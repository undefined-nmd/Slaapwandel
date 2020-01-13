import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import db


class Database():
    # This class is used for realtime database

    def __init__(self):
        # Call the parent class (Sprite) constructor
        super().__init__()

        # Fetch the service account key JSON file contents
        cred = credentials.Certificate('key.json')

        # Initialize the app with a service account, granting admin privileges
        firebase_admin.initialize_app(cred)




