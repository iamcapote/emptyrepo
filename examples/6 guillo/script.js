var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var side = canvas.width = canvas.height = 750;

var R = 200;
var r = 1;
var p = 100;
var Q = 6;
var n = 12;
var θ = 0;

function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, side, side);
  ctx.beginPath();
  do {
    var x = (R-r)*Math.cos(θ) + (r + p) * Math.cos((R+r)/r * θ) + Q * Math.cos(n * θ);
    var y = (R-r)*Math.sin(θ) - (r + p) * Math.sin((R+r)/r * θ) + Q * Math.sin(n * θ);

    ctx.lineTo(x + side/2, y + side/2);
    θ += 0.001;
  } while(θ < Math.PI * 2);
  ctx.stroke();
}

draw();