from flask import Flask, jsonify, request
from flask_restx import Api
from flask_cors import CORS
from model_generators.tunneling import Wave_Packet3D as t_wp, Animator3D as t_ani
from model_generators.interference import Wave_Packet3D as i_wp, Animator3D as i_ani
from model_generators.Qgate1 import Qgate1
from model_generators.QuantumFourierTransform import QFTStepByStepODE
import matplotlib.pyplot as plt
import logging
from logging.handlers import RotatingFileHandler
import os
from db import MongoConnector
from flask_socketio import SocketIO, emit
from functools import wraps

sid = None

#set swagger info
api: Api = Api(
    title='quantum_modeling',
    version='1.0',
    description='v1.0',
    prefix='/v1'
)

# Set up logging
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

formatter = logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)

file_handler = RotatingFileHandler(
    os.path.join(log_dir, 'quantum_app.log'), 
    maxBytes=10000000,  # 10MB
    backupCount=5
)
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
console_handler.setLevel(logging.DEBUG)

logger = logging.getLogger('quantum_app')
logger.addHandler(file_handler)
logger.addHandler(console_handler)
logger.setLevel(logging.DEBUG)

class SocketHandler(logging.Handler):
    def __init__(self):
        super().__init__()

    def emit(self, record):
        try:
            # Only emit INFO level and above to avoid flooding the client
            if record.levelno >= logging.INFO:
                global sid
                emit('status_update', {'message': record.getMessage()}, room=sid, namespace='/')
        except Exception as e:
            logger.error(f"Socket emission failed: {str(e)}", exc_info=True)

def handle_errors(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}", exc_info=True)
            emit_status(f"An error occurred: {str(e)}")
            return jsonify({"error": str(e)}), 500
    return wrapped

app = Flask(__name__)
api.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)
socket_handler = SocketHandler()
socket_handler.setLevel(logging.INFO)
logger.addHandler(socket_handler)
mongo = MongoConnector()

def emit_status(message):
    logger.info(message)

@app.route('/receive_data/tunneling/<barrier>/<width>/<momentum>', methods=['GET'])
@handle_errors
def Qtunneling(barrier, width, momentum):
    try:
        barrier = float(barrier)
        width = float(width)
        momentum = float(momentum)
    except ValueError as e:
        logger.error(f"Invalid parameters: {str(e)}")
        return jsonify({"error": "Invalid parameters"}), 400

    logger.debug(f"Tunneling request - barrier: {barrier}, width: {width}, momentum: {momentum}")
    
    t_collection = mongo.collection('tunneling')
    parameters = {'barrier': barrier, 'width': width, 'momentum': momentum}

    try:
        tunneling_model = mongo.get(t_collection, parameters)
        if not tunneling_model:
            plt.close('all')
            plt.switch_backend('Agg')

            animator = t_ani(t_wp(barrier_height=barrier, barrier_width=width, k0=momentum))
            
            tunneling_model = animator.animate3D()
            
            # Upload to MongoDB asynchronously after emitting response
            emit_status(f"Generated new tunneling model with parameters: {parameters}")
            socketio.start_background_task(mongo.upload, t_collection, parameters, tunneling_model)
        else:
            emit_status(f"Retrieved existing tunneling model with parameters: {parameters}")
        return tunneling_model
    except Exception as e:
        logger.error(f"Error generating tunneling model: {str(e)}", exc_info=True)
        raise

@app.route('/receive_data/interference/<spacing>/<slit_separation>/<int:momentum>', methods=['GET'])
@handle_errors
def Qinterference(spacing, slit_separation, momentum):
    try:
        momentum = float(momentum)
        spacing = float(spacing)
        slit_separation = float(slit_separation)
    except ValueError as e:
        logger.error(f"Invalid parameters: {str(e)}")
        return jsonify({"error": "Invalid parameters"}), 400

    logger.debug(f"Interference request - spacing: {spacing}, slit_separation: {slit_separation}, momentum: {momentum}")
    
    i_collection = mongo.collection('interference')
    parameters = {'spacing': spacing, 'slit_separation': slit_separation, 'momentum': momentum}

    try:
        interference_model = mongo.get(i_collection, parameters)
        if not interference_model:
            plt.close('all')
            plt.switch_backend('Agg')

            animator = i_ani(i_wp(slit_space=spacing, slit_sep=slit_separation, k0=momentum))
            interference_model = animator.animate3D()

            socketio.start_background_task(mongo.upload, i_collection, parameters, interference_model)
            emit_status(f"Generated new interference model with parameters: {parameters}")
        else:
            emit_status(f"Retrieved existing interference model with parameters: {parameters}")
        return interference_model
    except Exception as e:
        logger.error(f"Error generating interference model: {str(e)}", exc_info=True)
        raise

@app.route('/receive_data/evotrace/<int:gate>/<int:init_state>/<int:mag>/<t2>', methods=['GET'])
def Qtrace(gate, init_state, mag, t2):
    t2 = float(t2)
    emit_status("Calculating...")
    plt.close('all')
    plt.switch_backend('Agg')

    qg = Qgate1()
    qg.run(gate=gate, init_state=init_state, mag_f_B=mag, t2=t2)
    GifRes = qg.plot_evo()

    return {'GifRes': GifRes}

@app.route('/receive_data/qft', methods=['GET'])
def Qfouriertransform():
    logger.debug("Startting QFT generator")
    anim_js = None
    try:
        qft_ode = QFTStepByStepODE(initial_state_str='011')
        qft_ode.run(n_step=6)
        anim_js = qft_ode.animate_bloch()

        if not anim_js:
            raise Exception("Error generating QFT model")
    except Exception as e:
        logger.error(f"Error generating QFT model: {str(e)}", exc_info=True)
        raise
    return anim_js

@socketio.on('connect')
def handle_connect():
    global sid
    sid = request.sid
    logger.debug("Client connected")
    emit('status_update', {'message': 'Connected to quantum model generator server'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.debug("Client disconnected")

@socketio.on('message')
def handle_message(data):
    logger.debug(f"Received message: {data}")

if __name__ == '__main__':
    app.debug = True
    logger.debug("Starting quantum modeling server")
    socketio.run(app, host="0.0.0.0", port=3001, debug=False)