// 遊戲設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20; // 棋盤格數
const CELL_SIZE = canvas.width / GRID_SIZE; // 每格大小
let snake, direction, nextDirection, food, score, speed, gameInterval, isRunning;

// 初始化遊戲
function initGame() {
    snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]; // 初始蛇
    direction = { x: 1, y: 0 }; // 初始方向
    nextDirection = { ...direction };
    food = randomFood(); // 隨機生成食物
    score = 0; // 初始分數
    speed = 200; // 初始速度
    isRunning = false; // 遊戲未開始
    document.getElementById('score').textContent = `Score: ${score}`;
}

// 隨機生成食物
function randomFood() {
    let foodPosition;
    do {
        foodPosition = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    } while (snake.some(seg => seg.x === foodPosition.x && seg.y === foodPosition.y));
    return foodPosition;
}

// 更新遊戲狀態
function update() {
    direction = { ...nextDirection }; // 更新方向
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

    // 新增蛇頭
    snake.unshift({ x: newX, y: newY });

    // 吃到食物
    if (newX === food.x && newY === food.y) {
        score += 1;
        document.getElementById('score').textContent = `Score: ${score}`;
        food = randomFood();
        speed = Math.max(10, speed - 2); // 提升速度
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    } else {
        // 移除蛇尾
        snake.pop();
    }
}

// 繪製畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製蛇
    ctx.fillStyle = 'orange';
    snake.forEach(seg => {
        ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    // 繪製食物
    ctx.fillStyle = 'blue';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// 遊戲循環
function gameLoop() {
    update();
    draw();
}

// 開始遊戲
function startGame() {
    clearInterval(gameInterval);
    initGame();
    isRunning = true;
    gameInterval = setInterval(gameLoop, speed);
}

// 暫停遊戲
function togglePause() {
    if (!isRunning) return;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    } else {
        gameInterval = setInterval(gameLoop, speed);
    }
}

// 鍵盤控制
window.addEventListener('keydown', (e) => {
    const key = e.code;

    // 暫停遊戲
    if (key === 'Space') {
        togglePause();
        return;
    }

    // 方向鍵控制
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

// 綁定按鈕事件
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);

// 初始化遊戲
initGame();