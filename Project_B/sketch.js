function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("p5-canvas-container");
    background(135, 206, 235); // Light blue sky color
}

function draw() {
    background(135, 206, 235); // Refresh the background every frame
    
    // Draw the ground
    fill(34, 139, 34); // Green color for grass
    rect(0, height - 100, width, 100);

    // Draw a tree
    drawTree(100, 300);

    // Draw flying birds
    drawDetailedBird(frameCount * 0.02 % width, height * 0.3, sin(frameCount * 0.2) * 10);
    drawDetailedBird((frameCount * 0.015 + 300) % width, height * 0.4, cos(frameCount * 0.2) * 10);
}

function drawTree(x, y) {
    // Draw tree trunk
    fill(139, 69, 19); // Brown color for trunk
    rect(x, y - 50, 20, 50);
    
    // Draw tree leaves
    fill(34, 139, 34); // Green color for leaves
    ellipse(x + 10, y - 60, 60, 60);
    ellipse(x - 10, y - 70, 60, 60);
    ellipse(x + 30, y - 70, 60, 60);
}

function drawDetailedBird(x, y, wingOffset) {
    // Draw bird body
    fill(255, 215, 0); // Gold color for the bird's body
    ellipse(x, y, 40, 20); // Body

    // Draw bird wings
    fill(255, 140, 0); // Darker color for wings
    ellipse(x - 10, y - 10 + wingOffset, 20, 40); // Left wing
    ellipse(x + 10, y - 10 - wingOffset, 20, 40); // Right wing

    // Draw bird eyes
    fill(0); // Black color for eyes
    ellipse(x + 10, y - 5, 5, 5); // Right eye
    ellipse(x - 10, y - 5, 5, 5); // Left eye
}