from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from model_generators.tunneling import Wave_Packet3D as t_wp, Animator3D as t_ani
from model_generators.interference import Wave_Packet3D as i_wp, Animator3D as i_ani
from model_generators.Qgate1 import Qgate1
import matplotlib.pyplot as plt
import time
import base64
import os
from pathlib import Path
import portalocker
from db import MongoGridFS
from mongo_connection import MONGO_URI

#set swagger info
api: Api = Api(
    title='quantum_modeling',
    version='1.0',
    description='v1.0',
    prefix='/v1'
)

app = Flask(__name__)
api.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/receive_data/tunneling/<barrier>/<width>/<momentum>', methods=['GET'])
def Qtunneling(barrier, width, momentum):
    barrier = float(barrier)
    width = float(width)
    momentum = float(momentum)

    print("You evoked the tunneling API successfully")
    # Get tunneling models based on barrier, width, and momentum
    tunneling_model = gridfs.get_tunneling(barrier, width, momentum) # GridOut
    if tunneling_model:
        print(tunneling_model.filename)
        return tunneling_model.read()
    else:
        return None


@app.route('/receive_data/interference/<spacing>/<slit_separation>/<int:momentum>', methods=['GET'])
def Qinterference(spacing, slit_separation, momentum):
    spacing = float(spacing)
    slit_separation = float(slit_separation)

    print("You evoked the API successfully")
    
    if Path(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html').exists():
        print(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html')
        with open(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html',
                  "r") as f:
            portalocker.lock(f, portalocker.LOCK_SH)
            GifRes = f.read()
    else:
        plt.close('all')
        plt.switch_backend('Agg')

        start_3d_time = time.time()
        wave_packet3D = i_wp(slit_space=spacing, slit_sep=slit_separation, k0=momentum)
        animator3D = i_ani(wave_packet3D)
        GifRes = animator3D.animate3D()
    
        end_3d_time = time.time()  # Record the end time
        elapsed_3d_time = end_3d_time - start_3d_time
        print(f"Elapsed 3D generator time: {elapsed_3d_time} seconds")

    return {'GifRes': GifRes}


@app.route('/receive_data/evotrace/<int:gate>/<int:init_state>/<int:mag>/<t2>', methods=['GET'])
def Qtrace(gate, init_state, mag, t2):
    t2 = float(t2)
    print("You evoked the API successfully")
    plt.close('all')
    plt.switch_backend('Agg')

    start_time = time.time()  # Record the start time
    qg = Qgate1()
    qg.run(gate=gate, init_state=init_state, mag_f_B=mag, t2=t2)
    GifRes = qg.plot_evo()
    
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f"Elapsed 3D generator time: {elapsed_time} seconds")

    return {'GifRes': GifRes}
    
#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = True
    gridfs = MongoGridFS()

    #run backend server at port 3001
    app.run(host="0.0.0.0", port=3001, threaded=False, debug=True)