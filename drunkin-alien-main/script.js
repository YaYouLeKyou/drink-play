const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const alienimg = new Image();
alienimg.src = "./media/drunkinalien3.png";

// New: Enemy images
const enemy1Img = new Image();
enemy1Img.src = "./media/insectesolo.png"; // Normal enemy sprite
const enemy2Img = new Image();
enemy2Img.src = "./media/insectesolo2-rbg.png"; // New enemy2 sprite

//general settings
let gamePlaying = false;
let gravity = 0.16;
let initialSpeed = 4;
let speed = initialSpeed;
const speedIncreaseAmount = 0.5;
let displaySpeed = speed;
let showSpeedUpAd = false;
let speedUpAdTimer = 0;
const speedUpAdDuration = 60;
const enemySpeedIncreaseAmount = 0.1;
let newEnemy1SpawnTimer = 0;
const newEnemy1MinDelay = 30;
const newEnemy1MaxDelay = 90;
let initialEnemySpeed = 5; // Moved here
let enemySpeed = initialEnemySpeed; // Moved here
const size = [51, 30]; // Reverted to previous size
let jump = -5.75;
const cTenth = canvas.width / 20;
let thrustAmount = 0.4; // Default thrust amount

// Function to detect mobile device
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('Mobi') !== -1);
}

// Adjust settings for mobile
if (isMobileDevice()) {
  gravity = 0.046; // Less gravity for mobile
  jump = -1.0;    // Less jump power for mobile
  initialSpeed = 3; // Slower initial speed for mobile
  initialEnemySpeed = 2; // Slower initial enemy speed for mobile
  thrustAmount = 0.2; // Less thrust for mobile
}

// pipe settings
const pipeWidth = 50;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap - pipeWidth) - pipeWidth);

let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight,
  isThrusting = false,
  enemies = [], // Array to store enemy objects
  enemySpawnInterval = 200, // Frames between potential normal enemy spawns
  enemySpawnCounter = 0,
  delayedEnemySpawn = false,
  delayedEnemySpawnTimer = 0,
  delayedEnemySpawnDelay = 30,
  enemy2SpawnInterval = 300, // Frames between potential enemy2 spawns
  enemy2SpawnCounter = 0; // Counter for enemy2 spawning

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2 + 100; // Set initial flyHeight (middle of screen - size of the bird) + offset
  speed = initialSpeed; // Reset speed to initial value
  enemySpeed = initialEnemySpeed; // Reset enemySpeed to initial value

  // setup first 3 pipes
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
  console.log(pipes);
  enemies = []; // Reset enemies on setup
  delayedEnemySpawn = false; // Reset delayed spawn flag
  delayedEnemySpawnTimer = 0; // Reset delayed spawn timer
  enemy2SpawnCounter = 0; // Reset enemy2 spawn counter
};

