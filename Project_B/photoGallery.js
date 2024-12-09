// photoGallery.js

const photos = [
    'animals.jpg',
    'Birds.jpg',
    'Flowers.jpg',
    'Ocean.jpg'
];

let currentPhotoIndex = 0;
let img;

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent("photo-gallery");
    img = loadImage(photos[currentPhotoIndex]); // 初始化图片
}

function draw() {
    background(0); // 背景黑色
    image(img, 0, 0, 2*width, 2*height); // 显示图片

    // 如果需要，可以在画布上加一些文字说明
    fill(255);
    textSize(32);
    text("Nature Time Capsule", 10, height - 50);
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    img = loadImage(photos[currentPhotoIndex]); // 加载下一张图片
}

function previousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    img = loadImage(photos[currentPhotoIndex]); // 加载上一张图片
}
