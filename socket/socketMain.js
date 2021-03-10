const io = require("../setupServer").io;
const { getDB } = require("../db");
const Orb = require("../class/Orb");
const Player = require("../class/Player");
const PlayerData = require("../class/PlayerData");
const PlayerConfig = require("../class/PlayerConfig");
const checkOrbCollision = require("../helper/checkCollision").checkOrbCollision;
const checkPlayerCollision = require("../helper/checkCollision").checkPlayerCollision;

let orbs = [];
let players = [];
let gameSettings = {
    defaultOrbs: 4000,
    defaultSpeed: 5,
    defaultSize: 20,
    defaultZoom: 1.5,
    worldWidth: 4000,
    worldHeight: 4000
}

initGame();


setInterval(() => {
    if (players.length > 0) {
        players.sort((a, b) => {
            return a.score - b.score;
        });
        io.to("game").emit("sendListOfPlayers", { players });
    }
}, 60);

io.sockets.on("connect", async (socket) => {
    let count = 0;
    let delayInterval = setInterval(async () => {
        count++;
        if (count === 1) {
            let statData = await getDB().collection("player").find().toArray();
            io.emit("statData", statData);
            clearInterval(delayInterval);
        }
    }, 1000);

    let player = {};
    socket.on("init", async (data) => {
        socket.join("game");

        let playerData = new PlayerData(data.playerName, gameSettings);
        let playerConfig = new PlayerConfig(gameSettings);
        player = new Player(socket.id, playerData, playerConfig);
        const playerDB = await getDB().collection("player").findOne({ name: player.playerData.name });
        if (!playerDB) {
            await getDB().collection("player").insertOne(player.playerData);
        }

        let sendXYInterval = setInterval(async () => {
            socket.emit("sendPlayerLocForTranslate", {
                // send playerX, playerY to client
                // this values is used to translate
                playerX: player.playerData.x,
                playerY: player.playerData.y,
                playerAlive: player.playerData.alive
            });

            if (player.playerData.alive === false) {
                clearInterval(sendXYInterval);
                socket.emit("isDeath", player.playerData);

                await getDB().collection("player").update(
                    { $and: [{ name: player.playerData.name }, { highestScore: { $lt: player.playerData.score } }] },
                    {
                        $set: { highestScore: player.playerData.score },
                        $inc: { numberOfGame: 1 }
                    }
                )
                await getDB().collection("player").update(
                    { $and: [{ name: player.playerData.name }, { highestAbsorbedOrb: { $lt: player.playerData.orbAbsorbed } }] },
                    {
                        $set: { highestAbsorbedOrb: player.playerData.orbAbsorbed },
                    }
                )
                await getDB().collection("player").update(
                    { $and: [{ name: player.playerData.name }, { highestAbsorbedPlayer: { $lt: player.playerData.playerAbsorbed } }] },
                    {
                        $set: { highestAbsorbedPlayer: player.playerData.playerAbsorbed },
                    }
                )
                // SEND STAT DATA
                let statData = await getDB().collection("player").find().toArray();
                socket.emit("statData", statData);
            }
        }, 60);

        socket.emit("initReturn", { orbs });
        console.log(`Creater player: ${player.playerData.name}`)
        players.push(playerData);
    })


    socket.on("sendVector", (data) => {
        let speed = 0;
        if (player.playerConfig)
            speed = player.playerConfig.speed;
        // update the playerConfig object
        let xV = player.playerConfig.xVector = data.xVector;
        let yV = player.playerConfig.yVector = data.yVector;

        if ((player.playerData.x < 10 && xV < 0) || (player.playerData.x > gameSettings.worldWidth && xV > 0)) { // player is left most or right most
            if (!((player.playerData.y < 10 && yV < 0) || (player.playerData.y > gameSettings.worldHeight && yV > 0))) // and not top most or bottom most
                player.playerData.y += speed * yV;
        }
        else if ((player.playerData.y < 10 && yV < 0) || (player.playerData.y > gameSettings.worldHeight && yV > 0)) { // top most or bottom most
            if (!((player.playerData.x < 10 && xV < 0) || (player.playerData.x > gameSettings.worldWidth && xV > 0))) // and not left most or right most
                player.playerData.x += speed * xV;
        }
        else {
            player.playerData.x += speed * xV;
            player.playerData.y += speed * yV;
        }

        // ORB COLLISION
        let capturedOrb = checkOrbCollision(player.playerData, player.playerConfig, orbs, gameSettings);
        capturedOrb.then((data) => {
            let absorbedOrbs = data.map((i) => {
                return {
                    index: i,
                    newOrb: orbs[i]
                }
            })
            // every player have to know the leader board has changed
            io.sockets.emit("updateLeaderBoard", getLeaderBoard());
            io.sockets.emit("orbSwitch", absorbedOrbs);
        })
            .catch(() => { });

        // PLAYER COLLISION
        let playerDeath = checkPlayerCollision(player.playerData, player.playerConfig, players, player.socketId);
        playerDeath.then((data) => {
            // every player have to know the leader board has changed
            io.sockets.emit("updateLeaderBoard", getLeaderBoard());
            // let everyone know the absorbed player
            io.sockets.emit("playerDeathNotification", data);
        })
            .catch(() => {

            })


        // SEND PLAYER SCORE
        socket.emit("sendPlayerScore", { score: player.playerData.score });

        // DISCONNECT PLAYER
        socket.on("disconnect", async (data) => {
            // find out the player in players who just left
            if (player.playerData) {
                players.forEach((curPlayer, i) => {
                    if (curPlayer.uid === player.playerData.uid) {
                        players.splice(i, 1);
                        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
                    }
                })
            }
        })
    });

})

function getLeaderBoard() {
    players.sort((a, b) => {
        return b.score - a.score;
    });

    let leaderBoard = players.map((player) => {
        return {
            name: player.name,
            score: player.score
        }
    })
    return leaderBoard;
}

function initGame() {
    for (let i = 0; i < gameSettings.defaultOrbs; i++)
        orbs.push(new Orb(gameSettings));
}

module.exports = io;