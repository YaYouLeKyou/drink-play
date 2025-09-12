const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// --- Images ---
const alienimg = new Image();
alienimg.src = "./media/drunkinalien3.png";
const enemy1Img = new Image();
enemy1Img.src = "./media/insectesolo.png";
const enemy2Img = new Image();
enemy2Img.src = "./media/insectesolo2-rbg.png";
const enemy3Img = new Image();
enemy3Img.src = "./media/zigzagenemy.png";

// --- Flags ---
let mainImgLoaded = false;
let enemy1ImgLoaded = false;
let enemy2ImgLoaded = false;
let enemy3ImgLoaded = false;

alienimg.onload = () => { mainImgLoaded = true; startGameIfReady(); };
enemy1Img.onload = () => { enemy1ImgLoaded = true; startGameIfReady(); };
enemy2Img.onload = () => { enemy2ImgLoaded = true; startGameIfReady(); };
enemy3Img.onload = () => { enemy3ImgLoaded = true; };

// --- General settings ---
let gamePlaying = false;
let gravity = 0.16;
let initialSpeed = 4;
let speed = initialSpeed;
let displaySpeed = speed;
const speedIncreaseAmount = 0.5;

let initialEnemySpeed = 5;
let enemySpeed = initialEnemySpeed;
const enemySpeedIncreaseAmount = 0.1;

const size = [51, 30];
let jump = -5.75;
const cTenth = canvas.width / 20;
let thrustAmount = 0.4;

// Speed-up message
let showSpeedUpAd = false;
let speedUpAdTimer = 0;
const speedUpAdDuration = 60;

// --- Mobile adjustments ---
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
  gravity = 0.046;
  jump = -1.0;
  initialSpeed = 3;
  initialEnemySpeed = 2;
  thrustAmount = 0.2;
  speed = initialSpeed;
  enemySpeed = initialEnemySpeed;
}

// --- Pipe settings ---
const pipeWidth = 50;
const pipeGap = 270;
const pipeLoc = () => Math.random() * (canvas.height - (pipeGap - pipeWidth) - pipeWidth);

// --- Game state ---
let index = 0, bestScore = 0, currentScore = 0;
let pipes = [], flight, flyHeight, isThrusting = false, enemies = [], shots = [];
const shotSpeed = 10;

// --- Enemy spawn timer ---
let enemySpawnTimer = 0;
const enemyBaseInterval = 120; // frames
const enemyMinInterval = 40;

// Adjust for mobile
const effectiveEnemyBaseInterval = isMobile ? enemyBaseInterval * 2 : enemyBaseInterval;
const effectiveEnemyMinInterval = isMobile ? enemyMinInterval * 2 : enemyMinInterval;

// --- Setup ---
function setup() {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2 + 100;
  speed = initialSpeed;
  enemySpeed = initialEnemySpeed;
  pipes = Array(3).fill().map((_, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
  enemies = [];
  shots = [];
  enemySpawnTimer = effectiveEnemyBaseInterval;
  showSpeedUpAd = false;
  speedUpAdTimer = 0;
}

// --- Spawn functions ---
function spawnEnemy(type) {
  if (type === 'enemy1') {
    const y = Math.random() * (canvas.height - size[1]);
    const variation = (Math.random() - 0.5) * 1;
    enemies.push({ x: canvas.width, y, type: 'enemy1', speedVariation: variation });
  } else if (type === 'enemy2') {
    const startX = canvas.width + 100;
    const startY = Math.random() < 0.5 ? Math.random() * canvas.height * 0.3 : canvas.height - Math.random() * canvas.height * 0.2 - size[1];
    const vx = -enemySpeed;
    const vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 0.5);
    enemies.push({ x: startX, y: startY, vx, vy, rotation: 0, type: 'enemy2' });
  } else if (type === 'enemy3') {
    const vx = -enemySpeed * 0.8;
    const vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1.5 + 0.8);
    enemies.push({ x: canvas.width, y: Math.random() * (canvas.height - size[1]), vx, vy, type: 'enemy3' });
  }
}

// --- Probabilistic enemy selection ---
function getEnemyType(score) {
  let r = Math.random() * 100;
  if (score < 80) {
    // Early game: mostly enemy1
    if (r < 90) return 'enemy1';
    else return 'enemy2';
  } else {
    // Mid/high game: introduce enemy3 gradually
    if (r < 60) return 'enemy1';
    else if (r < 85) return 'enemy2';
    else return 'enemy3';
  }
}

