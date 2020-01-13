import grovepi
import time
from threading import Thread

# Connect the Grove PIR Motion Sensor to digital port D8
# SIG,NC,VCC,GND
pir_sensor = 8 
grovepi.pinMode(pir_sensor,"INPUT")

# Connect the Grove Piezo Vibration Sensor to analog port A0
# OUT,NC,VCC,GND
piezo = 0
grovepi.pinMode(piezo,"INPUT")

class Trigger():
    
    def __init__(self, db):
        super().__init__()

        trigger_ref = db.collection(u'Users').document('y2wiAwN8e1e52SWtvVD3BNFiWGu2').collection('People').document('Indy').collection('Sensors').document('alarmCheck')

        #checkVibrate = Thread(target = Vibrationsensor)
        #checkMotion = Thread(target = Motionsensor)

        #print(checkMotion.getStatus)


        #checkVibrate.start()
        #checkMotion.start()

        try:
            if grovepi.digitalRead(pir_sensor):
                print('Motion Detected')
                
                if grovepi.analogRead(piezo) > 100:
                        print('Vibration detected')    

                        trigger_ref.update({
                           u'alarm': True,
                        })

                else:
                    print('No vibration')  

            else:
                print('Nothing detected')

            time.sleep(.5)


        except IOError:
            print("Error with trigger")

