let windowHeight = $(window).height();
let windowWidth = $(window).width();
let player = {
    name: "",
    xVector: 0,
    yVector: 0
}; // save all information about player
let orbs = [];
let players = [];

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = windowWidth;
canvas.height = windowHeight;

$(window).load(() => {
    $("#loginModal").modal("show"); // show login form
});

$(".name-form").submit(async (e) => {
    e.preventDefault();
    player.name = document.querySelector("#name-input").value;
    $("#loginModal").modal("hide"); // after player enter their name, hide login form
    $("#spawnModal").modal("show"); // then show spawn form
    document.querySelector(".player-name").innerHTML = player.name;
})


$(".start-game").click((e) => {
    $(".modal").modal("hide");
    $(".hiddenOnStart").css("visibility", "visible")
    init();
})

$(".show-stat").click((e) => {
    $(".modal").modal("hide");
    $("#statModal").modal("show");
})

$(".out-stat-btn").click((e) => {
    $("#statModal").modal("hide");
    $("#spawnModal").modal("show");
})
