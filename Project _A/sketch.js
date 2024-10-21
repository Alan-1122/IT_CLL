let core;
let cells = [];
let coreSize = 80;
let maxCells = 150; // 增加生成的细胞数量
let cellLifetime = 600; // 延长细胞的存活时间
let avoidMouseRadius = 50; // 鼠标点击的避让范围
let ripples = []; // 存储涟漪效果

function setup() {
    let canvas= createCanvas(800, 500);
    canvas.parent("p5-canvas-container")
    background(30, 30, 60); // 改为深色背景
    core = new Core(width / 2, height / 2, coreSize);
}

function draw() {
    background(30, 30, 60);

    // 显示涟漪效果
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].display();
        ripples[i].expand();
        if (ripples[i].isGone()) {
            ripples.splice(i, 1);
        }
    }

    // 显示核心并微微颤动
    core.display();
    core.vibrate();

    // 均匀生成细胞，并用波浪状的丝线连接
    if (frameCount % 10 === 0 && cells.length < maxCells) {
        let angle = random(TWO_PI);
        let distance = cells.length === 0 ? 80 : (80 + cells.length * 5); // 距离逐渐增大
        let x = core.x + cos(angle) * distance;
        let y = core.y + sin(angle) * distance;
        if (dist(mouseX, mouseY, x, y) > avoidMouseRadius) {
            let newCell = new Cell(x, y, angle, distance);
            cells.push(newCell);
        }
    }

    // 显示并连接细胞，控制其振动和消失
    stroke(150); // 用浅色线连接细胞
    for (let i = cells.length - 1; i >= 0; i--) {
        // 核心只连接最近的细胞
        if (i < 20) {
            line(core.x, core.y, cells[i].x, cells[i].y);
        }
        // 细胞之间通过波浪状的线相连
        if (i > 0) {
            let prevCell = cells[i - 1];
            stroke(100);
            strokeWeight(1);
            let midX = (cells[i].x + prevCell.x) / 2;
            let midY = (cells[i].y + prevCell.y) / 2 + sin(frameCount / 20) * 10;
            bezier(cells[i].x, cells[i].y, midX, midY, midX, midY, prevCell.x, prevCell.y);
        }
        cells[i].display();
        cells[i].vibrate();
        cells[i].checkLifetime();
        if (cells[i].isDead()) {
            cells.splice(i, 1);
        }
    }
}

// 核心类，带刺状保护组织
class Core {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
        this.spikes = 10;
        this.spikeLength = 20;
    }

    // 核心轻微颤动
    vibrate() {
        this.angle += 0.05;
        this.x = width / 2 + sin(this.angle) * 5;
        this.y = height / 2 + cos(this.angle) * 5;
    }

    // 显示核心和刺状保护
    display() {
        noStroke();
        fill(200, 0, 0);
        ellipse(this.x, this.y, this.size, this.size);

        // 核心内部添加细节，模拟复杂的细胞核
        fill(150, 0, 0);
        ellipse(this.x, this.y, this.size * 0.6, this.size * 0.6);
        fill(255, 255, 100);
        ellipse(this.x, this.y, this.size * 0.3, this.size * 0.3);

        // 刺状保护组织，随鼠标点击核心时收缩
        stroke(255, 100, 100);
        strokeWeight(2);
        for (let i = 0; i < this.spikes; i++) {
            let angle = TWO_PI / this.spikes * i;
            let x1 = this.x + cos(angle) * (this.size / 2);
            let y1 = this.y + sin(angle) * (this.size / 2);
            let x2 = this.x + cos(angle) * (this.size / 2 + this.spikeLength);
            let y2 = this.y + sin(angle) * (this.size / 2 + this.spikeLength);
            line(x1, y1, x2, y2);
        }
    }

    // 刺状保护组织收缩
    shrink() {
        this.spikeLength = max(10, this.spikeLength - 10); // 收缩刺
    }

    // 恢复刺状保护
    restore() {
        this.spikeLength = 20; // 恢复原始长度
    }
}

// 细胞类，带细胞膜和振动效果
class Cell {
    constructor(x, y, angle, distance) {
        this.x = x;
        this.y = y;
        this.size = random(20, 40);
        this.color = [random(255), random(255), random(255)];
        this.vibrateAngle = angle;
        this.distance = distance;
        this.lifetime = cellLifetime;
    }

    // 细胞微小振动，不穿过核心
    vibrate() {
        this.vibrateAngle += 0.01;
        this.x += sin(this.vibrateAngle) * 0.5;
        this.y += cos(this.vibrateAngle) * 0.5;
        // 避免穿过核心
        if (dist(this.x, this.y, core.x, core.y) < coreSize / 2 + this.size / 2) {
            this.x = core.x + cos(this.vibrateAngle) * this.distance;
            this.y = core.y + sin(this.vibrateAngle) * this.distance;
        }
    }

    // 显示细胞并带有细胞膜效果
    display() {
        fill(this.color);
        stroke(255);
        strokeWeight(2); // 模拟细胞膜
        ellipse(this.x, this.y, this.size, this.size);
    }

    // 检查细胞的存活时间
    checkLifetime() {
        this.lifetime--;
    }

    // 判断细胞是否应该消失
    isDead() {
        return this.lifetime <= 0;
    }

    // 改变细胞颜色（遇到鼠标时）
    changeColor() {
        this.color = [random(255), random(255), random(255)];
    }
}

// 涟漪效果类
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.lifetime = 60; // 涟漪的存在时间
    }

    // 涟漪扩展
    expand() {
        this.radius += 2;
        this.lifetime--;
    }

    // 显示涟漪
    display() {
        noFill();
        stroke(100, 150, 255, this.lifetime * 4);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius * 2);
    }

    // 检查涟漪是否消失
    isGone() {
        return this.lifetime <= 0;
    }
}

// 处理鼠标点击交互
function mousePressed() {
    // 核心遇到鼠标点击时，刺状保护收缩
    if (dist(mouseX, mouseY, core.x, core.y) < coreSize / 2) {
        core.shrink();
        setTimeout(() => core.restore(), 500); // 0.5秒后恢复
    }

    // 点击其他空白处，生成涟漪
    if (dist(mouseX, mouseY, core.x, core.y) >= coreSize / 2) {
        ripples.push(new Ripple(mouseX, mouseY));
    }

    // 细胞遇到鼠标点击时改变颜色
    for (let i = 0; i < cells.length; i++) {
        if (dist(mouseX, mouseY, cells[i].x, cells[i].y) < cells[i].size / 2) {
            cells[i].changeColor();
        }
    }
}