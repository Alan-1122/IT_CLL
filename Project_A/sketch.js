let core = { x: 400, y: 250, size: 80, color: [200, 0, 0], isAlive: true };
let cells = [];
let maxCells = 30;
let cellLifetime = 500;
let rippleLifetime = 60;
let ripples = [];
let linesToCore = true; // 核心牵引线
let coreMove = false;
let timeSinceBirth = 0;
let cellsGenerationDelay = 0;
let microbePoints = [];
let maxMicrobePoints = 5;

function setup() {
    let canvas= createCanvas(800, 500);
    canvas.parent("p5-canvas-container")
  generateCells();
}
s
function draw() {
  background(30, 30, 60);
  
  timeSinceBirth++;

  // 核心消亡与重生逻辑
  if (timeSinceBirth > 600) {
    if (core.isAlive) {
      // 核心湮灭，所有细胞消失
      core.isAlive = false;
      cells = [];
    } else {
      // 核心重新生成
      core.isAlive = true;
      timeSinceBirth = 0;
      cellsGenerationDelay = 100; // 设置细胞生成延迟时间
    }
  }

  if (core.isAlive) {
    // 显示核心
    drawCore();
    
    // 显示细胞
    if (cellsGenerationDelay <= 0) {
      for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        // 如果牵引线消失，细胞缓慢移动到核心
        if (dist(core.x, core.y, cell.x, cell.y) > 200) {
          cell.x += (core.x - cell.x) * 0.01;
          cell.y += (core.y - cell.y) * 0.01;
        } else {
          // 围绕核心均匀分布
          if (!cell.settled) {
            let angle = atan2(cell.y - core.y, cell.x - core.x);
            let targetX = core.x + cos(angle) * random(100, 150);
            let targetY = core.y + sin(angle) * random(100, 150);
            cell.x += (targetX - cell.x) * 0.05;
            cell.y += (targetY - cell.y) * 0.05;

            if (dist(cell.x, cell.y, targetX, targetY) < 1) {
              cell.settled = true; // 标记细胞已经稳定围绕核心
            }
          }
          cell.vibrate();
        }
        drawCell(cell);
        // 绘制细胞与核心的牵引线
        if (dist(core.x, core.y, cell.x, cell.y) < 200 && linesToCore) {
          drawConnectingLine(core.x, core.y, cell.x, cell.y);
        }
      }
    } else {
      cellsGenerationDelay--;
      if (cellsGenerationDelay === 0) {
        generateCells();
      }
    }
  }

  // 显示并扩展涟漪
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.expand();
    ripple.display();
    // 涟漪碰到细胞时推动它们
    for (let j = 0; j < cells.length; j++) {
      if (dist(ripple.x, ripple.y, cells[j].x, cells[j].y) < ripple.radius) {
        cells[j].x += random(-5, 5);  // 推动细胞
        cells[j].y += random(-5, 5);
      }
    }
    if (ripple.isGone()) {
      ripples.splice(i, 1);
    }
  }

  // 核心追随鼠标移动
  if (coreMove) {
    let targetX = constrain(mouseX, width / 4, 3 * width / 4);
    let targetY = constrain(mouseY, height / 4, 3 * height / 4);
    core.x += (targetX - core.x) * 0.05;
    core.y += (targetY - core.y) * 0.05;
  }

  // 显示微生物小点
  drawMicrobePoints();
}

function drawCore() {
  // 绘制核心外部的波动突刺
  stroke(255, 100, 100);
  strokeWeight(2);
  for (let angle = 0; angle < TWO_PI; angle += PI / 8) {
    let spikeLength = core.size * 0.7 + sin(frameCount * 0.05 + angle) * 10; // 波动的突刺长度
    let x1 = core.x + cos(angle) * (core.size / 2);
    let y1 = core.y + sin(angle) * (core.size / 2);
    let x2 = core.x + cos(angle) * (core.size / 2 + spikeLength);
    let y2 = core.y + sin(angle) * (core.size / 2 + spikeLength);
    line(x1, y1, x2, y2);
  }

  // 绘制核心本体
  fill(core.color);
  stroke(255);
  strokeWeight(6); // 细胞膜效果
  ellipse(core.x, core.y, core.size, core.size);

  // 核心内部结构
  fill(255, 255, 100); // 内部较浅的圆形结构
  ellipse(core.x, core.y, core.size * 0.5, core.size * 0.5);
  fill(0, 0, 150); // 更小的核心内部结构
  ellipse(core.x, core.y, core.size * 0.25, core.size * 0.25);
}

