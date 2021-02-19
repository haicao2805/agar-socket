class Orb {
    constructor(gameSettings) {
        this.x = Math.floor(Math.random() * gameSettings.worldWidth);
        this.y = Math.floor(Math.random() * gameSettings.worldHeight);
        this.radius = 5;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = Orb; 