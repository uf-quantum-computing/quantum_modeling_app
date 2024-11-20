import bson

from flask import app
from werkzeug.local import LocalProxy
import pymongo
import gridfs
from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId
import os
from mongo_connection import MONGO_URI

# Create a gridfs instance from a mongodb instance
class MongoGridFS:
    def __init__(self):
        self.client = pymongo.MongoClient(MONGO_URI)
        self.db = self.client['models']
        self.fs = gridfs.GridFS(self.db)

        if len(self.fs.list()) == 0:
            self.add_tunneling()

    def add_tunneling(self):
        # Write files from /cache/tunneling to MongoDB using GridFS
        try:
            # Write all tunneling models from ./cache/tunneling to MongoDB using GridFS
            for file in os.listdir('cache/tunneling'):
                with open(f'cache/tunneling/{file}', 'rb') as f:
                    print('Adding tunneling models from cache file')
                    self.fs.put(f, filename=file)
        except Exception as e:
            return e

    def get_tunneling(self, barrier, width, momentum):
        # Read tunneling models from MongoDB using GridFS
        barrier = float(barrier)
        width = float(width)
        momentum = float(momentum)

        try:
            return self.fs.get_last_version(f'probs_{momentum}_{barrier}_{width}_3D.html')
        except pymongo.errors.OperationFailure as e:
            print(e.details)
            return None