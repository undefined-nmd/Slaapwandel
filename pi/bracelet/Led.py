import time
from grovepi import *

# Connect the Grove LED to digital port D4
led = 4
pinMode(led,"OUTPUT")

class Led():
    
    def __init__(self, status):
        super().__init__()

        digitalWrite(led, status)		# Send HIGH to switch on LED
        
        
