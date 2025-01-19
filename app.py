# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from logcollection import LogCollector
import security_event_detection

app = Flask(__name__)
CORS(app)  # Enable CORS for your React frontend

collector = LogCollector()

@app.route('/api/system-metrics')
def get_system_metrics():
    metrics = collector.collect_system_info()
    return jsonify(metrics)

@app.route('/api/get-top-stories')
def get_top_stories():
    stories = security_event_detection.get_recent_topstories()
    return jsonify(stories)

@app.route('/api/process-info')
def process_info():
    process = security_event_detection.get_process_info()
    return jsonify(process)


if __name__ == '__main__':
    app.run(debug=True)