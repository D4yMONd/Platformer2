class Platform {
    constructor(x, y, width, height, color, isGoal = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isGoal = isGoal;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Добавление текстуры к платформам
        if (this.color === 'green') {
            ctx.fillStyle = '#2E8B57';
            for (let i = 0; i < this.width; i += 20) {
                ctx.fillRect(this.x + i, this.y, 10, 5);
            }
        } else if (this.color === 'brown') {
            ctx.fillStyle = '#8B4513';
            for (let i = 0; i < this.width; i += 30) {
                ctx.fillRect(this.x + i, this.y, 15, 8);
            }
        }
        
        // Флаг на платформе
        if (this.isGoal) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x + this.width - 10, this.y - 50, 5, 50);
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width - 10, this.y - 50);
            ctx.lineTo(this.x + this.width - 25, this.y - 35);
            ctx.lineTo(this.x + this.width - 10, this.y - 20);
            ctx.closePath();
            ctx.fill();
        }
    }
}