function drawCell(cell) {
  // 绘制细胞外部的细胞膜
  stroke(255);
  strokeWeight(1); // 细胞膜效果
  fill(cell.color);
  if (cell.shape === 'circle') {
    ellipse(cell.x, cell.y, cell.size, cell.size);
  } else if (cell.shape === 'triangle') {
    triangle(
      cell.x - cell.size / 2, cell.y + cell.size / 2,
      cell.x + cell.size / 2, cell.y + cell.size / 2,
      cell.x, cell.y - cell.size / 2
    );
  } else if (cell.shape === 'square') {
    rect(cell.x - cell.size / 2, cell.y - cell.size / 2, cell.size, cell.size);
  }
}

// 核心和细胞之间的牵引线
function drawConnectingLine(x1, y1, x2, y2) {
  stroke(150, 150); // 颜色减弱，减少视觉复杂度
  strokeWeight(1);
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2 + sin(frameCount / 20) * 10;
  bezier(x1, y1, midX, midY, midX, midY, x2, y2);
}

// 生成细胞
function generateCells() {
  cells = [];
  for (let i = 0; i < maxCells; i++) {
    let angle = random(TWO_PI);
    let distance = random(50, 150);
    let x = core.x + cos(angle) * distance;
    let y = core.y + sin(angle) * distance;
    let shapeType = random(['circle', 'triangle', 'square']);
    let color = [random(50, 255), random(50, 255), random(50, 255)]; // 多样化的颜色
    cells.push({
      x: x,
      y: y,
      size: random(20, 40), // 适中的细胞尺寸
      color: color,
      shape: shapeType,
      lifetime: cellLifetime,
      settled: false, // 标记细胞是否稳定
      vibrate: function () {
        this.x += random(-1, 1); // 适中的振动效果
        this.y += random(-1, 1);
      }
    });
  }
}

// 生成闪烁的小点
function generateMicrobePoint() {
  if (microbePoints.length < maxMicrobePoints) {
    microbePoints.push({
      x: random(width),
      y: random(height),
      lifetime: random(30, 100)
    });
  }
}

// 显示闪烁的小点
function drawMicrobePoints() {
  generateMicrobePoint();
  
  for (let i = microbePoints.length - 1; i >= 0; i--) {
    let point = microbePoints[i];
    fill(255, random(100, 255));
    noStroke();
    ellipse(point.x, point.y, 5, 5);
    point.lifetime--;

    if (point.lifetime <= 0) {
      microbePoints.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (dist(mouseX, mouseY, core.x, core.y) < core.size / 2) {
    coreMove = true;
  } else {
    let clickedCell = false;
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (dist(mouseX, mouseY, cell.x, cell.y) < cell.size / 2) {
        // 改变细胞颜色，模拟伪装能力
        cell.color = [random(50, 255), random(50, 255), random(50, 255)];
        clickedCell = true;
        break;
      }
    }
    if (!clickedCell) {
      ripples.push(new Ripple(mouseX, mouseY));
    }
  }
}

function mouseReleased() {
  coreMove = false;
}

// 涟漪效果对象改为函数实现
function Ripple(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 5;
  this.lifetime = rippleLifetime;

  this.expand = function () {
    this.radius += 2;
    this.lifetime--;
  };

  this.display = function () {
    noFill();
    stroke(255, this.lifetime * 4);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  };

  this.isGone = function () {
    return this.lifetime <= 0;
  };
}
