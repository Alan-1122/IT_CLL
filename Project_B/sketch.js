// JavaScript code to enhance interactivity for Page 1

let flowers = [];
let birds = [];
let clouds = [];
let waterOffset = 0;
let ripples = [];

function setup() {
    let canvas = createCanvas(1200, 400);
    canvas.parent("p5-canvas-container");

    // Initialize flowers
    for (let i = 0; i < 5; i++) {
        flowers.push({
            x: random(50, 300),
            y: height - 100,
            size: 0,
            stemHeight: 0,
            color: color(255, random(100, 150), random(100, 150))
        });
    }

    // Initialize birds
    for (let i = 0; i < 3; i++) {
        birds.push({
            x: random(width / 2, width),
            y: random(100, 200),
            speed: random(1.5, 3),
            wingOffset: 0,
            direction: 1
        });
    }

    // Initialize clouds
    for (let i = 0; i < 4; i++) {
        clouds.push({
            x: random(width),
            y: random(50, 150),
            size: random(50, 100)
        });
    }
}

function draw() {
    background(135, 206, 235); // Light blue sky

    // Draw clouds
    drawClouds();

    // Draw grass area
    fill(34, 139, 34);
    rect(0, height - 100, width / 2, 100);

    // Draw flowers
    drawFlowers();

    // Draw water
    drawWater();

    // Draw ripples
    drawRipples();

    // Draw birds
    drawBirds();

    // Draw tree
    drawTree(100, 300);
}

function drawClouds() {
    fill(255);
    noStroke();
    for (let cloud of clouds) {
        ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
        ellipse(cloud.x + 20, cloud.y - 10, cloud.size * 0.8, cloud.size * 0.5);
        ellipse(cloud.x - 20, cloud.y - 10, cloud.size * 0.7, cloud.size * 0.4);
        cloud.x += 0.5; // Move cloud slowly
        if (cloud.x > width) cloud.x = -cloud.size; // Reset position
    }
}

function drawFlowers() {
    for (let flower of flowers) {
        // Draw stem
        stroke(34, 139, 34);
        line(flower.x, height - 100, flower.x, height - 100 - flower.stemHeight);

        // Draw flower head
        noStroke();
        fill(flower.color);
        ellipse(flower.x, height - 100 - flower.stemHeight - flower.size / 2, flower.size, flower.size);

        // Grow flower gradually
        if (flower.stemHeight < 50) {
            flower.stemHeight += 0.2;
        } else if (flower.size < 20) {
            flower.size += 0.1;
        }
    }
}

function drawWater() {
    fill(70, 130, 180);
    beginShape();
    for (let x = width / 2; x < width; x++) {
        let y = height - 100 + sin(x * 0.1 + waterOffset) * 10;
        vertex(x, y);
    }
    vertex(width, height);
    vertex(width / 2, height);
    endShape(CLOSE);
    waterOffset += 0.05;
}

function drawRipples() {
    noFill();
    stroke(255);
    for (let ripple of ripples) {
        ellipse(ripple.x, ripple.y, ripple.size, ripple.size);
        ripple.size += 2; // Expand ripple gradually
        ripple.opacity -= 3; // Fade ripple
        if (ripple.opacity <= 0) {
            ripples.splice(ripples.indexOf(ripple), 1);
        }
    }
}

function drawBirds() {
    for (let bird of birds) {
        bird.x += bird.speed * bird.direction;
        bird.wingOffset = sin(frameCount * 0.1) * 10;

        if (bird.x > width || bird.x < 0) bird.direction *= -1; // Reverse direction if out of bounds

        // Draw bird body
        fill(255, 215, 0);
        ellipse(bird.x, bird.y, 40, 20);

        // Draw bird wings
        fill(255, 140, 0);
        ellipse(bird.x - 10, bird.y - 10 + bird.wingOffset, 20, 10);
        ellipse(bird.x + 10, bird.y - 10 - bird.wingOffset, 20, 10);

        // Draw bird eyes
        fill(0);
        ellipse(bird.x + 10, bird.y - 5, 5, 5);
    }
}

