# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from logcollection import LogCollector

app = Flask(__name__)
CORS(app)  # Enable CORS for your React frontend

collector = LogCollector()

@app.route('/api/system-metrics')
def get_system_metrics():
    metrics = collector.collect_system_info()
    return jsonify(metrics)


if __name__ == '__main__':
    app.run(debug=True)