import pymongo
import re
import os
from dotenv import load_dotenv
load_dotenv()

VARIABLES = {'tunneling': ['momentum', 'barrier', 'width'], 
             'interference': ['momentum', 'spacing', 'slit_separation']}

class MongoConnector:
    def __init__(self):
        self.client = pymongo.MongoClient(os.getenv('MONGO_URI'))
        self.db = self.client['models']
        self.model = ''

    def set_collection(self, model):
        self.collection = self.db[model]
        self.model = model

    def get(self, parameters):
        for param, value in parameters.items():
            if param not in VARIABLES[self.model]:
                raise ValueError(f'{param} is not a valid parameter for model {self.model}')
            if not isinstance(value, (int, float)):
                raise ValueError(f'{value} is not a valid value for parameter {param}')
        
        try:
            res = self.collection.find({'parameters': parameters})
            if res:
                document = res.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
                return document['animation'].decode('utf-8')
            else:
                return None
        except IndexError as e:
            print(e)
            return None
        
    def upload_model(self, parameters, animation):
        try:
            if self.collection.find({'parameters': parameters}):
                # replace the existing document
                self.collection.delete_one({'parameters': parameters})
            self.collection.insert_one({'parameters': parameters, 'animation': animation.encode('utf-8')})
        except ValueError as e:
            print(e)
            return None