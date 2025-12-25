const canvas = document.getElementById("footer-firework");
const ctx = canvas.getContext("2d");

/* ================= CANVAS ================= */
function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= CONFIG ================= */
const FOOTER_ZONE = 120;        // độ cao pháo bay lên
const HEART_SCALE = 3.2;        // tim nhỏ gọn
const GROUP_MIN = 3;
const GROUP_MAX = 8;

/* ================= ROCKET ================= */
class Rocket {
    constructor(x) {
        this.x = x;
        this.y = canvas.height;
        this.vy = -(3.6 + Math.random() * 0.6); // bay thấp
        this.vx = (Math.random() - 0.5) * 0.3; // lệch nhẹ
        this.targetY =
            canvas.height - (60 + Math.random() * FOOTER_ZONE);
        this.exploded = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.015;

        if (this.y <= this.targetY) {
            this.exploded = true;
            explodeRing(this.x, this.y);
            explodeHeart(this.x, this.y);
        }
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ================= PARTICLE ================= */
class Particle {
    constructor(x, y, vx, vy, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.color = color;
        this.size = size;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.008;
        this.life -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let rockets = [];
let particles = [];

/* ================= RING EXPLOSION ================= */
function explodeRing(cx, cy) {
    const count = 22;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = 1 + Math.random() * 0.5;

        particles.push(
            new Particle(
                cx,
                cy,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                "rgba(255,255,255,0.8)",
                1.1
            )
        );
    }
}

/* ================= HEART SHAPE ================= */
function heartPoint(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y:
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t),
    };
}

/* ================= HEART EXPLOSION ================= */
function explodeHeart(cx, cy) {
    for (let t = 0; t < Math.PI * 2; t += 0.04) {
        const p = heartPoint(t);
        const px = cx + p.x * HEART_SCALE;
        const py = cy - p.y * HEART_SCALE;

        // tạo khối tim
        for (let i = 0; i < 2; i++) {
            particles.push(
                new Particle(
                    cx,
                    cy,
                    (px - cx) * 0.012 + (Math.random() - 0.5) * 0.25,
                    (py - cy) * 0.012 + (Math.random() - 0.5) * 0.25,
                    "#ff7eb9",
                    1
                )
            );
        }
    }
}

/* ================= LOOP ================= */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((r) => {
        r.update();
        r.draw();
    });
    rockets = rockets.filter((r) => !r.exploded);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });
    particles = particles.filter((p) => p.life > 0);

    requestAnimationFrame(animate);
}
animate();

/* ================= SPAWN GROUP ================= */
function launchGroup() {
    if (document.hidden) return;

    const count =
        GROUP_MIN + Math.floor(Math.random() * (GROUP_MAX - GROUP_MIN + 1));

    for (let i = 0; i < count; i++) {
        rockets.push(
            new Rocket(canvas.width * (0.25 + Math.random() * 0.5))
        );
    }
}


setInterval(launchGroup, 1600);
