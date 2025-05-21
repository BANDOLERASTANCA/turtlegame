let x, y;
let currentangle = 0;
let step = 20;
let angle = 90;
let stack = [];
let trail = [];
let ellipses = [];
let savedMarkers = [];

function setup() {
  createCanvas(800, 600);
  textFont('Georgia');
  resetGame();
  frameRate(30);
}

function draw() {
  background(255);

  // Tracciato
  stroke(0);
  for (let l of trail) {
    line(l.x1, l.y1, l.x2, l.y2);
  }

  // Ellissi decorative
  noStroke();
  for (let e of ellipses) {
    fill(e.r, e.g, e.b, e.a);
    ellipse(e.x, e.y, e.radius, e.radius);
  }

  drawTurtle();
  drawSidebar();
}

function moveF() {
  let newX = x + step * cos(radians(currentangle));
  let newY = y + step * sin(radians(currentangle));

  // Limiti del canvas (evita barra laterale)
  if (newX < 0 || newX > width - 200 || newY < 0 || newY > height) return;

  // Linea tracciata
  trail.push({ x1: x, y1: y, x2: newX, y2: newY });

  // Ellisse decorativa
  let r = random(128, 255);
  let g = random(0, 192);
  let b = random(0, 50);
  let a = random(80, 130);
  let radius = (random(0, 15) + random(0, 15) + random(0, 15)) / 3;
  ellipses.push({ x: newX, y: newY, r, g, b, a, radius });

  x = newX;
  y = newY;
}

function keyPressed() {
  if (key === 'F' || key === 'f') {
    moveF();
  } else if (key === '+') {
    currentangle += angle;
  } else if (key === '-') {
    currentangle -= angle;
  } else if (key === '[') {
    stack.push([x, y, currentangle]);
    savedMarkers.push({ type: 'save', x: x, y: y, angle: currentangle });
  } else if (key === ']') {
    if (stack.length > 0) {
      let state = stack.pop();
      savedMarkers.push({ type: 'load', x: state[0], y: state[1], angle: state[2] });
      x = state[0];
      y = state[1];
      currentangle = state[2];
    }
  } else if (key === 'R' || key === 'r') {
    resetGame();
  }
}

function drawTurtle() {
  fill(0, 180, 0, 180);
  noStroke();
  ellipse(x, y, 10, 10);
}

function drawSidebar() {
  fill(245);
  noStroke();
  rect(width - 200, 0, 200, height);

  fill(30);
  textSize(18);
  textAlign(LEFT, TOP);
  text("COMANDI", width - 190, 20);
  textSize(14);
  text("F → avanti", width - 190, 55);
  text("+ → gira a destra", width - 190, 80);
  text("- → gira a sinistra", width - 190, 105);
  text("[ → salva posizione", width - 190, 130);
  text("] → carica posizione", width - 190, 155);
  text("R → reset", width - 190, 180);

  fill(0);
  textSize(16);
  text("STATO", width - 190, 230);
  textSize(14);
  text("X: " + nf(x, 1, 1), width - 190, 260);
  text("Y: " + nf(y, 1, 1), width - 190, 280);
  text("Angolo: " + currentangle + "°", width - 190, 300);
  text("Salvati: " + stack.length, width - 190, 320);

  fill(30);
  textSize(16);
  text("SALVATAGGI", width - 190, 360);
  textSize(12);
  let startY = 385;
  for (let i = 0; i < savedMarkers.length; i++) {
    let m = savedMarkers[i];
    let label = m.type === 'save' ? 'Salva' : 'Carica';
    text(`${label}: (${nf(m.x, 1, 0)}, ${nf(m.y, 1, 0)}) ang ${m.angle}°`, width - 190, startY + i * 16);
    if (startY + i * 16 > height - 20) break;
  }
}

function resetGame() {
  x = width / 3;
  y = height / 2;
  currentangle = 0;
  stack = [];
  trail = [];
  ellipses = [];
  savedMarkers = [];
}