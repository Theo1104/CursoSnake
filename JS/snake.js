//Objetcts

const DIRECTIONS = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

//HTML

const canvasGame = document.getElementById("Edge");
const textPoints = document.getElementById("Points");
const ctx = canvasGame.getContext("2d");
const consoleNintendo = document.getElementById("Nintendo");
const rotation = document.getElementById("Rotate");
const button = document.getElementById("Close");

//Songs

const backgroundSong = new Audio("../CSS/Sounds/Musica_de_snake.mp3");
const pointSound = new Audio("../CSS/Sounds/ganaste_un_punto.wav");
const youLost = new Audio("../CSS/Sounds/GameOver.mp3");

//States

let Song = false;

let snakePosition;

let currentDirection;
let newDirection;

let food;

let FPS = 70;

let cycle;

let points;

//Dibujar Juego

const fillBox = (ctx, PositionX, PositionY) => {
  ctx.beginPath();
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(PositionX, PositionY, 20, 20);
  ctx.stroke();
};

const fillFood = (ctx, PositionX, PositionY) => {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(PositionX, PositionY, 20, 20);
  ctx.stroke();
};

const snake = (context, snakePosition) => {
  for (possnake of snakePosition) {
    fillBox(context, possnake.PositionX, possnake.PositionY);
  }
};

const drawFood = (context, food) => {
  fillFood(context, food.PositionX, food.PositionY, 20, 20);
};

const drawWalls = (context) => {
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = "white";
  context.rect(20, 20, 560, 560);
  context.stroke();
};

const drawText = (context, text, PositionX, PositionY) => {
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "white";
  context.fillText(text, PositionX, PositionY);
};

//Movimiento snake

const moveSnake = (direccion, snakePosition) => {
  let headPositionX = snakePosition[0].PositionX;
  let headPositionY = snakePosition[0].PositionY;

  if (direccion === DIRECTIONS.RIGHT) {
    headPositionX += 20;
  } else if (direccion === DIRECTIONS.LEFT) {
    headPositionX -= 20;
  } else if (direccion === DIRECTIONS.UP) {
    headPositionY -= 20;
  } else if (direccion === DIRECTIONS.DOWN) {
    headPositionY += 20;
  }

  snakePosition.unshift({ PositionX: headPositionX, PositionY: headPositionY });
  return snakePosition.pop();
};

const snakeAte = (snakePosition, food) => {
  return (
    snakePosition[0].PositionX === food.PositionX && snakePosition[0].PositionY === food.PositionY
  );
};

//food

const generateFood = () => {
  while (true) {
    const columnaX = Math.floor(Math.random() * 29) + 1
    const columnaY = Math.floor(Math.random() * 29) +1

    const PositionX = columnaX * 20;
    const PositionY = columnaY * 20;

    let crashes = false;
    for (positionSnake of snakePosition) {
      if (positionSnake.PositionX === PositionX && positionSnake.PositionY === PositionY) {
        crashes = true;
        break;
      }
    }

    if (crashes === true) {
      continue;
    }

    return { PositionX: PositionX, PositionY: PositionY };
  }
};

//ocurrio una colision

const crashed = (snakePosition) => {
  let head = snakePosition[0];

  if (
    head.PositionX < 20 ||
    head.PositionY < 20 ||
    head.PositionX > 560 ||
    head.PositionY > 560
  ) {
    console.log("Perdiste");
    return true;
  }

  if (snakePosition.length < 5) {
    return false;
  }

  for (let i = 1; i < snakePosition.length; i++) {
    if (
      head.PositionX === snakePosition[i].PositionX &&
      head.PositionY === snakePosition[i].PositionY
    ) {
      return true;
    }
  }

  return false;
};

//Musicas

const backgroundSongs = () => {
  if (Song === false) {
    backgroundSong.loop = true;
    backgroundSong.play();
  }
};

//Resoluciones

window.addEventListener("orientationchange", () => {
  rotation.classList.remove("Hide");
});

button.addEventListener("click", () => {
  rotation.classList.add("Hide");
});

//cycle del juego

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp" && currentDirection !== DIRECTIONS.DOWN) {
    newDirection = DIRECTIONS.UP;
  } else if (event.code === "ArrowDown" && currentDirection !== DIRECTIONS.UP) {
    newDirection = DIRECTIONS.DOWN;
  } else if (
    event.code === "ArrowLeft" &&
    currentDirection !== DIRECTIONS.RIGHT
  ) {
    newDirection = DIRECTIONS.LEFT;
  } else if (
    event.code === "ArrowRight" &&
    currentDirection !== DIRECTIONS.LEFT
  ) {
    newDirection = DIRECTIONS.RIGHT;
  }
});

const gameCycle = () => {
  let tail = moveSnake(newDirection, snakePosition);
  currentDirection = newDirection;

  if (snakeAte(snakePosition, food)) {
    snakePosition.push(tail);
    food = generateFood();
    points++;
    textPoints.innerText = "PUNTOS: " + points;
    pointSound.play();
  }

  if (crashed(snakePosition)) {
    gameOver();
    return;
  }

  ctx.clearRect(0, 0, 600, 600);
  drawWalls(ctx);
  snake(ctx, snakePosition);
  drawFood(ctx, food);
}

const gameOver = () => {
  cycle = clearInterval(cycle);
  backgroundSong.pause();
  backgroundSong.loop = false;
  youLost.play();
  drawText(ctx, "¡Has perdido!", 300, 260);
  drawText(ctx, "¡Pulsa click para volver a empezar!", 300, 310);
  consoleNintendo.classList.add("shake-horizontal");
}

const reboot = () => {
  snakePosition = [
    { PositionX: 60, PositionY: 40 },
    { PositionX: 60, PositionY: 20 },
    { PositionX: 40, PositionY: 20 },
    { PositionX: 20, PositionY: 20 },
  ];
  points = 0;
  currentDirection = DIRECTIONS.DOWN;
  newDirection = DIRECTIONS.DOWN;
  textPoints.innerText = "PUNTOS: " + points;
  backgroundSongs();
  consoleNintendo.classList.remove("shake-horizontal");

  food = generateFood();

  cycle = setInterval(gameCycle, FPS);
}

drawText(ctx, "¡Pulsa click izquierdo para empezar!", 300, 260);
drawText(ctx, "Desktop: ¡Muevete con ↑ ↓ → ←!", 300, 310);
drawText(ctx, "Mobil: ¡Pulsa con Tab para girar!", 300, 360);
drawWalls(ctx);

canvasGame.addEventListener("click", () => {
  if (cycle === undefined) {
    reboot();
    return;
  }

  if (currentDirection === DIRECTIONS.DOWN) {
    newDirection = DIRECTIONS.LEFT;
  } else if (currentDirection === DIRECTIONS.LEFT) {
    newDirection = DIRECTIONS.UP;
  } else if (currentDirection === DIRECTIONS.UP) {
    newDirection = DIRECTIONS.RIGHT;
  } else if (currentDirection === DIRECTIONS.RIGHT) {
    newDirection = DIRECTIONS.DOWN;
  }
});
