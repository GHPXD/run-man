let score = 0;
const scoreElement = document.getElementById('score');

const updateScore = () => {
    score++;
    scoreElement.textContent = String(score).padStart(4, '0');
}

const gameOverDialog = document.getElementById('game-over-dialog');
const finalScoreElement = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');

const scoreInterval = setInterval(updateScore, 300); 
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

const jump = () => {
    mario.classList.add('jump');
    setTimeout (() => {
        mario.classList.remove('jump');
    }, 500);
}

const loop = setInterval (() => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

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
    
}, 10)

retryButton.addEventListener('click', () => {
    // Reload the page to restart the game
    location.reload();
});

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);