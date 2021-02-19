class PlayerConfig {
    constructor(gameSettings) {
        this.xVector = 0;
        this.yVector = 0;
        this.speed = gameSettings.defaultSpeed;
        this.zoom = gameSettings.defaultZoom;
    }
}

module.exports = PlayerConfig;