import time
from grovepi import *

buzzer_pin = 2		#Port for buzzer

class Buzz():
    
    def __init__(self, status):
        super().__init__()

        digitalWrite(buzzer_pin, status)		# Send HIGH to switch on LED