const render = () => {
  // make the pipe and bird moving
  index++;

  displaySpeed += (speed - displaySpeed) * 0.005;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part
  ctx.drawImage(
    alienimg,
    115,
    0,
    250,
    canvas.height,
    -((index * (displaySpeed / 2)) % 431) + 431,
    0,
    canvas.width,
    canvas.height
  );
  // background second part
  ctx.drawImage(
    alienimg,
    115,
    0,
    250,
    canvas.height,
    -(index * (displaySpeed / 2)) % 431,
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    //ufo
    ctx.drawImage(
      alienimg,
      405,
      Math.floor(index % 1) * size[0],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    if (isThrusting) {
      flight -= thrustAmount; // Apply a little bit more upward thrust
    }
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    // Check for canvas border collision
    if (flyHeight <= 0 || flyHeight >= canvas.height - size[1]) {
      gamePlaying = false;
      setup();
    }

    // Normal Enemy spawning
    enemySpawnCounter++;
    if (enemySpawnCounter % enemySpawnInterval === 0) {
      const enemyY = Math.random() * (canvas.height - size[1]); // Random height
      const speedVariation = (Math.random() - 0.5) * 1; // Variation between -0.5 and 0.5
      enemies.push({ x: canvas.width, y: enemyY, type: 'normal', speedVariation: speedVariation }); // Store as object
    }

    // New: Handle delayed normal enemy spawn
    if (delayedEnemySpawn) {
      delayedEnemySpawnTimer--;
      if (delayedEnemySpawnTimer <= 0) {
        const enemyY = Math.random() * (canvas.height - size[1]);
        const speedVariation = (Math.random() - 0.5) * 1; // Variation between -0.5 and 0.5
        enemies.push({ x: canvas.width, y: enemyY, type: 'normal', speedVariation: speedVariation });
        delayedEnemySpawn = false; // Reset flag
      }
    }

    // New: Enemy2 spawning
    if (currentScore >= 20) {
      enemy2SpawnCounter++;
      if (enemy2SpawnCounter % enemy2SpawnInterval === 0) {
        const startX = canvas.width + 100;
        const startY = Math.random() < 0.5 ? // 50% chance to start near top
          Math.random() * (canvas.height * 0.2) : // Top 20% of canvas
          canvas.height - (Math.random() * (canvas.height * 0.2)) - size[1]; // Bottom 20% of canvas
        const speedX = -enemySpeed; // Use existing enemySpeed for horizontal
        const initialDirection = Math.random() < 0.5 ? 1 : -1;
        const speedY = initialDirection * (Math.random() * 1 + 0.5); // Random speed between 0.5 and 1.5, in chosen direction
        enemies.push({ x: startX, y: startY, vx: speedX, vy: speedY, rotation: 0, type: 'enemy2' }); // Store as object
      }
    }

    // New: Spawn new enemy1 with random delay
    if (newEnemy1SpawnTimer > 0) {
      newEnemy1SpawnTimer--;
      if (newEnemy1SpawnTimer === 0) {
        const enemyY = Math.random() * (canvas.height - size[1]);
        const speedVariation = (Math.random() - 0.5) * 1;
        enemies.push({ x: canvas.width, y: enemyY, type: 'normal', speedVariation: speedVariation });
      }
    }

  } else {
    ctx.drawImage(
      alienimg,
      405,
      Math.floor(index % 1) * size[0],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );

    // text accueil
    ctx.textAlign = "center";
    ctx.fillText(`Best score : ${bestScore}`, canvas.width / 2, 105);
    ctx.fillText("Click to play", canvas.width / 2, 335);
    ctx.font = "bold 30px courier";
  }
  // pipe display
  if (gamePlaying) {
    pipes.map((pipe) => {
      // pipe moving
      pipe[0] -= displaySpeed;

      // top pipe
      ctx.drawImage(
        alienimg,
        409,
        250 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      // bottom pipe
      ctx.drawImage(
        alienimg,
        413 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // give 1 point & create new pipe
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);

        // Increase speed every 20 points
        if (currentScore % 20 === 0 && currentScore > 0) {
          speed += speedIncreaseAmount;
          showSpeedUpAd = true;
          speedUpAdTimer = speedUpAdDuration;
          newEnemy1SpawnTimer = Math.floor(Math.random() * (newEnemy1MaxDelay - newEnemy1MinDelay + 1)) + newEnemy1MinDelay;
        }

        // Check for score multiple of 10 to spawn delayed normal enemy
        if (currentScore % 10 === 0 && currentScore !== 0) {
          enemySpeed += enemySpeedIncreaseAmount;
          delayedEnemySpawn = true;
          delayedEnemySpawnTimer = delayedEnemySpawnDelay;
        }

        // remove & create new pipe
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }

      // if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });

    // Enemy movement, drawing, and collision (moved here to be in front of pipes)
    enemies.forEach((enemy, i) => {
      if (enemy.type === 'enemy2') {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Rebound logic
        if (enemy.y <= 0 || enemy.y + size[1] >= canvas.height) {
          enemy.vy *= -1; // Reverse vertical direction
        }
        enemy.rotation = (enemy.rotation + 0.05) % (2 * Math.PI); // Rotate slowly

        ctx.save();
        ctx.translate(enemy.x + size[0] / 2, enemy.y + size[1] / 2); // Translate to center of enemy
        ctx.rotate(enemy.rotation); // Apply rotation
        ctx.drawImage(
          enemy2Img,
          0, 0, enemy2Img.width, enemy2Img.height, // Source
          -size[0] / 2, -size[1] / 2, // Destination (centered)
          size[0], size[1] // Destination size
        );
        ctx.restore();

      } else { // 'normal' enemy
        enemy.x -= (enemySpeed + enemy.speedVariation);

        ctx.drawImage(
          enemy1Img,
          0, 0, enemy1Img.width, enemy1Img.height,
          enemy.x, enemy.y,
          size[0], size[1]
        );
      }

      // Remove enemy if off-screen
      if (enemy.x + size[0] < 0 || enemy.y + size[1] < 0 || enemy.y > canvas.height) {
        enemies.splice(i, 1);
      }

      // Collision detection with player
      if (
        cTenth < enemy.x + size[0] &&
        cTenth + size[0] > enemy.x &&
        flyHeight < enemy.y + size[1] &&
        flyHeight + size[1] > enemy.y
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  ctx.textAlign = "right";
  ctx.fillText(`Score : ${currentScore}`, canvas.width - 10, 50); // Always display current score
  ctx.font = "bold 20px courier";
  ctx.fillStyle = "black";

  if (showSpeedUpAd && speedUpAdTimer > 0) {
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "bold 40px Arial";
    ctx.fillText("SPEED UP!", canvas.width / 2, canvas.height / 2);
    speedUpAdTimer--;
  }

  window.requestAnimationFrame(render);
};

// Asset loading and game start
let mainImgLoaded = false;
let enemy1ImgLoaded = false;
let enemy2ImgLoaded = false; // New: Flag for enemy2 image

function startGame() {
  if (mainImgLoaded && enemy1ImgLoaded && enemy2ImgLoaded) { // Check all images
    setup(); // Initialize game state
    render();
  }
}

alienimg.onload = () => {
  mainImgLoaded = true;
  startGame();
};

enemy1Img.onload = () => {
  enemy1ImgLoaded = true;
  startGame();
};

enemy2Img.onload = () => { // New: onload for enemy2 image
  enemy2ImgLoaded = true;
  startGame();
};

// start game
document.addEventListener("mousedown", () => {
  gamePlaying = true;
  isThrusting = true;
});
document.addEventListener("mouseup", () => {
  isThrusting = false;
});
document.addEventListener("touchstart", () => {
  gamePlaying = true;
  isThrusting = true;
});
document.addEventListener("touchend", () => {
  isThrusting = false;
});