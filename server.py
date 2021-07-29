from flask import Flask, render_template, jsonify, request
import pandas as pd
import json
from ProjectImpl import *

app = Flask(__name__)

# Display your index page
@app.route("/")
def index():
    return render_template('index.html')


@app.route("/getPlotsData")
def get_PlotsData():
    dataset, categories, columns = ProjectImpl().get_PlotsData()
    data = {'data': json.dumps(dataset), 'categories': json.dumps(categories), 'columns': json.dumps(columns)}
    return data

@app.route("/getMDSPlotData")
def get_MDSPlotData():
    X, Y, columns = ProjectImpl().get_MDSPlot()
    data = {'dataX': json.dumps(X), 'dataY': json.dumps(Y), 'columns': json.dumps(columns)}
    return data


if __name__ == "__main__":
    print("running...")
    app.run(host='127.0.0.1', port=5050, debug=True)
    