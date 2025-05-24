const Game = {
    canvas: document.getElementById('gameCanvas'),
    ctx: null,
    player: null,
    background: null,
    platforms: [],
    coins: [],
    enemies: [],
    currentLevel: 0,
    cameraOffset: 0,
    levelDisplay: document.getElementById('levelDisplay'),
    livesDisplay: document.getElementById('livesDisplay'),
    scoreDisplay: document.getElementById('scoreDisplay'),

    // Дизайн уровней
    levels: [
        // Level 1
        {
            platforms: [
                { x: 0, y: 400, width: 800, height: 20, color: 'brown' },
                { x: 100, y: 300, width: 100, height: 20, color: 'green' },
                { x: 300, y: 250, width: 100, height: 20, color: 'green' },
                { x: 500, y: 200, width: 100, height: 20, color: 'green', isGoal: true }
            ],
            coins: [
                { x: 150, y: 250 },
                { x: 350, y: 200 },
                { x: 550, y: 150 }
            ],
            enemies: [
                { x: 200, y: 360, type: 'basic' }
            ]
        },
        // Level 2
        {
            platforms: [
                { x: 0, y: 400, width: 300, height: 20, color: 'brown' },
                { x: 350, y: 400, width: 300, height: 20, color: 'brown' },
                { x: 150, y: 320, width: 80, height: 20, color: 'green' },
                { x: 400, y: 270, width: 80, height: 20, color: 'green' },
                { x: 650, y: 220, width: 80, height: 20, color: 'green', isGoal: true }
            ],
            coins: [
                { x: 50, y: 350 },
                { x: 250, y: 350 },
                { x: 450, y: 350 },
                { x: 180, y: 280 },
                { x: 430, y: 230 }
            ],
            enemies: [
                { x: 100, y: 360, type: 'basic' },
                { x: 500, y: 360, type: 'strong' }
            ]
        },
        // Level 3
        {
            platforms: [
                { x: 0, y: 400, width: 200, height: 20, color: 'brown' },
                { x: 250, y: 400, width: 200, height: 20, color: 'brown' },
                { x: 500, y: 400, width: 200, height: 20, color: 'brown' },
                { x: 100, y: 300, width: 100, height: 20, color: 'green' },
                { x: 350, y: 250, width: 100, height: 20, color: 'green' },
                { x: 600, y: 200, width: 100, height: 20, color: 'green', isGoal: true }
            ],
            coins: [
                { x: 50, y: 350 },
                { x: 300, y: 350 },
                { x: 550, y: 350 },
                { x: 150, y: 250 },
                { x: 400, y: 200 },
                { x: 650, y: 150 }
            ],
            enemies: [
                { x: 150, y: 360, type: 'basic' },
                { x: 400, y: 360, type: 'basic' },
                { x: 650, y: 360, type: 'strong' }
            ]
        }
    ],

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        this.background = new Background();
        this.loadLevel(this.currentLevel);
        
        // Запуск игрового цикла
        requestAnimationFrame(() => this.gameLoop());
    },
    
    loadLevel(levelNum) {
        const level = this.levels[levelNum];
        
        this.platforms = level.platforms.map(plat => 
            new Platform(plat.x, plat.y, plat.width, plat.height, plat.color, plat.isGoal)
        );
        
        this.coins = level.coins.map(coin => 
            new Coin(coin.x, coin.y)
        );
        
        this.enemies = level.enemies.map(enemy => 
            new Enemy(enemy.x, enemy.y, enemy.type)
        );
        
        this.player = new Player(100, 300);
        this.cameraOffset = 0;
        this.updateUI();
    },
    
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >= this.levels.length) {
            this.currentLevel = 0;
            alert(`Поздравляю! Вы прошли все уровни со счетом: ${this.player.score}`);
        }
        this.loadLevel(this.currentLevel);
    },
    
    reset() {
        this.currentLevel = 0;
        this.player.score = 0;
        this.loadLevel(this.currentLevel);
    },
    
    resetPlayer() {
        this.player.x = 100;
        this.player.y = 300;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.cameraOffset = 0;
        this.updateUI();
    },
    
    updateUI() {
        this.levelDisplay.textContent = `Level: ${this.currentLevel + 1}`;
        this.livesDisplay.textContent = `Lives: ${this.player.lives}`;
        this.scoreDisplay.textContent = `Score: ${this.player.score}`;
    },
    
    gameLoop() {
        // Прозрачный холст
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновление состояния игры
        this.player.update(this.platforms, this.coins, this.enemies);
        this.background.update(this.player.x);
        
        this.coins.forEach(coin => coin.update());
        this.enemies.forEach(enemy => enemy.update());
        
        this.cameraOffset = this.player.x - 100;
        this.updateUI();
        
        // Фон
        this.ctx.save();
        this.ctx.translate(-this.cameraOffset * 0.5, 0);
        this.background.draw(this.ctx);
        this.ctx.restore();
        
        // Платформы
        this.platforms.forEach(platform => {
            this.ctx.save();
            this.ctx.translate(-this.cameraOffset, 0);
            platform.draw(this.ctx);
            this.ctx.restore();
        });
        
        // Монеты
        this.coins.forEach(coin => {
            this.ctx.save();
            this.ctx.translate(-this.cameraOffset, 0);
            coin.draw(this.ctx);
            this.ctx.restore();
        });
        
        // Противники
        this.enemies.forEach(enemy => {
            this.ctx.save();
            this.ctx.translate(-this.cameraOffset, 0);
            enemy.draw(this.ctx);
            this.ctx.restore();
        });
        
        // Игрок
        this.ctx.save();
        this.ctx.translate(-this.cameraOffset, 0);
        this.player.draw(this.ctx);
        this.ctx.restore();
        
        // Продолжение игрового цикла
        requestAnimationFrame(() => this.gameLoop());
    }
};

// Запуск игры, когда все будет загружено
window.addEventListener('load', () => {
    Game.init();
});