// Game elements
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameOverDialog = document.getElementById('game-over-dialog');
const finalScoreElement = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');
const scoreElement = document.getElementById('score');
const fullscreenButton = document.getElementById('fullscreen-button');

// Game state
let score = 0;
let isGameRunning = false;
let scoreInterval;
let gameLoop;
let isFullscreen = false;

// Initialize game state
function initializeGame() {
    score = 0;
    scoreElement.textContent = '0000';
    mario.src = './Data/img/mario.gif';
    mario.classList.remove('game-over');
    pipe.style.animation = '';
    pipe.style.left = '';
    mario.style.bottom = '0';
    mario.style.animation = '';
    gameOverDialog.style.display = 'none';
}

// Start game function
function startGame() {
    initializeGame();
    startScreen.style.display = 'none';
    isGameRunning = true;
    
    // Start score counter
    scoreInterval = setInterval(() => {
        score++;
        scoreElement.textContent = String(score).padStart(4, '0');
    }, 300);

    // Start game loop
    gameLoop = setInterval(() => {
        if (!isGameRunning) return;
        
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
        
        // Ajusta a área de colisão para mobile
        const collisionThreshold = window.matchMedia("(max-width: 768px)").matches ? 80 : 93;

        if (pipePosition <= collisionThreshold && pipePosition > 0 && marioPosition < 100) {
            gameOver();
        }
    }, 10);
}

// Game over function
function gameOver() {
    isGameRunning = false;
    clearInterval(gameLoop);
    clearInterval(scoreInterval);
    
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    
    mario.style.animation = 'none';
    mario.style.bottom = `${window.getComputedStyle(mario).bottom}`;
    mario.src = './Data/img/game-over.png';
    mario.classList.add('game-over');
    
    finalScoreElement.textContent = `Score: ${String(score).padStart(4, '0')}`;
    gameOverDialog.style.display = 'block';
}

// Jump function
function jump() {
    if (isGameRunning && !mario.classList.contains('jump')) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

// Fullscreen handling
async function toggleFullscreen() {
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        isFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            isFullscreen = false;
        }
    }
}

// Função para verificar se é dispositivo móvel
function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

// Event listeners
startButton.addEventListener('click', async () => {
    if (isMobile()) {
        await toggleFullscreen();  // Aguarda a tela cheia ser ativada
        setTimeout(startGame, 300); // Pequeno delay para garantir que a tela cheia foi ativada
    } else {
        startGame();
    }
});

retryButton.addEventListener('click', () => {
    initializeGame();
    startGame();
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (isGameRunning) {
        event.preventDefault();
        jump();
    }
});

// Touch controls
document.addEventListener('touchstart', (event) => {
    if (isGameRunning && !mario.classList.contains('jump')) {
        event.preventDefault();
        jump();
    }
}, { passive: false });

fullscreenButton.addEventListener('click', toggleFullscreen);

// Orientation handling
function checkOrientation() {
    const orientationMessage = document.getElementById('orientation-message');
    if (window.matchMedia("(orientation: portrait)").matches) {
        orientationMessage.style.display = 'flex';
        if (isGameRunning) {
            clearInterval(gameLoop);
            clearInterval(scoreInterval);
            isGameRunning = false;
        }
    } else {
        orientationMessage.style.display = 'none';
        if (!isGameRunning && startScreen.style.display === 'none') {
            startGame();
        }
    }
}

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);

// Initial check
checkOrientation();

// Show start screen only if on desktop or in landscape
if (window.matchMedia("(orientation: landscape)").matches || !window.matchMedia("(max-width: 768px)").matches) {
    startScreen.style.display = 'flex';
} else {
    startScreen.style.display = 'none';
}
