from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from watchdog.events import FileSystemEvent


#set swagger info
api: Api = Api(
    title='quantum_modeling',
    version='1.0',
    description='v1.0',
    prefix='/v1'
)

app = Flask(__name__)

api.init_app(app)

# CORS added
CORS(app, supports_credentials=True)

@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.get_json()
    barrier = data['barrier']
    thickness = data['thickness']
    wave = data['wave']
    # now we want to pass this into the tunneling.py function
    # and return the data to the frontend
    return jsonify({'message': 'Data received'})

@app.route('/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"

    

#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True

    # from hello import api as ns1

    # #bind apis
    # api.add_namespace(ns1)

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)