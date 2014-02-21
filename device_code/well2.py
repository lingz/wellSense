#!/usr/bin/env python

import RPi.GPIO as GPIO
from time import sleep, time

POLL_TIME = 15 # sec

switchHandle = 7
switchFlow = 11

# Set pin layout to board format
GPIO.setmode(GPIO.BOARD)

# set pins to inputs (use pulldown resistors?)
GPIO.setup(switchHandle, GPIO.IN)
GPIO.setup(switchFlow, GPIO.IN)

print "Starting main polling loop"
while True:
	# if handle triggers high, during 15 seconds, poll for flow
	if (GPIO.input(switchHandle)):
		print "Handle triggers, polling for 15 seconds"
		# go until past start time by POLL_TIME
		tstart = time()

		# tracks whether flow went high during poll period
		flow = False
		while (time() - tstart < POLL_TIME):
			# flow stays high if it goes high
			flow = GPIO.input(switchFlow) or flow 
			print "Pump:", flow
			sleep(0.1) 
	sleep(0.1)

print "Finished well.py"
