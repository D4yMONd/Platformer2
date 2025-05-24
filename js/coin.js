class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
    }

    update() {
        this.animationFrame += this.animationSpeed;
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Анимация блеска монет
        const frame = Math.floor(this.animationFrame) % 4;
        const sizes = [15, 18, 20, 18];
        const currentSize = sizes[frame];
        const offset = (20 - currentSize) / 2;

        // Монета
        ctx.beginPath();
        ctx.arc(10, 10, currentSize/2, 0, Math.PI * 2);
        ctx.fillStyle = 'gold';
        ctx.fill();
        
        // Детали монеты
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(10, 10, currentSize/3, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        
        ctx.restore();
    }

    checkCollision(player) {
        if (this.collected) return false;

        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}