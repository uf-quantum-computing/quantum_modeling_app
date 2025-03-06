import pymongo
import gridfs
import os
import configparser
import re

config = configparser.ConfigParser()
config_path = os.path.abspath(os.path.join("quantum_app_backend/.ini"))
config.read(config_path)
VARIABLES = {'tunneling': ['momentum', 'barrier', 'width'], 
             'interference': ['momentum', 'spacing', 'slit_separation']}

class MongoConnector:
    def __init__(self):
        self.client = pymongo.MongoClient(config['MONGO']['MONGO_URI'])
        self.db = self.client['models']
        self.model = ''

    def collection(self, model):
        return self.db[model]

    def get(self, collection, parameters):
        for param, value in parameters.items():
            if param not in VARIABLES[collection.name]:
                raise ValueError(f'{param} is not a valid parameter for model {collection.name}')
            if not isinstance(value, (int, float)):
                raise ValueError(f'{value} is not a valid value for parameter {param}')
        
        try:
            res = collection.find({'parameters': parameters})
            if res:
                document = res.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
                return document['animation'].decode('utf-8')
            else:
                return None
        except IndexError as e:
            print(e)
            return None
        
    def upload(self, collection, parameters, animation):
        try:
            self.collection.insert_one({'parameters': parameters, 'animation': animation.encode('utf-8')})
        except ValueError as e:
            print(e)
            return None