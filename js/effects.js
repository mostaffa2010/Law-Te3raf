// js/effects.js - محرك المؤثرات البصرية التفاعلية (انفجار الكرات الملونة، الألعاب النارية، واهتزاز الأخطاء)

var EffectsEngine = window.EffectsEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    fireworks: [],
    animationFrameId: null,
    isRunning: false,

    init() {
        this.canvas = document.getElementById('celebration-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }
    },

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },

        // 1. انفجار كرات ملونة وشرارات ناعمة وصغيرة وشفافة (60% opacity)
    burstCorrectParticles(targetElem) {
        if (!targetElem) return;

        const rect = targetElem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const container = document.getElementById('floating-reactions-box') || document.body;
        const colors = ['#10b981', '#f59e0b', '#00f0ff', '#ec4899', '#38bdf8'];
        const numParticles = 14; // عدد خفيف وناعم (14 كرة فقط)

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle-dot';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.floor(Math.random() * 4) + 4; // حجم أصغر (4px إلى 7px)

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.floor(Math.random() * 45) + 25; // انتشار لطيف (25px إلى 70px)
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            particle.style.opacity = '0.6';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--dest-x', `${destX}px`);
            particle.style.setProperty('--dest-y', `${destY}px`);

            container.appendChild(particle);

            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 650);
        }
    },

    // 2. إطلاق ألعاب نارية وكونفيتي احتفالي عند الفوز بالمباراة
    launchVictoryFireworks() {
        this.init();
        if (!this.canvas || !this.ctx) return;

        this.particles = [];
        this.fireworks = [];
        this.isRunning = true;
        this.canvas.style.display = 'block';

        let rocketCount = 0;
        const maxRockets = 14;

        const launchInterval = setInterval(() => {
            if (!this.isRunning || rocketCount >= maxRockets) {
                clearInterval(launchInterval);
                return;
            }
            this.createRocket();
            rocketCount++;
        }, 320);

        // إنشاء كونفيتي متساقط
        this.createConfettiShower(60);

        // تشغيل حلقة الرسم
        this.animateCelebration();

        // إيقاف وتفريغ الكانفاس تلقائياً بعد 5.5 ثوانٍ
        setTimeout(() => {
            this.stopCelebration();
        }, 5500);
    },

    createRocket() {
        const startX = Math.random() * (this.canvas.width * 0.7) + (this.canvas.width * 0.15);
        const targetY = Math.random() * (this.canvas.height * 0.45) + (this.canvas.height * 0.1);
        const colors = ['#f59e0b', '#10b981', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7', '#00f0ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.fireworks.push({
            x: startX,
            y: this.canvas.height,
            targetY: targetY,
            speed: Math.random() * 3 + 7,
            color: color,
            radius: 3
        });
    },

    createExplosion(x, y, color) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSparkle();

        const count = 45;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.012,
                size: Math.random() * 3 + 2,
                gravity: 0.1
            });
        }
    },

    createConfettiShower(count = 50) {
        const colors = ['#f59e0b', '#10b981', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * -this.canvas.height * 0.5,
                vx: (Math.random() - 0.5) * 2.5,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.003,
                size: Math.random() * 6 + 4,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 8,
                isConfetti: true
            });
        }
    },

    animateCelebration() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. تحديث ورسم صواريخ الألعاب النارية
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            fw.y -= fw.speed;

            this.ctx.beginPath();
            this.ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = fw.color;
            this.ctx.fill();

            if (fw.y <= fw.targetY) {
                this.createExplosion(fw.x, fw.y, fw.color);
                this.fireworks.splice(i, 1);
            }
        }

        // 2. تحديث ورسم الجزيئات والكونفيتي
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.isConfetti) {
                p.rotation += p.vRot;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                this.ctx.restore();
            } else {
                p.vy += p.gravity || 0.08;
                p.alpha -= p.decay;

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();
                this.ctx.restore();
            }

            if (p.alpha <= 0 || p.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.animateCelebration());
    },

    stopCelebration() {
        this.isRunning = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.style.display = 'none';
        }
        this.particles = [];
        this.fireworks = [];
    }
};

window.addEventListener('DOMContentLoaded', () => {
    EffectsEngine.init();
});
