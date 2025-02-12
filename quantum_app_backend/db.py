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

    def set_collection(self, model):
        self.collection = self.db[model]

    def close(self):
        self.client.close()

    def get(self, parameters):
        for key, value in parameters.items():
            if key not in VARIABLES:
                raise ValueError(f'{key} is not a valid model')
            if value not in VARIABLES[key]:
                raise ValueError(f'{value} is not a valid parameter for model {key}')
        
        try:
            model = self.collection.find({'parameters': parameters})
            if model:
                return model.sort('uploadDate', pymongo.DESCENDING).limit(1)[0].decode('utf-8')
        except IndexError as e:
            print(e)
            return None

    # def get_tunneling(self, barrier, width, momentum):
    #     try:
    #         model = self.tunneling_collection.find({'filename':f'probs_{momentum}_{barrier}_{width}_3D.html'})
    #         if model:
    #             return model.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
    #     except IndexError as e:
    #         print(e)
    #         return None

    # def get_interference(self, momentum, spacing, slit_separation):
    #     try:
    #         model = self.interference_collection.find({'filename':f'probs_{momentum}_{spacing}_{slit_separation}_3D.html'})
    #         if model:
    #             return model.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
    #     except IndexError as e:
    #         print(e)
    #         return None
        
    def upload_model(self, parameters, animation):
        try:
            self.collection.insert_one({'parameters': parameters, 'animation': animation.encode('utf-8')})
        except ValueError as e:
            print(e)
            return None

def parse_parameters(filename, variables):
    pattern = r"probs_(\d+(\.\d+)?)_(\d+(\.\d+)?)_(\d+(\.\d+)?)_3D\.html"
    match = re.match(pattern, filename)
    if match:
        return dict(zip(variables, [match.group(1), match.group(3), match.group(5)])) # To change hard code if handles more variables
    else:
        raise ValueError('Filename does not match the expected pattern')

# Driver to write cache files to MongoDB
if __name__ == '__main__':
    client = pymongo.MongoClient(config['MONGO']['MONGO_URI'])
    db = client['models']
    
