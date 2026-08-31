// js/audio.js - محرك المؤثرات الصوتية والاهتزاز الهادئ للعبة "لَو تِعرَف"

const AudioEngine = {
    ctx: null,

    isSoundEnabled() {
        return localStorage.getItem('sound_enabled') !== 'false';
    },

    isVibrateEnabled() {
        return localStorage.getItem('vibrate_enabled') !== 'false';
    },

    init() {
        if (!this.isSoundEnabled()) return;
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    vibrate(pattern) {
        if (this.isVibrateEnabled() && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {}
        }
    },

    // تم إلغاء الصوت التلقائي للنقر على الأزرار والقوائم
    playClick() {
        // مفرغ عمداً لراحة المستخدم أثناء التصفح
    },

    // صوت الإجابة الصحيحة (هادئ وناعم)
    playCorrect() {
        if (this.isSoundEnabled()) {
            this.init();
            if (this.ctx) {
                try {
                    const now = this.ctx.currentTime;
                    const notes = [523.25, 659.25, 783.99]; // نغمات دافئة C5, E5, G5

                    notes.forEach((freq, idx) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();

                        osc.type = 'sine'; // موجة نقية وناعمة
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.07));

                        // مستوى صوت منخفض جداً وناعم (0.08)
                        gain.gain.setValueAtTime(0.08, now + (idx * 0.07));
                        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.07) + 0.2);

                        osc.connect(gain);
                        gain.connect(this.ctx.destination);

                        osc.start(now + (idx * 0.07));
                        osc.stop(now + (idx * 0.07) + 0.2);
                    });
                } catch (e) {}
            }
        }
        this.vibrate(30);
    },

    // صوت الإجابة الخاطئة (خافت وغير مزعج)
    playWrong() {
        if (this.isSoundEnabled()) {
            this.init();
            if (this.ctx) {
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine'; // استخدام موجة هادئة بدل المنشار الحاد
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.linearRampToValueAtTime(130, now + 0.2);

                    // مستوى صوت خافت (0.09)
                    gain.gain.setValueAtTime(0.09, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.2);
                } catch (e) {}
            }
        }
        this.vibrate([40, 40, 40]);
    },

    // تكتكة خافتة للمؤقت
    playTick() {
        if (!this.isSoundEnabled()) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.02);
        } catch (e) {}
    },

    // صوت استخدام المساعدات
    playPowerup() {
        if (this.isSoundEnabled()) {
            this.init();
            if (this.ctx) {
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(900, now + 0.18);

                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.18);
                } catch (e) {}
            }
        }
        this.vibrate(25);
    },

    // صوت خافت عند الفوز بالمرحلة
    playWin() {
        if (this.isSoundEnabled()) {
            this.init();
            if (this.ctx) {
                try {
                    const notes = [523.25, 659.25, 783.99, 1046.50];
                    notes.forEach((freq, idx) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();

                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.08));

                        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + (idx * 0.08));
                        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.08) + 0.22);

                        osc.connect(gain);
                        gain.connect(this.ctx.destination);

                        osc.start(this.ctx.currentTime + (idx * 0.08));
                        osc.stop(this.ctx.currentTime + (idx * 0.08) + 0.22);
                    });
                } catch (e) {}
            }
        }
        this.vibrate([60, 40, 80]);
    },

    // صوت انتهاء المحاولات
    playGameOver() {
        if (!this.isSoundEnabled()) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [330, 293, 261];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.1));

                gain.gain.setValueAtTime(0.08, this.ctx.currentTime + (idx * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.1) + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + (idx * 0.1));
                osc.stop(this.ctx.currentTime + (idx * 0.1) + 0.2);
            });
        } catch (e) {}
    }
};

// تهيئة محرك الصوت مع أول لمسة
['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, () => AudioEngine.init(), { once: true });
});
