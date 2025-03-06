import pymongo
import re
import os
from dotenv import load_dotenv
load_dotenv()

VARIABLES = {'tunneling': ['momentum', 'barrier', 'width'], 
             'interference': ['momentum', 'spacing', 'slit_separation']}

class MongoConnector:
    _instance = None
    
    def __new__(cls, uri=os.getenv("MONGO_URI")):
        if cls._instance is None:
            cls._instance = super(MongoConnector, cls).__new__(cls)
            cls._instance.client = pymongo.MongoClient(uri)
            cls._instance.db = cls._instance.client['models']
        return cls._instance

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
            if collection.find({'parameters': parameters}):
                # replace the existing document
                print('Replacing existing document')
                collection.delete_one({'parameters': parameters})
            collection.insert_one({'parameters': parameters, 'animation': animation.encode('utf-8')})
        except ValueError as e:
            print(e)
            return None