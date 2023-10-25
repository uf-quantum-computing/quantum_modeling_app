from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from watchdog.events import FileSystemEvent
from model_generators.tunneling import Wave_Packet, Wave_Packet3D, Animator, Animator3D
import matplotlib.pyplot as plt
import time
import base64


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

@app.route('/receive_data/tunneling/<int:barrier>/<int:thickness>/<int:momentum>', methods=['GET'])
def receive_data(barrier, thickness, momentum):
    # can pass variables through the route url /tunneling/intensity/thickness/momentum
    print("You evoked the API successfully")
    plt.switch_backend('Agg') 
    start_time = time.time()  # Record the start time
    wave_packet = Wave_Packet(n_points=500, dt=0.5, barrier_width=thickness, barrier_height=barrier, k0=momentum)
    wave_packet3D = Wave_Packet3D(x_n_points=100, y_n_points=80, dt=0.5, BarrierThickness=thickness, barrier_height=barrier, k0=momentum)
    animator = Animator(wave_packet)
    animator.animate()
    plt.close()
    animator3D = Animator3D(wave_packet3D)
    animator3D.animate()
    plt.close()
    end_time = time.time()    # Record the end time
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time} seconds")
    with open('tunneling_2D.gif', 'rb') as file:
        base64Gif2D = base64.b64encode(file.read()).decode('utf-8')
    with open('tunneling_3D.gif', 'rb') as file:
        base64Gif3D = base64.b64encode(file.read()).decode('utf-8')

    return {'base64Gif2D': base64Gif2D, 'base64Gif3D': base64Gif3D}
    

@app.route('/hello', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"


#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)