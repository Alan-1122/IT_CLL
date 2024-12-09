// JavaScript code to enhance interactivity for Page 1

let flowers = [];
let birds = [];
let clouds = [];
let waterOffset = 0;
let ripples = [];

function setup() {
    let canvas = createCanvas(800, 400);
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
