const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const clickMeBtn = document.getElementById("clickMeBtn");
const notePopup = document.getElementById("notePopup");
const closeBtn = document.getElementById("closeBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

canvas.width = 400;
canvas.height = 400;


let score = 0;
let hearts = [];
let basket = {
    x: 160,
    y: 320,
    width: 70,
    height: 70,
    speed: 7
};

let messageShown = false;
let messageTargetY = (canvas.height / 2) - 20; 
let messageY = messageTargetY + 30; 
let messageAlpha = 0; 


const basketImg = new Image();
basketImg.src = "assets/basket.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";


let keys = {};
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);


canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let mouseX = (e.clientX - rect.left) * scaleX;
    basket.x = mouseX - basket.width / 2;
});


let movingLeft = false;
let movingRight = false;


leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); movingLeft = true; });
leftBtn.addEventListener("touchend", () => { movingLeft = false; });
leftBtn.addEventListener("mousedown", () => { movingLeft = true; });
leftBtn.addEventListener("mouseup", () => { movingLeft = false; });


rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); movingRight = true; });
rightBtn.addEventListener("touchend", () => { movingRight = false; });
rightBtn.addEventListener("mousedown", () => { movingRight = true; });
rightBtn.addEventListener("mouseup", () => { movingRight = false; });


clickMeBtn.addEventListener("click", () => {
    notePopup.classList.remove("popup-hidden");
});

closeBtn.addEventListener("click", () => {
    notePopup.classList.add("popup-hidden");
});

function spawnHeart() {
    if (Math.random() < 0.05) {
        hearts.push({
            x: Math.random() * (canvas.width - 35),
            y: -40,
            size: 40,
            speed: Math.random() * 2 + 2
        });
    }
}

function update() {
    
    if ((keys["ArrowLeft"] || keys["KeyA"] || movingLeft) && basket.x > 0) {
        basket.x -= basket.speed;
    }
    if ((keys["ArrowRight"] || keys["KeyD"] || movingRight) && basket.x < canvas.width - basket.width) {
        basket.x += basket.speed;
    }

    if (basket.x < 0) basket.x = 0;
    if (basket.x > canvas.width - basket.width) basket.x = canvas.width - basket.width;

    spawnHeart();

    for (let i = hearts.length - 1; i >= 0; i--) {
        let h = hearts[i];
        h.y += h.speed;

        if (
            h.y + h.size > basket.y &&
            h.x < basket.x + basket.width &&
            h.x + h.size > basket.x &&
            h.y < basket.y + basket.height
        ) {
            score++;
            hearts.splice(i, 1);
            continue;
        }

        if (h.y > canvas.height) {
            hearts.splice(i, 1);
        }
    }

   
    if (score >= 20 && !messageShown) {
        messageShown = true;
        
        clickMeBtn.classList.remove("btn-hidden");
        setTimeout(() => {
            clickMeBtn.classList.add("show");
        }, 50);

        for (let i = 0; i < 30; i++) {
            hearts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -200,
                size: 40,
                speed: Math.random() * 3 + 2
            });
        }
    }

    if (messageShown) {
        if (messageAlpha < 1) {
            messageAlpha += 0.005; 
        }
        if (messageY > messageTargetY) {
            messageY -= 0.4; 
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let h of hearts) {
        ctx.drawImage(heartImg, h.x, h.y, h.size, h.size);
    }

    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);

    ctx.fillStyle = "#333";
    ctx.font = "bold 20px 'Segoe UI'";
    ctx.fillText("Score: " + score, 15, 30);

    
    if (messageShown) {
        ctx.save();
        ctx.font = "bold 26px 'Segoe UI'";
        ctx.textAlign = "center";
        ctx.globalAlpha = messageAlpha; 

        let textGradient = ctx.createLinearGradient(0, messageY - 15, 0, messageY + 8);
        textGradient.addColorStop(0, "#d63384"); 
        textGradient.addColorStop(1, "rgba(254, 207, 239, 0.4)"); 

        ctx.fillStyle = textGradient;
        ctx.shadowColor = "rgba(214, 51, 132, 0.4)";
        ctx.shadowBlur = 8;
        
        ctx.fillText("You mean the world to me", canvas.width / 2, messageY);
        ctx.restore();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

let loadedImages = 0;
function checkImagesLoaded() {
    loadedImages++;
    if (loadedImages === 2) {
        loop();
    }
}

basketImg.onload = checkImagesLoaded;
heartImg.onload = checkImagesLoaded;