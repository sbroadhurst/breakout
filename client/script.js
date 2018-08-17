var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

var min = -200
var max = 200
var x = canvas.width / 2 + getRandomInt(min, max)
var y = canvas.height - 30
var dx = 3
var dy = -3
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
var gameEnd = false
var level = 1
var maxLevel = 5
var count = 0
const colors = ['red', 'yellow', 'green', 'pink', 'orange', 'purple', 'white']
let scoreBoard = []

fetch('http://localhost:5000/api/items')
  .then(res => {
    return res.json()
  })
  .then(res => {
    console.log(res)
    scoreBoard = res
  })

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
        ctx.fillStyle = colors[r]
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
  if (e.code == 'Enter') {
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
          if (count == brickColumnCount * brickRowCount) {
            if (level === maxLevel) {
              gameEnd = true
            } else {
              level++
              brickRowCount++
              count = 0
              makeBricks()
              dx += 2
              dy = Math.abs(dy) * -1
              dy -= 2
              x = canvas.width / 2 + getRandomInt(min, max)
              y = canvas.height - 30
              paddleX = (canvas.width - paddleWidth) / 2
            }
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '24px Verdana'
  ctx.strokeStyle = 'white'
  ctx.strokeText('Score:' + score, 10, 20)
}

function drawTime(time) {
  ctx.font = '24px Verdana'
  ctx.strokeStyle = 'white'
  ctx.strokeText('Time:' + Math.round(time) + 's', 190, 20)
}

function drawLevel() {
  ctx.font = '24px Verdana'
  ctx.strokeStyle = 'white'
  ctx.strokeText('Level:' + level, 370, 20)
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
  ctx.fillText('Press ENTER to start or pause the game', 55, 190)

  // startButton()
}

function drawScoreBoard() {
  let y = 320
  let position = 1
  scoreBoard.map(score => {
    ctx.fillStyle = 'white'
    ctx.font = '30px Arial'

    ctx.fillText('Leaderboard Scores:', 105, 250)
    ctx.font = '24px Arial'

    ctx.fillText(position + '. ' + score.name, 140, y)
    ctx.fillText(score.score, 250, y)
    y += 30
    position++
  })
}

function drawGameEndScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.font = '50px Arial'
  ctx.fillStyle = 'white'
  ctx.fillText('Game End', 125, 150)
  ctx.font = '20px Arial'
  ctx.fillText('Final Score = ' + (10 * score - Math.round(time / 60)), 170, 190)
  drawScoreBoard()

  setTimeout(function() {
    document.location.reload()
  }, 5000)
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (paused) {
    drawStartScreen()
  } else if (gameEnd) {
    drawGameEndScreen()
  } else {
    //draw ball
    drawBall()
    drawPaddle()
    drawBricks()
    collisionDetection()
    drawScore()
    drawLevel()

    time++
    drawTime(time / 60)

    //wall collision for y
    if (y + dy < ballRadius) {
      dy = -dy
      snd1.play()
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        snd2.play()
        dy = -dy
      } else {
        gameEnd = true
      }
    }
    //wall collision for x
    if (x + dx < 0 + ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx
      snd1.play()
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

  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
