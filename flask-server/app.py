from flask import Flask, send_from_directory, jsonify, request
import requests
import heapq

app = Flask(__name__, static_folder='build', static_url_path='/')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# # example get request
# @app.route('/api/get-flights')
# def get_flights():
#     url = "https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date=2020-02-14"
#     response = requests.get(url)
#     data = response.json()
#     return jsonify(data)


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

def find_connecting_flight(graph, start, goal):
    visited = set()
    queue = [(start, [])]

    while queue:
        current_node, path = queue.pop(0)

        if current_node == goal:
            return {"shortest_path": path + [current_node], "flight_numbers": [], "standby_seats": []}

        if current_node in visited:
            continue

        visited.add(current_node)

        for neighbor, distance, flight_number, seats in graph.get(current_node, []):
            queue.append((neighbor, path + [current_node]))

    return None  # No connecting path found

# A* Algorithm
def a_star(graph, start, goal):
    open_set = [(0, start, [], [], [])]  # (cost, current node, path taken so far, flight numbers, standby seats)
    closed_set = set()

    while open_set:
        cost, current_node, path, flight_numbers, standby_seats = heapq.heappop(open_set)

        print(f"Processing node: {current_node}, Cost: {cost}, Path: {path}, Flight Numbers: {flight_numbers}, Standby Seats: {standby_seats}")

        if current_node == goal:
            return {
                "shortest_path": path + [current_node],
                "flight_numbers": flight_numbers,
                "standby_seats": standby_seats
            }

        if current_node in closed_set:
            continue

        closed_set.add(current_node)

        for neighbor, distance, flight_number, seats in graph.get(current_node, []):
            new_cost = cost + distance
            heapq.heappush(open_set, (new_cost, neighbor, path + [current_node], flight_numbers + [flight_number], standby_seats + [seats]))

    connecting_result = find_connecting_flight(graph, start, goal)
    if connecting_result is not None:
        return connecting_result

    return {
        "shortest_path": None,
        "flight_numbers": None,
        "standby_seats": None
    }  # No path found

@app.route('/api/get-shortest-path')
def get_shortest_path():
    date_param = request.args.get('date')
    start_airport = request.args.get('origin') 
    goal_airport = request.args.get('destination') 

    print(f"Received request with date={date_param}, origin={start_airport}, destination={goal_airport}")

    url = f"https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date={date_param}&origin={start_airport}&destination={goal_airport}"
    response = requests.get(url)
    flight_data = response.json()

    print(f"Retrieved flight data: {flight_data}")

    flight_graph = construct_flight_graph(flight_data)
    
    print(f"Constructed flight graph: {flight_graph}")

    shortest_path_result = a_star(flight_graph, start_airport, goal_airport)

    print(f"Shortest path result: {shortest_path_result}")

    return jsonify(shortest_path_result)


if __name__ == '__main__':
    app.run(debug=True)