// --- Main render loop ---
function render() {
  index++;
  displaySpeed += (speed - displaySpeed) * 0.005;

  // Background
  ctx.drawImage(alienimg, 115, 0, 250, canvas.height, -((index * displaySpeed / 2) % 431) + 431, 0, canvas.width, canvas.height);
  ctx.drawImage(alienimg, 115, 0, 250, canvas.height, -(index * displaySpeed / 2) % 431, 0, canvas.width, canvas.height);

  // Player
  if (gamePlaying) {
    ctx.drawImage(alienimg, 405, Math.floor(index % 1) * size[0], ...size, cTenth, flyHeight, ...size);
    if (isThrusting) flight -= thrustAmount;
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    if (flyHeight <= 0 || flyHeight >= canvas.height - size[1]) {
      gamePlaying = false; setup();
    }

    // Shots
    for (let i = shots.length - 1; i >= 0; i--) {
      const shot = shots[i];
      shot.x += shotSpeed;

      ctx.fillStyle = "red";
      ctx.fillRect(shot.x, shot.y, shot.width, shot.height);

      if (shot.x > canvas.width) {
        shots.splice(i, 1);
        continue;
      }

      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (
          shot.x < enemy.x + size[0] &&
          shot.x + shot.width > enemy.x &&
          shot.y < enemy.y + size[1] &&
          shot.y + shot.height > enemy.y
        ) {
          enemies.splice(j, 1);
          shots.splice(i, 1);
          break;
        }
      }
    }
  } else {
    ctx.drawImage(alienimg, 405, Math.floor(index % 1) * size[0], ...size, cTenth, flyHeight, ...size);
    ctx.textAlign = "center";
    ctx.font = "bold 30px courier";
    ctx.fillStyle = "black";
    ctx.fillText(`Best score : ${bestScore}`, canvas.width / 2, 105);
    ctx.fillText("Click to play", canvas.width / 2, 335);
  }

  // Pipes
  if (gamePlaying) {
    pipes.forEach((pipe, i) => {
      pipe[0] -= displaySpeed;
      ctx.drawImage(alienimg, 409, 250 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      ctx.drawImage(alienimg, 413 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // Speed increase every 20 points
        if (currentScore % 20 === 0) {
          speed += speedIncreaseAmount;
          if (currentScore >= 80) enemySpeed += enemySpeedIncreaseAmount;
          showSpeedUpAd = true;
          speedUpAdTimer = speedUpAdDuration;
        }

        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(Boolean)) {
        gamePlaying = false;
        setup();
      }
    });

    // Enemy spawn
    enemySpawnTimer--;
    if (enemySpawnTimer <= 0) {
      spawnEnemy(getEnemyType(currentScore));
      enemySpawnTimer = Math.max(effectiveEnemyMinInterval, effectiveEnemyBaseInterval - currentScore * 0.7);
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.type === 'enemy1') {
        e.x -= (enemySpeed + (e.speedVariation || 0));
        ctx.drawImage(enemy1Img, 0, 0, enemy1Img.width || size[0], enemy1Img.height || size[1], e.x, e.y, size[0], size[1]);
      } else if (e.type === 'enemy2') {
        e.x += e.vx;
        e.y += e.vy;
        if (e.y <= 0 || e.y + size[1] >= canvas.height) e.vy *= -1;
        e.rotation = (e.rotation + 0.05) % (2 * Math.PI);
        ctx.save();
        ctx.translate(e.x + size[0] / 2, e.y + size[1] / 2);
        ctx.rotate(e.rotation);
        ctx.drawImage(enemy2Img, 0, 0, enemy2Img.width || size[0], enemy2Img.height || size[1], -size[0] / 2, -size[1] / 2, size[0], size[1]);
        ctx.restore();
      } else if (e.type === 'enemy3') {
        e.x += e.vx;
        e.y += e.vy;
        if (e.y <= 0 || e.y + size[1] >= canvas.height) e.vy *= -1;
        if (enemy3ImgLoaded) {
          ctx.drawImage(enemy3Img, 0, 0, enemy3Img.width || size[0], enemy3Img.height || size[1], e.x, e.y, size[0], size[1]);
        } else {
          ctx.drawImage(enemy1Img, 0, 0, enemy1Img.width || size[0], enemy1Img.height || size[1], e.x, e.y, size[0], size[1]);
        }
      }

      // Remove off-screen
      if (e.x + size[0] < 0 || e.y + size[1] < 0 || e.y > canvas.height) {
        enemies.splice(i, 1);
        continue;
      }

      // Collision
      if (cTenth < e.x + size[0] && cTenth + size[0] > e.x && flyHeight < e.y + size[1] && flyHeight + size[1] > e.y) {
        gamePlaying = false;
        setup();
        break;
      }
    }
  }

  // --- HUD ---
  ctx.textAlign = "right";
  ctx.font = "bold 20px courier";
  ctx.fillStyle = "black";
  ctx.fillText(`Score : ${currentScore}`, canvas.width - 10, 50);

  // Speed-up message
  if (showSpeedUpAd && speedUpAdTimer > 0) {
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "bold 40px Arial";
    ctx.fillText("SPEED UP!", canvas.width / 2, canvas.height / 2);
    speedUpAdTimer--;
  }

  requestAnimationFrame(render);
}

// --- Start game if images loaded ---
function startGameIfReady() {
  if (mainImgLoaded && enemy1ImgLoaded && enemy2ImgLoaded) {
    setup();
    render();
  }
}

// --- Controls ---
document.addEventListener("mousedown", () => {
  if (gamePlaying) {
    shots.push({
      x: cTenth + size[0],
      y: flyHeight + size[1] / 2,
      width: 10,
      height: 10,
    });
  }
  gamePlaying = true;
  isThrusting = true;
});
document.addEventListener("mouseup", () => { isThrusting = false; });
document.addEventListener("touchstart", () => {
  if (gamePlaying) {
    shots.push({
      x: cTenth + size[0],
      y: flyHeight + size[1] / 2,
      width: 10,
      height: 10,
    });
  }
  gamePlaying = true;
  isThrusting = true;
});
document.addEventListener("touchend", () => { isThrusting = false; });
