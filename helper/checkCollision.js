const Orb = require("../class/Orb");

function checkOrbCollision(playerData, playerConfig, orbs, gameSettings) {
    return new Promise((resolve, reject) => {
        let absorbedOrbs = [];
        orbs.forEach((orb, i) => {
            let xDistance = playerData.x - orb.x;
            let yDistance = playerData.y - orb.y;
            let distancePlayerToOrbs = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            if (distancePlayerToOrbs <= playerData.radius) {
                playerData.score++;
                playerData.orbAbsorbed++;
                if (playerConfig.zoom > 1) playerConfig.zoom -= 0.001;
                playerData.radius += 0.25;
                if (playerConfig.speed > 0.01) playerConfig.speed -= 0.005;
                else if (playerConfig.speed < -0.01) playerConfig.speed += 0.005;
                orbs[i] = new Orb(gameSettings);
                absorbedOrbs.push(i);
            }
            resolve(absorbedOrbs);
        })

        reject();
    });
}

function checkPlayerCollision(playerData, playerConfig, players, playerId) {
    return new Promise((resolve, reject) => {
        players.forEach((curPlayer, i) => {
            if (curPlayer.socketId != playerId) {
                let xDistance = curPlayer.x - playerData.x;
                let yDistance = curPlayer.y - playerData.y;
                let distancePlayerToPlayer = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
                if (distancePlayerToPlayer <= playerData.radius && playerData.radius > curPlayer.radius) {
                    // DEATH
                    let collisionData = updateScores(playerData, curPlayer);
                    if (playerConfig.zoom > 1) playerConfig.zoom -= (curPlayer.radius * 0.25) * 0.001;
                    players.splice(i, 1);
                    resolve(collisionData);
                }
            }
        })
        reject();
    })
}

function updateScores(killer, killed) {
    killer.score += (killed.score + 10);
    killer.playerAbsorbed += 1;
    killed.alive = false;
    killer.radius += (killed.radius * 0.25)
    return {
        died: killed,
        killedBy: killer,
    }
}

module.exports = { checkOrbCollision, checkPlayerCollision };