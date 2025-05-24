class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = -12;
        this.gravity = 0.5;
        this.isJumping = false;
        this.direction = 'right';
        this.lives = 3;
        this.score = 0;
        this.frameCount = 0;
        this.currentFrame = 0;
        this.animationSpeed = 5;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    update(platforms, coins, enemies) {
        // Гравитация
        this.velocityY += this.gravity;
        
        // Движение игрока
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Проверка столкновений платформ
        this.isJumping = true;
        platforms.forEach(platform => {
            if (this.isOnPlatform(platform)) {
                this.isJumping = false;
                this.velocityY = 0;
                this.y = platform.y - this.height;
                
                // Провека приземления на платформу
                if (platform.isGoal) {
                    Game.nextLevel();
                }
            }
        });

        // Проверка колизии монет
        coins.forEach(coin => {
            if (!coin.collected && coin.checkCollision(this)) {
                coin.collected = true;
                this.score += 100;
                Game.updateUI();
            }
        });

        // Проверка колизии противников
        if (!this.invincible) {
            enemies.forEach(enemy => {
                if (enemy.isActive && enemy.checkCollision(this)) {
                    // Check if player is falling onto enemy
                    if (this.velocityY > 0 && this.y + this.height < enemy.y + enemy.height/2) {
                        // Bounce off enemy
                        this.velocityY = this.jumpPower * 0.7;
                        
                        // Урон противнику
                        if (enemy.takeDamage()) {
                            this.score += enemy.type === 'basic' ? 200 : 500;
                            Game.updateUI();
                        }
                    } else {
                        // Получение урона
                        this.takeDamage();
                    }
                }
            });
        }

        // Анимации
        if (this.velocityX !== 0) {
            this.frameCount++;
            if (this.frameCount >= this.animationSpeed) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % 4;
            }
        } else {
            this.currentFrame = 0;
        }

        // Таймер неуязвимости
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        // Проверка, не исчез ли игрок с экрана
        if (this.y > Game.canvas.height) {
            this.takeDamage();
        }
    }
    
    isOnPlatform(platform) {
        return (
            this.x + this.width > platform.x &&
            this.x < platform.x + platform.width &&
            this.y + this.height >= platform.y &&
            this.y + this.height <= platform.y + 10 &&
            this.velocityY >= 0
        );
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    }

    takeDamage() {
        if (this.invincible) return;

        this.lives--;
        this.invincible = true;
        this.invincibleTimer = 60; // 1 second at 60fps
        
        if (this.lives <= 0) {
            Game.reset();
        } else {
            Game.resetPlayer();
        }
    }

    draw(ctx) {
        // Flash effect when invincible
        if (this.invincible && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
            return;
        }

        // Тело игрока
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Глаза, смотрящие в направление
        ctx.fillStyle = 'white';
        if (this.direction === 'right') {
            ctx.fillRect(this.x + 25, this.y + 15, 10, 10);
        } else {
            ctx.fillRect(this.x + 5, this.y + 15, 10, 10);
        }
        
        // Простой анимационный эффект
        if (this.velocityX !== 0 && this.currentFrame > 1) {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + 15, this.y + this.height - 10, 10, 5);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + 10, this.y + this.height - 10, 20, 5);
        }
    }
}