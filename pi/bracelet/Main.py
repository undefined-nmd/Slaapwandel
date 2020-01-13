# Import the libraries
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import time
import sys

# Import the classes
from Led import Led
from Database import Database
from Alarm import Alarm
from Trigger import Trigger

# Initialise the firebase database
Database()
db = firestore.client()

def main():
    while True:
        #retrieve data
        # Led() 

        Trigger(db)

        # The alarm class, basically it checks in the database if the alarm is true or false,
        # based on that it either turns on or off the leds/buzzing
        # Alarm(db)

        # makes it so it runs every second
        time.sleep(1) 

if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, SystemExit):
        print('Interrupt received! Stopping the application...')
    finally:
        print('Cleaning up the mess...')
        sys.exit(0)