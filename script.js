document.addEventListener('DOMContentLoaded', function() {
    const nameEntryScreen = document.getElementById('nameEntryScreen');
    const spinWheelScreen = document.getElementById('spinWheelScreen');
    const spinResultsScreen = document.getElementById('spinResultsScreen');
    const playerNameElement = document.getElementById('playerName');
    const spinsLeftElement = document.getElementById('spinsLeft');
    const totalWinningsElement = document.getElementById('totalWinnings');
    const spinWinningsElement = document.getElementById('spinWinnings');
    const wheel = document.getElementById('wheel'); // The wheel image
    console.log("Script loaded");

    let playerName = '';
    let totalWinnings = 0;
    let spinsLeft = 3;
    let lastSpinResult = null;

    function showScreen(screen) {
        console.log("in showScreen")
        nameEntryScreen.classList.add('hidden');
        spinWheelScreen.classList.add('hidden');
        spinResultsScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    }

    document.getElementById('submitName').addEventListener('click', function() {
        playerName = document.getElementById('nameInput').value;
        if (playerName.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        playerName = document.getElementById('nameInput').value.toLowerCase(); // Convert to lowercase for comparison
        const allowedStrings = ["ben", "ob", "grac", "mag", "hen", "fin", "koop", "chas", "oli"];
        
        // Check if the entered name contains any of the allowed strings
        const isAllowed = allowedStrings.some(sub => playerName.includes(sub));
        
        if (playerName.trim() === '' || !isAllowed) {
            // Name is empty or not allowed
            alert("Santa has you on the naughty list this year. You are not allowed to spin the wheel.");
            return;
        }
        
        // Capitalize the first letter of each word in the name
        playerName = playerName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        playerNameElement.textContent = playerName;
        showScreen(spinWheelScreen);
        updateWinningsAndSpins();
    });

    document.getElementById('spinButton').addEventListener('click', function() {
        if (this.textContent === 'START OVER') {
        resetGame();
        return;
        }
        
        wheel.classList.add('spinning'); // Start the spin animation

        // Disable the button while spinning
        this.setAttribute('disabled', 'disabled');

        // After the spin, calculate the result
        setTimeout(function() {
            spinWheel();
            wheel.classList.remove('spinning'); // Reset the wheel for the next spin

            // Re-enable the spin button
            document.getElementById('spinButton').removeAttribute('disabled');
        }, 8000); // This should match the duration of the CSS animation
    });

    document.getElementById('nextSpin').addEventListener('click', function() {
        if (spinsLeft > 0) {
            showScreen(spinWheelScreen);
        } else {
            resetGame();
        }
    });

    function spinWheel() {
       /*
        if (spinsLeft <= 0) {
            alert('No spins left. Thank you for playing!');
            resetGame();
            return;
        }
        */

        let spinWinnings;
        if (spinsLeft === 3) {
            spinWinnings = getFirstSpinWinnings();
        } else if (spinsLeft === 2) {
            spinWinnings = getSecondSpinWinnings();
        } else {
            spinWinnings = getThirdSpinWinnings(playerName, totalWinnings);
        }

        lastSpinResult = spinWinnings;

        totalWinnings += spinWinnings;

        //spinWinningsElement.textContent = spinWinnings.toFixed(2);
        

        let spinOutcomeMessage = `The wheel says: You won $${spinWinnings.toFixed(2)}!`;
        document.getElementById('spinOutcome').textContent = spinOutcomeMessage;

        updateResultMedia(spinWinnings);
        showScreen(spinResultsScreen);

        // Update the button text for the next spin
        if (spinsLeft === 3) {
            document.getElementById('spinButton').textContent = 'SPIN (2 of 3)';
        } else if (spinsLeft === 2) {
            document.getElementById('spinButton').textContent = 'SPIN (3 of 3)';
        } else if (spinsLeft === 1) {
            document.getElementById('spinButton').textContent = 'START OVER';
            document.getElementById('nextSpin').textContent = 'TRY AGAIN';
        } else if (spinsLeft === 0) {
        // After the third spin, change the button text to "TRY AGAIN"
        document.getElementById('nextSpin').textContent = 'TRY AGAIN';
        }    
    
        // Decrement spinsLeft after updating the button text
        console.log("Spins Left:", spinsLeft);
        spinsLeft -= 1;
        updateWinningsAndSpins();
    }

    function updateWinningsAndSpins() {
        spinsLeftElement.textContent = spinsLeft;
        totalWinningsElement.textContent = totalWinnings.toFixed(2);
    }

    function resetGame() {
        totalWinnings = 0;
        spinsLeft = 3;
        lastSpinResult = null;
        thirdSpinWinnings = 0;
        document.getElementById('nameInput').value = ''; // Clear the input field
        showScreen(nameEntryScreen);
        updateWinningsAndSpins();
        document.getElementById('spinButton').textContent = 'SPIN (1 of 3)';
    }

    function getFirstSpinWinnings() {
        const options = [0.50, 1, 20];
        return options[Math.floor(Math.random() * options.length)];
    }

    function getSecondSpinWinnings() {
        let options = [0.50, 1, 20, 99, 50, 100, 25].filter(opt => opt !== lastSpinResult);
        return options[Math.floor(Math.random() * options.length)];
    }

    function getThirdSpinWinnings(name, currentTotal) {
        let targetTotal;
        if (["ben", "ob", "grac", "mag", "hen"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 100;
        } else if (["fin", "koop"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 500;
        } else if (["chas", "oli"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 250;
        } else {
            targetTotal = 100; // Default target total
        }
    
        return targetTotal - currentTotal;
    }

    function updateResultMedia(amountWon) {
        console.log("in updateResultMedia, amount won:", amountWon);
        const imageSources = {
            "0.5": "50cent.jpg",
            "1": "dolla.jpg",
            "20": "20.jpg",
            "99": "99.jpg",
            "50": "boat.jpg",
            "100": "dmx.jpg",
            "25": "fancylike.jpg",
        };

        const spinOutcomeMessages = {
            "0.5": "Good start! Keep spinning for more!",
            "1": "Nice! You've won a dollar!",
            "20": "Wow! You're up $20!",
            "99": "Incredible! You've won $99!",
            "50": "Great! You've won $50!",
            "100": "Amazing! You've hit $100!",
            "25": "Sweet! You've won $25!",
            // ... other amounts with their messages
        };
    
       // Default media for any amounts not listed
        const defaultImage = "taylor.jpg";
        const defaultMessage = "Look what you made me do! You won: $" + amountWon.toFixed(2) + 
                               "<br>Total Christmas Cash: $" + totalWinnings + 
                               "<br>MERRY CHRISTMAS!";

        const resultImage = document.getElementById('resultImage');
        const spinOutcomeElement = document.getElementById('spinOutcome');
        
        // Use the images and messages from the objects, or the default if not found
        resultImage.src = imageSources[amountWon] || defaultImage;
        spinOutcomeElement.innerHTML = spinOutcomeMessages[amountWon] || defaultMessage;
    }

    showScreen(nameEntryScreen);
});
