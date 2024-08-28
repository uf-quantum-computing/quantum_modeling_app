# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn, options

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from model_generators.tunneling import Wave_Packet3D as t_wp, Animator3D as t_ani
from model_generators.interference import Wave_Packet3D as i_wp, Animator3D as i_ani
from model_generators.Qgate1 import Qgate1
import matplotlib.pyplot as plt
import time
import base64
import os
from pathlib import Path
import portalocker


app = initialize_app()


@https_fn.on_request(
    timeout_sec=600,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def tunneling(req: https_fn.Request) -> https_fn.Response:
    """Take the text parameter passed to this HTTP endpoint and insert it into
    a new document in the messages collection."""
    # Grab the text parameter.
    try:
        barrier = float(req.args.get("barrier"))
        width = float(req.args.get("width"))
        momentum = float(req.args.get("momentum"))
    except ValueError:
        return https_fn.Response("No parameter provided", status=400)
    if Path(f'cache/tunneling/probs_{momentum}_{barrier}_{width}_3D.html').exists():
        print(f'cache/tunneling/probs_{momentum}_{barrier}_{width}_3D.html')
        with open(f'cache/tunneling/probs_{momentum}_{barrier}_{width}_3D.html',
                  "r") as f:
            portalocker.lock(f, portalocker.LOCK_SH)
            GifRes = f.read()
    else:
        plt.switch_backend('Agg')
        start_3d_time = time.time()  # Record the start time
        wave_packet3D = t_wp(barrier_width=width, barrier_height=barrier, k0=momentum)
        animator = t_ani(wave_packet3D)
        GifRes = animator.animate3D()
        # print(GifRes)
        end_3d_time = time.time()  # Record the end time
        elapsed_3d_time = end_3d_time - start_3d_time
        print(f"Elapsed 3D generator time: {elapsed_3d_time} seconds")

    # Send back a message that we've successfully written the message
    return {'GifRes': GifRes}

@https_fn.on_request(
    timeout_sec=600,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def interference(req: https_fn.Request) -> https_fn.Response:
    """Take the text parameter passed to this HTTP endpoint and insert it into
    a new document in the messages collection."""
    # Grab the text parameter.
    try:
        spacing = float(req.args.get("spacing"))
        slit_separation = float(req.args.get("sep"))
        momentum = float(req.args.get("momentum"))
    except ValueError:
        return https_fn.Response("No parameter provided", status=400)
    if Path(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html').exists():
        print(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html')
        with open(f'cache/interference/probs_{momentum}_{spacing}_{slit_separation}_3D.html',
                  "r") as f:
            portalocker.lock(f, portalocker.LOCK_SH)
            GifRes = f.read()
    else:
        plt.switch_backend('Agg')

        start_3d_time = time.time()
        wave_packet3D = i_wp(slit_space=spacing, slit_sep=slit_separation, k0=momentum)
        animator3D = i_ani(wave_packet3D)
        GifRes = animator3D.animate3D()
        end_3d_time = time.time()  # Record the end time
        elapsed_3d_time = end_3d_time - start_3d_time
        print(f"Elapsed 3D generator time: {elapsed_3d_time} seconds")

    # Send back a message that we've successfully written the message
    return {'GifRes': GifRes}

@https_fn.on_request(
    timeout_sec=600,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def trace(req: https_fn.Request) -> https_fn.Response:
    """Take the text parameter passed to this HTTP endpoint and insert it into
    a new document in the messages collection."""
    # Grab the text parameter.
    try:
        gate = int(req.args.get("gate"))
        init_state = int(req.args.get("init_state"))
        mag = int(req.args.get("mag"))
        t2 = float(req.args.get("t2"))
    except ValueError:
        return https_fn.Response("No parameter provided", status=400)
    plt.switch_backend('Agg')

    start_time = time.time()  # Record the start time
    qg = Qgate1()
    qg.run(gate=gate, init_state=init_state, mag_f_B=mag, t2=t2)
    GifRes = qg.plot_evo()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f"Elapsed 3D generator time: {elapsed_time} seconds")

    return {'GifRes': GifRes}

