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

# CORS added
CORS(app)

@app.route('/recieve_data/tunneling/<float:barrier>/<float:thickness>/<float:momentum>', methods=['GET'])
def recieve_data(barrier, thickness, momentum):
    # can pass variables through the route url /tunneling/intensity/thickness/momentum

    start_time = time.time()  # Record the start time
    wave_packet = Wave_Packet(n_points=500, dt=0.5, barrier_width=thickness, barrier_height=barrier, k0=momentum)
    wave_packet3D = Wave_Packet3D(x_n_points=100, y_n_points=80, dt=0.5, BarrierThickness=thickness, barrier_height=barrier, k0=momentum)
    animator = Animator(wave_packet)
    animator.animate()
    animator3D = Animator3D(wave_packet3D)
    animator3D.animate()
    end_time = time.time()    # Record the end time
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time} seconds")
    plt.show()
    plt.close()
    return f"Created tunneling_2D.gif and tunneling_3D.gif"
    

@app.route('/hello', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"


#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)