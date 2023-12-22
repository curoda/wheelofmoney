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
            alert('All spins used. Thank you for playing!');
            resetGame();
        }
    });

    function spinWheel() {
        if (spinsLeft <= 0) {
            alert('No spins left. Thank you for playing!');
            resetGame();
            return;
        }

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

        spinWinningsElement.textContent = spinWinnings.toFixed(2);
        

        let spinOutcomeMessage = `The wheel says: You won $${spinWinnings.toFixed(2)}!`;
        document.getElementById('spinOutcome').textContent = spinOutcomeMessage;

        showScreen(spinResultsScreen);

        // Update the button text for the next spin
        if (spinsLeft === 3) {
            document.getElementById('spinButton').textContent = 'SPIN (2 of 3)';
        } else if (spinsLeft === 2) {
            document.getElementById('spinButton').textContent = 'SPIN (3 of 3)';
        } else if (spinsLeft === 1) {
            document.getElementById('spinButton').textContent = 'START OVER';
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
        if (["ben", "ob", "grace", "mag", "hen"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 100;
        } else if (["fin", "koop"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 500;
        } else if (["chase", "olivia"].some(sub => name.toLowerCase().includes(sub))) {
            targetTotal = 250;
        } else {
            targetTotal = 100; // Default target total
        }

        return targetTotal - currentTotal;
    }
    showScreen(nameEntryScreen);
});
