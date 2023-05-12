from flask import Flask
from flask_restx import Api
from flask_cors import CORS


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
CORS(app, supports_credentials=True)

#blind namespace to swagger api page
if __name__ == '__main__':
    app.debug = False

    from hello import api as ns1

    #bind apis
    api.add_namespace(ns1)

    #run backend server at port 5001
    app.run(host="0.0.0.0", port=39022)