function drawTree(x, y) {
    // Draw tree trunk
    fill(139, 69, 19);
    rect(x, y - 120, 40, 120);

    // Draw tree leaves
    fill(34, 139, 34);
    ellipse(x + 20, y - 150, 100, 100);
    ellipse(x - 20, y - 160, 100, 100);
    ellipse(x + 40, y - 160, 100, 100);
}

function mousePressed() {
    // Generate ripple on water click
    if (mouseX > width / 2 && mouseY > height - 100) {
        ripples.push({ x: mouseX, y: mouseY, size: 10, opacity: 255 });
    }

    // Change bird direction on click
    for (let bird of birds) {
        if (dist(mouseX, mouseY, bird.x, bird.y) < 20) {
            bird.direction *= -1; // Reverse bird direction
        }
    }
}
function showText(element, text) {
    var hoverText = element.querySelector('.hover-text');
    if (!hoverText) {
        // 如果.hover-text不存在，则创建一个新的元素

        hoverText.className = 'hover-text';
        hoverText.style.display = 'none'; // 初始隐藏
        hoverText.style.position = 'absolute'; // 可选，根据需求调整位置
        hoverText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 可选，背景色
        hoverText.style.color = '#fff'; // 可选，文字颜色
        hoverText.style.padding = '5px'; // 可选，内边距
        hoverText.style.borderRadius = '3px'; // 可选，圆角
        hoverText.style.zIndex = 1000; // 确保元素在其他内容之上
        element.appendChild(hoverText);
    }
 
    hoverText.textContent = text; 
    hoverText.style.display = 'block';
    hoverText.style.whiteSpace = 'pre-wrap'; // 允许文本中的换行符生效
    hoverText.style.width = '400px'
    // 如果需要，还可以调整其他样式，比如位置、动画等
    // 例如：hoverText.style.left = '10px';
    // hoverText.style.top = '10px';
}

function hideText(element) {
    var hoverText = element.querySelector('.hover-text');
    hoverText.style.display = 'none';
}

// script.js
function showTextNext(text, textId) {
    var popUpText = document.getElementById('pop-up-text');
    popUpText.innerHTML = ''; // 清空之前的文字
    popUpText.style.width = '200px'
    popUpText.style.fontSize = '20px'
    popUpText.style.position = 'absolute';
    popUpText.style.right = '100px'
    popUpText.style.top = '-500px'
    popUpText.style.whiteSpace = 'pre-wrap'; // 允许文本中的换行符生效
 
    // 创建一个span元素数组，每个元素包含文本的一个字符
    var spans = text.split('').map(function(char) {
        var span = document.createElement('span');
        span.textContent = char;
        return span;
    });

    // 逐个添加span元素到容器中，并稍微延迟每个元素的动画开始时间
    spans.forEach(function(span, index) {
        setTimeout(function() {
            popUpText.appendChild(span);
        }, index * 100); // 每个字符延迟100毫秒
    });

    // 可选：如果你想在动画结束后隐藏文字，可以使用setTimeout
    // 但由于我们这里是逐个显示，隐藏可能不太合适，除非你有特定需求
}
function showTextNextTwo(text, textId) {
    var popUpText = document.getElementById('pop-up-text2');
    popUpText.innerHTML = ''; // 清空之前的文字
    popUpText.style.fontSize = '20px'
    popUpText.style.width = '200px'
    popUpText.style.position = 'absolute';
    popUpText.style.left = '100px'
    popUpText.style.top = '-500px'
    popUpText.style.whiteSpace = 'pre-wrap'; // 允许文本中的换行符生效

    // 创建一个span元素数组，每个元素包含文本的一个字符
    var spans = text.split('').map(function(char) {
        var span = document.createElement('span');
        span.textContent = char;
        return span;
    });

    // 逐个添加span元素到容器中，并稍微延迟每个元素的动画开始时间
    spans.forEach(function(span, index) {
        setTimeout(function() {
            popUpText.appendChild(span);
        }, index * 100); // 每个字符延迟100毫秒
    });

    // 可选：如果你想在动画结束后隐藏文字，可以使用setTimeout
    // 但由于我们这里是逐个显示，隐藏可能不太合适，除非你有特定需求
}

// 假设previousPhoto和nextPhoto函数已经定义在其他地方
// function previousPhoto() {
//     // ...
// }
//
// function nextPhoto() {
//     // ...
// }