import time

from Led import Led
from Buzz import Buzz
from Heartbeat import Heartbeat

class Alarm():
    # This class represents an alarm.

    def __init__(self, db):
        # Call the parent class (Sprite) constructor
        super().__init__()

        alarm_ref = db.collection(u'Users').document('y2wiAwN8e1e52SWtvVD3BNFiWGu2').collection('People').document('Indy').collection('Sensors').document('alarmCheck')
        try:
            alarm = alarm_ref.get()
            val = format(alarm.to_dict()['alarm'])  
            print(val)

            if val == 'True':
                print('alarm on')
                Led(0)
                print('alarm off')
                Led(1)
                print('alarm off')
                Buzz(1)
                Heartbeat(db, 100, 113) # hier de hogere waarden
            else:   
                Led(1)
                Buzz(0)
                print('he')
                Heartbeat(db, 61, 99) # hier de lagere waarden
        
            time.sleep(1)

        except google.cloud.exceptions.NotFound:
            print(u'No AlarmCheck document was found, check your firestore database!')