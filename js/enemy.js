class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.type = type;
        this.speed = type === 'basic' ? 2 : 1.5;
        this.direction = 1; // 1 for right, -1 for left
        this.moveDistance = 100;
        this.startX = x;
        this.health = type === 'basic' ? 1 : 2;
        this.isActive = true;
        this.animationFrame = 0;
    }

    update() {
        if (!this.isActive) return;

        // Основная схема движения
        this.x += this.speed * this.direction;
        
        // Change direction if moved too far
        if (Math.abs(this.x - this.startX) > this.moveDistance) {
            this.direction *= -1;
        }

        this.animationFrame += 0.1;
    }

    draw(ctx) {
        if (!this.isActive) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Враг в зависимости от его типа
        if (this.type === 'basic') {
            // Basic enemy (goomba-like)
            ctx.fillStyle = 'brown';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Глаза
            ctx.fillStyle = 'white';
            ctx.fillRect(5, 10, 10, 5);
            ctx.fillRect(25, 10, 10, 5);
            
            // Рот
            ctx.fillStyle = 'black';
            ctx.fillRect(10, 20, 20, 5);
        } else {
            // Более сильный враг (koopa-like)
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(20, 20, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Узор
            ctx.fillStyle = 'darkgreen';
            ctx.beginPath();
            ctx.arc(20, 20, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Глаза
            const eyeX = this.direction > 0 ? 25 : 15;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(eyeX, 15, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    checkCollision(player) {
        if (!this.isActive) return false;

        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.isActive = false;
            return true; // Enemy defeated
        }
        return false;
    }
}