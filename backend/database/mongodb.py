from pymongo import MongoClient
from decouple import config
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment variables with a default value
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('MONGO_DB', 'healthdata')

# Create MongoDB client
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Collections
files_collection = db.files  # Collection for storing file metadata
documents_collection = db.documents  # Collection for storing medical documents 