// =====================================
// ===============DRAWING===============
// =====================================
const PI = Math.PI;

function draw() {
    // reset the translation back to default!
    context.setTransform(1, 0, 0, 1, 0, 0)

    // clear before draw
    context.clearRect(0, 0, canvas.width, canvas.height);

    // // translate allow us to move the canvas
    if (player.alive) {
        let camX = canvas.width / 2 - player.x;
        let camY = canvas.height / 2 - player.y;
        context.translate(camX, camY);


        // Draw a circle with arc() function
        // arc() take 5 args. There are X, Y, R, startPos, endPos
        // draw players
        players.forEach((player) => {
            context.beginPath();
            context.fillStyle = player.color;
            context.arc(player.x, player.y, player.radius, 0, 2 * PI);
            context.fill();

            context.strokeStyle = "white";
            context.lineWidth = 3;
            context.stroke();
        })


        // draw all orb in orbs
        orbs.forEach((orb) => {
            context.beginPath();
            context.fillStyle = orb.color;
            context.arc(orb.x, orb.y, orb.radius, 0, 2 * PI);
            context.fill();
        })
    }
    requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", (e) => {
    const mousePosition = {
        x: e.clientX,
        y: e.clientY
    };

    // ta cần xác định mouse đang nằm ở phần tư thứ mấy của màn hình
    // lấy tâm là là canvas, chia màn hình thành 4 phần.
    // dùng atan2 để xác định chính xác phần tư nào
    // dùng atan thì không xác định được.
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / PI;

    player.xVector = Math.cos(angleDeg * PI / 180);
    player.yVector = Math.sin(angleDeg * PI / 180);
})