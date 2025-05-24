class Background {
    constructor() {
        this.layers = [
            { color: '#87CEEB', speed: 0.2, height: 500 }, // Sky
            { color: '#3A5F0B', speed: 0.5, height: 150, y: 350 }, // Distant hills
            { color: '#2A4D0B', speed: 0.8, height: 200, y: 300 }  // Closer hills
        ];
    }
    
    update(playerX) {
        this.layers.forEach(layer => {
            layer.offset = -playerX * layer.speed;
        });
    }
    
    draw(ctx) {
        // Небо
        ctx.fillStyle = this.layers[0].color;
        ctx.fillRect(0, 0, 1600, 500);
        
        // Параллакс слои
        for (let i = 1; i < this.layers.length; i++) {
            const layer = this.layers[i];
            ctx.fillStyle = layer.color;
            
            // Две копии для плавной прокрутки
            const firstX = layer.offset % 800;
            ctx.fillRect(firstX, layer.y, 800, layer.height);
            ctx.fillRect(firstX + 800, layer.y, 800, layer.height);
        }
    }
}