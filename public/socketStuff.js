const url = "https://agar-socket.herokuapp.com";
//const url = "http://localhost:5000"
let socket = io(url);
let sendVectorInterval;
function init() { // call when player click "play" btn
    draw(); // drawing the screen
    socket.emit("init", { playerName: player.name }); // player ready
}

socket.on("initReturn", (data) => {
    // we receive the orbs from server
    // then save it to local orbs which is defined in uiStuff.js
    orbs = data.orbs;
    sendVectorInterval = setInterval(() => {
        socket.emit("sendVector", {
            // update xVector, yVector to determine the direction of player
            xVector: player.xVector,
            yVector: player.yVector
        })
    }, 30);
})

socket.on("sendListOfPlayers", (data) => {
    players = data.players;
})

socket.on("sendPlayerLocForTranslate", (data) => {
    player.x = data.playerX;
    player.y = data.playerY;
    player.alive = data.playerAlive;
})

socket.on("orbSwitch", (data) => {
    data.forEach((absorbedOrb) => {
        orbs[absorbedOrb.index] = absorbedOrb.newOrb;
    });
})

socket.on("updateLeaderBoard", (data) => {
    document.querySelector(".leader-board").innerHTML = "";
    data.forEach((element) => {
        if (element.name.length > 10) element.name = element.name.slice(0, 10) + "...";

        document.querySelector(".leader-board").innerHTML +=
            `<li class="leaderboard-player"><span>${element.score} -- <span>${element.name}</span></span></li>`
    })
})

socket.on("sendPlayerScore", (data) => {
    document.querySelector(".player-score").innerHTML = data.score;
})

socket.on("playerDeathNotification", (data) => {
    document.querySelector("#game-message").innerHTML =
        `${data.died.name} is absorbed by ${data.killedBy.name}`;

    $("#game-message").css({
        "background-color": "white",
        "color": "black",
        "opacity": 1
    })
    $("#game-message").show();
    $("#game-message").fadeOut(5000);
})

// socket.on("playerDeathSpecific", (data) => {
//     console.log(data);
// })

socket.on("isDeath", async (data) => {
    clearInterval(sendVectorInterval);
    if (data.alive === false) {
        $("#loginModal").modal("show"); // show login form
        $(".hiddenOnStart").css("visibility", "hidden");
    }
})

socket.on("statData", (data) => {
    data = data.sort();
    console.log(data);
    let statBody = document.querySelector(".stat-body");
    statBody.innerHTML = "";
    data.forEach((e) => {
        statBody.innerHTML += `
        <tr class="stat-row">
            <td class="stat-item">${e.name}</td>
            <td class="stat-item">${e.numberOfGame}</td>
            <td class="stat-item">${e.highestScore}</td>
            <td class="stat-item">${e.highestAbsorbedOrb}</td>
            <td class="stat-item">${e.highestAbsorbedPlayer}</td>
        </tr>
        `
    })
})