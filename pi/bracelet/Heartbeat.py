from random import randrange, uniform
from datetime import datetime

class Heartbeat():
    
    def __init__(self, db, low, high):
        super().__init__()

        print('this works')
        # randrange gives you an integral value
        irand = randrange(low, high)
        print(irand)

        dateTimeObj = datetime.now()
        print(dateTimeObj)

        heartbeat_ref = db.collection(u'Users').document('y2wiAwN8e1e52SWtvVD3BNFiWGu2').collection('People').document('Indy').collection('Sensors').document('hartSensor').collection('refreshes').document()
        userbeat_ref =  db.collection(u'Users').document('y2wiAwN8e1e52SWtvVD3BNFiWGu2').collection('People').document('Indy')

        heartbeat_ref.set({
            u'rate': irand,
            u'timestamp': dateTimeObj,
        })

        userbeat_ref.update({
            u'hartslag': irand,
        })