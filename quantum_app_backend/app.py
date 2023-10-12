from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from watchdog.events import FileSystemEvent
from model_generators.tunneling import Wave_Packet, Wave_Packet3D, Animator, Animator3D
import matplotlib.pyplot as plt
import time


#set swagger info
api: Api = Api(
    title='quantum_modeling',
    version='1.0',
    description='v1.0',
    prefix='/v1'
)

app = Flask(__name__)

api.init_app(app)

#CORS added
# CORS(app, supports_credentials=True)

# @app.route('/recieve_data', methods=['POST'])
# def recieve_data():
#     data = request.get_json()
#     barrier = data['barrier']
#     thickness = data['thickness']
#     wave = data['wave']
#     # now we want to pass this into the tunneling.py function
#     # and return the data to the frontend
#     return jsonify({'message': 'Data recieved'})

@app.route('/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"


#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)