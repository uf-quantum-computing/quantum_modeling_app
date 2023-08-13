import base64
from flask_restx import Resource, Namespace
from flask import request
from subprocess import Popen, PIPE


pc = Popen(['C:/Users/willr/AppData/Local/Programs/Julia-1.9.1/bin/julia.exe'], stdin=PIPE, stdout=PIPE)
pc.stdin.write(b'include("quantum_modeling_app/quantum_app_backend/functions.jl")\n')

pc.stdin.flush()
print(repr(pc.stdout.readline()))
# init api namespace
api = Namespace('', description='flask demo')


class Hello(Resource):
    @api.doc(description="quantum tunneling")
    @api.param(name='intensity', _in='url')
    @api.param(name='thickness', _in='url')
    @api.param(name='momentum', _in='url')
    def get(self):
        intensity = request.args.get('intensity')
        thickness = request.args.get('thickness')
        momentum = request.args.get('momentum')
        try:
            pc.stdin.write(str.encode('Tunneling({}, {}, {})\n'.format(intensity, thickness, momentum)))
            pc.stdin.flush()
            print(repr(pc.stdout.readline()))
            with open("tunneling_2D.gif", "rb") as gif_file:
                gif_2D_base64 = 'data:image/gif;base64,{}'.format(base64.b64encode(gif_file.read()).decode())
            with open("tunneling_3D.gif", "rb") as gif_file:
                gif_3D_base64 = 'data:image/gif;base64,{}'.format(base64.b64encode(gif_file.read()).decode())
            return {'2D': gif_2D_base64, '3D': gif_3D_base64}, 201
        except:
            return {"message": "bad payload"}, 400


#bind api to routes
api.add_resource(Hello, '/hello')

#api.add_resource(refresh, '/refresh')