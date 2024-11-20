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
client = pymongo.MongoClient(MONGO_URI)
db = client['models']
fs = gridfs.GridFS(db)

def add_tunneling():
    # Write files from /cache/tunneling to MongoDB using GridFS
    try:
        # Write all tunneling models from ./cache/tunneling to MongoDB using GridFS
        for file in os.listdir('cache/tunneling'):
            with open(f'cache/tunneling/{file}', 'rb') as f:
                print('Adding tunneling models from cache file')
                fs.put(f, filename=file)
    except Exception as e:
        return e

def get_tunneling(barrier, width, momentum):
    # Read tunneling models from MongoDB using GridFS
    barrier = float(barrier)
    width = float(width)
    momentum = float(momentum)

    try:
        print('Getting tunneling model')
        return fs.get(ObjectId('6734f0c4cd8c9ba1c6f54b7c'))
    except pymongo.errors.OperationFailure:
        print('Operation Failure')