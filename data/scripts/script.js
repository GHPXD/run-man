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
const pauseOverlay = document.getElementById('pause-overlay');
const highScoreElement = document.getElementById('high-score-value');
const newRecordElement = document.getElementById('new-record');

// Audio elements
const jumpSound = document.getElementById('jump-sound');
const gameOverSound = document.getElementById('game-over-sound');
const scoreSound = document.getElementById('score-sound');

// Game state variables
let score = 0;
let highScore = 0;
let isGameRunning = false;
let isPaused = false;
let scoreInterval;
let isFullscreen = false;

// Performance variables para requestAnimationFrame
let lastTime = 0;
let deltaTime = 0;
let targetFPS = 60;
let frameInterval = 1000 / targetFPS; // 16.67ms para 60 FPS

// Initialize game state
function initializeGame() {
    score = 0;
    scoreElement.textContent = '0000';
    mario.src = './data/images/mario.gif';
    mario.classList.remove('game-over');
    pipe.style.animation = '';
    pipe.style.left = '';
    mario.style.bottom = '0';
    mario.style.animation = '';
    gameOverDialog.style.display = 'none';
    pauseOverlay.style.display = 'none';
    isPaused = false;
    loadHighScore();
}

// Sistema de High Score
function loadHighScore() {
    highScore = parseInt(localStorage.getItem('marioHighScore')) || 0;
    highScoreElement.textContent = String(highScore).padStart(4, '0');
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('marioHighScore', highScore);
        return true; // Novo recorde
    }
    return false;
}

// Sistema de áudio
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Erro ao reproduzir som:', e));
    }
}

// Função para calcular a área de colisão melhorada
function checkCollision() {
    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();
    
    // Adiciona margem de tolerância para colisão mais precisa
    const tolerance = 8;
    
    return (
        marioRect.right - tolerance > pipeRect.left &&
        marioRect.left + tolerance < pipeRect.right &&
        marioRect.bottom - tolerance > pipeRect.top &&
        marioRect.top + tolerance < pipeRect.bottom
    );
}

// Start game function
function startGame() {
    initializeGame();
    startScreen.style.display = 'none';
    isGameRunning = true;
    
    // Start score counter
    scoreInterval = setInterval(() => {
        if (!isPaused) {
            score++;
            scoreElement.textContent = String(score).padStart(4, '0');
            
            // Tocar som a cada 100 pontos
            if (score % 100 === 0) {
                playSound(scoreSound);
            }
        }
    }, 300);

    // Iniciar game loop otimizado com requestAnimationFrame
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// Game loop otimizado
function gameLoop(currentTime) {
    if (!isGameRunning) return;
    
    // Calcular delta time
    deltaTime = currentTime - lastTime;
    
    // Só executar lógica se passou tempo suficiente (controle de FPS)
    if (deltaTime >= frameInterval && !isPaused) {
        // Verificação de colisão melhorada
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        lastTime = currentTime - (deltaTime % frameInterval);
    }
    
    // Continuar o loop
    requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
    isGameRunning = false;
    clearInterval(scoreInterval);
    
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    
    mario.style.animation = 'none';
    mario.style.bottom = `${window.getComputedStyle(mario).bottom}`;
    mario.src = './data/images/game-over.png';
    mario.classList.add('game-over');
    
    // Verificar se é novo recorde
    const isNewRecord = saveHighScore();
    
    finalScoreElement.textContent = `Score: ${String(score).padStart(4, '0')}`;
    
    if (isNewRecord) {
        newRecordElement.style.display = 'block';
        highScoreElement.textContent = String(highScore).padStart(4, '0');
    } else {
        newRecordElement.style.display = 'none';
    }
    
    gameOverDialog.style.display = 'block';
    playSound(gameOverSound);
}

// Jump function melhorada
function jump() {
    if (isGameRunning && !mario.classList.contains('jump') && !isPaused) {
        mario.classList.add('jump');
        playSound(jumpSound);
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

// Sistema de pausa
function pauseGame() {
    if (!isGameRunning) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        pipe.style.animationPlayState = 'paused';
        pauseOverlay.style.display = 'flex';
    } else {
        pipe.style.animationPlayState = 'running';
        pauseOverlay.style.display = 'none';
    }
}

// Fullscreen handling melhorado
async function toggleFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
        try {
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
            isFullscreen = true;
        } catch (err) {
            console.log('Erro ao ativar fullscreen:', err);
        }
    } else {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            isFullscreen = false;
        } catch (err) {
            console.log('Erro ao sair do fullscreen:', err);
        }
    }
}

// Função para verificar se é dispositivo móvel
function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

// Event listeners melhorados
startButton.addEventListener('click', async () => {
    if (isMobile()) {
        await toggleFullscreen();
        setTimeout(startGame, 300);
    } else {
        startGame();
    }
});

retryButton.addEventListener('click', () => {
    initializeGame();
    startGame();
});

// Controles de teclado melhorados
document.addEventListener('keydown', (event) => {
    if (isGameRunning) {
        // Aceitar apenas teclas específicas para pular
        if (event.code === 'Space' || event.code === 'ArrowUp' || 
            event.code === 'KeyW' || event.code === 'Enter') {
            event.preventDefault();
            jump();
        }
    }
    
    // Tecla ESC para pausar
    if (event.code === 'Escape' && isGameRunning) {
        event.preventDefault();
        pauseGame();
    }
});

// Touch controls melhorados
document.addEventListener('touchstart', handleTouch, { passive: false });
document.addEventListener('touchend', handleTouch, { passive: false });

function handleTouch(event) {
    if (isGameRunning && !mario.classList.contains('jump')) {
        event.preventDefault();
        if (isPaused) {
            pauseGame(); // Despausar se estiver pausado
        } else {
            jump();
        }
    }
}

// Pausar/despausar com toque no overlay
pauseOverlay.addEventListener('click', () => {
    if (isPaused) {
        pauseGame();
    }
});

fullscreenButton.addEventListener('click', toggleFullscreen);

// Orientation handling melhorado
function checkOrientation() {
    const orientationMessage = document.getElementById('orientation-message');
    if (window.matchMedia("(orientation: portrait)").matches) {
        orientationMessage.style.display = 'flex';
        if (isGameRunning) {
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

// Event listeners para orientação
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100); // Delay para aguardar mudança completa
});
window.addEventListener('resize', checkOrientation);

// Detectar mudanças de fullscreen
document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
});

document.addEventListener('webkitfullscreenchange', () => {
    isFullscreen = !!document.webkitFullscreenElement;
});

document.addEventListener('msfullscreenchange', () => {
    isFullscreen = !!document.msFullscreenElement;
});

// Prevenir que o jogo continue rodando quando a aba não está ativa
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isGameRunning && !isPaused) {
        pauseGame();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar high score na inicialização
    loadHighScore();
    
    // Verificação inicial de orientação
    checkOrientation();
    
    // Mostrar tela inicial apenas se estiver em landscape ou desktop
    if (window.matchMedia("(orientation: landscape)").matches || !window.matchMedia("(max-width: 768px)").matches) {
        startScreen.style.display = 'flex';
    } else {
        startScreen.style.display = 'none';
    }
});

// Preload de imagens para melhor performance
function preloadImages() {
    const imageUrls = [
        './data/images/mario.gif',
        './data/images/game-over.png',
        './data/images/pipe.png',
        './data/images/clouds.png',
        './data/images/brick.png',
        './data/images/fullscreen.png',
        './data/images/retry.png',
        './data/images/rotate.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Chamar preload quando a página carregar
window.addEventListener('load', preloadImages);