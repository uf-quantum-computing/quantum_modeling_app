from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from watchdog.events import FileSystemEvent
from model_generators.tunneling import Wave_Packet, Wave_Packet3D, Animator2D, Animator3D
import matplotlib.pyplot as plt
import time
import base64
import os
from IPython import display

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
CORS(app)

# @app.route('/tunneling', methods=['GET'])
# def default():
#     return {}

@app.route('/receive_data/tunneling/<int:barrier>/<int:thickness>/<int:momentum>', methods=['GET'])
def receive_data(barrier, thickness, momentum):
    # can pass variables through the route url /tunneling/intensity/thickness/momentum
    print("You evoked the API successfully")
    plt.switch_backend('Agg') 
    
    start_2d_time = time.time()  # Record the start time
    wave_packet = Wave_Packet(n_points=500, dt=0.75, barrier_width=thickness, barrier_height=barrier, k0=momentum)
    animator = Animator2D(wave_packet)
    base64Gif2D = animator.animate2D()
    end_2d_time = time.time()    # Record the end time
    elapsed_2d_time = end_2d_time - start_2d_time
    print(f"Elapsed 2D generator time: {elapsed_2d_time} seconds")
    start_3d_time = time.time()  # Record the start time
    wave_packet3D = Wave_Packet3D(x_n_points=100, y_n_points=80, dt=0.75, BarrierThickness=thickness, barrier_height=barrier, k0=momentum)
    animator3D = Animator3D(wave_packet3D)
    base64Gif3D = animator3D.animate3D()
    end_3d_time = time.time()    # Record the end time
    elapsed_3d_time = end_3d_time - start_3d_time
    print(f"Elapsed 3D generator time: {elapsed_3d_time} seconds")

    return {'base64Gif2D': base64Gif2D, 'base64Gif3D': base64Gif3D}
    

@app.route('/hello', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"


#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)