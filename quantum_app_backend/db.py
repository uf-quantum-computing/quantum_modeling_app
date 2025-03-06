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
    _instance = None
    
    def __new__(cls, uri=os.getenv("MONGO_URI")):
        if cls._instance is None:
            try:
                cls._instance = super(MongoConnector, cls).__new__(cls)
                cls._instance.client = pymongo.MongoClient(uri)
                # Test the connection
                cls._instance.client.server_info()
                cls._instance.db = cls._instance.client['models']
                logger.debug("Successfully connected to MongoDB")
            except pymongo.errors.ConnectionError as e:
                logger.debug(f"Failed to connect to MongoDB: {str(e)}")
                raise
            except pymongo.errors.ServerSelectionTimeoutError as e:
                logger.debug(f"MongoDB server selection timeout: {str(e)}")
                raise
            except Exception as e:
                logger.debug(f"Unexpected error connecting to MongoDB: {str(e)}")
                raise
        return cls._instance

    def collection(self, model):
        if model not in VARIABLES:
            err_msg = f"Invalid model type: {model}"
            logger.debug(err_msg)
            raise ValueError(err_msg)
        return self.db[model]

    def get(self, collection, parameters):
        try:
            # Validate parameters
            for param, value in parameters.items():
                if param not in VARIABLES[collection.name]:
                    err_msg = f'{param} is not a valid parameter for model {collection.name}'
                    logger.debug(err_msg)
                    raise ValueError(err_msg)
                if not isinstance(value, (int, float)):
                    err_msg = f'{value} is not a valid value for parameter {param}'
                    logger.debug(err_msg)
                    raise ValueError(err_msg)
            
            # Query MongoDB
            logger.debug(f"Querying {collection.name} with parameters: {parameters}")
            res = collection.find({'parameters': parameters})
            
            if res:
                document = res.sort('uploadDate', pymongo.DESCENDING).limit(1)[0]
                logger.debug(f"Found existing model in {collection.name} with parameters: {parameters}")
                return document['animation'].decode('utf-8')
            else:
                logger.debug(f"No existing model found in {collection.name} with parameters: {parameters}")
                return None

        except pymongo.errors.OperationFailure as e:
            logger.debug(f"MongoDB operation failed: {str(e)}")
            raise
        except IndexError as e:
            logger.debug(f"No model found in {collection.name} with parameters: {parameters}")
            return None
        except Exception as e:
            logger.debug(f"Error retrieving model from MongoDB: {str(e)}", exc_info=True)
            raise
        
    def upload(self, collection, parameters, animation):
        try:
            # Validate parameters before upload
            for param, value in parameters.items():
                if param not in VARIABLES[collection.name]:
                    err_msg = f'{param} is not a valid parameter for model {collection.name}'
                    logger.debug(err_msg)
                    raise ValueError(err_msg)
                if not isinstance(value, (int, float)):
                    err_msg = f'{value} is not a valid value for parameter {param}'
                    logger.debug(err_msg)
                    raise ValueError(err_msg)

            # Check if document exists and replace if it does
            if collection.find_one({'parameters': parameters}):
                logger.debug(f"Replacing existing model in {collection.name} with parameters: {parameters}")
                collection.delete_one({'parameters': parameters})
            
            # Insert new document
            collection.insert_one({
                'parameters': parameters, 
                'animation': animation.encode('utf-8')
            })
            logger.debug(f"Successfully uploaded model to {collection.name} with parameters: {parameters}")

        except pymongo.errors.OperationFailure as e:
            logger.debug(f"MongoDB operation failed during upload: {str(e)}")
            raise
        except Exception as e:
            logger.debug(f"Error uploading model to MongoDB: {str(e)}", exc_info=True)
            raise