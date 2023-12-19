document.addEventListener('DOMContentLoaded', function() {
    const nameEntryScreen = document.getElementById('nameEntryScreen');
    const spinWheelScreen = document.getElementById('spinWheelScreen');
    const spinResultsScreen = document.getElementById('spinResultsScreen');
    const playerNameElement = document.getElementById('playerName');
    const spinsLeftElement = document.getElementById('spinsLeft');
    const totalWinningsElement = document.getElementById('totalWinnings');
    const spinWinningsElement = document.getElementById('spinWinnings');
    
    let playerName = '';
    let totalWinnings = 0;
    let spinsLeft = 3;

    function showScreen(screen) {
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
        playerNameElement.textContent = playerName;
        showScreen(spinWheelScreen);
        updateWinningsAndSpins();
    });
    
    document.getElementById('spinButton').addEventListener('click', spinWheel);
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
        
        const spinWinnings = calculateWinnings(playerName);
        totalWinnings += spinWinnings;
        spinsLeft -= 1;

        spinWinningsElement.textContent = spinWinnings.toFixed(2);
        updateWinningsAndSpins();

        let spinOutcomeMessage = `The wheel says: You won $${spinWinnings.toFixed(2)}!`;
        document.getElementById('spinOutcome').textContent = spinOutcomeMessage;
        
        showScreen(spinResultsScreen);
    }
    
    function updateWinningsAndSpins() {
        spinsLeftElement.textContent = spinsLeft;
        totalWinningsElement.textContent = totalWinnings.toFixed(2);
    }

    function resetGame() {
        totalWinnings = 0;
        spinsLeft = 3;
        showScreen(nameEntryScreen);
        updateWinningsAndSpins();
    }

    function calculateWinnings(name) {
        let winnings = Math.random() * (99 - 0.5) + 0.5; // Default random winnings
        if (name.toLowerCase().includes("ben") || name.toLowerCase().includes("ob")) {
            winnings = 100;
        } else if (name.toLowerCase().includes("grace") || name.toLowerCase().includes("mag") || name.toLowerCase().includes("hen")) {
            winnings = 100;
        } else if (name.toLowerCase().includes("fin") || name.toLowerCase().includes("koop")) {
            winnings = 500;
        } else if (name.toLowerCase().includes("chase") || name.toLowerCase().includes("olivia")) {
            winnings = 250;
        }
        return winnings;
    }
});
