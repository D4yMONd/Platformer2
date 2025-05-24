// Элементы управления с клавиатуры
window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            Game.player.velocityX = -Game.player.speed;
            Game.player.direction = 'left';
            break;
        case 'ArrowRight':
            Game.player.velocityX = Game.player.speed;
            Game.player.direction = 'right';
            break;
        case 'ArrowUp':
        case 'Space':
            if (!Game.player.isJumping) {
                Game.player.jump();
            }
            break;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        Game.player.velocityX = 0;
    }
});

// Сенсорное управление для мобильных устройств
Game.canvas.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const canvasRect = Game.canvas.getBoundingClientRect();
    const canvasCenter = canvasRect.left + canvasRect.width / 2;
    
    if (touchX < canvasCenter) {
        // Left side - move left
        Game.player.velocityX = -Game.player.speed;
        Game.player.direction = 'left';
    } else {
        // Right side - move right
        Game.player.velocityX = Game.player.speed;
        Game.player.direction = 'right';
    }
    
    // Подпрыгивание от любого прикосновения
    if (!Game.player.isJumping) {
        Game.player.jump();
    }
});

Game.canvas.addEventListener('touchend', () => {
    Game.player.velocityX = 0;
});