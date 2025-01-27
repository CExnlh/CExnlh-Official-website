const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const startShowButton = document.getElementById('startShowButton');

// 创建多个音频元素以实现同时播放
const fireworkSounds = [
    document.getElementById('fireworkSound1'),
    document.getElementById('fireworkSound2'),
    document.getElementById('fireworkSound3')
];
let soundIndex = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor(x, y, type, size, speed, decay) {
        this.x = x;
        this.y = y;
        this.sparkles = [];
        this.type = type;
        this.size = size;
        this.speed = speed;
        this.decay = decay;
        const sparkleCount = Math.random() * 30 + 20;
        for (let i = 0; i < sparkleCount; i++) {
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机颜色
            this.sparkles.push(new Sparkle(this.x, this.y, this.type, color, this.size, this.speed, this.decay));
        }
        this.playSound();
    }

    playSound() {
        const sound = fireworkSounds[soundIndex];
        sound.currentTime = 0;
        sound.play();
        soundIndex = (soundIndex + 1) % fireworkSounds.length; // 轮流使用音频元素
    }

    update() {
        this.sparkles.forEach(sparkle => sparkle.update());
    }

    draw() {
        this.sparkles.forEach(sparkle => sparkle.draw());
    }
}

class Sparkle {
    constructor(x, y, type, color, size, speed, decay) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * speed + 1;
        this.gravity = 0.05;
        this.alpha = 1;
        this.decay = Math.random() * decay + 0.005;
        this.size = Math.random() * size + 1;
        this.color = color;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (this.type === 0) { // 圆形
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else if (this.type === 1) { // 星形
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(this.x + Math.cos((18 + i * 72) / 180 * Math.PI) * this.size,
                           this.y - Math.sin((18 + i * 72) / 180 * Math.PI) * this.size);
                ctx.lineTo(this.x + Math.cos((54 + i * 72) / 180 * Math.PI) * this.size / 2.5,
                           this.y - Math.sin((54 + i * 72) / 180 * Math.PI) * this.size / 2.5);
            }
        } else if (this.type === 2) { // 线形
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(this.angle) * this.size * 10,
                       this.y + Math.sin(this.angle) * this.size * 10);
        } else if (this.type === 3) { // 半圆形
            ctx.arc(this.x, this.y, this.size, 0, Math.PI);
        } else if (this.type === 4) { // 自定义图案（例如心形）
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size / 2, this.y + this.size / 2, this.x + this.size / 2, this.y + this.size / 2, this.x, this.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

const fireworks = [];

canvas.addEventListener('click', (e) => {
    const type = Math.floor(Math.random() * 5);
    fireworks.push(new Firework(e.clientX, e.clientY, type, 2, 4, 0.02));
});

startShowButton.addEventListener('click', () => {
    startFireworkShow();
});

function startFireworkShow() {
    const showDuration = 300000; // 烟花盛宴持续5分钟
    const interval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const type = Math.floor(Math.random() * 5);
        fireworks.push(new Firework(x, y, type, 2, 4, 0.02));
    }, 500); // 调整间隔以营造烟花盛宴的效果

    setTimeout(() => {
        clearInterval(interval);
        // 最后一幕，使用特定样式的烟花来结束
        setTimeout(() => {
            fireworks.push(new Firework(canvas.width / 2, canvas.height / 2, 1, 5, 6, 0.01));
        }, 1000);
    }, showDuration);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.sparkles[0].alpha <= 0) {
            fireworks.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

animate();