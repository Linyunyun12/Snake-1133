const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 30;
const CELL_SIZE = canvas.width / GRID_SIZE;
let snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
let direction = { x: 1, y: 0 };
let nextDirection = { ...direction };
let food = randomFood();
let score = 0;
let speed = 200;
let gameInterval = null;
let isRunning = false;

// 隨機產生食物位置
function randomFood() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

// 開始或重新開始遊戲
function startGame() {
  clearInterval(gameInterval);
  snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  food = randomFood();
  score = 0;
  speed = 200;
  isRunning = true;
  document.getElementById('score').textContent = `Score: ${score}`;
  gameInterval = setInterval(gameLoop, speed);
}

// 切換暫停
function togglePause() {
  if (!isRunning) return;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  } else {
    gameInterval = setInterval(gameLoop, speed);
  }
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);

// 鍵盤控制方向與暫停
window.addEventListener('keydown', (e) => {
  const key = e.code;
  if (key === 'Space') {
    togglePause();
    return;
  }
  const dirs = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  const newDir = dirs[key];
  if (newDir) {
    // 禁止原地反向
    if (newDir.x + direction.x !== 0 || newDir.y + direction.y !== 0) {
      nextDirection = newDir;
    }
  }
});

function gameLoop() {
  if (!isRunning) return;
  update();
  draw();
}

function update() {
  direction = { ...nextDirection };
  const head = snake[0];
  let newX = head.x + direction.x;
  let newY = head.y + direction.y;
  // 邊緣傳送
  if (newX < 0) newX = GRID_SIZE - 1;
  if (newX >= GRID_SIZE) newX = 0;
  if (newY < 0) newY = GRID_SIZE - 1;
  if (newY >= GRID_SIZE) newY = 0;
  // 碰撞判定
  if (snake.some(seg => seg.x === newX && seg.y === newY)) {
    clearInterval(gameInterval);
    isRunning = false;
    alert('Game Over');
    return;
  }
  snake.unshift({ x: newX, y: newY });
  // 吃到食物
  if (newX === food.x && newY === food.y) {
    score += 1;
    document.getElementById('score').textContent = `Score: ${score}`;
    food = randomFood();
    speed = Math.max(10, speed - 2);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  } else {
    snake.pop();
  }
}

function draw() {
  // 清除畫面
  ctx.fillStyle = '#161616';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 畫食物
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  // 畫蛇
  ctx.fillStyle = '#FFFFFF';
  snake.forEach(seg => {
    ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
}