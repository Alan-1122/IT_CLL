// photoGallery.js

let photos = [
    'animals.jpg',
    'Birds.jpg',
    'Flowers.jpg',
    'Ocean.jpg',
    'Light.jpg',
    'Gu.jpg',
    'Tree.jpg'
];

let currentPhotoIndex = 0;
let img;

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent("photo-gallery");
    img = (photos[currentPhotoIndex]); // 初始化图片
}

function draw() {
    background(0); // 背景黑色
    image(img, 0, 0, 2*width, 2*height); // 显示图片

    // 如果需要，可以在画布上加一些文字说明
    fill(255);
    textSize(32);
    text("Nature Time Capsule", 10, height - 50);
}

function updateImage() {
    const galleryImage = document.getElementById('gallery-image');
    galleryImage.src = photos[currentPhotoIndex];
}


// 显示上一张图片的函数
function previousPhoto() {
    currentPhotoIndex = (currentPhotoIndex > 0) ? currentPhotoIndex - 1 : photos.length - 1; // 如果当前索引大于0，则减1；否则回到最后一张
    updateImage();
}
 
// 显示下一张图片的函数
function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex < photos.length - 1) ? currentPhotoIndex + 1 : 0; // 如果当前索引小于最后一张的索引，则加1；否则回到第一张
    updateImage();
}
 
// 初始化显示第一张图片
updateImage();
