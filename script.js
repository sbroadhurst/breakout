var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

var min = -200
var max = 200
var x = canvas.width / 2 + getRandomInt(min, max)
var y = canvas.height - 30
var dx = 2
var dy = -2
var ballRadius = 10
var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var paddleDx = 7
var rightPressed = false
var leftPressed = false
var brickColumnCount = 5
var brickRowCount = 3
var brickWidth = 75
var brickHeight = 20
var brickPadding = 10
var brickOffsetTop = 30
var brickOffsetLeft = 30
var score = 0
var time = 0
var snd1 = new Audio('Blip_Select11.m4a')
var snd2 = new Audio('Blip_Select12.m4a')
var paused = true
var level = 1
var maxLevel = 5
var count = 0

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var bricks = []
makeBricks()
function makeBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
  }
}

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = 'blue'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = true
  }
  if (e.key == 'p') {
    paused = !paused
  } else if (e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = false
  } else if (e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = false
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.closePath()
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          snd1.play()
          b.status = 0
          score++
          count++
          if (count == brickRowCount * brickColumnCount) {
            if (level === maxLevel) {
              alert('You win, Congratulations!')
              document.location.reload()
            } else {
              level++
              count = 0
              makeBricks()
            }
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial'
  ctx.fillStyle = 'blue'
  ctx.fillText('Score:' + score, 10, 20)
}

function drawTime() {
  time++
  ctx.font = '16px Arial'
  ctx.fillStyle = 'blue'
  ctx.fillText('Time:' + time + 's', 80, 20)
}

function drawLevel() {
  ctx.font = '16px Arial'
  ctx.fillStyle = 'blue'
  ctx.fillText('Level:' + level, 210, 20)
}

// function startButton() {
//   var btn = document.createElement('input')
//   btn.setAttribute('type', 'button')
//   btn.setAttribute('value', 'START / PAUSE GAME')
//   document.body.appendChild(btn)
//   btn.style.marginLeft = '45%'
//   btn.style.marginTop = '25px'
//   btn.onclick = unpause
// }
// function unpause() {
//   window['paused'] = !paused
// }

function drawStartScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.font = '50px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText('Breakout!', 125, 150)
  ctx.font = '20px Arial'
  ctx.fillText('Press P to start or pause the game at anytime', 35, 190)
  // startButton()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (paused) {
    requestAnimationFrame(drawStartScreen)
    clearTimeout(draw)
  } else {
    //draw ball
    drawBall()
    drawPaddle()
    drawBricks()
    collisionDetection()
    drawScore()
    drawLevel()

    setTimeout(drawTime, 1000)

    //wall collision for y
    if (y + dy < ballRadius) {
      dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        snd2.play()
        dy = -dy
      } else {
        alert('GAME OVER')
        document.location.reload()
        paused = !paused
      }
    }
    //wall collision for x
    if (x + dx < 0 + ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleDx
    }

    if (leftPressed && paddleX > 0) {
      paddleX -= paddleDx
    }

    x += dx
    y += dy
  }
}
setInterval(draw, 10)
