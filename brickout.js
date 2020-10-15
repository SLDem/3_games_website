// canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
var started = false;

//score and lives
var score = 0;
var lives = 3;

// ball
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;

var dx = 2;
var dy = -6;

var ballRadius = 8;

// paddle
var paddleHeight = 5;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;

// controls
var rightPressed = false;
var leftPressed = false;

//brick wall
var brickRowCount = 4;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;


var bricks = [];
for (var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//execute functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2)
    ctx.fillStyle = "#FCA0A0";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FF7171";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding )) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding )) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#D64EF7";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX >= paddleX && ballX <= paddleX + paddleWidth / 3) {
            dy = -dy;
            dx -= 1;
        } else if (ballX > paddleX + (paddleWidth / 3) && ballX < paddleX + ((paddleWidth / 3) * 2)) {
            dy = -dy;
        } else if (ballX > paddleX + ((paddleWidth / 3) * 2) && ballX < paddleX + paddleWidth) {
            dy = -dy;
            dx += 1;
        } else {
            lives--;
            if (!lives) {
                alert("Game Over!");
                document.location.reload();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 2;
                dy = -4;
            }
        }

    }
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    };

    if(rightPressed) {
        paddleX += 4.5;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 4.5;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    if (!started) {
        console.log(started)
    } else if (started) {
        ballX += dx;
        ballY += dy;
    }

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == ' ') {
        started = true;
        draw();
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ballX + ballRadius > b.x && ballX - ballRadius < b.x + brickWidth && ballY + ballRadius > b.y && ballY - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("You win!, Total points: " + score);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#404040";
    ctx.fillText("Score: " + score, 8, 20)
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#404040";
    ctx.fillText("Lives: " + lives, 495, 20)
}

