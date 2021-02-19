const uuidv4 = require("uuid/v4");

class PlayerData {
    constructor(playerName, gameSettings) {
        this.uid = uuidv4(); // create a random string
        this.name = playerName;
        this.x = Math.floor(gameSettings.worldWidth * Math.random() + 50);
        this.y = Math.floor(gameSettings.worldHeight * Math.random() + 50);
        this.radius = gameSettings.defaultSize;
        this.color = this.getRandomColor();
        this.score = 0;
        this.orbAbsorbed = 0;
        this.playerAbsorbed = 0;
        this.alive = true;
        this.highestScore = 0;
        this.numberOfGame = 0;
        this.highestAbsorbedOrb = 0;
        this.highestAbsorbedPlayer = 0;
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = PlayerData;