// Variáveis de pontuação
let score = 0;
const scoreElement = document.getElementById('score');

// Elementos do game over
const gameOverDialog = document.getElementById('game-over-dialog');
const finalScoreElement = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');

// Elementos do jogo
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

// Controle de tela cheia
const fullscreenButton = document.getElementById('fullscreen-button');

// Função para atualizar a pontuação
const updateScore = () => {
    score++;
    scoreElement.textContent = String(score).padStart(4, '0');
}

// Intervalo de atualização da pontuação
const scoreInterval = setInterval(updateScore, 300);

// Função de pulo
const jump = () => {
    // Previne múltiplos pulos durante a animação
    if (!mario.classList.contains('jump')) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

// Função para alternar tela cheia
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
            console.log(`Error attempting to enable fullscreen: ${e.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Loop principal do jogo
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Colisão
    if (pipePosition <= 93 && pipePosition > 0 && marioPosition < 100) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;
    
        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
    
        mario.src = './Data/img/game-over.png';
        mario.classList.add('game-over');
    
        clearInterval(loop);
        clearInterval(scoreInterval);

        finalScoreElement.textContent = `Score: ${String(score).padStart(4, '0')}`;
        gameOverDialog.style.display = 'block';
    }
}, 10);

// Event Listeners
retryButton.addEventListener('click', () => {
    location.reload();
});

// Controles para desktop - agora qualquer tecla faz pular
document.addEventListener('keydown', (event) => {
    event.preventDefault(); // Previne scroll da página
    jump();
});

// Controles para mobile
document.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Previne comportamentos padrão do touch
    jump();
});

// Listener para botão de tela cheia
fullscreenButton.addEventListener('click', toggleFullscreen);

// Detectar mudanças de orientação
window.addEventListener('orientationchange', () => {
    if (window.orientation === 0) { // Retrato
        document.getElementById('orientation-message').style.display = 'flex';
    } else { // Paisagem
        document.getElementById('orientation-message').style.display = 'none';
    }
});

// Verificar orientação inicial
if (window.matchMedia("(orientation: portrait)").matches) {
    document.getElementById('orientation-message').style.display = 'flex';
}