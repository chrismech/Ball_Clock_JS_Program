/**
 * BallClock Program
 */
var completeRotation = false;
var finishedMinutes = false;
var minutes = 1;
var minuteLength = 4;
var minuteTray = [];

var fiveMinuteLength = 11;
var fiveMinuteTray = [];

var hourLength = 11;
var hourTray = [];

var mainTray = [];

function loadMinuteTray(ballPassed) {

	if (minuteTray.length < minuteLength) {
		minuteTray.push(ballPassed);
	} else {
		loadMainTray(minuteTray);
		loadFiveMinuteTray(ballPassed);
	}
}

function loadFiveMinuteTray(ballPassed) {

	if (fiveMinuteTray.length < fiveMinuteLength) {
		fiveMinuteTray.push(ballPassed);
	} else {
		loadMainTray(fiveMinuteTray);
		loadHourTray(ballPassed);
	}
}

function loadHourTray(ballPassed) {

	if (hourTray.length < hourLength) {
		hourTray.push(ballPassed);
	} else {
		var returnBallsToTray = [];

		for (var i = 0; i < hourLength; i++) {
			returnBallsToTray.push(hourTray.shift());
		}

		loadMainTray(returnBallsToTray);

		// Now Clear out the returnBallTray to load in the last Passed ball
		returnBallsToTray = [];

		console.log("Empty hour tray: " + returnBallsToTray);

		returnBallsToTray.push(ballPassed);
		
		console.log("Last Ball to send: " + returnBallsToTray);
		
		loadMainTray(returnBallsToTray);
	}
}

function loadMainTray(tray) {
	for (var i = tray.length; i-- > 0; ) {
		mainTray.push(tray.pop());
    }
}

function queue(numberOfBalls, minutesToRun) {
	var startTime = new Date();
	var endTime;

	if (!checkIfNotEmpty(numberOfBalls))
		return;

	if (checkIfInputIsValid(minutesToRun)) {
		minutesToFinish = minutesToRun;
	} else {
		return;
	}

	if (numberOfBalls >= 27 && numberOfBalls <= 127) {
		for (var i=0; i < numberOfBalls; i++) {
			mainTray.push(i + 1);
		}
	} else {
		console.log("Input is out of range");
		return;
	}

	console.log("Starting mainTray contents: " + mainTray);

	while(!completeRotation && !finishedMinutes) {
		
		loadMinuteTray(mainTray.shift());

		completeRotation = checkMainTraySequence();
		finishedMinutes = checkIfDoneInMinutes(minutesToRun);

		if (completeRotation) {
			endTime = new Date();
			var days = minutes/(24*60);
		    console.log(numberOfBalls + " balls cycle after " + days + " days.");
		}

		if (finishedMinutes) {
			endTime = new Date();
			console.log("Status of the Trays when minutes limit reached: \n");
			console.log(constructJSON());
		}

		if (completeRotation || finishedMinutes) {
			var timeDifference = endTime.getMilliseconds() - startTime.getMilliseconds();
			var timeInSeconds = timeDifference / 1000;
			console.log("Completed in: " + timeDifference +  " milliseconds (" + timeInSeconds + " seconds)");
		}

		minutes++;
	}
}

function checkMainTraySequence() {
	for (var i = 0; i < mainTray.length; i++) {

		if (mainTray[i] != i + 1) {
			return false;
		}
	}

	return true;
}

function checkIfDoneInMinutes(timeLimit) {
	if (timeLimit != null && minutes == timeLimit) {
		return true;
	}

	return false;
}

function checkIfNotEmpty(input) {
	if (typeof input === 'undefined' || input == "") {
		console.log("Please enter a numeric value...");
		return false;
	}

	return checkIfInputIsValid(input);
}

function checkIfInputIsValid(inputValue) {
	if (inputValue != null && isNaN(inputValue)) {
		console.log("Input must be a number...");
		return false;
	}
	
	return true;
}

function constructJSON() {
	var jsonTrayContents = {};
	jsonTrayContents["Min"] = minuteTray;
	jsonTrayContents["FiveMin"] = fiveMinuteTray;
	jsonTrayContents["Hour"] = hourTray;
	jsonTrayContents["Main"] = mainTray;

	return JSON.stringify(jsonTrayContents);
}

/*Run the Program: ex; queue(27) or queue(30, 100) */
queue(30);