const betButton = document.querySelector('#betButton');
const cashOutButton = document.querySelector('#cashOutButton');
const displayPlayerPoints = document.querySelector('#playerPoints');
const displayCrashMultiplier = document.querySelector('#crashMultiplier');
const inputPointsBetted = document.getElementById("pointsBetted");
const startButton = document.querySelector('#startButton');
const displayBailedMultiplier = document.querySelector('#bailedMultiplier');
const displayWonPoints = document.querySelector('#wonPoints');
const divBailedText = document.querySelector('#bailedText');
const divLost = document.querySelector('#lostText');
const divCrashedButWon = document.querySelector('#crashed');
const displayFinalCrashPoint = document.querySelector('#finalCrashValue');
const divExplanation = document.querySelector('#writtenRules');
const howToPlayButton = document.querySelector('#howToPlay');

let input = document.getElementById("pointsBetted");
let bettedPoints = input.value;
let playerPoints = 100;
let crashAtThisScore = 1.00;
let autoCrash = 0.01;
let countingValue = 1.00;
let bailedBeforeCrash = false;
let bailedMultiplier = 1.00;

//------------------------------------------------------------------------------------------------
//Disable some buttons so user just doesnt go ham and break the website
//Also hide some text that doesn't need to be shown.
cashOutButton.disabled = true;
startButton.disabled = true;
divLost.style.display = "none";
divCrashedButWon.style.display = "none"
divExplanation.style.display = "none"
divBailedText.style.display = "none"
//------------------------------------------------------------------------------------------------
//Hides or displays the explaination on how to play
howToPlayButton.addEventListener('click', function(){
	if(divExplanation.style.display === "none"){
		divExplanation.style.display = "block";
	}
	else{
		divExplanation.style.display = "none";
	}
})
//------------------------------------------------------------------------------------------------
//Grab the number of points the user is betting. Is able to be changed until user hits 'BET' Button
inputPointsBetted.addEventListener('change', function(){
	bettedPoints = parseInt(this.value);

	//User inputs value outside of range - reset value to 1
	if(bettedPoints <= 0 || bettedPoints > 1000){
		alert("ERROR: Cannont place bet outside of betting range");
		bettedPoints = 1;
		input.value = 1;
	}

	//User bets more points than they have - set score to their max
	else if(bettedPoints > playerPoints){
		alert("Warning: Bet exceeds player's points. Setting bet to player's total points...");
		bettedPoints = playerPoints;
		input.value = bettedPoints.toFixed(2);
	}

	//User puts in letters (e) or trys some dumb stuff not caught in other branches
	else if(isNaN(bettedPoints) == true){
		alert("ERROR: Not a recognized number.")
		bettedPoints = 1;
		input.value = 1;
	}
})

//-----------------------------------------------------------------------------------------------
//Locks in the bet value the user inputs and generates a value the game will crash at
betButton.addEventListener('click', function() {
	//Check to see if the user has actually touches the bet amount
	if(bettedPoints === '0' || playerPoints <= 0 || playerPoints - bettedPoints < 0){
		alert("ERROR: Insufficient funds OR value of bet amount cannont be 0");
	}
	else{
		startButton.disabled = false;
		betButton.disabled = true;
		//Remove bet amount from the player
		playerPoints = playerPoints - bettedPoints;
		displayPlayerPoints.textContent = playerPoints.toFixed(2);
		//Check to see if it will insta crash 
		if(Math.random() < autoCrash){
			crashAtThisScore = 0.00;
			countingValue = 0.00;
			autoCrash = 0.01;

		}
		//If not an auto crash, generate value which it will crash at
		else{
			autoCrash = (autoCrash * 10 + 0.005 * 10) / 10
			crashAtThisScore = determineCrashScore();
		}
		console.log(crashAtThisScore);
	}
})

//-----------------------------------------------------------------------------------------------
//Starts counting up the multiplier 
startButton.addEventListener('click', function() {
	//Interval which adds 0.005 to the multiplier every 50 miliseconds
	bailedBeforeCrash = false;
	betButton.disabled = true;
	cashOutButton.disabled = false;
	startButton.disabled = true;
	let interval = setInterval(function(){
		//If the mulitplier meets/exceeds pre-generated score, stop the timer, its "CRASHED"
		if(countingValue >= crashAtThisScore){
			clearInterval(interval);
			cashOutButton.disabled = true;
			displayCrashMultiplier.textContent = countingValue.toFixed(2);
			if(bailedBeforeCrash == false){
				divLost.style.display = "block";
			}
			divCrashedButWon.style.display = "block";
			displayFinalCrashPoint.textContent = countingValue.toFixed(2);
			const timeOut = setTimeout(reset, 9000);
		}
		//Keep counting otherwise
		else{
			displayCrashMultiplier.textContent = countingValue.toFixed(2);
		}
	countingValue = countingValue + 0.005;
	}, 50);
})

//-----------------------------------------------------------------------------------------------
//Used to bail with their (the user's) winning before the crash
cashOutButton.addEventListener('click', function(){
	divBailedText.style.display = "block";	
	bailedBeforeCrash = true;
	cashOutButton.disabled = true;
	bailedMultiplier = countingValue;
	displayBailedMultiplier.textContent = bailedMultiplier.toFixed(2);
	playerPoints = playerPoints + (bettedPoints * bailedMultiplier);
	displayPlayerPoints.textContent = playerPoints.toFixed(2);
	displayWonPoints.textContent = (bettedPoints * bailedMultiplier).toFixed(2)

})

//-----------------------------------------------------------------------------------------------
//Function that generate the number at which this round will crash at
function determineCrashScore() {
	let finalCrashNumber = 1;
	let decimalCrashNumber = Math.random();
	let intNumber = 1;

	//Generate the decimal part of the crash number
	decimalCrashNumber = decimalCrashNumber + Math.random() - 0.1;
	if(decimalCrashNumber >= 1){
		decimalCrashNumber--;
	}

	//Generate the int part of the crash number
	if(Math.random() < 0.67){
		//Roughly 67% of runs will be btw 1-2
		intNumber = 1;
	}
	else if(Math.random() < 0.87){
		//Roughly 20% of runs 2-5
		intNumber = Math.floor(Math.random() * 4) + 2
	}
	else if(Math.random() < 0.96){
		//roughly <10% btw 5-10
		intNumber = Math.floor(Math.random() * 6) + 5
	}
	else if(Math.random() < 0.99){
		//rougly 3% to go from 11 - 20
		intNumber = Math.floor(Math.random() * 11) + 11
	}
	else{
		//20 - 118 (?)
		intNumber = Math.floor(Math.random() * 98) + 20
	}

	//Slap the two numbers together to get crash value
	finalCrashNumber = intNumber + ((decimalCrashNumber * 10) / 10);

	if(finalCrashNumber < 1){
		finalCrashNumber = 1.01;
	}
	return finalCrashNumber.toFixed(2);
}

//----------------------------------------------------------------------------------------
//Resets the scores and values so that continuous games can be played
function reset(){
	divBailedText.style.display = "none"
	divLost.style.display = "none";
	divCrashedButWon.style.display = "none"
	cashOutButton.disabled = true;
	startButton.disabled = true;
	betButton.disabled = false;
	crashAtThisScore = 1.00;
	countingValue = 1.00;
	displayCrashMultiplier.textContent = 1.00;
	displayBailedMultiplier.textContent = 1.00;
	displayWonPoints.textContent = 0;
}
