import requests
from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='build', static_url_path='/')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# example get request
@app.route('/api/get-flights')
def get_flights():
    url = "https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date=2020-02-14"
    response = requests.get(url)
    data = response.json()
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
