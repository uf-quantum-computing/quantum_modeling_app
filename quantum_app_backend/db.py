import pymongo
import gridfs
import os
import configparser
from collections import deque

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

# Create a gridfs instance from a mongodb instance
class MongoGridFS:
    def __init__(self):
        self.client = pymongo.MongoClient(config['MONGO']['MONGO_URI'])
        self.db = self.client['models']
        self.tunneling_fs = gridfs.GridFSBucket(self.db, bucket_name='tunneling')
        self.interference_fs = gridfs.GridFSBucket(self.db, bucket_name='interference')
        self.tunneling_cache = deque()
        self.interference_cache = deque()

    def get_tunneling(self, barrier, width, momentum):
        # Read tunneling models from MongoDB using GridFS
        try:
            model = self.tunneling_fs.find({'filename':f'probs_{momentum}_{barrier}_{width}_3D.html'})
            if model:
                return model.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
        except IndexError as e:
            print(e)
            return None

    def get_interference(self, momentum, spacing, slit_separation):
        # Read interference models from MongoDB using GridFS
        try:
            model = self.interference_fs.find({'filename':f'probs_{momentum}_{spacing}_{slit_separation}_3D.html'})
            if model:
                return model.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
        except IndexError as e:
            print(e)
            return None

def add_tunneling(db):
        # Write files from /cache/tunneling to MongoDB using GridFS
        bucket = gridfs.GridFSBucket(db, bucket_name='tunneling')
        try:
            # Write all tunneling models from ./cache/tunneling to MongoDB using GridFS
            for file in os.listdir('cache/tunneling'):
                with open(f'cache/tunneling/{file}', 'rb') as f:
                    print('Adding tunneling models from cache file')
                    bucket.upload_from_stream(file, f, metadata={'filename': file})
        except ValueError as e:
            return e

def add_interference(db):
        # Write files from /cache/interference to MongoDB using GridFS
        bucket = gridfs.GridFSBucket(db, bucket_name='interference')

        try:
            # Write all tunneling models from ./cache/interference to MongoDB using GridFS
            for file in os.listdir('cache/interference'):
                with open(f'cache/interference/{file}', 'rb') as f:
                    print('Adding interference models from cache file')
                    bucket.upload_from_stream(file, f)
        except ValueError as e:
            return e

# Driver to write cache files to MongoDB
if __name__ == '__main__':
    client = pymongo.MongoClient(config['MONGO']['MONGO_URI'])
    db = client['models']
    add_tunneling(db)
    add_interference(db)