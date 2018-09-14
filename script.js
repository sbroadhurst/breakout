var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
var nameBox = document.getElementById('nameBox')
nameBox.style.display = 'none'
nameBox.maxLength = '3'

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
var countDown = 20 * 60
const colors = ['red', 'yellow', 'green', 'pink', 'orange', 'purple', 'white']
let scoreBoard = []
var database = firebase.database()
var ref = database
  .ref('breakout')
  .orderByChild('score')
  .limitToFirst(10)

// ref.on(
//   'value',
//   data => {
//     scoreBoard = sortData(data.val(), 'order')
//     console.log(scoreBoard)
//   },
//   err => {}
// )

function sortData(data, attr) {
  var arr = []
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var obj = {}
      obj[prop] = data[prop]
      obj.tempSortName = data[prop][attr]
      arr.push(obj)
    }
  }

  arr.sort(function(a, b) {
    var at = a.tempSortName,
      bt = b.tempSortName
    return at > bt ? 1 : at < bt ? -1 : 0
  })

  var result = []
  for (var i = 0, l = arr.length; i < l; i++) {
    var obj = arr[i]
    delete obj.tempSortName
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var id = prop
      }
    }
    var item = obj[id]
    result.push(item)
  }
  return result
}

function gotData(data) {
  //scoreBoard = data.val()
  scoreBoard = sortData(data.val(), 'order')
}

function errData(err) {
  console.log('Error: ' + err)
}
// fetch('http://localhost:5000/api/items')
//   .then(res => {
//     return res.json()
//   })
//   .then(res => {
//     console.log(res)
//     scoreBoard = res
//   })

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
  if (e.code == 'Enter' && gameEnd === false) {
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
  ctx.fillStyle = 'white'
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
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 10, 20)
}

function drawTime(time) {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Time: ' + Math.round(time) + 's', 190, 20)
}

function drawLevel() {
  ctx.font = '30px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Level: ' + level, 360, 20)
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

function drawStartScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '80px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Breakout!', 55, 150)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Press ENTER to start or pause the game', 55, 190)
  drawScoreBoard()
  // startButton()
}

function drawScoreBoard() {
  ref.on('value', gotData, errData)

  let y = 320
  let position = 1
  var keys = Object.keys(scoreBoard)
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i]
    var name = scoreBoard[k].name
    var score = scoreBoard[k].score
    ctx.fillStyle = 'white'
    ctx.font = '30px ArcadeClassic'

    ctx.fillText('Leaderboard Scores:', 105, 250)
    ctx.font = '24px ArcadeClassic'

    ctx.fillText(position + '.  ' + name, 140, y)
    ctx.fillText(score, 250, y)
    y += 30
    position++
  }
}

function drawCountDown() {
  ctx.fillStyle = 'white'
  ctx.font = '40px ArcadeClassic'
  ctx.fillText(Math.round(countDown / 60), 400, 120)
  countDown--
}

function drawGameEndScreen() {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.font = '50px ArcadeClassic'
  ctx.fillStyle = 'white'
  ctx.fillText('Game End', 145, 150)
  ctx.font = '20px ArcadeClassic'
  ctx.fillText('Final Score = ' + (10 * score - Math.round(time / 60)), 170, 190)
  ctx.fillText('Enter name: ', 170, 215)
  nameBox.style.display = 'block'
  drawScoreBoard()
  drawCountDown()

  //// will be used for when we enter a name
  document.addEventListener('keydown', function(evt) {
    if (event.code == 'Enter') {
      countDown = 1
    }
    if ((evt.keyCode < 65 && evt.keyCode !== 8) || evt.keyCode > 90) {
      evt.preventDefault()
    }
  })

  if (countDown === 0) {
    var data = {
      name: nameBox.value,
      score: 10 * score - Math.round(time / 60),
      order: -1 * (10 * score - Math.round(time / 60))
    }

    database
      .ref()
      .child('breakout')
      .push(data)

    // fetch('http://localhost:5000/api/items', {
    //   mode: 'no-cors',
    //   method: 'POST',
    //   body: data

    //   // headers: {
    //   //   'Content-type': 'application.json',
    //   //   'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
    //   //   'Access-Control-Allow-Origin': '*'
    //   // }
    // })
    //   .then(res => res)
    //   .then(response => console.log('Success: ', response))
    //   .catch(error => console.error('Error: ', error))

    document.location.reload()
  }
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
