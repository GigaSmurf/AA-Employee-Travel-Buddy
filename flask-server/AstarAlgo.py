from flask import Flask, send_from_directory, jsonify, request
import requests
import heapq

app = Flask(__name__, static_folder='build', static_url_path='/')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

def construct_flight_graph(flight_data):
    graph = {}
    for flight in flight_data:
        origin = flight["origin"]["code"]
        destination = flight["destination"]["code"]
        distance = flight["distance"]
        standby_seats = flight["standby"]
        flight_number = flight["flightNumber"]

        if origin not in graph:
            graph[origin] = []
        if standby_seats > 0:  # Only consider flights with standby seats > 0
            graph[origin].append((destination, distance, flight_number, standby_seats))

    return graph


def a_star(graph, start, goal):
    open_set = []
    paths_with_standby_seats = []

    heapq.heappush(open_set, (0, start, [], [], []))  # (cost, node, path, flight_numbers, standby_seats)
    visited = set()

    while open_set:
        cost, current_node, path, flight_numbers, standby_seats = heapq.heappop(open_set)

        if current_node == goal and standby_seats and standby_seats[-1] > 0:
            paths_with_standby_seats.append({
                "path": path + [current_node],
                "flight_numbers": flight_numbers,
                "standby_seats": standby_seats[-1]  # Only consider the last standby seats value
            })

        if current_node in visited:
            continue

        visited.add(current_node)

        for neighbor, distance, flight_number, seats in graph.get(current_node, []):
            new_cost = cost + distance
            new_path = path + [current_node]
            new_flight_numbers = flight_numbers + [flight_number]
            new_standby_seats = standby_seats + [seats]

            heapq.heappush(open_set, (new_cost, neighbor, new_path, new_flight_numbers, new_standby_seats))

    # Sort paths based on the number of standby seats
    sorted_paths = sorted(paths_with_standby_seats, key=lambda x: x["standby_seats"], reverse=True)

    return sorted_paths

@app.route('/api/get-shortest-path')
def get_shortest_path():
    try:
        date_param = request.args.get('date')
        start_airport = request.args.get('origin')
        goal_airport = request.args.get('destination')
        shortest_path_results = []

        if not date_param or not start_airport or not goal_airport:
            return jsonify({"error": "Invalid input parameters"}), 400

        # Scenario 1: Check for direct flights from start to goal with standby seats
        url_direct = f"https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date={date_param}&origin={start_airport}&destination={goal_airport}"
        response_direct = requests.get(url_direct)
        direct_flight_data = response_direct.json()

        if direct_flight_data and any(flight["standby"] > 0 for flight in direct_flight_data):
            shortest_path_result = a_star(construct_flight_graph(direct_flight_data), start_airport, goal_airport)
        else:
            # Scenario 2: Check for flights from start to any airport with standby seats
            url_origin = f"https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date={date_param}&origin={start_airport}"
            response_origin = requests.get(url_origin)
            origin_flight_data = response_origin.json()

            connecting_airport = None
            for flight in origin_flight_data:
                if flight["standby"] > 0:
                    connecting_airport = flight["destination"]["code"]
                    break

            if connecting_airport:
                # Scenario 3: Check for flights from connecting airport to goal with standby seats
                url_connecting = f"https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date={date_param}&origin={connecting_airport}&destination={goal_airport}"
                response_connecting = requests.get(url_connecting)
                connecting_flight_data = response_connecting.json()

                shortest_path_result = a_star(
                    construct_flight_graph(connecting_flight_data),
                    start_airport,
                    goal_airport
                )
            else:
                return jsonify({"error": "No flights with standby seats available"}), 404

        for path_result in shortest_path_result:
            formatted_result = {
                "shortest_path": path_result.get("path", []),
                "flight_numbers": path_result.get("flight_numbers", []),
                "standby_seats": path_result.get("standby_seats", [])
            }
            shortest_path_results.append(formatted_result)

        return jsonify(shortest_path_results)

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)