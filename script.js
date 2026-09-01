// script.js - النسخة الكاملة المجمعة المحدثة للعبة لَو تِعرَف

// الإعدادات الديناميكية ودوال جلب الأسعار الحية
var APP_CONFIG = window.APP_CONFIG = {
    prices: {
        hint5050: 20,
        addTime: 15,
        skip: 30,
        dailyFreeReward: 30,
        wheelExtraSpin: 25
    },
    customPrices: {
        av_detective: 400,
        av_viking: 600,
        av_samurai: 800,
        av_pharaoh: 1000,
        av_astro: 1200,
        av_gladiator: 1400,
        av_pirate: 1600,
        av_alchemist: 1800,
        av_wizard: 2000,
        av_lion: 2500,
        frame_cyber_neon: 500,
        frame_royal_laurel: 800,
        frame_dragon_fire: 1000,
        title_mastermind: 300,
        title_puzzle_king: 500,
        title_sniper: 600
    },
    announcement: "",
    announcementActive: false
};

function getShopItemPrice(itemKey) {
    const p = (window.APP_CONFIG && window.APP_CONFIG.prices) || {};
    if (itemKey === 'hint5050') return parseInt(p.hint5050) || 20;
    if (itemKey === 'addTime') return parseInt(p.addTime) || 15;
    if (itemKey === 'skip') return parseInt(p.skip) || 30;
    if (itemKey === 'dailyFreeReward') return parseInt(p.dailyFreeReward) || 30;
    if (itemKey === 'wheelExtraSpin') return parseInt(p.wheelExtraSpin) || 25;
    return 20;
}
window.getShopItemPrice = getShopItemPrice;

function getCustomItemPrice(itemId, defaultPrice = 0) {
    const cp = (window.APP_CONFIG && window.APP_CONFIG.customPrices) || {};
    if (cp && cp[itemId] !== undefined) {
        return parseInt(cp[itemId]) || defaultPrice;
    }
    return defaultPrice;
}
window.getCustomItemPrice = getCustomItemPrice;

// js/config.js - إعدادات النظام، التهيئة، والمتغيرات العامة

var SHEET_CSV_URL = window.SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmve4Q3DU8ITcd4p6CYlEUiP4fvwLGRAevzmiBHwluw_J7k_NTa9pLWoxrHKme0cmlrQqZ2wA8VwlC/pub?gid=0&single=true&output=csv";

// إعدادات Firebase
var firebaseConfig = window.firebaseConfig = {
    apiKey: "AIzaSyDELtkkAkxym1CospHaGdLt6TNCEKZAc1A",
    authDomain: "law-te3raf.firebaseapp.com",
    projectId: "law-te3raf",
    storageBucket: "law-te3raf.firebasestorage.app",
    messagingSenderId: "613977492704",
    appId: "1:613977492704:web:53bb5863f419750c9dd485",
    measurementId: "G-RFXCZ62K8F"
};

let auth = null;
let db = null;

if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        db = firebase.firestore();

        if (db && db.enablePersistence) {
            db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
        }

        if (typeof firebase.analytics === 'function') {
            firebase.analytics();
        }
    } catch (e) {
        console.warn('Firebase init warning:', e);
    }
}

// المتغيرات العامة للحالة
var currentUser = null;
window.currentUser = currentUser;

var gameState = window.gameState = {
    currentScreen: 'auth-screen',
    mode: 'endless',
    selectedCategory: '',
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    lives: 3,
    timer: 15,
    timerInterval: null,
    isAnswered: false,
    usedPowerupInSession: false,
    sessionCorrectStreak: 0,
    sessionMistakes: [],
    leaderboardTab: 'ranked',
    pvpRoomId: null,
    isPvpHost: false,
    pvpUnsubscribe: null,
    pvpRoomData: null
};

// إعدادات عجلة الحظ
var WHEEL_SECTORS = window.WHEEL_SECTORS = [
    { label: "15 عملة", type: "coins", value: 15, color: "#3b82f6" },
    { label: "50:50", type: "item", value: "hint5050", color: "#8b5cf6" },
    { label: "30 عملة", type: "coins", value: 30, color: "#10b981" },
    { label: "+10 ثواني", type: "item", value: "addTime", color: "#f59e0b" },
    { label: "50 عملة", type: "coins", value: 50, color: "#06b6d4" },
    { label: "تخطي", type: "item", value: "skip", color: "#ec4899" },
    { label: "150 عملة", type: "coins", value: 150, color: "#eab308" },
    { label: "20 عملة", type: "coins", value: 20, color: "#6366f1" }
];

var isWheelSpinning = false;
window.isWheelSpinning = isWheelSpinning;
var wheelCurrentAngle = 0;
window.wheelCurrentAngle = wheelCurrentAngle;

// إعدادات الإنجازات
var INFINITE_ACHIEVEMENTS = window.INFINITE_ACHIEVEMENTS = [
    {
        id: 'ach_correct',
        title: 'موسوعة المعرفة الكبرى',
        icon: 'fa-solid fa-brain',
        color: '#f59e0b',
        levels: [
            { target: 100, reward: 50, rewardName: '50 عملة' },
            { target: 300, reward: 150, rewardName: '150 عملة + لقب المفكر الذكي' },
            { target: 700, reward: 300, rewardName: '300 عملة' },
            { target: 1500, reward: 600, rewardName: '600 عملة + أفاتار صقر المعرفة الأسطوري 🦅' },
            { target: 2500, reward: 1200, rewardName: '1,200 عملة + شارة العبقرية الخالدة' }
        ],
        getProgress: (p) => p.totalCorrect || 0,
        desc: (target) => `أجب على ${target} سؤالاً بشكل صحيح عبر جميع أنماط اللعب.`
    },
    {
        id: 'ach_speed',
        title: 'السرعة الخاطفة',
        icon: 'fa-solid fa-bolt',
        color: '#38bdf8',
        levels: [
            { target: 25, reward: 40, rewardName: '40 عملة' },
            { target: 75, reward: 100, rewardName: '100 عملة' },
            { target: 150, reward: 250, rewardName: '250 عملة + لقب صاعقة السرعة ⚡' },
            { target: 200, reward: 500, rewardName: '500 عملة + أفاتار البرق الخاطف ⚡' }
        ],
        getProgress: (p) => p.fastAnswersCount || 0,
        desc: (target) => `أجب على ${target} سؤالاً بشكل صحيح خلال أقل من 3 ثوانٍ.`
    },
    {
        id: 'ach_pvp',
        title: 'سيد التحديات والرانك',
        icon: 'fa-solid fa-trophy',
        color: '#a855f7',
        levels: [
            { target: 10, reward: 50, rewardName: '50 عملة' },
            { target: 30, reward: 150, rewardName: '150 عملة' },
            { target: 60, reward: 350, rewardName: '350 عملة + لقب قاهر الرانك ⚔️' },
            { target: 100, reward: 800, rewardName: '800 عملة + أفاتار ملك التحديات 👑' }
        ],
        getProgress: (p) => p.rankedWins || 0,
        desc: (target) => `حقق الفوز في ${target} مباراة تصنيف (Ranked 1v1).`
    },
    {
        id: 'ach_streak',
        title: 'القناص الذي لا يخطئ',
        icon: 'fa-solid fa-fire',
        color: '#ef4444',
        levels: [
            { target: 3, reward: 30, rewardName: '30 عملة' },
            { target: 5, reward: 80, rewardName: '80 عملة' },
            { target: 7, reward: 200, rewardName: '200 عملة + لقب البروفيسور 🎓' },
            { target: 10, reward: 500, rewardName: '500 عملة + إطار اللهب الناري المتوهج 🔥' }
        ],
        getProgress: (p) => p.rankedWinStreak || 0,
        desc: (target) => `حقق سلسلة ${target} انتصارات متتالية في مباريات الرانك دون أي هزيمة.`
    },
    {
        id: 'ach_high_score',
        title: 'أسطورة الصمود',
        icon: 'fa-solid fa-infinity',
        color: '#10b981',
        levels: [
            { target: 50, reward: 40, rewardName: '40 عملة' },
            { target: 100, reward: 100, rewardName: '100 عملة' },
            { target: 200, reward: 250, rewardName: '250 عملة' },
            { target: 350, reward: 600, rewardName: '600 عملة' }
        ],
        getProgress: (p) => p.highScore || 0,
        desc: (target) => `حقق سكور ${target} نقطة في النمط اللانهائي.`
    }
];

// أيقونات وتنسيقات الأقسام
var CATEGORY_STYLES = window.CATEGORY_STYLES = {
    'إسلاميات': { icon: 'fa-solid fa-kaaba', color: '#10b981' },
    'رياضة وكورة': { icon: 'fa-solid fa-futbol', color: '#3b82f6' },
    'علوم وفضاء': { icon: 'fa-solid fa-atom', color: '#8b5cf6' },
    'تاريخ': { icon: 'fa-solid fa-landmark', color: '#f59e0b' },
    'جغرافيا': { icon: 'fa-solid fa-earth-americas', color: '#06b6d4' },
    'سينما وفن': { icon: 'fa-solid fa-clapperboard', color: '#ec4899' },
    'طبيعة وحيوانات': { icon: 'fa-solid fa-paw', color: '#84cc16' },
    'تكنولوجيا وألعاب': { icon: 'fa-solid fa-gamepad', color: '#6366f1' },
    'أدب ولغات': { icon: 'fa-solid fa-book', color: '#14b8a6' },
    'ألغاز وذكاء': { icon: 'fa-solid fa-puzzle-piece', color: '#f97316' },
    'سيارات ومحركات': { icon: 'fa-solid fa-car-side', color: '#ef4444' },
    'معلومات عامة': { icon: 'fa-solid fa-lightbulb', color: '#eab308' }
};

var ENDLESS_REPEAT_COOLDOWN_MS = window.ENDLESS_REPEAT_COOLDOWN_MS = 5 * 24 * 60 * 60 * 1000;

// البنية الافتراضية الشاملة لتقدم المستخدم
var DEFAULT_USER_PROGRESS = window.DEFAULT_USER_PROGRESS = {
    coins: 50,
    highScore: 0,
    dailyStreak: 0,
    lastDailyDate: '',
    lastWheelDate: '',
    lastFreeRewardDate: '',
    seenQuestions: [],
    inventory: { hint5050: 1, addTime: 1, skip: 1 },
    totalCorrect: 0,
    maxCorrectStreak: 0,
    fastAnswersCount: 0,
    pvpWins: 0,
    itemsPurchased: 0,
    infiniteLevels: {},
    claimedInfiniteLevels: {},
    endlessSeenAt: {},
    rankTier: 'iron',
    rankStars: 0,
    rankedWins: 0,
    rankedLosses: 0,
    rankedWinStreak: 0,
    highestRankTier: 'iron'
};

var userProgress = window.userProgress = { ...DEFAULT_USER_PROGRESS };

function ensureUserProgressIntegrity() {
    if (!userProgress || typeof userProgress !== 'object') {
        userProgress = { ...DEFAULT_USER_PROGRESS };
    }
    for (let key in DEFAULT_USER_PROGRESS) {
        if (userProgress[key] === undefined || userProgress[key] === null) {
            if (typeof DEFAULT_USER_PROGRESS[key] === 'object' && !Array.isArray(DEFAULT_USER_PROGRESS[key])) {
                userProgress[key] = { ...DEFAULT_USER_PROGRESS[key] };
            } else if (Array.isArray(DEFAULT_USER_PROGRESS[key])) {
                userProgress[key] = [...DEFAULT_USER_PROGRESS[key]];
            } else {
                userProgress[key] = DEFAULT_USER_PROGRESS[key];
            }
        }
    }
    if (!userProgress.inventory) userProgress.inventory = { hint5050: 1, addTime: 1, skip: 1 };
    if (!userProgress.infiniteLevels) userProgress.infiniteLevels = {};
    if (!userProgress.claimedInfiniteLevels) userProgress.claimedInfiniteLevels = {};
    if (!userProgress.seenQuestions) userProgress.seenQuestions = [];
    if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};
}

// محاولة قراءة التقدم المحفوظ محلياً مع ضمان سلامة البيانات
try {
    const saved = localStorage.getItem('law_ta3raf_progress');
    if (saved) {
        userProgress = { ...userProgress, ...JSON.parse(saved) };
    }
} catch(e) {}
ensureUserProgressIntegrity();

// استعادة الجلسة المحفوظة أوفلاين إن وجدت
try {
    const savedOfflineGuest = localStorage.getItem('local_offline_guest');
    if (savedOfflineGuest) {
        currentUser = JSON.parse(savedOfflineGuest);
    }
} catch(e) {}

// دوال المساعدة الأساسية
function showCustomAlert(message, title = 'تنبيه', icon = '💡') {
    const modal = document.getElementById('custom-modal');
    const titleElem = document.getElementById('custom-modal-title');
    const msgElem = document.getElementById('custom-modal-msg');
    const iconElem = document.getElementById('custom-modal-icon');
    if (!modal) {
        window.alert(message);
        return;
    }
    if (titleElem) titleElem.innerText = title;
    if (msgElem) msgElem.innerText = message;
    if (iconElem) iconElem.innerText = icon;
    modal.classList.add('show');
}

function closeCustomAlert() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

let currentConfirmCallback = null;
let currentCancelCallback = null;

function showCustomConfirm(message, onConfirm, onCancel = null, title = 'تأكيد الإجراء', confirmText = 'نعم', cancelText = 'إلغاء', icon = '⚠️') {
    const modal = document.getElementById('custom-confirm-modal');
    const titleElem = document.getElementById('custom-confirm-title');
    const msgElem = document.getElementById('custom-confirm-msg');
    const iconElem = document.getElementById('custom-confirm-icon');
    const okBtn = document.getElementById('custom-confirm-ok-btn');
    const cancelBtn = document.getElementById('custom-confirm-cancel-btn');

    currentConfirmCallback = onConfirm;
    currentCancelCallback = onCancel;

    if (!modal) {
        if (window.confirm(message)) {
            if (onConfirm) onConfirm();
        } else {
            if (onCancel) onCancel();
        }
        return;
    }

    if (titleElem) titleElem.innerText = title;
    if (msgElem) msgElem.innerText = message;
    if (iconElem) iconElem.innerText = icon;
    if (okBtn) okBtn.innerText = confirmText;
    if (cancelBtn) cancelBtn.innerText = cancelText;

    modal.classList.add('show');
}

function closeCustomConfirm(isConfirmed) {
    const modal = document.getElementById('custom-confirm-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    if (isConfirmed) {
        if (typeof currentConfirmCallback === 'function') {
            currentConfirmCallback();
        }
    } else {
        if (typeof currentCancelCallback === 'function') {
            currentCancelCallback();
        }
    }
    currentConfirmCallback = null;
    currentCancelCallback = null;
}

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getAchGoal(ach, level) { 
    return ach.baseGoal + (level * ach.stepGoal); 
}

function getAchReward(ach, level) { 
    return ach.baseReward + (level * ach.stepReward); 
}

function saveProgress() {
    ensureUserProgressIntegrity();
    localStorage.setItem('law_ta3raf_progress', JSON.stringify(userProgress));

    if (db && currentUser && currentUser.uid && !currentUser.isOffline) {
        const displayName = currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب');
        const photoURL = currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

        db.collection('users').doc(currentUser.uid).set({
            name: displayName,
            photoURL: photoURL,
            isAnonymous: currentUser.isAnonymous,
            highScore: userProgress.highScore || 0,
            pvpWins: userProgress.pvpWins || 0,
            totalCorrect: userProgress.totalCorrect || 0,
            rankTier: userProgress.rankTier || 'iron',
            rankStars: userProgress.rankStars || 0,
            rankedWins: userProgress.rankedWins || 0,
            progress: userProgress,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(() => {});
    }
}

async function loadCloudProgress(uid) {
    if (!db) return;
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists && doc.data().progress) {
            userProgress = { ...userProgress, ...doc.data().progress };
            ensureUserProgressIntegrity();
            localStorage.setItem('law_ta3raf_progress', JSON.stringify(userProgress));
        } else {
            saveProgress();
        }
    } catch (e) {
        console.warn('Error loading cloud progress:', e);
    }
}


// js/audio.js - محرك المؤثرات الصوتية والاهتزاز الهادئ للعبة "لَو تِعرَف"

var AudioEngine = window.AudioEngine = {
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
    
    // صوت انفجار الألعاب النارية والشرارات
    playSparkle() {
        if (!this.isSoundEnabled()) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(900 + Math.random() * 400, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    },

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


// js/questions-engine.js - إدارة جلب الأسئلة من الشيت والنمط اللانهائي

function getActiveQuestionsBank() {
    if (window.questionsBank && window.questionsBank.length > 0) {
        return window.questionsBank;
    }
    const cached = localStorage.getItem('cached_questions_bank');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.length > 0) {
                window.questionsBank = parsed;
                return parsed;
            }
        } catch (e) {
            console.error('Cache parse error:', e);
        }
    }
    return window.questionsBank || [];
}

function getEndlessQuestionQueue() {
    if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};

    const fullBank = getActiveQuestionsBank();
    const now = Date.now();

    Object.keys(userProgress.endlessSeenAt).forEach(id => {
        if (now - userProgress.endlessSeenAt[id] > ENDLESS_REPEAT_COOLDOWN_MS) {
            delete userProgress.endlessSeenAt[id];
        }
    });

    const fresh = fullBank.filter(q => !userProgress.endlessSeenAt[q.id]);
    const stale = fullBank
        .filter(q => userProgress.endlessSeenAt[q.id])
        .sort((a, b) => userProgress.endlessSeenAt[a.id] - userProgress.endlessSeenAt[b.id]);

    return [...shuffleArray(fresh), ...stale];
}

async function loadQuestionsFromPublishedSheet() {
    try {
        const freshUrl = `${SHEET_CSV_URL}&t=${Date.now()}`;
        const response = await fetch(freshUrl);
        if (!response.ok) return;

        const csvText = await response.text();
        const parsedQuestions = parseSheetCSV(csvText);

        if (parsedQuestions.length > 0) {
            window.questionsBank = parsedQuestions;
            localStorage.setItem('cached_questions_bank', JSON.stringify(parsedQuestions));
        }
    } catch (err) {
        const cached = localStorage.getItem('cached_questions_bank');
        if (cached) {
            window.questionsBank = JSON.parse(cached);
        }
    }
}

function parseSheetCSV(text) {
    const lines = text.split(/\r?\n/);
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 9 || !cols[3]) continue;

        questions.push({
            id: parseInt(cols[0]) || i,
            category: cols[1] || 'عام',
            difficulty: parseInt(cols[2]) || 1,
            question: cols[3],
            options: [cols[4] || '', cols[5] || '', cols[6] || '', cols[7] || ''],
            correct: parseInt(cols[8]) || 0,
            image: cols[9] ? cols[9].trim() : '',
            author: cols[10] ? cols[10].trim() : ''
        });
    }
    return questions;
}

function getSmartQuestions(count = 10, categoryFilter = null) {
    if (!userProgress.seenQuestions) userProgress.seenQuestions = [];

    const bank = getActiveQuestionsBank();
    let pool = categoryFilter 
        ? bank.filter(q => q.category === categoryFilter)
        : [...bank];

    let available = pool.filter(q => !userProgress.seenQuestions.includes(q.id));

    if (available.length < count) {
        const poolIds = pool.map(q => q.id);
        userProgress.seenQuestions = userProgress.seenQuestions.filter(id => !poolIds.includes(id));
        saveProgress();
        available = [...pool];
    }

    const shuffledAvailable = shuffleArray(available);
    const selected = shuffledAvailable.slice(0, count);

    selected.forEach(q => {
        if (!userProgress.seenQuestions.includes(q.id)) {
            userProgress.seenQuestions.push(q.id);
        }
    });
    saveProgress();

    return selected;
}


// --- محرك الذكاء الاصطناعي السلوكي المتطور لمنافسي الرانك (Behavioral AI Rivals) ---

const SMART_RIVAL_NAMES = [
    "أحمد الشناوي", "سارة محمود", "عمر الفاروق", "نور الدين", "مريم خالد",
    "كريم يوسف", "ياسمين عادل", "حمزة طارق", "فاطمة الزهراء", "زياد إبراهيم",
    "كابتن حازم", "منى سليم", "طارق العوضي", "هند مصطفى", "رامي صبري",
    "د. آية رضوان", "مهند الشافعي", "ليلى عبد الله", "أنس البحيري", "سلمى النجار",
    "خالد العقاد", "ريم الجابري", "حسام عاشور", "ندى إيهاب", "إبراهيم الجمل"
];

const ALL_GAME_CATEGORIES = [
    'إسلاميات', 'رياضة وكورة', 'علوم وفضاء', 'تاريخ', 'جغرافيا', 'سينما وفن',
    'طبيعة وحيوانات', 'تكنولوجيا وألعاب', 'أدب ولغات', 'سيارات ومحركات', 'ألغاز وذكاء', 'معلومات عامة'
];

function generateSmartRivalProfile(oppRank, oppDiv) {
    const name = SMART_RIVAL_NAMES[Math.floor(Math.random() * SMART_RIVAL_NAMES.length)];
    
    // اختيار أفاتار وإطار ولقب عشوائي من قاعدة البيانات الأصلية للعبة
    const avatars = (typeof AVATARS_DB !== 'undefined' && AVATARS_DB.length > 0) ? AVATARS_DB : [{ src: './assets/avatars/avatar_warrior.svg' }];
    const frames = (typeof FRAMES_DB !== 'undefined' && FRAMES_DB.length > 0) ? FRAMES_DB : [{ overlaySvg: '' }];
    const titles = (typeof TITLES_DB !== 'undefined' && TITLES_DB.length > 0) ? TITLES_DB : [{ title: 'لاعب' }];

    const randomAv = avatars[Math.floor(Math.random() * avatars.length)];
    const randomFr = frames[Math.floor(Math.random() * frames.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)].title;

    // تحديد أسلوب اللعب السلوكي (Playstyle)
    const playstyles = ['rusher', 'tactician', 'streaker'];
    const playstyle = playstyles[Math.floor(Math.random() * playstyles.length)];

    // تحديد تخصص وقوة المنافس في قسم أو قسمين
    const shuffledCats = [...ALL_GAME_CATEGORIES].sort(() => Math.random() - 0.5);
    const favoredCats = [shuffledCats[0], shuffledCats[1]];
    const weakCat = shuffledCats[2];

    // تحديد زمن التفكير والدقة حسب رتبة المنافس وأسلوب لعبه
    let baseAccuracy = Math.min(0.92, 0.52 + (oppRank.tier * 0.042));
    let minTime = Math.max(1.4, 4.2 - (oppRank.tier * 0.25));
    let maxTime = Math.max(2.6, 6.2 - (oppRank.tier * 0.3));

    if (playstyle === 'rusher') {
        minTime = Math.max(1.2, minTime * 0.65);
        maxTime = Math.max(2.2, maxTime * 0.7);
        baseAccuracy -= 0.06;
    } else if (playstyle === 'tactician') {
        minTime = minTime * 1.25;
        maxTime = maxTime * 1.3;
        baseAccuracy += 0.07;
    }

    return {
        name: name,
        avatar: randomAv.src,
        frameOverlay: randomFr.overlaySvg || '',
        title: randomTitle,
        rank: oppRank,
        division: oppDiv,
        playstyle: playstyle,
        favoredCats: favoredCats,
        weakCat: weakCat,
        baseAccuracy: Math.min(0.94, Math.max(0.45, baseAccuracy)),
        minTime: minTime,
        maxTime: maxTime,
        score: 0,
        correctCount: 0,
        answeredIndex: 0,
        streak: 0,
        answersHistory: []
    };
}

// دالة حساب القوة الترتيبية للرانك لترتيب لوحة المتصدرين بدقة فائقة
function calculateRankSortWeight(prog) {
    if (!prog) return 0;
    const rankTier = prog.rankTier || 'iron';
    const tierConfig = (typeof RANKS_CONFIG !== 'undefined') ? (RANKS_CONFIG.find(r => r.id === rankTier) || RANKS_CONFIG[0]) : { tier: 1, divisions: 3 };
    const tierNum = tierConfig.tier || 1;
    
    // دوريات القمة (Master, Grandmaster, Challenger) تعتمد على نقاط الـ LP
    if (tierConfig.isApex) {
        const lp = prog.rankLP || 0;
        return (tierNum * 1000000) + lp;
    }
    
    // الدوريات العادية من الحديدي للماسي
    const totalDivs = tierConfig.divisions || 3;
    const currentDiv = (prog.rankDivision !== undefined) ? prog.rankDivision : totalDivs;
    const divScore = Math.max(0, totalDivs - currentDiv);
    const stars = prog.rankStars || 0;
    
    return (tierNum * 10000) + (divScore * 100) + stars;
}
window.calculateRankSortWeight = calculateRankSortWeight;

// js/ranked.js - محرك دوريات التصنيف المتدرج (Ranked Divisions) والمواسم الشهرية والبحث السريع 1v1

var RANKS_CONFIG = window.RANKS_CONFIG = [
    { id: 'iron', name: 'الحديدي', tier: 1, divisions: 3, starsPerDiv: 3, color: '#94a3b8', icon: 'fa-solid fa-shield', protectLoss: true },
    { id: 'bronze', name: 'البرونزي', tier: 2, divisions: 3, starsPerDiv: 3, color: '#cd7f32', icon: 'fa-solid fa-shield-halved', protectLoss: true },
    { id: 'silver', name: 'الفضي', tier: 3, divisions: 3, starsPerDiv: 3, color: '#e2e8f0', icon: 'fa-solid fa-shield-heart', protectLoss: false },
    { id: 'gold', name: 'الذهبي', tier: 4, divisions: 4, starsPerDiv: 4, color: '#f59e0b', icon: 'fa-solid fa-award', protectLoss: false },
    { id: 'platinum', name: 'البلاتيني', tier: 5, divisions: 4, starsPerDiv: 4, color: '#06b6d4', icon: 'fa-solid fa-gem', protectLoss: false },
    { id: 'emerald', name: 'الزمردي', tier: 6, divisions: 4, starsPerDiv: 4, color: '#10b981', icon: 'fa-solid fa-clover', protectLoss: false },
    { id: 'diamond', name: 'الماسي', tier: 7, divisions: 4, starsPerDiv: 5, color: '#38bdf8', icon: 'fa-solid fa-diamond', protectLoss: false },
    { id: 'master', name: 'أستاذ', tier: 8, divisions: 1, starsPerDiv: 999, isApex: true, color: '#a855f7', icon: 'fa-solid fa-chess-knight', protectLoss: false },
    { id: 'grandmaster', name: 'أستاذ أعظم', tier: 9, divisions: 1, starsPerDiv: 999, isApex: true, color: '#ef4444', icon: 'fa-solid fa-fire-flame-curved', protectLoss: false },
    { id: 'challenger', name: 'متحدي أسطوري', tier: 10, divisions: 1, starsPerDiv: 999, isApex: true, color: '#fbbf24', icon: 'fa-solid fa-trophy', protectLoss: false }
];

var SMART_RIVALS_POOL = window.SMART_RIVALS_POOL = [
    { name: "أحمد الشناوي", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
    { name: "سارة محمود", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png" },
    { name: "عمر الفاروق", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" },
    { name: "نور الدين", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png" },
    { name: "مريم خالد", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135805.png" },
    { name: "كريم يوسف", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png" },
    { name: "ياسمين عادل", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135798.png" },
    { name: "حمزة طارق", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135728.png" },
    { name: "فاطمة الزهراء", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135784.png" },
    { name: "زياد إبراهيم", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135773.png" }
];

let matchmakingInterval = null;
let matchmakingTimer = 0;
let isMatchmakingActive = false;
let currentRankedOpponent = null;
let opponentSimTimeout = null;
let isPlayerWaitingForOpponent = false;

// تحويل الأرقام إلى عربية
function toArabicNumerals(num) {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, w => arabicNums[+w]);
}

function getRankData(rankId) {
    return RANKS_CONFIG.find(r => r.id === rankId) || RANKS_CONFIG[0];
}

function getRankIndex(rankId) {
    const idx = RANKS_CONFIG.findIndex(r => r.id === rankId);
    return idx !== -1 ? idx : 0;
}

function getUserCurrentRank() {
    if (!userProgress.rankTier) userProgress.rankTier = 'iron';
    const rankData = getRankData(userProgress.rankTier);
    if (!userProgress.rankDivision || userProgress.rankDivision > rankData.divisions) {
        userProgress.rankDivision = rankData.divisions;
    }
    if (userProgress.rankStars === undefined) userProgress.rankStars = 0;
    if (userProgress.rankLP === undefined) userProgress.rankLP = 0;
    return rankData;
}

function formatUserFullRankName(progress = userProgress) {
    const rk = getRankData(progress.rankTier || 'iron');
    if (rk.isApex) {
        return `${rk.name}`;
    }
    const divNum = progress.rankDivision || rk.divisions;
    return `${rk.name} ${toArabicNumerals(divNum)}`;
}

// --- نظام المواسم والعد التنازلي والـ Soft Reset ---
function getCurrentSeasonInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const seasonId = `season_${year}_${String(month).padStart(2, '0')}`;

    // نهاية الشهر الحالي عند الساعة 23:59:59
    const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);
    const diffMs = lastDayOfMonth - now;

    const daysLeft = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const hoursLeft = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

    return {
        seasonId: seasonId,
        monthName: now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }),
        daysLeft: daysLeft,
        hoursLeft: hoursLeft,
        timeRemainingText: `${daysLeft} يوماً و ${hoursLeft} ساعة`
    };
}

function checkAndApplySeasonReset() {
    const seasonInfo = getCurrentSeasonInfo();
    if (!userProgress.currentSeasonId) {
        userProgress.currentSeasonId = seasonInfo.seasonId;
        saveProgress();
        return;
    }

    // إذا بدأ شهر جديد وموسم جديد، تطبيق الـ Soft Reset (تراجع 4 درجات)
    if (userProgress.currentSeasonId !== seasonInfo.seasonId) {
        const currentRank = getUserCurrentRank();
        const currentIdx = getRankIndex(currentRank.id);

        // التراجع 4 مستويات للوراء
        const targetIdx = Math.max(0, currentIdx - 4);
        const targetRank = RANKS_CONFIG[targetIdx];

        userProgress.rankTier = targetRank.id;
        userProgress.rankDivision = targetRank.divisions;
        userProgress.rankStars = 0;
        userProgress.rankLP = 0;
        userProgress.rankedWinStreak = 0;
        userProgress.currentSeasonId = seasonInfo.seasonId;

        saveProgress();

        setTimeout(() => {
            showCustomAlert(`🏆 بدأ موسم تنافسي جديد (${seasonInfo.monthName})! تم تحديث التصنيف لتبدأ رحلة الصعود في دوري [ ${formatUserFullRankName()} ]. بالتوفيق!`, 'موسم جديد!', '⚡');
        }, 1500);
    }
}

function openRankedInfoModal() {
    const modal = document.getElementById('ranked-info-modal');
    const ranksListElem = document.getElementById('ranked-tiers-list');
    const seasonBannerElem = document.getElementById('ranked-modal-season-text');
    const seasonInfo = getCurrentSeasonInfo();

    if (seasonBannerElem) {
        seasonBannerElem.innerText = `الموسم الحالي: ${seasonInfo.monthName} (ينتهي خلال ${seasonInfo.timeRemainingText})`;
    }

    if (ranksListElem) {
        ranksListElem.innerHTML = '';
        const currentRank = getUserCurrentRank();

        RANKS_CONFIG.forEach(r => {
            const isCurrent = (r.id === currentRank.id);
            const card = document.createElement('div');
            card.className = `ranked-tier-card ${isCurrent ? 'current-tier' : ''}`;

            card.innerHTML = `
                <div class="ranked-tier-icon" style="color: ${r.color};"><i class="${r.icon}"></i></div>
                <div class="ranked-tier-details">
                    <h4>${r.name} ${isCurrent ? `<span class="tier-curr-badge">${formatUserFullRankName()}</span>` : ''}</h4>
                </div>
            `;
            ranksListElem.appendChild(card);
        });
    }

    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeRankedInfoModal() {
    const modal = document.getElementById('ranked-info-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

// بدء البحث السريع عن منافس
function startRankedMatchmaking() {
    if (!navigator.onLine) {
        showCustomAlert('يجب أن تكون متصلاً بالإنترنت للعب مباريات التصنيف!', 'تنبيه', '📶');
        return;
    }

    checkAndApplySeasonReset();

    isMatchmakingActive = true;
    matchmakingTimer = 0;
    isPlayerWaitingForOpponent = false;

    const modal = document.getElementById('matchmaking-overlay');
    const timerElem = document.getElementById('mm-timer-text');
    const rankElem = document.getElementById('mm-player-rank-badge');
    const userRank = getUserCurrentRank();

    if (rankElem) {
        rankElem.innerHTML = `<span style="color: ${userRank.color};"><i class="${userRank.icon}"></i> ${formatUserFullRankName()}</span>`;
    }

    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    if (timerElem) timerElem.innerText = '00:00';

    clearInterval(matchmakingInterval);
    matchmakingInterval = setInterval(() => {
        matchmakingTimer++;
        const mins = String(Math.floor(matchmakingTimer / 60)).padStart(2, '0');
        const secs = String(matchmakingTimer % 60).padStart(2, '0');
        if (timerElem) timerElem.innerText = `${mins}:${secs}`;

        // إيجاد منافس ذكي مناسب بعد 3 إلى 5 ثوانٍ
        if (matchmakingTimer >= 4) {
            clearInterval(matchmakingInterval);
            foundRankedMatch();
        }
    }, 1000);
}

function cancelRankedMatchmaking() {
    isMatchmakingActive = false;
    clearInterval(matchmakingInterval);
    const modal = document.getElementById('matchmaking-overlay');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function foundRankedMatch() {
    if (!isMatchmakingActive) return;
    isMatchmakingActive = false;

    const userRank = getUserCurrentRank();
    const userIdx = getRankIndex(userRank.id);

    // اختيار رتبة ومستوى تقسيم مقارب للمنافس
    const opponentIdx = Math.max(0, Math.min(RANKS_CONFIG.length - 1, userIdx + (Math.random() > 0.65 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
    const oppRank = RANKS_CONFIG[opponentIdx];
    const oppDiv = oppRank.isApex ? 1 : (Math.floor(Math.random() * oppRank.divisions) + 1);

    currentRankedOpponent = generateSmartRivalProfile(oppRank, oppDiv);

    const modal = document.getElementById('matchmaking-overlay');
    if (modal) modal.classList.remove('show');

    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showRankedVersusScreen(currentRankedOpponent);
}

function showRankedVersusScreen(opponent) {
    const myNameElem = document.getElementById('vs-my-name');
    const myAvatarElem = document.getElementById('vs-my-avatar');
    const myRankElem = document.getElementById('vs-my-rank');

    const oppNameElem = document.getElementById('vs-opp-name');
    const oppAvatarElem = document.getElementById('vs-opp-avatar');
    const oppRankElem = document.getElementById('vs-opp-rank');

    const myRank = getUserCurrentRank();

    if (myNameElem) myNameElem.innerText = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'أنت';
    if (myAvatarElem) {
        const myAv = (typeof AVATARS_DB !== 'undefined' && AVATARS_DB.find(a => a.id === userProgress.equippedAvatar)) || { src: './assets/avatars/avatar_warrior.svg' };
        myAvatarElem.src = (currentUser && currentUser.photoURL) || myAv.src;
    }
    if (myRankElem) {
        myRankElem.innerHTML = `<span style="color: ${myRank.color};"><i class="${myRank.icon}"></i> ${formatUserFullRankName()} (${userProgress.rankStars || 0} ⭐)</span>`;
    }

    if (oppNameElem) oppNameElem.innerText = `${opponent.name} (${opponent.title})`;
    if (oppAvatarElem) oppAvatarElem.src = opponent.avatar;
    if (oppRankElem) {
        const oppRankTitle = opponent.rank.isApex ? opponent.rank.name : `${opponent.rank.name} ${toArabicNumerals(opponent.division)}`;
        oppRankElem.innerHTML = `<span style="color: ${opponent.rank.color};"><i class="${opponent.rank.icon}"></i> ${oppRankTitle}</span>`;
    }

    switchScreen('ranked-versus-screen', false);

    // بعد 2.4 ثانية ينطلق التحدي في شاشة اللعب
    setTimeout(() => {
        launchRankedGameSession();
    }, 2400);
}

function launchRankedGameSession() {
    gameState.mode = 'ranked';
    gameState.questions = getSmartQuestions(10); // 10 أسئلة سريعة ومكثفة
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];
    isPlayerWaitingForOpponent = false;

    currentRankedOpponent.score = 0;
    currentRankedOpponent.correctCount = 0;
    currentRankedOpponent.answeredIndex = 0;
    currentRankedOpponent.answersHistory = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'none';

    const oppWidget = document.getElementById('game-ranked-opp-bar');
    if (oppWidget) {
        oppWidget.style.display = 'flex';
        updateRankedOpponentUI();
    }

    switchScreen('game-screen');
    loadQuestion();
    startOpponentSimulation();
}

function startOpponentSimulation() {
    clearTimeout(opponentSimTimeout);

    function scheduleNextOpponentAnswer() {
        if (!currentRankedOpponent || currentRankedOpponent.answeredIndex >= 10) {
            if (isPlayerWaitingForOpponent) {
                setTimeout(finishRankedMatchSession, 600);
            }
            return;
        }

        const qIdx = currentRankedOpponent.answeredIndex;
        const currentQ = (gameState.questions && gameState.questions[qIdx]) ? gameState.questions[qIdx] : null;

        // 1. حساب الدقة بناءً على تخصص المنافس ونوع السؤال
        let currentAccuracy = currentRankedOpponent.baseAccuracy;
        let thinkMin = currentRankedOpponent.minTime;
        let thinkMax = currentRankedOpponent.maxTime;

        if (currentQ) {
            if (currentRankedOpponent.favoredCats.includes(currentQ.category)) {
                currentAccuracy = Math.min(0.96, currentAccuracy + 0.18); // متفوق في هذا القسم
                thinkMin = Math.max(1.1, thinkMin * 0.8);
            } else if (currentRankedOpponent.weakCat === currentQ.category) {
                currentAccuracy = Math.max(0.35, currentAccuracy - 0.20); // نقطة ضعف المنافس
                thinkMax = thinkMax * 1.35;
            }

            // صعوبة السؤال
            if (currentQ.difficulty >= 7) {
                currentAccuracy = Math.max(0.40, currentAccuracy - 0.10);
                thinkMin += 0.8;
                thinkMax += 1.5;
            }
        }

        // تأثير الحماس والسلسلة للمنافس الحماسي
        if (currentRankedOpponent.playstyle === 'streaker') {
            if (currentRankedOpponent.streak >= 2) {
                currentAccuracy = Math.min(0.95, currentAccuracy + 0.10);
                thinkMin = Math.max(1.2, thinkMin * 0.85);
            } else if (currentRankedOpponent.streak === 0 && currentRankedOpponent.answeredIndex > 0) {
                currentAccuracy = Math.max(0.45, currentAccuracy - 0.08); // تشتت بعد الخطأ
            }
        }

        // محاكاة زمن التفكير البشري الواقعي
        const answerDelay = (thinkMin + Math.random() * (thinkMax - thinkMin)) * 1000;

        opponentSimTimeout = setTimeout(() => {
            if (!currentRankedOpponent || currentRankedOpponent.answeredIndex >= 10) return;

            const isCorrect = Math.random() <= currentAccuracy;
            const timeRemainingRatio = Math.max(0.1, 1 - (answerDelay / 15000));
            const timeBonus = Math.floor(timeRemainingRatio * 10);

            if (!currentRankedOpponent.answersHistory) currentRankedOpponent.answersHistory = [];

            if (isCorrect) {
                currentRankedOpponent.correctCount++;
                currentRankedOpponent.streak = (currentRankedOpponent.streak || 0) + 1;
                currentRankedOpponent.score += (100 + timeBonus * 10);
                currentRankedOpponent.answersHistory.push(true);

                // إطلاق تفاعل تلقائي من المنافس عند تحقيق سلسلة انتصارات
                if (currentRankedOpponent.streak === 3 && Math.random() > 0.4) {
                    setTimeout(() => spawnLiveReactionBubble('🔥', currentRankedOpponent.name, currentRankedOpponent.avatar), 400);
                } else if (currentRankedOpponent.streak >= 5 && Math.random() > 0.5) {
                    setTimeout(() => spawnLiveReactionBubble('🚀', currentRankedOpponent.name, currentRankedOpponent.avatar), 400);
                }
            } else {
                currentRankedOpponent.streak = 0;
                currentRankedOpponent.answersHistory.push(false);

                // إطلاق تفاعل بكاء أو صدمة عند الخطأ في الأسئلة الحاسمة
                if (currentRankedOpponent.answeredIndex >= 7 && Math.random() > 0.45) {
                    setTimeout(() => spawnLiveReactionBubble('😭', currentRankedOpponent.name, currentRankedOpponent.avatar), 500);
                }
            }

            currentRankedOpponent.answeredIndex++;
            updateRankedOpponentUI();

            if (isPlayerWaitingForOpponent) {
                updateWaitingOpponentUI();
            }

            if (currentRankedOpponent.answeredIndex < 10) {
                scheduleNextOpponentAnswer();
            } else if (isPlayerWaitingForOpponent) {
                setTimeout(finishRankedMatchSession, 800);
            }
        }, answerDelay);
    }

    scheduleNextOpponentAnswer();
}

function updateRankedOpponentUI() {
    const nameElem = document.getElementById('ranked-opp-live-name');
    const avatarElem = document.getElementById('ranked-opp-live-avatar');
    const scoreElem = document.getElementById('ranked-opp-live-score');
    const dotsContainer = document.getElementById('ranked-opp-dots');

    if (!currentRankedOpponent) return;

    if (nameElem) nameElem.innerText = currentRankedOpponent.name;
    if (avatarElem) avatarElem.src = currentRankedOpponent.avatar;
    if (scoreElem) scoreElem.innerText = `${currentRankedOpponent.score} نقطة`;

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('span');
            const state = currentRankedOpponent.answersHistory ? currentRankedOpponent.answersHistory[i] : undefined;
            if (state === true) {
                dot.className = 'opp-progress-dot correct-dot';
            } else if (state === false) {
                dot.className = 'opp-progress-dot wrong-dot';
            } else {
                dot.className = 'opp-progress-dot pending-dot';
            }
            dotsContainer.appendChild(dot);
        }
    }
}

function updateWaitingOpponentUI() {
    const oppNameElem = document.getElementById('rk-wait-opp-name');
    const oppAvatarElem = document.getElementById('rk-wait-opp-avatar');
    const oppStatusElem = document.getElementById('rk-wait-opp-status');
    const dotsContainer = document.getElementById('rk-wait-opp-dots');

    if (!currentRankedOpponent) return;

    if (oppNameElem) oppNameElem.innerText = currentRankedOpponent.name;
    if (oppAvatarElem) oppAvatarElem.src = currentRankedOpponent.avatar;
    if (oppStatusElem) {
        oppStatusElem.innerText = `أجاب على ${currentRankedOpponent.answeredIndex} من 10 أسئلة (${currentRankedOpponent.score} نقطة)...`;
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('span');
            const state = currentRankedOpponent.answersHistory ? currentRankedOpponent.answersHistory[i] : undefined;
            if (state === true) {
                dot.className = 'opp-progress-dot correct-dot';
            } else if (state === false) {
                dot.className = 'opp-progress-dot wrong-dot';
            } else {
                dot.className = 'opp-progress-dot pending-dot';
            }
            dotsContainer.appendChild(dot);
        }
    }
}

// معالجة نتيجة الترقية والنزول عبر التقسيمات والرتب
function finishRankedMatchSession() {
    clearTimeout(opponentSimTimeout);
    isPlayerWaitingForOpponent = false;

    while (currentRankedOpponent && currentRankedOpponent.answeredIndex < 10) {
        if (!currentRankedOpponent.answersHistory) currentRankedOpponent.answersHistory = [];
        const isCorrect = Math.random() <= currentRankedOpponent.accuracy;
        const timeBonus = Math.floor(Math.random() * 8) + 4;
        if (isCorrect) {
            currentRankedOpponent.correctCount++;
            currentRankedOpponent.score += (100 + timeBonus * 10);
            currentRankedOpponent.answersHistory.push(true);
        } else {
            currentRankedOpponent.answersHistory.push(false);
        }
        currentRankedOpponent.answeredIndex++;
    }

    const isWinner = (gameState.score > currentRankedOpponent.score) || 
                     (gameState.score === currentRankedOpponent.score && gameState.correctCount >= currentRankedOpponent.correctCount);

    const rankBefore = getUserCurrentRank();
    const divBefore = userProgress.rankDivision || rankBefore.divisions;
    const starsBefore = userProgress.rankStars || 0;

    let isPromoted = false;
    let isDemoted = false;
    let winStreakBonus = false;

    if (isWinner) {
        userProgress.rankedWins = (userProgress.rankedWins || 0) + 1;
        userProgress.rankedWinStreak = (userProgress.rankedWinStreak || 0) + 1;
        userProgress.coins = (userProgress.coins || 0) + 30;

        if (userProgress.rankedWinStreak >= 3) {
            winStreakBonus = true;
        }

        const starsEarned = winStreakBonus ? 2 : 1;

        if (rankBefore.isApex) {
            // رتب النخبة (أستاذ، أستاذ أعظم، متحدي) تعتمد على نقاط الـ LP
            const lpGain = Math.floor(Math.random() * 10) + 25; // +25 إلى +35 LP
            userProgress.rankLP = (userProgress.rankLP || 0) + lpGain;
            userProgress.rankStars = (userProgress.rankStars || 0) + 1;
        } else {
            userProgress.rankStars = (userProgress.rankStars || 0) + starsEarned;

            // هل وصل للحد الأقصى لنجوم التقسيم الحالي؟
            if (userProgress.rankStars >= rankBefore.starsPerDiv) {
                userProgress.rankStars = userProgress.rankStars - rankBefore.starsPerDiv;

                if (userProgress.rankDivision > 1) {
                    // الترقية للتقسيم الأعلى داخل نفس الرتبة (مثال: حديدي ٣ ➔ حديدي ٢)
                    userProgress.rankDivision--;
                    isPromoted = true;
                } else {
                    // الترقية للرتبة التالية بالكامل (مثال: حديدي ١ ➔ برونزي ٣)
                    const nextRankIdx = getRankIndex(rankBefore.id) + 1;
                    if (nextRankIdx < RANKS_CONFIG.length) {
                        const nextRank = RANKS_CONFIG[nextRankIdx];
                        userProgress.rankTier = nextRank.id;
                        userProgress.rankDivision = nextRank.divisions;
                        userProgress.highestRankTier = nextRank.id;
                        isPromoted = true;
                    }
                }
            }
        }
    } else {
        userProgress.rankedLosses = (userProgress.rankedLosses || 0) + 1;
        userProgress.rankedWinStreak = 0;

        if (rankBefore.isApex) {
            const lpLoss = Math.floor(Math.random() * 8) + 15;
            userProgress.rankLP = Math.max(0, (userProgress.rankLP || 0) - lpLoss);
        } else if (!rankBefore.protectLoss) {
            // من الفضي فما فوق يخصم نجوم
            if ((userProgress.rankStars || 0) > 0) {
                userProgress.rankStars = Math.max(0, userProgress.rankStars - 1);
            } else {
                // الهبوط للتقسيم الأدنى أو الرتبة السابقة عند 0 نجوم
                if (userProgress.rankDivision < rankBefore.divisions) {
                    userProgress.rankDivision++;
                    userProgress.rankStars = rankBefore.starsPerDiv - 1;
                    isDemoted = true;
                } else if (rankBefore.tier > 1) {
                    const prevRankIdx = getRankIndex(rankBefore.id) - 1;
                    const prevRank = RANKS_CONFIG[prevRankIdx];
                    userProgress.rankTier = prevRank.id;
                    userProgress.rankDivision = 1;
                    userProgress.rankStars = prevRank.starsPerDiv - 1;
                    isDemoted = true;
                }
            }
        }
    }

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();

    renderRankedResultScreen(isWinner, rankBefore, divBefore, starsBefore, isPromoted, isDemoted, winStreakBonus);
    if (isWinner && typeof EffectsEngine !== 'undefined') {
        EffectsEngine.launchVictoryFireworks();
    }
}

function renderRankedResultScreen(isWinner, rankBefore, divBefore, starsBefore, isPromoted, isDemoted, winStreakBonus) {
    const oppWidget = document.getElementById('game-ranked-opp-bar');
    if (oppWidget) oppWidget.style.display = 'none';

    switchScreen('ranked-result-screen', false);

    const iconElem = document.getElementById('rk-res-icon');
    const titleElem = document.getElementById('rk-res-title');
    const subElem = document.getElementById('rk-res-sub');

    const myScoreElem = document.getElementById('rk-my-final-score');
    const oppScoreElem = document.getElementById('rk-opp-final-score');
    const oppAvatarElem = document.getElementById('rk-res-opp-avatar');
    const oppNameElem = document.getElementById('rk-res-opp-name');

    const rankEmblemElem = document.getElementById('rk-res-rank-emblem');
    const rankTitleElem = document.getElementById('rk-res-rank-title');
    const starsContainer = document.getElementById('rk-res-stars-box');
    const streakBadge = document.getElementById('rk-streak-bonus-badge');

    const currentRank = getUserCurrentRank();

    if (isWinner) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
        iconElem.innerText = '🏆';
        titleElem.innerText = 'انتصار ساحق!';
        titleElem.style.color = 'var(--accent-yellow)';
        subElem.innerText = `تفوقت بجدارة على منافسك وحققت نقاطاً أعلى! (+30 عملة)`;
    } else {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        iconElem.innerText = '⚔️';
        titleElem.innerText = 'هزيمة!';
        titleElem.style.color = 'var(--accent-red)';
        subElem.innerText = `حاول مرة أخرى وركز في السرعة والدقة للتعويض!`;
    }

    if (myScoreElem) myScoreElem.innerText = `${gameState.score} نقطة (${gameState.correctCount}/10)`;
    if (oppScoreElem) oppScoreElem.innerText = `${currentRankedOpponent.score} نقطة (${currentRankedOpponent.correctCount}/10)`;
    if (oppAvatarElem) oppAvatarElem.src = currentRankedOpponent.avatar;
    if (oppNameElem) oppNameElem.innerText = currentRankedOpponent.name;

    if (rankEmblemElem) {
        rankEmblemElem.innerHTML = `<span style="font-size: 40px; color: ${currentRank.color};"><i class="${currentRank.icon}"></i></span>`;
    }
    if (rankTitleElem) {
        rankTitleElem.innerHTML = `<span style="color: ${currentRank.color}; font-weight: 900;">${formatUserFullRankName()}</span>`;
    }

    if (starsContainer) {
        starsContainer.innerHTML = '';
        if (!currentRank.isApex) {
            const maxStars = currentRank.starsPerDiv;
            const currentStars = userProgress.rankStars || 0;
            for (let i = 0; i < maxStars; i++) {
                const starSlot = document.createElement('span');
                starSlot.className = `rk-star-slot ${i < currentStars ? 'active-star' : ''}`;
                starSlot.innerHTML = '⭐';
                starsContainer.appendChild(starSlot);
            }
        } else {
            starsContainer.innerHTML = `<span style="font-weight: bold; color: var(--accent-yellow); font-size: 1.15rem;">${userProgress.rankLP || 0} نقطة تقييم LP 🔥</span>`;
        }
    }

    if (streakBadge) {
        if (winStreakBonus) {
            streakBadge.style.display = 'inline-block';
            streakBadge.innerText = `🔥 سلسلة انتصارات (${userProgress.rankedWinStreak})! +نجمة إضافية هدية!`;
        } else if (userProgress.rankedWinStreak > 1) {
            streakBadge.style.display = 'inline-block';
            streakBadge.innerText = `🔥 سلسلة انتصارات: ${userProgress.rankedWinStreak} متتالية!`;
        } else {
            streakBadge.style.display = 'none';
        }
    }

    if (isPromoted) {
        setTimeout(() => {
            showCustomAlert(`🎉 مبروك الترقية! لقد صعدت إلى تصنيف [ ${formatUserFullRankName()} ]! استمر نحو القمة!`, 'ترقية جديدة!', '🚀');
        }, 1200);
    }
}


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


// js/game.js - المحرك الأساسي للجولات، الأسئلة، والمساعدات

function startEndlessMode() {
    gameState.mode = 'endless';
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    gameState.questions = getEndlessQuestionQueue();
    
    switchScreen('game-screen');
    loadQuestion();
}



function checkDailyStatus() {
    const badge = document.getElementById('daily-status-badge');
    if (!badge) return;
    if (userProgress.lastDailyDate === getTodayString()) {
        badge.innerText = 'تم اليوم';
        badge.style.backgroundColor = 'var(--accent-green)';
    } else {
        badge.innerText = 'متاح';
        badge.style.backgroundColor = 'var(--accent-red)';
    }
}

function openDailyChallenge() {
    if (userProgress.lastDailyDate === getTodayString()) {
        showCustomAlert('لقد أنجزت تحدي اليوم بالفعل! عُد غداً لتحدٍ وجائزة جديدة.', 'التحدي اليومي', '⏳');
        return;
    }

    gameState.mode = 'daily';
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    gameState.questions = getSmartQuestions(10);
    switchScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    gameState.isAnswered = false;
    clearInterval(gameState.timerInterval);

    if (gameState.currentIndex >= gameState.questions.length && gameState.mode === 'endless') {
        gameState.questions = getEndlessQuestionQueue();
        gameState.currentIndex = 0;
    }

    const q = gameState.questions[gameState.currentIndex];
    if (!q) {
        finishGameSession();
        return;
    }

    if (gameState.mode === 'endless') {
        if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};
        userProgress.endlessSeenAt[q.id] = Date.now();
        saveProgress();
    }

    const progressLabel = document.getElementById('question-progress-label');
    if (progressLabel) {
        if (gameState.mode === 'endless') {
            progressLabel.innerHTML = `السؤال رقم <b>${gameState.currentIndex + 1}</b> (سلسلة صحيحة: ${gameState.correctCount})`;
        } else {
            progressLabel.innerHTML = `السؤال <span id="current-q-num">${gameState.currentIndex + 1}</span> من <span id="total-q-num">${gameState.questions.length}</span>`;
        }
    }

    document.getElementById('q-category').innerText = q.category;
    document.getElementById('question-text').innerText = q.question;

    // إظهار شارة تكريم صاحب السؤال إذا كان مقترحاً من أحد اللاعبين
    const authorBadge = document.getElementById('q-author-badge');
    const authorNameElem = document.getElementById('q-author-name');
    if (authorBadge && authorNameElem) {
        if (q.author && q.author.trim() !== '' && q.author.trim() !== '-') {
            authorNameElem.innerText = q.author.trim();
            authorBadge.style.display = 'inline-flex';
        } else {
            authorBadge.style.display = 'none';
        }
    }


    const imgBox = document.getElementById('question-image-box');
    const imgElem = document.getElementById('question-img');
    if (q.image && q.image.trim().startsWith('http')) {
        if (imgElem) {
            imgElem.src = q.image.trim();
        }
        if (imgBox) imgBox.style.display = 'block';
    } else {
        if (imgBox) imgBox.style.display = 'none';
        if (imgElem) imgElem.src = '';
    }

    renderLivesDisplay();
    startTimer();

    const isCompetitiveMode = (gameState.mode === 'ranked' || gameState.mode === 'pvp');

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) {
        pwrBar.style.display = isCompetitiveMode ? 'none' : 'flex';
    }
    if (!isCompetitiveMode) {
        updatePowerupButtons();
    }

    const reactTrigger = document.getElementById('game-reaction-trigger');
    if (reactTrigger) {
        reactTrigger.style.display = isCompetitiveMode ? 'flex' : 'none';
    }

    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
        btn.onclick = () => selectAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function renderLivesDisplay() {
    const container = document.getElementById('lives-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (gameState.mode === 'pvp') {
        container.innerHTML = `<span style="font-size: 0.85rem; color: var(--accent-pink); font-weight: 900;"><i class="fa-solid fa-users-rays"></i> تحدي الغرفة</span>`;
        return;
    }

    if (gameState.mode === 'ranked') {
        container.innerHTML = `<span style="font-size: 0.85rem; color: var(--accent-yellow); font-weight: 900;"><i class="fa-solid fa-trophy"></i> 10 أسئلة</span>`;
        return;
    }

    for (let i = 0; i < 3; i++) {
        const icon = document.createElement('i');
        icon.className = `fa-solid fa-heart ${i < gameState.lives ? '' : 'opacity-muted'}`;
        if (i >= gameState.lives) icon.style.opacity = '0.2';
        container.appendChild(icon);
    }
}

function startTimer() {
    gameState.timer = 15;
    const timerElem = document.getElementById('timer-count');
    if (!timerElem) return;
    timerElem.innerText = gameState.timer;

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timerElem.innerText = gameState.timer;

        if (gameState.timer <= 5 && gameState.timer > 0 && typeof AudioEngine !== 'undefined') {
            AudioEngine.playTick();
        }

        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            handleMistake(null, true);
        }
    }, 1000);
}

function selectAnswer(selectedIndex, btnElement) {
    if (gameState.isAnswered) return;
    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);

    const q = gameState.questions[gameState.currentIndex];
    const isCorrect = (selectedIndex === q.correct);

    // تسجيل إحصائيات دقة الأقسام بدقة تامة لجميع الإجابات (صحيحة وخاطئة)
    if (q && q.category) {
        if (!userProgress.categoryStats) userProgress.categoryStats = {};
        if (!userProgress.categoryStats[q.category]) {
            userProgress.categoryStats[q.category] = { total: 0, correct: 0 };
        }
        userProgress.categoryStats[q.category].total++;
        if (isCorrect) {
            userProgress.categoryStats[q.category].correct++;
        }
        saveProgress();
    }

    if (isCorrect) {

        if (typeof AudioEngine !== 'undefined') AudioEngine.playCorrect();
        btnElement.classList.add('correct');
        if (typeof EffectsEngine !== 'undefined') EffectsEngine.burstCorrectParticles(btnElement);
        btnElement.querySelector('i').className = 'fa-solid fa-circle-check';
        gameState.correctCount++;
        if (gameState.mode === 'ranked') {
            gameState.score += (100 + gameState.timer * 10);
        } else if (gameState.mode === 'pvp') {
            gameState.score += (10 + gameState.timer);
        } else {
            gameState.score += 10;
        }
        userProgress.coins += 2;
        userProgress.totalCorrect = (userProgress.totalCorrect || 0) + 1;

        if (gameState.timer >= 12) {
            userProgress.fastAnswersCount = (userProgress.fastAnswersCount || 0) + 1;
        }

        gameState.sessionCorrectStreak++;
        if (gameState.sessionCorrectStreak > userProgress.maxCorrectStreak) {
            userProgress.maxCorrectStreak = gameState.sessionCorrectStreak;
        }

        saveProgress();
        updateHeaderStats();
        checkAllAchievements();
        proceedNext();
    } else {
        btnElement.classList.add('wrong');
        btnElement.querySelector('i').className = 'fa-solid fa-circle-xmark';
        handleMistake(selectedIndex, false);
    }
}

function handleMistake(selectedIndex = null, isTimeout = false) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWrong();
    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);
    gameState.wrongCount++;

    // في حال انتهاء الوقت دون اختيار، يتم احتساب السؤال ضمن إجمالي أسئلة القسم
    if (isTimeout) {
        const qTimeout = gameState.questions[gameState.currentIndex];
        if (qTimeout && qTimeout.category) {
            if (!userProgress.categoryStats) userProgress.categoryStats = {};
            if (!userProgress.categoryStats[qTimeout.category]) {
                userProgress.categoryStats[qTimeout.category] = { total: 0, correct: 0 };
            }
            userProgress.categoryStats[qTimeout.category].total++;
            saveProgress();
        }
    }
    if (gameState.mode !== 'pvp' && gameState.mode !== 'ranked') {
        gameState.lives = Math.max(0, gameState.lives - 1);
    }
    gameState.sessionCorrectStreak = 0;

    const q = gameState.questions[gameState.currentIndex];
    if (q) {
        gameState.sessionMistakes.push({
            question: q.question,
            category: q.category,
            image: q.image || '',
            userAnswer: isTimeout ? 'انتهى الوقت دون إجابة' : (selectedIndex !== null ? q.options[selectedIndex] : 'لم يتم الاختيار'),
            correctAnswer: q.options[q.correct]
        });
    }

    renderLivesDisplay();
    revealCorrectAnswer();

    if (gameState.lives <= 0 && gameState.mode !== 'pvp' && gameState.mode !== 'ranked') {
        setTimeout(finishGameSession, 1200);
        return;
    }

    proceedNext();
}

function revealCorrectAnswer() {
    const q = gameState.questions[gameState.currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    if (buttons[q.correct]) {
        buttons[q.correct].classList.add('correct');
        buttons[q.correct].querySelector('i').className = 'fa-solid fa-circle-check';
    }
}

function proceedNext() {
    setTimeout(() => {
        gameState.currentIndex++;
        if (gameState.currentIndex >= gameState.questions.length) {
            finishGameSession();
        } else {
            loadQuestion();
        }
    }, 1200);
}

async function finishGameSession() {
    const reactDock = document.getElementById('game-reactions-dock');
    if (reactDock) reactDock.style.display = 'none';
    if (gameState.mode === 'ranked') {
        const oppWidget = document.getElementById('game-ranked-opp-bar');
        if (oppWidget) oppWidget.style.display = 'none';

        // فحص هل المنافس أنهى أسئلته الـ 5 كاملة أم لا يزال يجاوب
        if (typeof currentRankedOpponent !== 'undefined' && currentRankedOpponent && currentRankedOpponent.answeredIndex < 10) {
            isPlayerWaitingForOpponent = true;
            updateWaitingOpponentUI();
            switchScreen('ranked-waiting-opponent-screen', false);
            // أقصى مهلة انتظار أمان 8 ثوانٍ
            setTimeout(() => {
                if (isPlayerWaitingForOpponent) {
                    finishRankedMatchSession();
                }
            }, 8000);
            return;
        }

        if (typeof finishRankedMatchSession === 'function') {
            finishRankedMatchSession();
        }
        return;
    }

    if (gameState.mode === 'pvp') {
        await updatePvpPlayerFinalScore();
        switchScreen('pvp-waiting-opponent-screen');
        return;
    }

    switchScreen('result-screen');
    if (gameState.score >= 50 && typeof EffectsEngine !== 'undefined') {
        EffectsEngine.launchVictoryFireworks();
    }

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const reviewBtn = document.getElementById('review-mistakes-btn');

    document.getElementById('res-correct').innerText = gameState.correctCount;
    document.getElementById('res-wrong').innerText = gameState.wrongCount;

    if (reviewBtn) {
        if (gameState.sessionMistakes && gameState.sessionMistakes.length > 0) {
            reviewBtn.style.display = 'flex';
            reviewBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> مراجعة الأخطاء (${gameState.sessionMistakes.length})`;
        } else {
            reviewBtn.style.display = 'none';
        }
    }

    if (gameState.mode === 'endless') {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        resultIcon.innerText = '🔥';
        resultTitle.innerText = 'انتهت المحاولات!';
        resultMessage.innerText = `جمعت ${gameState.correctCount} إجابة صحيحة (${gameState.score} نقطة).`;

        if (gameState.score > userProgress.highScore) {
            userProgress.highScore = gameState.score;
            resultMessage.innerText += ' 🌟 رقم قياسي جديد!';
        }
    } else if (gameState.mode === 'daily') {
        if (gameState.correctCount >= 7) {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
            resultIcon.innerText = '👑';
            resultTitle.innerText = 'بطل اليوم!';
            resultMessage.innerText = 'أكملت التحدي اليومي بنجاح وزادت سلسلة أيامك!';
            userProgress.dailyStreak = (userProgress.dailyStreak || 0) + 1;
            userProgress.lastDailyDate = getTodayString();
            userProgress.coins += 25;
            checkDailyStatus();
        } else {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
            resultIcon.innerText = '⏳';
            resultTitle.innerText = 'فاتتك فرصة اليوم';
            resultMessage.innerText = 'حاولت في التحدي ولكن لم تصل لـ 7 إجابات صحيحة.';
        }
    } 

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();
}

function openReviewScreen() {
    const list = document.getElementById('review-list');
    if (!list) return;
    list.innerHTML = '';

    if (!gameState.sessionMistakes || gameState.sessionMistakes.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد أخطاء لمراجعتها!</p>';
    } else {
        gameState.sessionMistakes.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'review-card';
            const imgHtml = (item.image && item.image.startsWith('http')) 
                ? `<div class="review-img-box"><img src="${item.image}" alt="صورة السؤال" onclick="openImageZoomModal('${item.image}')"></div>` 
                : '';
            card.innerHTML = `
                <div class="review-header-tag"><i class="fa-solid fa-shapes"></i> ${item.category} (سؤال ${index + 1})</div>
                ${imgHtml}
                <h4>${item.question}</h4>
                <div class="review-answer-row">
                    <div><i class="fa-solid fa-xmark" style="color: var(--accent-red);"></i> إجابتك: <span class="user-mistake-val">${item.userAnswer}</span></div>
                    <div><i class="fa-solid fa-check" style="color: var(--accent-green);"></i> الإجابة الصحيحة: <span class="correct-answer-val">${item.correctAnswer}</span></div>
                </div>
            `;
            list.appendChild(card);
        });
    }

    switchScreen('review-screen');
}

function restartGame() {
    if (gameState.mode === 'endless') startEndlessMode();
    
    else switchScreen('modes-screen');
}

function updatePowerupButtons() {
    const btn50 = document.getElementById('btn-5050');
    const btnTime = document.getElementById('btn-time');
    const btnSkip = document.getElementById('btn-skip');

    const badge50 = document.getElementById('badge-5050');
    const badgeTime = document.getElementById('badge-time');
    const badgeSkip = document.getElementById('badge-skip');

    const has50 = (userProgress.inventory.hint5050 > 0);
    const hasTime = (userProgress.inventory.addTime > 0);
    const hasSkip = (userProgress.inventory.skip > 0);

    if (badge50) badge50.innerText = has50 ? `لديك (${userProgress.inventory.hint5050})` : '20 عملة';
    if (badgeTime) badgeTime.innerText = hasTime ? `لديك (${userProgress.inventory.addTime})` : '15 عملة';
    if (badgeSkip) badgeSkip.innerText = hasSkip ? `لديك (${userProgress.inventory.skip})` : '30 عملة';

    if (btn50) btn50.disabled = !has50 && userProgress.coins < 20;
    if (btnTime) btnTime.disabled = !hasTime && userProgress.coins < 15;
    if (btnSkip) btnSkip.disabled = !hasSkip && userProgress.coins < 30;
}

function use5050() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.hint5050 > 0) userProgress.inventory.hint5050--;
    else if (userProgress.coins >= 20) userProgress.coins -= 20;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    document.getElementById('btn-5050').disabled = true;

    const q = gameState.questions[gameState.currentIndex];
    const buttons = Array.from(document.querySelectorAll('.option-btn'));

    let wrongIndices = [];
    q.options.forEach((_, idx) => { if (idx !== q.correct) wrongIndices.push(idx); });

    wrongIndices = shuffleArray(wrongIndices);
    wrongIndices.slice(0, 2).forEach(idx => {
        if (buttons[idx]) buttons[idx].classList.add('hidden-option');
    });
}

function useAddTime() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.addTime > 0) userProgress.inventory.addTime--;
    else if (userProgress.coins >= 15) userProgress.coins -= 15;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    gameState.timer += 10;
    document.getElementById('timer-count').innerText = gameState.timer;
    document.getElementById('btn-time').disabled = true;
}

function useSkipQuestion() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.skip > 0) userProgress.inventory.skip--;
    else if (userProgress.coins >= 30) userProgress.coins -= 30;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);
    document.getElementById('btn-skip').disabled = true;

    proceedNext();
}

function openImageZoomModal(customSrc = null) {
    const modal = document.getElementById('image-zoom-modal');
    const zoomImg = document.getElementById('image-zoom-img');
    const qImg = document.getElementById('question-img');

    const src = customSrc || (qImg ? qImg.src : '');
    if (!src) return;

    if (zoomImg) zoomImg.src = src;
    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeImageZoomModal() {
    const modal = document.getElementById('image-zoom-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}


// js/pvp.js - نظام التحديات الأونلاين والغرف الجماعية

function openPvpLobbyScreen() {
    switchScreen('pvp-lobby-screen');
}

function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

async function createPvpRoom() {
    if (!currentUser) {
        showCustomAlert('يرجى تسجيل الدخول أولاً لتحدي أصدقائك!', 'تنبيه', '🔒');
        return;
    }

    const roomCode = generateRoomCode();
    gameState.pvpRoomId = roomCode;
    gameState.isPvpHost = true;

    const sharedQuestions = getSmartQuestions(10);

    const hostProfile = {
        uid: currentUser.uid,
        name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'المضيف'),
        avatar: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        score: 0,
        correctCount: 0,
        finished: false,
        isHost: true
    };

    const initialPlayers = {};
    initialPlayers[currentUser.uid] = hostProfile;

    try {
        await db.collection('pvp_rooms').doc(roomCode).set({
            code: roomCode,
            status: 'waiting',
            hostUid: currentUser.uid,
            players: initialPlayers,
            questions: sharedQuestions,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        openWaitingRoomUI(roomCode, true);
        listenToPvpRoom(roomCode);
    } catch (e) {
        showCustomAlert('حدث خطأ أثناء إنشاء الغرفة: ' + e.message, 'خطأ', '⚠️');
    }
}

async function joinPvpRoom() {
    if (!currentUser) {
        showCustomAlert('يرجى تسجيل الدخول أولاً!', 'تنبيه', '🔒');
        return;
    }

    const input = document.getElementById('pvp-room-code-input');
    const roomCode = input ? input.value.trim() : '';

    if (!roomCode || roomCode.length !== 5) {
        showCustomAlert('يرجى إدخال كود غرفة صحيح مكون من 5 أرقام!', 'تنبيه', '🔢');
        return;
    }

    try {
        const docRef = db.collection('pvp_rooms').doc(roomCode);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            showCustomAlert('الغرفة غير موجودة! تأكد من صحة الكود من صديقك.', 'خطأ', '❌');
            return;
        }

        const data = docSnap.data();
        if (data.status !== 'waiting') {
            showCustomAlert('عذراً، بدأت هذه المباراة بالفعل ولا يمكن الانضمام إليها الآن!', 'تنبيه', '⏳');
            return;
        }

        gameState.pvpRoomId = roomCode;
        gameState.isPvpHost = (data.hostUid === currentUser.uid);

        const myProfile = {
            uid: currentUser.uid,
            name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب'),
            avatar: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            score: 0,
            correctCount: 0,
            finished: false,
            isHost: gameState.isPvpHost
        };

        const updateObj = {};
        updateObj[`players.${currentUser.uid}`] = myProfile;

        await docRef.update(updateObj);

        openWaitingRoomUI(roomCode, gameState.isPvpHost);
        listenToPvpRoom(roomCode);
    } catch (e) {
        showCustomAlert('خطأ أثناء الانضمام للغرفة: ' + e.message, 'خطأ', '⚠️');
    }
}

function openWaitingRoomUI(code, isHost) {
    document.getElementById('pvp-display-code').innerText = code;
    const countdownBox = document.getElementById('pvp-countdown-box');
    const hostControls = document.getElementById('pvp-host-controls');

    if (countdownBox) countdownBox.style.display = 'none';

    if (hostControls) {
        const startBtn = document.getElementById('btn-start-party-match');
        const waitSub = document.getElementById('pvp-wait-sub');
        if (isHost) {
            if (startBtn) startBtn.style.display = 'block';
            if (waitSub) waitSub.innerText = 'شارك الكود مع أصدقائك، واضغط زر البدء عندما يجتمع الجميع!';
        } else {
            if (startBtn) startBtn.style.display = 'none';
            if (waitSub) waitSub.innerText = 'في انتظار صاحب الغرفة لبدء التحدي ⏳...';
        }
    }

    switchScreen('pvp-waiting-screen');
}

function copyPvpCode() {
    const code = gameState.pvpRoomId;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
        showCustomAlert(`تم نسخ الكود [ ${code} ]! شاركه مع أصدقائك الآن.`, 'تم النسخ', '📋');
    } else {
        showCustomAlert(`كود الغرفة هو: ${code}`, 'كود الغرفة', '🔑');
    }
}

function listenToPvpRoom(code) {
    if (gameState.pvpUnsubscribe) gameState.pvpUnsubscribe();

    gameState.pvpUnsubscribe = db.collection('pvp_rooms').doc(code).onSnapshot((doc) => {
        if (!doc.exists) {
            showCustomAlert('تم إغلاق الغرفة من قِبل المضيف.', 'الغرفة مغلقة', '🚪');
            leavePvpRoom();
            return;
        }

        const data = doc.data();
        gameState.pvpRoomData = data;

        const playersMap = data.players || {};
        const playersList = Object.values(playersMap);

        const countElem = document.getElementById('pvp-player-count');
        const gridElem = document.getElementById('pvp-players-grid');

        if (countElem) countElem.innerText = playersList.length;

        if (gridElem) {
            gridElem.innerHTML = '';
            playersList.forEach(p => {
                const card = document.createElement('div');
                card.className = `pvp-player-card ${p.isHost ? 'is-host' : ''}`;
                card.innerHTML = `
                    <div class="pvp-card-avatar-box">
                        <img class="pvp-card-avatar" src="${p.avatar}" alt="${p.name}">
                        ${p.isHost ? '<span class="pvp-crown-badge">👑</span>' : ''}
                    </div>
                    <div class="pvp-card-details">
                        <span class="pvp-card-name">${p.name}</span>
                        <span class="pvp-card-tag">${p.isHost ? 'المضيف' : 'جاهز ✅'}</span>
                    </div>
                `;
                gridElem.appendChild(card);
            });
        }

        if (data.lastReaction && data.lastReaction.id !== lastSeenReactionId) {
            lastSeenReactionId = data.lastReaction.id;
            const isMe = (currentUser && data.lastReaction.senderUid === currentUser.uid);
            if (!isMe) {
                showFloatingReaction(data.lastReaction.emoji, data.lastReaction.senderName, data.lastReaction.senderAvatar, false);
            }
        }

        if (data.status === 'starting') {
            triggerPvpCountdown(data);
        }

        const allFinished = playersList.length > 0 && playersList.every(p => p.finished === true);
        if (allFinished || data.status === 'finished') {
            renderGroupPvpResults(playersList);
        }
    });
}

async function hostStartPartyMatch() {
    if (!gameState.pvpRoomId || !gameState.isPvpHost) return;

    const catSelect = document.getElementById('pvp-selected-category');
    const chosenCat = (catSelect && catSelect.value !== 'all') ? catSelect.value : null;
    const freshQuestions = getSmartQuestions(10, chosenCat);

    try {
        await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({
            questions: freshQuestions,
            status: 'starting'
        });
    } catch (e) {
        showCustomAlert('خطأ أثناء بدء التحدي: ' + e.message, 'خطأ', '⚠️');
    }
}

function triggerPvpCountdown(roomData) {
    const countdownBox = document.getElementById('pvp-countdown-box');
    const countVal = document.getElementById('pvp-countdown-val');
    if (!countdownBox || countdownBox.style.display === 'block') return;

    countdownBox.style.display = 'block';
    let count = 3;
    countVal.innerText = count;
    if (typeof AudioEngine !== 'undefined') AudioEngine.playTick();

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countVal.innerText = count;
            if (typeof AudioEngine !== 'undefined') AudioEngine.playTick();
        } else {
            clearInterval(timer);
            startPvpMatch(roomData);
        }
    }, 1000);
}

function startPvpMatch(roomData) {
    gameState.mode = 'pvp';
    gameState.questions = roomData.questions;
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'none';

    switchScreen('game-screen');
    loadQuestion();
}

async function updatePvpPlayerFinalScore() {
    if (!gameState.pvpRoomId || !currentUser) return;

    const myUid = currentUser.uid;
    const finalScore = gameState.score;
    const correctAnswers = gameState.correctCount;

    try {
        const updateObj = {};
        updateObj[`players.${myUid}.score`] = finalScore;
        updateObj[`players.${myUid}.correctCount`] = correctAnswers;
        updateObj[`players.${myUid}.finished`] = true;

        await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update(updateObj);

        const snap = await db.collection('pvp_rooms').doc(gameState.pvpRoomId).get();
        if (snap.exists) {
            const data = snap.data();
            const playersList = Object.values(data.players || {});
            if (playersList.length > 0 && playersList.every(p => p.finished === true)) {
                await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({ status: 'finished' });
                renderGroupPvpResults(playersList);
            }
        }
    } catch (e) {
        console.error('Error submitting score:', e);
    }
}

function renderGroupPvpResults(playersList) {
    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    switchScreen('pvp-result-screen');

    const sorted = [...playersList].sort((a, b) => {
        const aCorrect = a.correctCount !== undefined ? a.correctCount : 0;
        const bCorrect = b.correctCount !== undefined ? b.correctCount : 0;
        if (bCorrect !== aCorrect) {
            return bCorrect - aCorrect;
        }
        return (b.score || 0) - (a.score || 0);
    });

    const listContainer = document.getElementById('pvp-group-results-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const winner = sorted[0];
    const isMeWinner = currentUser && (winner.uid === currentUser.uid);
    const winnerCorrect = winner.correctCount !== undefined ? winner.correctCount : 0;

    const titleElem = document.getElementById('pvp-res-title');
    const msgElem = document.getElementById('pvp-res-message');
    const iconElem = document.getElementById('pvp-res-icon');
    const rewardBadge = document.getElementById('pvp-reward-badge');

    if (isMeWinner) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
        iconElem.innerText = '👑';
        titleElem.innerText = 'مبروك! أنت بطل الغرفة!';
        msgElem.innerText = `حققت المركز الأول بإجابة ${winnerCorrect} من 10 صحيحة وتفوقت على الجميع!`;
        rewardBadge.style.display = 'inline-block';
        userProgress.coins += 50;
        userProgress.pvpWins = (userProgress.pvpWins || 0) + 1;
    } else {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        iconElem.innerText = '⚔️';
        titleElem.innerText = 'انتهى التحدي الجماعي!';
        msgElem.innerText = `الفائز هو [ ${winner.name} ] بإجابة ${winnerCorrect} من 10 صحيحة!`;
        rewardBadge.style.display = 'none';
    }

    const rankEmojis = ['🥇', '🥈', '🥉'];

    sorted.forEach((p, index) => {
        const isMe = currentUser && (p.uid === currentUser.uid);
        const rankText = index < 3 ? rankEmojis[index] : `#${index + 1}`;
        const pCorrect = p.correctCount !== undefined ? p.correctCount : 0;

        const row = document.createElement('div');
        row.className = `pvp-res-row ${index === 0 ? 'first-place' : ''}`;
        row.innerHTML = `
            <div class="pvp-res-rank-num">${rankText}</div>
            <img class="pvp-res-avatar" src="${p.avatar}" alt="${p.name}">
            <div class="pvp-res-info">
                <span class="pvp-res-name">${p.name} ${isMe ? '<small style="color:var(--accent-purple); font-weight:bold;">(أنت)</small>' : ''}</span>
            </div>
            <div class="pvp-res-score" style="color: var(--accent-green);">${pCorrect} من 10 ✅</div>
        `;
        listContainer.appendChild(row);
    });

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();
}

function leavePvpRoom() {
    if (gameState.pvpUnsubscribe) {
        gameState.pvpUnsubscribe();
        gameState.pvpUnsubscribe = null;
    }

    if (gameState.pvpRoomId && gameState.isPvpHost) {
        db.collection('pvp_rooms').doc(gameState.pvpRoomId).delete().catch(() => {});
    }

    gameState.pvpRoomId = null;
    gameState.isPvpHost = false;
    switchScreen('modes-screen');
}


const PVP_CATEGORIES = [
    { id: 'all', name: 'جميع الأقسام (منوع)', icon: '🌟' },
    { id: 'إسلاميات', name: 'إسلاميات', icon: '🕌' },
    { id: 'رياضة وكورة', name: 'رياضة وكورة', icon: '⚽' },
    { id: 'علوم وفضاء', name: 'علوم وفضاء', icon: '🔬' },
    { id: 'تاريخ', name: 'تاريخ وحضارات', icon: '🏛️' },
    { id: 'جغرافيا', name: 'جغرافيا وعواصم', icon: '🌍' },
    { id: 'سينما وفن', name: 'سينما وفن', icon: '🎬' },
    { id: 'طبيعة وحيوانات', name: 'طبيعة وحيوانات', icon: '🐾' },
    { id: 'تكنولوجيا وألعاب', name: 'تكنولوجيا وألعاب', icon: '🎮' },
    { id: 'أدب ولغات', name: 'أدب ولغات', icon: '📚' },
    { id: 'ألغاز وذكاء', name: 'ألغاز وذكاء', icon: '🧩' },
    { id: 'سيارات ومحركات', name: 'سيارات ومحركات', icon: '🏎️' },
    { id: 'معلومات عامة', name: 'معلومات عامة', icon: '💡' }
];

function openPvpCategoryModal() {
    const modal = document.getElementById('pvp-category-modal');
    const listElem = document.getElementById('pvp-categories-list');
    const currentVal = document.getElementById('pvp-selected-category') ? document.getElementById('pvp-selected-category').value : 'all';

    if (listElem) {
        listElem.innerHTML = '';
        PVP_CATEGORIES.forEach(cat => {
            const isSelected = (cat.id === currentVal);
            const item = document.createElement('div');
            item.className = `pvp-cat-option-item ${isSelected ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="pvp-cat-option-info">
                    <span class="pvp-cat-option-icon">${cat.icon}</span>
                    <span class="pvp-cat-option-name">${cat.name}</span>
                </div>
                <i class="fa-solid ${isSelected ? 'fa-circle-dot' : 'fa-circle'} pvp-cat-radio"></i>
            `;
            item.onclick = () => selectPvpCategory(cat.id, `${cat.icon} ${cat.name}`);
            listElem.appendChild(item);
        });
    }

    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closePvpCategoryModal() {
    const modal = document.getElementById('pvp-category-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectPvpCategory(catId, catLabel) {
    const hiddenInput = document.getElementById('pvp-selected-category');
    const triggerLabel = document.getElementById('pvp-cat-selected-label');

    if (hiddenInput) hiddenInput.value = catId;
    if (triggerLabel) triggerLabel.innerText = catLabel;

    closePvpCategoryModal();
}


// --- محرك التفاعلات والرياكشنات الحية ---
let lastSentReactionTime = 0;
let lastSeenReactionId = null;

function toggleReactionsDrawer() {
    const modal = document.getElementById('reactions-modal-overlay');
    if (!modal) return;
    modal.classList.toggle('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeReactionsDrawer(event) {
    const modal = document.getElementById('reactions-modal-overlay');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function sendLiveReaction(emoji) {
    const now = Date.now();
    if (now - lastSentReactionTime < 1000) {
        return; // منع السبام (Cooldown 1 ثانية)
    }
    lastSentReactionTime = now;

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    const myName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'أنت';
    const myAvatar = (currentUser && currentUser.photoURL) || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    // إظهار الرياكشن محلياً للمستخدم فوراً
    showFloatingReaction(emoji, myName, myAvatar, true);

    // إغلاق الدرج بعد الاختيار
    const modal = document.getElementById('reactions-modal-overlay');
    if (modal) modal.classList.remove('show');

    // إرسال للغرفة في Firebase إذا كان في مود PvP
    if (gameState.mode === 'pvp' && gameState.pvpRoomId && db) {
        const reactionObj = {
            id: now + '_' + Math.random().toString(36).substr(2, 5),
            emoji: emoji,
            senderUid: currentUser ? currentUser.uid : 'anon',
            senderName: myName,
            senderAvatar: myAvatar,
            timestamp: now
        };

        db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({
            lastReaction: reactionObj
        }).catch(() => {});
    }

    // تفاعل المنافس الذكي في مود الرانك
    if (gameState.mode === 'ranked' && typeof currentRankedOpponent !== 'undefined' && currentRankedOpponent) {
        if (Math.random() > 0.35) {
            const botReactions = ['🔥', '👏', '😂', '🎯', '😱', '🧠'];
            const randomReaction = botReactions[Math.floor(Math.random() * botReactions.length)];
            setTimeout(() => {
                showFloatingReaction(randomReaction, currentRankedOpponent.name, currentRankedOpponent.avatar, false);
            }, 1200 + Math.random() * 1500);
        }
    }
}

function showFloatingReaction(emoji, senderName, senderAvatar, isMe) {
    const container = document.getElementById('floating-reactions-box');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `floating-bubble ${isMe ? 'is-me' : 'is-opponent'}`;
    bubble.innerHTML = `
        <img class="float-avatar" src="${senderAvatar}" alt="${senderName}">
        <span class="float-sender">${senderName}</span>
        <span class="float-emoji">${emoji}</span>
    `;

    container.appendChild(bubble);

    // إزالة العنصر بعد انتهاء الأنيميشن
    setTimeout(() => {
        if (bubble && bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 2800);
}


// js/community.js - إدارة اقتراح الأسئلة من اللاعبين والمجتمع ولوحة تحكم المشرف

const SUGGEST_CATEGORIES = [
    { id: 'إسلاميات', name: 'إسلاميات', icon: 'fa-solid fa-mosque', color: '#10b981' },
    { id: 'رياضة وكورة', name: 'رياضة وكورة', icon: 'fa-solid fa-futbol', color: '#38bdf8' },
    { id: 'علوم وفضاء', name: 'علوم وفضاء', icon: 'fa-solid fa-atom', color: '#a855f7' },
    { id: 'تاريخ', name: 'تاريخ', icon: 'fa-solid fa-landmark-dome', color: '#f59e0b' },
    { id: 'جغرافيا', name: 'جغرافيا', icon: 'fa-solid fa-earth-americas', color: '#06b6d4' },
    { id: 'سينما وفن', name: 'سينما وفن', icon: 'fa-solid fa-film', color: '#ec4899' },
    { id: 'طبيعة وحيوانات', name: 'طبيعة وحيوانات', icon: 'fa-solid fa-paw', color: '#84cc16' },
    { id: 'تكنولوجيا وألعاب', name: 'تكنولوجيا وألعاب', icon: 'fa-solid fa-gamepad', color: '#6366f1' },
    { id: 'أدب ولغات', name: 'أدب ولغات', icon: 'fa-solid fa-book-open', color: '#14b8a6' },
    { id: 'سيارات ومحركات', name: 'سيارات ومحركات', icon: 'fa-solid fa-car', color: '#ef4444' },
    { id: 'ألغاز وذكاء', name: 'ألغاز وذكاء', icon: 'fa-solid fa-puzzle-piece', color: '#f97316' },
    { id: 'معلومات عامة', name: 'معلومات عامة', icon: 'fa-solid fa-globe', color: '#eab308' }
];

function openSuggestQuestionModal() {
    const modal = document.getElementById('suggest-question-modal');
    if (!modal) return;

    // ملء اسم الكاتب تلقائياً باسم اللاعب المسجل
    const authorInput = document.getElementById('suggest-author-input');
    if (authorInput) {
        authorInput.value = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : (userProgress.equippedTitle ? `${userProgress.equippedTitle}` : '');
    }

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestQuestionModal() {
    const modal = document.getElementById('suggest-question-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

// نافذة اختيار القسم المخصصة
function openSuggestCategoryPicker() {
    const modal = document.getElementById('suggest-cat-picker-modal');
    const list = document.getElementById('suggest-cat-picker-list');
    if (!modal || !list) return;

    const currentVal = document.getElementById('suggest-cat-value').value || 'معلومات عامة';
    list.innerHTML = '';

    SUGGEST_CATEGORIES.forEach(cat => {
        const isSelected = (cat.id === currentVal);
        const item = document.createElement('div');
        item.className = `pvp-cat-option-item ${isSelected ? 'selected' : ''}`;
        item.onclick = () => selectSuggestCategory(cat.id, cat.name, cat.icon, cat.color);

        item.innerHTML = `
            <div class="pvp-cat-option-info">
                <i class="${cat.icon}" style="color: ${cat.color};"></i>
                <span class="pvp-cat-option-name">${cat.name}</span>
            </div>
            <i class="fa-solid fa-circle-dot pvp-cat-radio"></i>
        `;
        list.appendChild(item);
    });

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestCategoryPicker() {
    const modal = document.getElementById('suggest-cat-picker-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectSuggestCategory(catId, catName, catIcon, catColor) {
    const valInput = document.getElementById('suggest-cat-value');
    const labelElem = document.getElementById('suggest-cat-selected-label');

    if (valInput) valInput.value = catId;
    if (labelElem) labelElem.innerHTML = `<i class="${catIcon}" style="color: ${catColor}; margin-left: 6px;"></i> ${catName}`;

    closeSuggestCategoryPicker();
}

// نافذة اختيار مستوى الصعوبة المخصصة
function openSuggestDiffPicker() {
    const modal = document.getElementById('suggest-diff-picker-modal');
    if (!modal) return;

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestDiffPicker() {
    const modal = document.getElementById('suggest-diff-picker-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectSuggestDiff(diffVal, diffLabel) {
    const valInput = document.getElementById('suggest-diff-value');
    const labelElem = document.getElementById('suggest-diff-selected-label');

    if (valInput) valInput.value = diffVal;
    if (labelElem) labelElem.innerText = diffLabel;

    closeSuggestDiffPicker();
}

async function submitSuggestedQuestion() {
    const qInput = document.getElementById('suggest-q-text');
    const catInput = document.getElementById('suggest-cat-value');
    const diffInput = document.getElementById('suggest-diff-value');
    const opt1Input = document.getElementById('suggest-opt1');
    const opt2Input = document.getElementById('suggest-opt2');
    const opt3Input = document.getElementById('suggest-opt3');
    const opt4Input = document.getElementById('suggest-opt4');
    const authorInput = document.getElementById('suggest-author-input');
    const submitBtn = document.getElementById('btn-submit-suggest');

    const qText = qInput ? qInput.value.trim() : '';
    const qCat = catInput ? catInput.value : 'معلومات عامة';
    const qDiff = diffInput ? parseInt(diffInput.value) : 4;
    const opt1 = opt1Input ? opt1Input.value.trim() : '';
    const opt2 = opt2Input ? opt2Input.value.trim() : '';
    const opt3 = opt3Input ? opt3Input.value.trim() : '';
    const opt4 = opt4Input ? opt4Input.value.trim() : '';
    const author = authorInput ? authorInput.value.trim() : 'لاعب مجهول';

    if (!qText || qText.length < 8) {
        showCustomAlert('يرجى كتابة نص سؤال واضح ومفيد (8 أحرف على الأقل)!', 'تنبيه', '✍️');
        return;
    }

    if (!opt1 || !opt2 || !opt3 || !opt4) {
        showCustomAlert('يرجى كتابة جميع الخيارات الأربعة (الإجابة الصحيحة و3 خيارات خاطئة)!', 'بيانات ناقصة', '⚠️');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'جاري الإرسال...';
    }

    try {
        if (typeof db !== 'undefined' && db) {
            await db.collection('suggested_questions').add({
                question: qText,
                category: qCat,
                difficulty: qDiff,
                options: [opt1, opt2, opt3, opt4],
                correct: 0,
                authorName: author || 'صديق اللعبة',
                authorUid: (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : 'anon',
                status: 'pending',
                createdAt: Date.now()
            });
        }

        // مكافأة فورية 20 عملة لتشجيع المساهمة
        userProgress.coins = (userProgress.coins || 0) + 20;
        saveProgress();
        updateHeaderStats();

        if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

        closeSuggestQuestionModal();

        // تصفير الحقول
        if (qInput) qInput.value = '';
        if (opt1Input) opt1Input.value = '';
        if (opt2Input) opt2Input.value = '';
        if (opt3Input) opt3Input.value = '';
        if (opt4Input) opt4Input.value = '';

        showCustomAlert(`🎉 شكراً لمساهمتك يا ${author || 'بطل'}! تم إرسال سؤالك للمراجعة وسينضم لشيت الأسئلة باسمك الكريم فور اعتماده (+20 عملة هدية)!`, 'تم استلام سؤالك!', '💡');
    } catch (e) {
        console.error("Error submitting question:", e);
        showCustomAlert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.', 'خطأ', '❌');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال السؤال للمراجعة (+20 عملة) 🚀';
        }
    }
}

// --- إدارة لوحة المشرف السرية (Admin Panel) ---
const ADMIN_EMAILS = ['mostaffa201021@gmail.com'];

function isCurrentUserAdmin() {
    return !!(typeof currentUser !== 'undefined' && currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim()));
}

function checkAndShowAdminButton() {
    const adminBtn = document.getElementById('btn-admin-panel');
    if (adminBtn) {
        adminBtn.style.display = isCurrentUserAdmin() ? 'flex' : 'none';
    }
}

function openAdminPanelScreen() {
    if (!isCurrentUserAdmin()) {
        showCustomAlert('هذه الصفحة مخصصة لمدير اللعبة فقط!', 'غير مصرح', '🚫');
        return;
    }
    switchScreen('admin-panel-screen');
    fetchAndRenderAdminQuestions();
}

async function fetchAndRenderAdminQuestions() {
    const feed = document.getElementById('admin-questions-feed');
    const countPending = document.getElementById('admin-stat-pending');
    const countApproved = document.getElementById('admin-stat-approved');
    const countRejected = document.getElementById('admin-stat-rejected');

    if (!feed) return;
    feed.innerHTML = '<div class="lb-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري جلب الأسئلة من السيرفر...</div>';

    try {
        if (typeof db === 'undefined' || !db) throw new Error("No database connection");

        const snapshot = await db.collection('suggested_questions').orderBy('createdAt', 'desc').limit(100).get();

        let pending = 0, approved = 0, rejected = 0;
        let questions = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            data.docId = doc.id;
            questions.push(data);

            const st = data.status || 'pending';
            if (st === 'approved') approved++;
            else if (st === 'rejected') rejected++;
            else pending++;
        });

        if (countPending) countPending.innerText = pending;
        if (countApproved) countApproved.innerText = approved;
        if (countRejected) countRejected.innerText = rejected;

        if (questions.length === 0) {
            feed.innerHTML = '<div class="lb-loading">لا توجد أي أسئلة مقترحة حالياً.</div>';
            return;
        }

        feed.innerHTML = '';

        questions.forEach(q => {
            const card = document.createElement('div');
            const st = q.status || 'pending';
            card.className = `admin-q-card status-${st}`;

            const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            const catStyle = (typeof CATEGORY_STYLES !== 'undefined' && CATEGORY_STYLES[q.category]) || { icon: 'fa-solid fa-shapes', color: '#a855f7' };

            let statusBadge = `<span class="admin-status-badge pending">⏳ بانتظار المراجعة</span>`;
            if (st === 'approved') statusBadge = `<span class="admin-status-badge approved">✅ مقبول ومعتمد (ID #${q.assignedId || '---'})</span>`;
            if (st === 'rejected') statusBadge = `<span class="admin-status-badge rejected">❌ مرفوض</span>`;

            card.innerHTML = `
                <div class="admin-q-header">
                    <div class="admin-q-cat-box">
                        <i class="${catStyle.icon}" style="color: ${catStyle.color};"></i>
                        <span>${q.category || 'عام'} (صعوبة: ${q.difficulty || 5})</span>
                    </div>
                    ${statusBadge}
                </div>

                <h4 class="admin-q-title">${q.question}</h4>

                <div class="admin-q-options">
                    <div class="admin-opt-item correct"><i class="fa-solid fa-check"></i> ${q.options ? q.options[0] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[1] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[2] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[3] : ''}</div>
                </div>

                <div class="admin-q-meta">
                    <span>✍️ الكاتب: <b>${q.authorName || 'لاعب'}</b></span>
                    <span>🕒 ${dateStr}</span>
                </div>

                <div class="admin-q-actions">
                    <button class="btn-adm-approve" onclick="updateQuestionStatus('${q.docId}', 'approved')"><i class="fa-solid fa-check"></i> قبول وحجز ID</button>
                    <button class="btn-adm-reject" onclick="updateQuestionStatus('${q.docId}', 'rejected')"><i class="fa-solid fa-xmark"></i> رفض</button>
                    <button class="btn-adm-copy" onclick="copyQuestionAsTSV('${q.docId}')"><i class="fa-solid fa-table-cells"></i> نسخ TSV</button>
                    <button class="btn-adm-del" onclick="deleteSuggestedQuestion('${q.docId}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            feed.appendChild(card);
        });

    } catch (err) {
        console.error("Admin fetch error:", err);
        feed.innerHTML = '<div class="lb-loading">تعذر جلب الأسئلة أو لا توجد صلاحيات كافية.</div>';
    }
}

function getNextAvailableQuestionId() {
    if (typeof window !== 'undefined' && window.questionsBank && Array.isArray(window.questionsBank) && window.questionsBank.length > 0) {
        let maxId = 0;
        window.questionsBank.forEach(q => {
            const idNum = parseInt(q.id);
            if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
        });
        return maxId > 0 ? maxId + 1 : 2587;
    }
    return 2587;
}

function formatQuestionToTSV(q, assignedId) {
    const id = assignedId || getNextAvailableQuestionId();
    const cat = q.category || 'معلومات عامة';
    const diff = q.difficulty || 4;
    const cleanStr = (s) => (s || '').toString().split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').trim();
    const questionText = cleanStr(q.question);
    const opt1 = cleanStr(q.options && q.options[0]);
    const opt2 = cleanStr(q.options && q.options[1]);
    const opt3 = cleanStr(q.options && q.options[2]);
    const opt4 = cleanStr(q.options && q.options[3]);
    const correct = 0;
    const image = q.image ? q.image.trim() : '';
    const author = cleanStr(q.authorName || 'لاعب');

    return `${id}\t${cat}\t${diff}\t${questionText}\t${opt1}\t${opt2}\t${opt3}\t${opt4}\t${correct}\t${image}\t${author}`;
}

async function updateQuestionStatus(docId, newStatus) {
    if (typeof db === 'undefined' || !db) return;
    try {
        const updateData = {
            status: newStatus,
            reviewedAt: Date.now()
        };
        if (newStatus === 'approved') {
            updateData.assignedId = getNextAvailableQuestionId();
        }
        await db.collection('suggested_questions').doc(docId).update(updateData);
        if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
        fetchAndRenderAdminQuestions();
    } catch (e) {
        showCustomAlert('فشل تحديث حالة السؤال!', 'خطأ', '❌');
    }
}

async function deleteSuggestedQuestion(docId) {
    showCustomConfirm(
        'هل تريد حقاً حذف هذا السؤال المقترح نهائياً؟',
        async () => {
            if (typeof db === 'undefined' || !db) return;
            await db.collection('suggested_questions').doc(docId).delete().catch(() => {});
            fetchAndRenderAdminQuestions();
        },
        null,
        'تأكيد الحذف',
        'حذف',
        'إلغاء',
        '🗑️'
    );
}

async function copyQuestionAsTSV(docId) {
    if (typeof db === 'undefined' || !db) return;
    try {
        const doc = await db.collection('suggested_questions').doc(docId).get();
        if (!doc.exists) return;
        const q = doc.data();

        const assignedId = q.assignedId || getNextAvailableQuestionId();
        const tsvLine = formatQuestionToTSV(q, assignedId);

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(tsvLine);
            showCustomAlert(`تم نسخ السؤال بالمعرف #${assignedId} بصيغة TSV! الصقه مباشرة في شيت جوجل في خلية ID وسيتوزع تلقائياً على الأعمدة الـ 11.`, 'تم النسخ كـ TSV', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}

async function copyAllApprovedAsTSV() {
    if (typeof db === 'undefined' || !db) return;
    try {
        const snapshot = await db.collection('suggested_questions').where('status', '==', 'approved').get();
        if (snapshot.empty) {
            showCustomAlert('لا توجد أسئلة مقبولة حالياً لنسخها!', 'تنبيه', 'ℹ️');
            return;
        }

        let startId = getNextAvailableQuestionId();
        let lines = [];
        let count = 0;

        snapshot.forEach(doc => {
            const q = doc.data();
            const currentId = q.assignedId || (startId + count);
            lines.push(formatQuestionToTSV(q, currentId));
            count++;
        });

        const tsvPayload = lines.join('\n');

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(tsvPayload);
            showCustomAlert(`تم نسخ ${count} سؤال معتمد بمعرفات تسلسلية فريدة (من #${startId} إلى #${startId + count - 1}) بصيغة TSV جاهزة للصق في شيت جوجل مباشرة!`, 'تم النسخ الشامل', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}


// --- محرك لوحة التحكم والإعدادات الحية للمشرف (Admin Dashboard Controller) ---

let activeAdminTab = 'questions';

function switchAdminTab(tabName) {
    activeAdminTab = tabName;
    document.querySelectorAll('.adm-sub-tab').forEach(t => t.classList.remove('active'));

    const btn = document.getElementById(`adm-tab-${tabName}`);
    if (btn) btn.classList.add('active');

    const secQuestions = document.getElementById('adm-sec-questions');
    const secPrices = document.getElementById('adm-sec-prices');
    const secCustomPrices = document.getElementById('adm-sec-custom-prices');
    const secAnnounce = document.getElementById('adm-sec-announcement');

    if (secQuestions) secQuestions.style.display = (tabName === 'questions') ? 'block' : 'none';
    if (secPrices) secPrices.style.display = (tabName === 'prices') ? 'block' : 'none';
    if (secCustomPrices) secCustomPrices.style.display = (tabName === 'custom-prices') ? 'block' : 'none';
    if (secAnnounce) secAnnounce.style.display = (tabName === 'announcement') ? 'block' : 'none';

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    if (tabName === 'questions') fetchAndRenderAdminQuestions();
    if (tabName === 'prices') loadAdminPricesForm();
    if (tabName === 'custom-prices') loadAdminCustomPricesForm();
    if (tabName === 'announcement') loadAdminAnnouncementForm();
}

function loadAdminPricesForm() {
    const p = (window.APP_CONFIG && window.APP_CONFIG.prices) || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    setVal('adm-price-5050', p.hint5050 || 20);
    setVal('adm-price-time', p.addTime || 15);
    setVal('adm-price-skip', p.skip || 30);
    setVal('adm-reward-daily', p.dailyFreeReward || 30);
    setVal('adm-price-wheel', p.wheelExtraSpin || 25);
}

function loadAdminCustomPricesForm() {
    const cp = (window.APP_CONFIG && window.APP_CONFIG.customPrices) || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    // Avatars
    setVal('adm-price-av-detective', cp.av_detective || 400);
    setVal('adm-price-av-viking', cp.av_viking || 600);
    setVal('adm-price-av-samurai', cp.av_samurai || 800);
    setVal('adm-price-av-pharaoh', cp.av_pharaoh || 1000);
    setVal('adm-price-av-astro', cp.av_astro || 1200);
    setVal('adm-price-av-gladiator', cp.av_gladiator || 1400);
    setVal('adm-price-av-pirate', cp.av_pirate || 1600);
    setVal('adm-price-av-alchemist', cp.av_alchemist || 1800);
    setVal('adm-price-av-wizard', cp.av_wizard || 2000);
    setVal('adm-price-av-lion', cp.av_lion || 2500);

    // Frames
    setVal('adm-price-frame-neon', cp.frame_cyber_neon || 500);
    setVal('adm-price-frame-laurel', cp.frame_royal_laurel || 800);
    setVal('adm-price-frame-dragon', cp.frame_dragon_fire || 1000);

    // Titles
    setVal('adm-price-title-mastermind', cp.title_mastermind || 300);
    setVal('adm-price-title-puzzle', cp.title_puzzle_king || 500);
    setVal('adm-price-title-sniper', cp.title_sniper || 600);
}

function loadAdminAnnouncementForm() {
    const txtInput = document.getElementById('adm-announce-text');
    const chkInput = document.getElementById('adm-announce-active');

    if (txtInput) txtInput.value = (window.APP_CONFIG && window.APP_CONFIG.announcement) || '';
    if (chkInput) chkInput.checked = !!(window.APP_CONFIG && window.APP_CONFIG.announcementActive);
}

// دالة حفظ الإعدادات في التخزين المحلي وفولباك فايرستور
async function persistGlobalConfig(configData) {
    // 1. الحفظ الفوري محلياً لضمان العمل دائماً 100%
    try {
        localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
    } catch (e) {}

    // 2. الحفظ في فايرستور مع فولباك آمن لمجموعة users المفتوحة
    if (typeof db !== 'undefined' && db) {
        try {
            await db.collection('app_config').doc('settings').set(configData, { merge: true });
        } catch (err1) {
            console.warn("Retrying config save to users/global_config fallback:", err1);
            try {
                await db.collection('users').doc('global_config').set(configData, { merge: true });
            } catch (err2) {
                console.warn("Firestore config save permission restricted, saved locally:", err2);
            }
        }
    }
}

async function saveAdminPrices() {
    const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseInt(el.value) || def : def; };

    const newPrices = {
        hint5050: getVal('adm-price-5050', 20),
        addTime: getVal('adm-price-time', 15),
        skip: getVal('adm-price-skip', 30),
        dailyFreeReward: getVal('adm-reward-daily', 30),
        wheelExtraSpin: getVal('adm-price-wheel', 25)
    };

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.prices = newPrices;

    await persistGlobalConfig({ prices: newPrices });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم حفظ وتطبيق أسعار المتجر والمساعدات بنجاح!', 'تم الحفظ', '🪙');
}

async function saveAdminCustomPrices() {
    const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseInt(el.value) || def : def; };

    const newCustomPrices = {
        av_detective: getVal('adm-price-av-detective', 400),
        av_viking: getVal('adm-price-av-viking', 600),
        av_samurai: getVal('adm-price-av-samurai', 800),
        av_pharaoh: getVal('adm-price-av-pharaoh', 1000),
        av_astro: getVal('adm-price-av-astro', 1200),
        av_gladiator: getVal('adm-price-av-gladiator', 1400),
        av_pirate: getVal('adm-price-av-pirate', 1600),
        av_alchemist: getVal('adm-price-av-alchemist', 1800),
        av_wizard: getVal('adm-price-av-wizard', 2000),
        av_lion: getVal('adm-price-av-lion', 2500),
        frame_cyber_neon: getVal('adm-price-frame-neon', 500),
        frame_royal_laurel: getVal('adm-price-frame-laurel', 800),
        frame_dragon_fire: getVal('adm-price-frame-dragon', 1000),
        title_mastermind: getVal('adm-price-title-mastermind', 300),
        title_puzzle_king: getVal('adm-price-title-puzzle', 500),
        title_sniper: getVal('adm-price-title-sniper', 600)
    };

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.customPrices = newCustomPrices;

    await persistGlobalConfig({ customPrices: newCustomPrices });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم حفظ وتطبيق أسعار الأفاتارات والإطارات والألقاب بنجاح!', 'تم الحفظ', '🎨');
}

async function saveAdminAnnouncement() {
    const txtInput = document.getElementById('adm-announce-text');
    const chkInput = document.getElementById('adm-announce-active');

    const announceText = txtInput ? txtInput.value.trim() : '';
    const isActive = chkInput ? chkInput.checked : false;

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.announcement = announceText;
    window.APP_CONFIG.announcementActive = isActive;

    await persistGlobalConfig({
        announcement: announceText,
        announcementActive: isActive
    });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم نشر وتفعيل شريط الإعلان لجميع اللاعبين بنجاح!', 'تم النشر', '📢');
}

// تحميل ومزامنة الإعدادات على الفور

// دالة تطبيق التحديثات الحية فوراً على واجهات اللعبة بالكامل
function applyLiveConfigUpdates() {
    if (!window.APP_CONFIG) return;

    // 1. تحديث أسعار الأفاتارات في AVATARS_DB
    if (typeof AVATARS_DB !== 'undefined' && Array.isArray(AVATARS_DB) && window.APP_CONFIG.customPrices) {
        AVATARS_DB.forEach(av => {
            if (window.APP_CONFIG.customPrices[av.id] !== undefined) {
                av.price = window.APP_CONFIG.customPrices[av.id];
                if (av.type === 'shop') {
                    av.unlockDesc = `متجر: ${toArabicNumerals(av.price)} عملة`;
                }
            }
        });
    }

    // 2. تحديث أسعار الإطارات في FRAMES_DB
    if (typeof FRAMES_DB !== 'undefined' && Array.isArray(FRAMES_DB) && window.APP_CONFIG.customPrices) {
        FRAMES_DB.forEach(fr => {
            if (window.APP_CONFIG.customPrices[fr.id] !== undefined) {
                fr.price = window.APP_CONFIG.customPrices[fr.id];
                if (fr.type === 'shop') {
                    fr.unlockDesc = `متجر: ${toArabicNumerals(fr.price)} عملة`;
                }
            }
        });
    }

    // 3. تحديث أسعار الألقاب في TITLES_DB
    if (typeof TITLES_DB !== 'undefined' && Array.isArray(TITLES_DB) && window.APP_CONFIG.customPrices) {
        TITLES_DB.forEach(ti => {
            if (window.APP_CONFIG.customPrices[ti.id] !== undefined) {
                ti.price = window.APP_CONFIG.customPrices[ti.id];
                if (ti.type === 'shop') {
                    ti.unlockDesc = `متجر: ${toArabicNumerals(ti.price)} عملة`;
                }
            }
        });
    }

    // 4. تحديث وإظهار شريط الإعلانات في القائمة الرئيسية
    const banner = document.getElementById('global-live-announcement-banner');
    const bannerText = document.getElementById('global-announcement-text');
    if (banner && bannerText) {
        if (window.APP_CONFIG.announcementActive && window.APP_CONFIG.announcement && window.APP_CONFIG.announcement.trim() !== '') {
            bannerText.innerText = window.APP_CONFIG.announcement.trim();
            banner.style.display = 'flex';
        } else {
            banner.style.display = 'none';
        }
    }

    // 5. تحديث أسعار متجر المساعدات
    if (typeof updateShopDisplay === 'function') updateShopDisplay();

    // 6. تحديث متجر التخصيص إن كان مفتوحاً
    if (typeof renderCustomizationContent === 'function') {
        const customSec = document.getElementById('profile-custom-section');
        if (customSec && customSec.style.display !== 'none') {
            renderCustomizationContent();
        }
    }
}

function initLiveConfigListener() {
    // استرجاع الإعدادات المحفوظة محلياً أولاً
    try {
        const cachedConfig = localStorage.getItem('law_ta3raf_app_config');
        if (cachedConfig) {
            const parsed = JSON.parse(cachedConfig);
            if (parsed.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...parsed.prices };
            if (parsed.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...parsed.customPrices };
            if (parsed.announcement !== undefined) window.APP_CONFIG.announcement = parsed.announcement;
            if (parsed.announcementActive !== undefined) window.APP_CONFIG.announcementActive = parsed.announcementActive;
            applyLiveConfigUpdates();
        }
    } catch (e) {}

    if (typeof db === 'undefined' || !db) return;

    // الاستماع عبر app_config أو users/global_config
    const handleConfigDoc = (doc) => {
        if (doc && doc.exists) {
            const data = doc.data();
            if (data.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...data.prices };
            if (data.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...data.customPrices };
            if (data.announcement !== undefined) window.APP_CONFIG.announcement = data.announcement;
            if (data.announcementActive !== undefined) window.APP_CONFIG.announcementActive = data.announcementActive;

            try {
                localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
            } catch (e) {}

            applyLiveConfigUpdates();
        }
    };

    db.collection('app_config').doc('settings').onSnapshot(handleConfigDoc, () => {
        db.collection('users').doc('global_config').onSnapshot(handleConfigDoc, () => {});
    });
}

// دالة تطبيق التحديثات الحية فوراً على واجهات اللعبة
function applyLiveConfigUpdates() {
    if (!window.APP_CONFIG) return;

    // 1. تحديث شريط الإعلانات في القائمة الرئيسية
    const banner = document.getElementById('global-live-announcement-banner');
    const bannerText = document.getElementById('global-announcement-text');
    if (banner && bannerText) {
        if (window.APP_CONFIG.announcementActive && window.APP_CONFIG.announcement && window.APP_CONFIG.announcement.trim() !== '') {
            bannerText.innerText = window.APP_CONFIG.announcement.trim();
            banner.style.display = 'flex';
        } else {
            banner.style.display = 'none';
        }
    }

    // 2. تحديث أسعار متجر المساعدات
    if (typeof updateShopDisplay === 'function') {
        updateShopDisplay();
    }

    // 3. تحديث شاشات التخصيص إن كانت مفتوحة
    const customSec = document.getElementById('profile-custom-section');
    if (customSec && customSec.style.display !== 'none' && typeof renderCustomizationContent === 'function') {
        renderCustomizationContent();
    }
}
window.applyLiveConfigUpdates = applyLiveConfigUpdates;

async function persistGlobalConfig(configData) {
    try {
        localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
    } catch (e) {}

    if (typeof db !== 'undefined' && db) {
        try {
            await db.collection('app_config').doc('settings').set(configData, { merge: true });
        } catch (err1) {
            console.warn("Retrying config save to users/global_config fallback:", err1);
            try {
                await db.collection('users').doc('global_config').set(configData, { merge: true });
            } catch (err2) {
                console.warn("Firestore config save fallback locally:", err2);
            }
        }
    }
}

function initLiveConfigListener() {
    try {
        const cachedConfig = localStorage.getItem('law_ta3raf_app_config');
        if (cachedConfig) {
            const parsed = JSON.parse(cachedConfig);
            if (parsed.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...parsed.prices };
            if (parsed.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...parsed.customPrices };
            if (parsed.announcement !== undefined) window.APP_CONFIG.announcement = parsed.announcement;
            if (parsed.announcementActive !== undefined) window.APP_CONFIG.announcementActive = parsed.announcementActive;
            applyLiveConfigUpdates();
        }
    } catch (e) {}

    if (typeof db === 'undefined' || !db) return;

    const handleConfigDoc = (doc) => {
        if (doc && doc.exists) {
            const data = doc.data();
            if (data.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...data.prices };
            if (data.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...data.customPrices };
            if (data.announcement !== undefined) window.APP_CONFIG.announcement = data.announcement;
            if (data.announcementActive !== undefined) window.APP_CONFIG.announcementActive = data.announcementActive;

            try {
                localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
            } catch (e) {}

            applyLiveConfigUpdates();
        }
    };

    try {
        db.collection('app_config').doc('settings').onSnapshot(handleConfigDoc, () => {
            db.collection('users').doc('global_config').onSnapshot(handleConfigDoc, () => {});
        });
    } catch (e) {}
}


// js/customization.js - إدارة تخصيص الحساب والأفاتارات والإطارات والألقاب وبطاقة إحصائيات اللاعب

// قائمة الأفاتارات (20 شخصية فيكتور أصلية عالية الدقة)
var AVATARS_DB = window.AVATARS_DB = [
    // مجانية (2)
    { id: 'av_warrior', name: 'المحارب الفولاذي', type: 'free', price: 0, src: './assets/avatars/avatar_warrior.svg', unlockDesc: 'مجاني للجميع' },
    { id: 'av_ninja', name: 'النينجا الخفي', type: 'free', price: 0, src: './assets/avatars/avatar_ninja.svg', unlockDesc: 'مجاني للجميع' },
    
    // متجر العملات (10)
    { id: 'av_detective', name: 'المحقق الذكي', type: 'shop', price: 400, src: './assets/avatars/avatar_detective.svg', unlockDesc: 'متجر: 400 عملة' },
    { id: 'av_viking', name: 'محارب الفايكنج', type: 'shop', price: 600, src: './assets/avatars/avatar_viking.svg', unlockDesc: 'متجر: 600 عملة' },
    { id: 'av_samurai', name: 'الساموراي الصنديد', type: 'shop', price: 800, src: './assets/avatars/avatar_samurai.svg', unlockDesc: 'متجر: 800 عملة' },
    { id: 'av_pharaoh', name: 'الفرعون الذهبي', type: 'shop', price: 1000, src: './assets/avatars/avatar_pharaoh.svg', unlockDesc: 'متجر: 1,000 عملة' },
    { id: 'av_astro', name: 'رائد الفضاء الكوني', type: 'shop', price: 1200, src: './assets/avatars/avatar_astronaut.svg', unlockDesc: 'متجر: 1,200 عملة' },
    { id: 'av_gladiator', name: 'المصارع الروماني', type: 'shop', price: 1400, src: './assets/avatars/avatar_gladiator.svg', unlockDesc: 'متجر: 1,400 عملة' },
    { id: 'av_pirate', name: 'قبطان القراصنة', type: 'shop', price: 1600, src: './assets/avatars/avatar_pirate.svg', unlockDesc: 'متجر: 1,600 عملة' },
    { id: 'av_alchemist', name: 'عالم الكيمياء', type: 'shop', price: 1800, src: './assets/avatars/avatar_alchemist.svg', unlockDesc: 'متجر: 1,800 عملة' },
    { id: 'av_wizard', name: 'ساحر المعرفة الأكبر', type: 'shop', price: 2000, src: './assets/avatars/avatar_wizard.svg', unlockDesc: 'متجر: 2,000 عملة' },
    { id: 'av_lion', name: 'الأسد الملكي', type: 'shop', price: 2500, src: './assets/avatars/avatar_lion.svg', unlockDesc: 'متجر: 2,500 عملة' },
    
    // حصرية بالإنجازات التعجيزية والرانك (8)
    { id: 'av_cyberpunk', name: 'السايبورغ المتطور', type: 'achievement', reqAch: 'ach_high_score', reqLvl: 3, src: './assets/avatars/avatar_cyberpunk.svg', unlockDesc: 'إنجاز: 200 نقطة باللانهائي' },
    { id: 'av_dragon', name: 'فارس التنين الناري', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, src: './assets/avatars/avatar_dragon.svg', unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'av_emperor', name: 'إمبراطور الثقافة', type: 'achievement', reqAch: 'ach_correct', reqLvl: 3, src: './assets/avatars/avatar_emperor.svg', unlockDesc: 'إنجاز: 700 سؤال صحيح' },
    { id: 'av_phoenix', name: 'طائر الفينيق الخالد', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, src: './assets/avatars/avatar_phoenix.svg', unlockDesc: 'إنجاز: 60 فوز بالرانك' },
    { id: 'av_falcon', name: 'صقر الأساطير', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, src: './assets/avatars/avatar_falcon.svg', unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'av_lightning', name: 'سيد الصاعقة والبرق', type: 'achievement', reqAch: 'ach_speed', reqLvl: 4, src: './assets/avatars/avatar_lightning.svg', unlockDesc: 'إنجاز: 200 إجابة سريعة' },
    { id: 'av_warlord', name: 'بطل التحديات والرانك', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, src: './assets/avatars/avatar_champion.svg', unlockDesc: 'إنجاز: 100 فوز بالرانك' },
    { id: 'av_cosmic_god', name: 'كيان الكون الأسطوري', type: 'rank', reqRankTier: 'challenger', src: './assets/avatars/avatar_cosmic_god.svg', unlockDesc: 'بلوغ قمة المتحدي الأسطوري' }
];

// قائمة الإطارات المزخرفة الأصلية (Ornate SVG Frame Overlays)
var FRAMES_DB = window.FRAMES_DB = [
    { id: 'frame_none', name: 'بدون إطار', type: 'free', price: 0, overlaySvg: '', unlockDesc: 'مجاني للجميع' },
    
    // متجر العملات
    { id: 'frame_cyber_neon', name: 'السايبر والنيون التكنولوجي', type: 'shop', price: 500, overlaySvg: './assets/frames/frame_cyber_neon.svg', unlockDesc: 'متجر: 500 عملة' },
    { id: 'frame_royal_laurel', name: 'أوراق الغار الملكية والياقوت', type: 'shop', price: 800, overlaySvg: './assets/frames/frame_royal_laurel.svg', unlockDesc: 'متجر: 800 عملة' },
    { id: 'frame_dragon_fire', name: 'أجنحة التنين واللهب المشع', type: 'shop', price: 1000, overlaySvg: './assets/frames/frame_dragon_fire.svg', unlockDesc: 'متجر: 1,000 عملة' },
    
    // إطارات حصرية خارقة
    { id: 'frame_inferno_flame', name: 'اللهب البركاني المتوهج', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, overlaySvg: './assets/frames/frame_inferno_flame.svg', unlockDesc: 'إنجاز: سلسلة 10 انتصارات متتالية' },
    { id: 'frame_diamond_crystal', name: 'الكريستال الماسي الأسطوري', type: 'rank', reqRankTier: 'diamond', overlaySvg: './assets/frames/frame_diamond_crystal.svg', unlockDesc: 'بلوغ دوري الماسي' },
    { id: 'frame_challenger_crown', name: 'تاج المتحدي الأسطوري المذهب', type: 'rank', reqRankTier: 'challenger', overlaySvg: './assets/frames/frame_challenger_crown.svg', unlockDesc: 'بلوغ قمة المتحدي الأسطوري' }
];

// قائمة الألقاب الشرفية النقية (بدون أي إيموجي)
var TITLES_DB = window.TITLES_DB = [
    { id: 'title_player', title: 'لاعب', type: 'free', unlockDesc: 'اللقب الافتراضي' },
    { id: 'title_thinker', title: 'المفكر العبقري', type: 'achievement', reqAch: 'ach_correct', reqLvl: 2, unlockDesc: 'إنجاز: 300 سؤال صحيح' },
    { id: 'title_challenger', title: 'عاشق التحدي', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_knight', title: 'فارس الثقافة', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_star_hunter', title: 'صياد النجوم', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_mastermind', title: 'العقل المدبر', type: 'shop', price: 300, unlockDesc: 'متجر: 300 عملة' },
    { id: 'title_speedster', title: 'صاعقة السرعة', type: 'achievement', reqAch: 'ach_speed', reqLvl: 3, unlockDesc: 'إنجاز: 150 إجابة سريعة' },
    { id: 'title_gladiator', title: 'قاهر الرانك', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, unlockDesc: 'إنجاز: 60 فوز بالرانك' },
    { id: 'title_professor', title: 'البروفيسور', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'title_puzzle_king', title: 'ملك الألغاز', type: 'shop', price: 500, unlockDesc: 'متجر: 500 عملة' },
    { id: 'title_sniper', title: 'قناص الإجابات', type: 'shop', price: 600, unlockDesc: 'متجر: 600 عملة' },
    { id: 'title_warlord_title', title: 'سيد التحديات', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, unlockDesc: 'إنجاز: 100 فوز بالرانك' },
    { id: 'title_encyclopedia', title: 'موسوعة المعرفة', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'title_invincible', title: 'عقل لا يُقهر', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, unlockDesc: 'إنجاز: سلسلة 10 انتصارات' },
    { id: 'title_champion', title: 'بطل الأبطال', type: 'rank', reqRankTier: 'master', unlockDesc: 'بلوغ دوري أستاذ' },
    { id: 'title_legend', title: 'الأسطورة الخالدة', type: 'rank', reqRankTier: 'challenger', unlockDesc: 'بلوغ قمة المتحدي الأسطوري' }
];

let activeProfileTab = 'stats';
let activeCustomSubTab = 'avatars';

function switchCustomSubTab(subTabName) {
    activeCustomSubTab = subTabName;
    document.querySelectorAll('.custom-sub-tab').forEach(t => t.classList.remove('active'));

    const btn = document.getElementById(`subtab-${subTabName}`);
    if (btn) btn.classList.add('active');

    const contentAv = document.getElementById('subtab-content-avatars');
    const contentFr = document.getElementById('subtab-content-frames');
    const contentTi = document.getElementById('subtab-content-titles');

    if (contentAv) contentAv.style.display = (subTabName === 'avatars') ? 'block' : 'none';
    if (contentFr) contentFr.style.display = (subTabName === 'frames') ? 'block' : 'none';
    if (contentTi) contentTi.style.display = (subTabName === 'titles') ? 'block' : 'none';

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

let pendingAvatar = null;
let pendingFrame = null;
let pendingTitle = null;

function openPlayerProfileModal() {
    ensureUserProgressIntegrity();
    const modal = document.getElementById('player-profile-modal');
    if (!modal) return;

    pendingAvatar = userProgress.equippedAvatar || 'av_warrior';
    pendingFrame = userProgress.equippedFrame || 'frame_none';
    pendingTitle = userProgress.equippedTitle || 'لاعب';

    renderPlayerProfileHeader();
    switchProfileTab(activeProfileTab || 'stats');

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closePlayerProfileModal() {
    const modal = document.getElementById('player-profile-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function switchProfileTab(tabName) {
    activeProfileTab = tabName;
    document.querySelectorAll('.profile-nav-tab').forEach(t => t.classList.remove('active'));

    const tabBtn = document.getElementById(`tab-prof-${tabName}`);
    if (tabBtn) tabBtn.classList.add('active');

    const statsSec = document.getElementById('profile-stats-section');
    const customSec = document.getElementById('profile-custom-section');

    if (tabName === 'stats') {
        if (statsSec) statsSec.style.display = 'block';
        if (customSec) customSec.style.display = 'none';
        renderPlayerStatsContent();
    } else {
        if (statsSec) statsSec.style.display = 'none';
        if (customSec) customSec.style.display = 'block';
        renderCustomizationContent();
        switchCustomSubTab(activeCustomSubTab || 'avatars');
    }
}

function renderPlayerProfileHeader() {
    const avatarImg = document.getElementById('prof-header-avatar');
    const frameImg = document.getElementById('prof-header-frame-overlay');
    const nameElem = document.getElementById('prof-header-name');
    const titleElem = document.getElementById('prof-header-title');
    const rankElem = document.getElementById('prof-header-rank');

    const displayName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'لاعب';
    const currentAvObj = AVATARS_DB.find(a => a.id === pendingAvatar) || AVATARS_DB[0];
    const currentFrObj = FRAMES_DB.find(f => f.id === pendingFrame) || FRAMES_DB[0];
    const userRank = getUserCurrentRank();

    if (nameElem) nameElem.innerText = displayName;
    if (titleElem) titleElem.innerText = pendingTitle || 'لاعب';
    if (avatarImg) avatarImg.src = currentAvObj.src;

    if (frameImg) {
        if (currentFrObj.overlaySvg) {
            frameImg.src = currentFrObj.overlaySvg;
            frameImg.style.display = 'block';
        } else {
            frameImg.style.display = 'none';
        }
    }

    if (rankElem) {
        rankElem.innerHTML = `<span style="color: ${userRank.color}; font-weight: 800;"><i class="${userRank.icon}"></i> ${formatUserFullRankName()}</span>`;
    }
}

function renderPlayerStatsContent() {
    const totalRankedWins = userProgress.rankedWins || 0;
    const totalRankedLosses = userProgress.rankedLosses || 0;
    const totalRankedMatches = totalRankedWins + totalRankedLosses;
    const winRate = totalRankedMatches > 0 ? Math.round((totalRankedWins / totalRankedMatches) * 100) : 0;

    const rkWinsElem = document.getElementById('stat-val-rk-wins');
    const winRateElem = document.getElementById('stat-val-winrate');
    const highScoreElem = document.getElementById('stat-val-highscore');
    const maxStreakElem = document.getElementById('stat-val-maxstreak');

    if (rkWinsElem) rkWinsElem.innerText = toArabicNumerals(totalRankedWins);
    if (winRateElem) winRateElem.innerText = `${toArabicNumerals(winRate)}%`;
    if (highScoreElem) highScoreElem.innerText = toArabicNumerals(userProgress.highScore || 0);
    if (maxStreakElem) maxStreakElem.innerText = toArabicNumerals(userProgress.maxCorrectStreak || 0);

    const listContainer = document.getElementById('profile-category-accuracy-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const allCategories = [
        'إسلاميات', 'رياضة وكورة', 'علوم وفضاء', 'تاريخ', 'جغرافيا', 'سينما وفن',
        'طبيعة وحيوانات', 'تكنولوجيا وألعاب', 'أدب ولغات', 'سيارات ومحركات', 'ألغاز وذكاء', 'معلومات عامة'
    ];

    if (!userProgress.categoryStats) userProgress.categoryStats = {};

    allCategories.forEach(cat => {
        const catData = userProgress.categoryStats[cat] || { total: 0, correct: 0 };
        const style = CATEGORY_STYLES[cat] || { icon: 'fa-solid fa-shapes', color: 'var(--accent-purple)' };
        
        const accuracy = catData.total > 0 ? Math.round((catData.correct / catData.total) * 100) : 0;

        let barColor = 'var(--accent-green)';
        if (catData.total === 0) {
            barColor = 'rgba(255, 255, 255, 0.2)';
        } else if (accuracy < 40) {
            barColor = 'var(--accent-red)';
        } else if (accuracy < 65) {
            barColor = 'var(--accent-yellow)';
        } else if (accuracy < 80) {
            barColor = 'var(--accent-purple)';
        }

        const row = document.createElement('div');
        row.className = 'category-stat-row';
        row.innerHTML = `
            <div class="cat-stat-top">
                <div class="cat-stat-info">
                    <i class="${style.icon}" style="color: ${style.color};"></i>
                    <span class="cat-stat-name">${cat}</span>
                </div>
                <div class="cat-stat-meta">
                    <span class="cat-stat-percent" style="color: ${barColor};">${toArabicNumerals(accuracy)}%</span>
                    <small class="cat-stat-ratio">(${toArabicNumerals(catData.correct)}/${toArabicNumerals(catData.total)})</small>
                </div>
            </div>
            <div class="cat-stat-bar-track">
                <div class="cat-stat-bar-fill" style="width: ${accuracy}%; background: ${barColor};"></div>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function renderCustomizationContent() {
    renderAvatarsGrid();
    renderFramesGrid();
    renderTitlesList();
}

function isAvatarUnlocked(av) {
    if (av.type === 'free') return true;
    if (userProgress.unlockedAvatars && userProgress.unlockedAvatars.includes(av.id)) return true;

    if (av.type === 'achievement') {
        const achLvl = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[av.reqAch]) || 0;
        return achLvl >= av.reqLvl;
    }
    if (av.type === 'rank') {
        const userRank = getUserCurrentRank();
        const reqRank = getRankData(av.reqRankTier);
        return userRank.tier >= reqRank.tier;
    }
    return false;
}

function isFrameUnlocked(fr) {
    if (fr.type === 'free') return true;
    if (userProgress.unlockedFrames && userProgress.unlockedFrames.includes(fr.id)) return true;

    if (fr.type === 'achievement') {
        const achLvl = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[fr.reqAch]) || 0;
        return achLvl >= fr.reqLvl;
    }
    if (fr.type === 'rank') {
        const userRank = getUserCurrentRank();
        const reqRank = getRankData(fr.reqRankTier);
        return userRank.tier >= reqRank.tier;
    }
    return false;
}

function isTitleUnlocked(ti) {
    if (ti.type === 'free') return true;
    if (userProgress.unlockedTitles && userProgress.unlockedTitles.includes(ti.id)) return true;

    if (ti.type === 'achievement') {
        const achLvl = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[ti.reqAch]) || 0;
        return achLvl >= ti.reqLvl;
    }
    if (ti.type === 'rank') {
        const userRank = getUserCurrentRank();
        const reqRank = getRankData(ti.reqRankTier);
        return userRank.tier >= reqRank.tier;
    }
    return false;
}

function renderAvatarsGrid() {
    const grid = document.getElementById('custom-avatars-grid');
    if (!grid) return;
    grid.innerHTML = '';

    AVATARS_DB.forEach(av => {
        const unlocked = isAvatarUnlocked(av);
        const isSelected = (av.id === pendingAvatar);

        const card = document.createElement('div');
        card.className = `custom-item-card ${isSelected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;

        let actionBtnHtml = '';
        if (isSelected) {
            actionBtnHtml = `<span class="equipped-tag">محدد ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="selectPendingAvatar('${av.id}')">اختيار</button>`;
        } else if (av.type === 'shop') {
            const currentPrice = (typeof getCustomItemPrice === 'function') ? getCustomItemPrice(av.id, av.price) : av.price;
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyAvatar('${av.id}', ${currentPrice})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(currentPrice)}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${av.unlockDesc}</span>`;
        }

        card.innerHTML = `
            <div class="custom-avatar-wrapper">
                <img class="custom-card-img" src="${av.src}" alt="${av.name}">
            </div>
            <span class="custom-card-name">${av.name}</span>
            ${actionBtnHtml}
        `;
        grid.appendChild(card);
    });
}

function renderFramesGrid() {
    const grid = document.getElementById('custom-frames-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentAvObj = AVATARS_DB.find(a => a.id === pendingAvatar) || AVATARS_DB[0];

    FRAMES_DB.forEach(fr => {
        const unlocked = isFrameUnlocked(fr);
        const isSelected = (fr.id === pendingFrame);

        let actionBtnHtml = '';
        if (isSelected) {
            actionBtnHtml = `<span class="equipped-tag">محدد ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="selectPendingFrame('${fr.id}')">اختيار</button>`;
        } else if (fr.type === 'shop') {
            const currentPrice = (typeof getCustomItemPrice === 'function') ? getCustomItemPrice(fr.id, fr.price) : fr.price;
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyFrame('${fr.id}', ${currentPrice})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(currentPrice)}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${fr.unlockDesc}</span>`;
        }

        const card = document.createElement('div');
        card.className = `custom-item-card ${isSelected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="frame-preview-box">
                <img class="avatar-face-img" src="${currentAvObj.src}" alt="Preview">
                ${fr.overlaySvg ? `<img class="avatar-frame-overlay" src="${fr.overlaySvg}" alt="Frame">` : ''}
            </div>
            <span class="custom-card-name">${fr.name}</span>
            ${actionBtnHtml}
        `;
        grid.appendChild(card);
    });
}

function renderTitlesList() {
    const list = document.getElementById('custom-titles-list');
    if (!list) return;
    list.innerHTML = '';

    TITLES_DB.forEach(ti => {
        const unlocked = isTitleUnlocked(ti);
        const isSelected = (ti.title === pendingTitle);

        let actionBtnHtml = '';
        if (isSelected) {
            actionBtnHtml = `<span class="equipped-tag">محدد ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="selectPendingTitle('${ti.title}')">اختيار</button>`;
        } else if (ti.type === 'shop') {
            const currentPrice = (typeof getCustomItemPrice === 'function') ? getCustomItemPrice(ti.id, ti.price) : ti.price;
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyTitle('${ti.id}', '${ti.title}', ${currentPrice})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(currentPrice)}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${ti.unlockDesc}</span>`;
        }

        const row = document.createElement('div');
        row.className = `custom-title-row ${isSelected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        row.innerHTML = `
            <div class="custom-title-name">${ti.title}</div>
            ${actionBtnHtml}
        `;
        list.appendChild(row);
    });
}

function selectPendingAvatar(avId) {
    pendingAvatar = avId;
    renderPlayerProfileHeader();
    renderAvatarsGrid();
    renderFramesGrid();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectPendingFrame(frId) {
    pendingFrame = frId;
    renderPlayerProfileHeader();
    renderFramesGrid();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectPendingTitle(titleStr) {
    pendingTitle = titleStr;
    renderPlayerProfileHeader();
    renderTitlesList();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function buyAvatar(avId, price) {
    const av = AVATARS_DB.find(a => a.id === avId);
    if (!av) return;

    if ((userProgress.coins || 0) < price) {
        showCustomAlert('رصيدك من العملات غير كافٍ لشراء هذا الأفاتار!', 'رصيد غير كافٍ', '🪙');
        return;
    }

    userProgress.coins -= price;
    if (!userProgress.unlockedAvatars) userProgress.unlockedAvatars = ['av_warrior', 'av_ninja'];
    if (!userProgress.unlockedAvatars.includes(avId)) {
        userProgress.unlockedAvatars.push(avId);
    }
    pendingAvatar = avId;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! قمت بشراء [ ${av.name} ]! اضغط "حفظ وتطبيق المظهر" لاعتماده.`, 'تم الشراء!', '🎭');
    renderPlayerProfileHeader();
    renderAvatarsGrid();
    renderFramesGrid();
    updateHeaderStats();
}

function buyFrame(frId, price) {
    const fr = FRAMES_DB.find(f => f.id === frId);
    if (!fr) return;

    if ((userProgress.coins || 0) < price) {
        showCustomAlert('رصيدك من العملات غير كافٍ لشراء هذا الإطار!', 'رصيد غير كافٍ', '🪙');
        return;
    }

    userProgress.coins -= price;
    if (!userProgress.unlockedFrames) userProgress.unlockedFrames = ['frame_none'];
    if (!userProgress.unlockedFrames.includes(frId)) {
        userProgress.unlockedFrames.push(frId);
    }
    pendingFrame = frId;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! قمت بشراء إطار [ ${fr.name} ]! اضغط "حفظ وتطبيق المظهر" لاعتماده.`, 'تم الشراء!', '🖼️');
    renderPlayerProfileHeader();
    renderFramesGrid();
    updateHeaderStats();
}

function buyTitle(tiId, titleStr, price) {
    const ti = TITLES_DB.find(t => t.id === tiId);
    if (!ti) return;

    if ((userProgress.coins || 0) < price) {
        showCustomAlert('رصيدك من العملات غير كافٍ لشراء هذا اللقب!', 'رصيد غير كافٍ', '🪙');
        return;
    }

    userProgress.coins -= price;
    if (!userProgress.unlockedTitles) userProgress.unlockedTitles = ['title_player'];
    if (!userProgress.unlockedTitles.includes(tiId)) {
        userProgress.unlockedTitles.push(tiId);
    }
    pendingTitle = titleStr;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! قمت بشراء لقب [ ${titleStr} ]! اضغط "حفظ وتطبيق المظهر" لاعتماده.`, 'تم الشراء!', '🏷️');
    renderPlayerProfileHeader();
    renderTitlesList();
    updateHeaderStats();
}

// زر حفظ وتطبيق المظهر ومزامنته مع القائمة الرئيسية فوراً
function saveAndApplyCustomization() {
    userProgress.equippedAvatar = pendingAvatar || 'av_warrior';
    userProgress.equippedFrame = pendingFrame || 'frame_none';
    userProgress.equippedTitle = pendingTitle || 'لاعب';

    const avObj = AVATARS_DB.find(a => a.id === userProgress.equippedAvatar) || AVATARS_DB[0];
    const frObj = FRAMES_DB.find(f => f.id === userProgress.equippedFrame) || FRAMES_DB[0];

    if (currentUser) {
        currentUser.photoURL = avObj.src;
    }

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    applyCustomizationToHeader(avObj, frObj, userProgress.equippedTitle);

    showCustomAlert('✨ تم حفظ وتطبيق مظهرك الجديد بنجاح!', 'تم الحفظ!', '🎨');
    closePlayerProfileModal();
}

function applyCustomizationToHeader(avObj, frObj, titleStr) {
    const headerAvatar = document.getElementById('user-avatar');
    const headerFrameOverlay = document.getElementById('header-avatar-frame-overlay');
    const headerTitleElem = document.getElementById('header-user-title-display');

    if (!avObj) avObj = AVATARS_DB.find(a => a.id === (userProgress.equippedAvatar || 'av_warrior')) || AVATARS_DB[0];
    if (!frObj) frObj = FRAMES_DB.find(f => f.id === (userProgress.equippedFrame || 'frame_none')) || FRAMES_DB[0];
    if (!titleStr) titleStr = userProgress.equippedTitle || 'لاعب';

    if (headerAvatar) headerAvatar.src = avObj.src;

    if (headerFrameOverlay) {
        if (frObj.overlaySvg) {
            headerFrameOverlay.src = frObj.overlaySvg;
            headerFrameOverlay.style.display = 'block';
        } else {
            headerFrameOverlay.style.display = 'none';
        }
    }

    if (headerTitleElem) {
        headerTitleElem.innerText = `${titleStr}`;
    }
}


// js/features.js - المتصدرين، عجلة الحظ، الإنجازات، المتجر، وتثبيت PWA

// --- المتصدرين ---
function openLeaderboardScreen() {
    switchScreen('leaderboard-screen');
    fetchAndRenderLeaderboard();
}

function switchLeaderboardTab(tab) {
    gameState.leaderboardTab = tab;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    
    if (tab === 'ranked') {
        const t = document.getElementById('tab-lb-ranked');
        if (t) t.classList.add('active');
    } else if (tab === 'endless') {
        const t = document.getElementById('tab-lb-endless');
        if (t) t.classList.add('active');
    } else if (tab === 'pvp') {
        const t = document.getElementById('tab-lb-pvp');
        if (t) t.classList.add('active');
    }

    fetchAndRenderLeaderboard();
}

async function fetchAndRenderLeaderboard() {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('leaderboard-list');

    if (!listContainer) return;
    listContainer.innerHTML = '<div class="lb-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري تحميل الترتيب العالمي...</div>';
    if (podiumContainer) podiumContainer.innerHTML = '';

    const tab = gameState.leaderboardTab || 'ranked';
    let sortField = (tab === 'ranked') ? 'rankWeight' : ((tab === 'endless') ? 'highScore' : 'pvpWins');

    try {
        let players = [];
        if (typeof db !== 'undefined' && db) {
            try {
                const snapshot = await db.collection('users')
                    .orderBy(sortField, 'desc')
                    .limit(50)
                    .get();

                snapshot.forEach(doc => {
                    const d = doc.data();
                    players.push({
                        uid: doc.id,
                        name: d.name || 'لاعب',
                        photoURL: d.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                        rankTier: (d.progress && d.progress.rankTier) || d.rankTier || 'iron',
                        rankDivision: (d.progress && d.progress.rankDivision !== undefined) ? d.progress.rankDivision : (d.rankDivision !== undefined ? d.rankDivision : 3),
                        rankStars: (d.progress && d.progress.rankStars !== undefined) ? d.progress.rankStars : (d.rankStars || 0),
                        rankLP: (d.progress && d.progress.rankLP !== undefined) ? d.progress.rankLP : (d.rankLP || 0),
                        rankedWins: d.rankedWins || (d.progress && d.progress.rankedWins) || 0,
                        highScore: d.highScore || (d.progress && d.progress.highScore) || 0,
                        pvpWins: d.pvpWins || (d.progress && d.progress.pvpWins) || 0
                    });
                });
            } catch (dbErr) {
                // في حال عدم اكتمال فهرس Firestore، جلب المستخدمين وترتيبهم محلياً بدقة
                const fallbackSnap = await db.collection('users').limit(60).get();
                fallbackSnap.forEach(doc => {
                    const d = doc.data();
                    players.push({
                        uid: doc.id,
                        name: d.name || 'لاعب',
                        photoURL: d.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                        rankTier: (d.progress && d.progress.rankTier) || d.rankTier || 'iron',
                        rankDivision: (d.progress && d.progress.rankDivision !== undefined) ? d.progress.rankDivision : (d.rankDivision !== undefined ? d.rankDivision : 3),
                        rankStars: (d.progress && d.progress.rankStars !== undefined) ? d.progress.rankStars : (d.rankStars || 0),
                        rankLP: (d.progress && d.progress.rankLP !== undefined) ? d.progress.rankLP : (d.rankLP || 0),
                        rankedWins: d.rankedWins || (d.progress && d.progress.rankedWins) || 0,
                        highScore: d.highScore || (d.progress && d.progress.highScore) || 0,
                        pvpWins: d.pvpWins || (d.progress && d.progress.pvpWins) || 0
                    });
                });
            }
        }

        // التأكد من وجود اللاعب الحالي في اللائحة
        if (currentUser) {
            const exists = players.some(p => p.uid === currentUser.uid);
            if (!exists) {
                players.push({
                    uid: currentUser.uid,
                    name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب'),
                    photoURL: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                    rankTier: userProgress.rankTier || 'iron',
                    rankDivision: userProgress.rankDivision || 3,
                    rankStars: userProgress.rankStars || 0,
                    rankLP: userProgress.rankLP || 0,
                    rankedWins: userProgress.rankedWins || 0,
                    highScore: userProgress.highScore || 0,
                    pvpWins: userProgress.pvpWins || 0
                });
            }
        }

        // الترتيب المنطقي الصارم حسب التبويب المختار
        if (tab === 'ranked') {
            players.sort((a, b) => {
                const weightA = (typeof calculateRankSortWeight === 'function') ? calculateRankSortWeight(a) : 0;
                const weightB = (typeof calculateRankSortWeight === 'function') ? calculateRankSortWeight(b) : 0;
                if (weightB !== weightA) return weightB - weightA;
                return (b.rankedWins || 0) - (a.rankedWins || 0);
            });
        } else if (tab === 'endless') {
            players.sort((a, b) => (b.highScore || 0) - (a.highScore || 0));
        } else if (tab === 'pvp') {
            players.sort((a, b) => (b.pvpWins || 0) - (a.pvpWins || 0));
        }

        renderLeaderboardUI(players, tab);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        const localPlayers = [];
        if (currentUser) {
            localPlayers.push({
                uid: currentUser.uid,
                name: currentUser.isAnonymous ? 'ضيف اللعبة (أنت)' : (currentUser.displayName || 'أنت'),
                photoURL: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                rankTier: userProgress.rankTier || 'iron',
                rankDivision: userProgress.rankDivision || 3,
                rankStars: userProgress.rankStars || 0,
                rankLP: userProgress.rankLP || 0,
                rankedWins: userProgress.rankedWins || 0,
                highScore: userProgress.highScore || 0,
                pvpWins: userProgress.pvpWins || 0
            });
        }
        renderLeaderboardUI(localPlayers, tab);
    }
}

function formatLeaderboardScore(p, tab) {
    if (tab === 'ranked') {
        const rkTitle = (typeof formatUserFullRankName === 'function') ? formatUserFullRankName(p) : 'الحديدي';
        const rk = (typeof getRankData === 'function') ? getRankData(p.rankTier) : { icon: 'fa-solid fa-shield', color: '#94a3b8' };
        if (rk.isApex) {
            return `<span style="color: ${rk.color}; font-weight:bold;"><i class="${rk.icon}"></i> ${rkTitle}</span> (${p.rankLP || 0} LP)`;
        }
        return `<span style="color: ${rk.color}; font-weight:bold;"><i class="${rk.icon}"></i> ${rkTitle}</span> (${p.rankStars || 0} ⭐)`;
    }
    if (tab === 'pvp') return `${p.pvpWins || 0} فوز ⚔️`;
    return `${p.highScore || 0} نقطة`;
}

function renderLeaderboardUI(players, tab) {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (!players || players.length === 0) {
        listContainer.innerHTML = '<div class="lb-loading">لا توجد بيانات متاحة حالياً.</div>';
        updateMyRankFooter([], tab);
        return;
    }

    const top1 = players[0] || null;
    const top2 = players[1] || null;
    const top3 = players[2] || null;

    if (podiumContainer && top1) {
        let podiumHtml = '';

        if (top2) {
            const val2 = formatLeaderboardScore(top2, tab);
            podiumHtml += `
                <div class="podium-item podium-second">
                    <div class="podium-avatar-box">
                        <img class="podium-avatar" src="${top2.photoURL}" alt="${top2.name}">
                        <div class="podium-rank-badge">2</div>
                    </div>
                    <span class="podium-name">${top2.name}</span>
                    <span class="podium-score">${val2}</span>
                    <div class="podium-stand">2</div>
                </div>
            `;
        }

        const val1 = formatLeaderboardScore(top1, tab);
        podiumHtml += `
            <div class="podium-item podium-first">
                <div class="podium-avatar-box">
                    <img class="podium-avatar" src="${top1.photoURL}" alt="${top1.name}">
                    <div class="podium-rank-badge">👑</div>
                </div>
                <span class="podium-name">${top1.name}</span>
                <span class="podium-score">${val1}</span>
                <div class="podium-stand">1</div>
            </div>
        `;

        if (top3) {
            const val3 = formatLeaderboardScore(top3, tab);
            podiumHtml += `
                <div class="podium-item podium-third">
                    <div class="podium-avatar-box">
                        <img class="podium-avatar" src="${top3.photoURL}" alt="${top3.name}">
                        <div class="podium-rank-badge">3</div>
                    </div>
                    <span class="podium-name">${top3.name}</span>
                    <span class="podium-score">${val3}</span>
                    <div class="podium-stand">3</div>
                </div>
            `;
        }

        podiumContainer.innerHTML = podiumHtml;
    }

    const restPlayers = players.slice(3);
    if (restPlayers.length > 0) {
        restPlayers.forEach((p, idx) => {
            const rank = idx + 4;
            const isMe = currentUser && (p.uid === currentUser.uid);
            const scoreText = formatLeaderboardScore(p, tab);
            let subText = (tab === 'ranked') ? `انتصارات: ${p.rankedWins || 0}` : ((tab === 'pvp') ? `انتصارات: ${p.pvpWins || 0}` : `أعلى سكور`);

            const card = document.createElement('div');
            card.className = `lb-item-card ${isMe ? 'is-current-user' : ''}`;
            card.innerHTML = `
                <div class="lb-rank-num">#${rank}</div>
                <img class="lb-user-avatar" src="${p.photoURL}" alt="${p.name}">
                <div class="lb-user-details">
                    <span class="lb-user-name">${p.name} ${isMe ? '<small style="color:var(--accent-purple);">(أنت)</small>' : ''}</span>
                    <span class="lb-user-sub">${subText}</span>
                </div>
                <div class="lb-user-val">${scoreText}</div>
            `;
            listContainer.appendChild(card);
        });
    }

    updateMyRankFooter(players, tab);
}

function updateMyRankFooter(players, tab) {
    const posElem = document.getElementById('my-rank-pos');
    const nameElem = document.getElementById('my-rank-name');
    const avatarElem = document.getElementById('my-rank-avatar');
    const subElem = document.getElementById('my-rank-sub');
    const valElem = document.getElementById('my-rank-val');

    if (!currentUser) return;

    const myUid = currentUser.uid;
    const myIndex = players ? players.findIndex(p => p.uid === myUid) : -1;
    const myRank = myIndex !== -1 ? `#${myIndex + 1}` : '#--';

    if (posElem) posElem.innerText = myRank;
    if (nameElem) nameElem.innerText = currentUser.isAnonymous ? 'ضيف اللعبة (أنت)' : (currentUser.displayName || 'أنت');
    if (avatarElem) avatarElem.src = currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    if (tab === 'ranked') {
        const rkTitle = (typeof formatUserFullRankName === 'function') ? formatUserFullRankName(userProgress) : 'الحديدي';
        const rk = (typeof getUserCurrentRank === 'function') ? getUserCurrentRank() : { icon: 'fa-solid fa-shield', color: '#94a3b8' };
        if (subElem) subElem.innerText = `انتصارات الرانك: ${userProgress.rankedWins || 0}`;
        if (rk.isApex) {
            if (valElem) valElem.innerHTML = `<span style="color: ${rk.color}; font-weight:bold;"><i class="${rk.icon}"></i> ${rkTitle}</span> (${userProgress.rankLP || 0} LP)`;
        } else {
            if (valElem) valElem.innerHTML = `<span style="color: ${rk.color}; font-weight:bold;"><i class="${rk.icon}"></i> ${rkTitle}</span> (${userProgress.rankStars || 0} ⭐)`;
        }
    } else if (tab === 'pvp') {
        if (subElem) subElem.innerText = `انتصارات التحدي الجماعي`;
        if (valElem) valElem.innerText = `${userProgress.pvpWins || 0} فوز ⚔️`;
    } else {
        if (subElem) subElem.innerText = `أعلى سكور صمود`;
        if (valElem) valElem.innerText = `${userProgress.highScore || 0} نقطة`;
    }
}

// --- عجلة الحظ اليومية ---
function openWheelScreen() {
    switchScreen('wheel-screen');
    checkWheelStatus();
    drawWheel();
}

function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSectors = WHEEL_SECTORS.length;
    const arc = (2 * Math.PI) / numSectors;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(wheelCurrentAngle);

    for (let i = 0; i < numSectors; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = WHEEL_SECTORS[i].color;
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + arc);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Cairo";
        ctx.fillText(WHEEL_SECTORS[i].label, radius - 18, 5);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, 2 * Math.PI);
    ctx.fillStyle = "#161b22";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
}

function checkWheelStatus() {
    const badge = document.getElementById('wheel-badge');
    const spinText = document.getElementById('spin-btn-text');
    const statusText = document.getElementById('wheel-status-text');
    const isFree = (userProgress.lastWheelDate !== getTodayString());

    if (badge) badge.style.display = isFree ? 'flex' : 'none';
    if (spinText) spinText.innerText = isFree ? 'تدوير مجاني' : 'تدوير (25 عملة)';
    if (statusText) {
        statusText.innerText = isFree 
            ? 'لديك لفة مجانية متاحة اليوم!' 
            : 'اللفة اليومية تم استخدامها، يمكنك التدوير بـ 25 عملة.';
    }
}

function spinLuckyWheel() {
    if (isWheelSpinning) return;

    const isFree = (userProgress.lastWheelDate !== getTodayString());
    if (!isFree) {
        if ((userProgress.coins || 0) < 25) {
            showCustomAlert('تحتاج 25 عملة للتدوير الإضافي!', 'رصيد غير كافٍ', '🪙');
            return;
        }
        userProgress.coins -= 25;
        saveProgress();
        updateHeaderStats();
    }

    isWheelSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    const winningIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const numSectors = WHEEL_SECTORS.length;
    const arc = (2 * Math.PI) / numSectors;

    const targetAngleOnSector = (3 * Math.PI / 2) - (winningIndex * arc + arc / 2);
    const extraRotations = (5 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
    const finalAngle = extraRotations + targetAngleOnSector;

    let start = null;
    const duration = 4500;
    const initialAngle = wheelCurrentAngle % (2 * Math.PI);
    let lastTickAngle = 0;

    function animateWheel(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        wheelCurrentAngle = initialAngle + (finalAngle - initialAngle) * easeOut;

        if (Math.abs(wheelCurrentAngle - lastTickAngle) >= arc) {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playTick();
            lastTickAngle = wheelCurrentAngle;
        }

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateWheel);
        } else {
            isWheelSpinning = false;
            if (spinBtn) spinBtn.disabled = false;
            
            if (isFree) {
                userProgress.lastWheelDate = getTodayString();
                saveProgress();
            }

            giveWheelReward(WHEEL_SECTORS[winningIndex]);
            checkWheelStatus();
        }
    }

    requestAnimationFrame(animateWheel);
}

function giveWheelReward(sector) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    if (sector.type === "coins") {
        userProgress.coins = (userProgress.coins || 0) + sector.value;
        showCustomAlert(`فزت بـ ${sector.value} عملة ذهبية!`, 'مبروك!', '🎉');
    } else if (sector.type === "item") {
        if (!userProgress.inventory) userProgress.inventory = {};
        userProgress.inventory[sector.value] = (userProgress.inventory[sector.value] || 0) + 1;
        showCustomAlert(`فزت بوسيلة مساعدة: [${sector.label}] في مخزونك!`, 'مبروك!', '🎁');
    }

    saveProgress();
    updateHeaderStats();
}

// --- سجل الإنجازات ---
function openAchievementsScreen() {
    switchScreen('achievements-screen');
    renderAchievementsList();
}

function getAchievementCurrentLevelData(ach, claimedLevel) {
    const maxLvl = (ach.levels && ach.levels.length) ? ach.levels.length : 1;
    const isMaxed = claimedLevel >= maxLvl;
    const lvlIdx = isMaxed ? maxLvl - 1 : Math.max(0, Math.min(claimedLevel, maxLvl - 1));
    const lvlData = (ach.levels && ach.levels[lvlIdx]) ? ach.levels[lvlIdx] : { target: 100, reward: 50, rewardName: '50 عملة' };
    return { isMaxed, lvlData, maxLvl };
}

function checkAllAchievements() {
    if (!userProgress.infiniteLevels) userProgress.infiniteLevels = {};
    if (!userProgress.claimedInfiniteLevels) userProgress.claimedInfiniteLevels = {};

    let newlyUnlocked = false;

    if (typeof INFINITE_ACHIEVEMENTS !== 'undefined' && Array.isArray(INFINITE_ACHIEVEMENTS)) {
        INFINITE_ACHIEVEMENTS.forEach(ach => {
            const val = typeof ach.getProgress === 'function' ? ach.getProgress(userProgress) : (userProgress[ach.id] || 0);
            let currentUnlockedLvl = userProgress.infiniteLevels[ach.id] || 0;

            if (ach.levels && Array.isArray(ach.levels)) {
                ach.levels.forEach((lvl, idx) => {
                    const levelNum = idx + 1;
                    if (val >= lvl.target && levelNum > currentUnlockedLvl) {
                        currentUnlockedLvl = levelNum;
                        newlyUnlocked = true;
                        showAchievementToast(ach, levelNum);
                    }
                });
            }

            userProgress.infiniteLevels[ach.id] = currentUnlockedLvl;
        });
    }

    if (newlyUnlocked) {
        saveProgress();
        updateAchievementBadge();
    }
}

function showAchievementToast(ach, level) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    const toast = document.getElementById('achievement-toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastName = document.getElementById('toast-name');

    if (toast && toastIcon && toastName) {
        toastIcon.innerHTML = `<i class="${ach.icon || 'fa-solid fa-trophy'}"></i>`;
        toastName.innerText = `${ach.title || ach.name} (مستوى ${toArabicNumerals(level)})`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

function updateAchievementBadge() {
    const badge = document.getElementById('achievements-badge');
    if (!badge) return;

    let claimableCount = 0;
    if (typeof INFINITE_ACHIEVEMENTS !== 'undefined' && Array.isArray(INFINITE_ACHIEVEMENTS)) {
        INFINITE_ACHIEVEMENTS.forEach(ach => {
            const unlocked = (userProgress.infiniteLevels && userProgress.infiniteLevels[ach.id]) || 0;
            const claimed = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[ach.id]) || 0;
            const maxLvl = ach.levels ? ach.levels.length : 1;
            if (claimed < maxLvl && unlocked > claimed) {
                claimableCount += (unlocked - claimed);
            }
        });
    }

    if (claimableCount > 0) {
        badge.innerText = toArabicNumerals(claimableCount);
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderAchievementsList() {
    checkAllAchievements();
    const list = document.getElementById('achievements-list');
    const countDisplay = document.getElementById('ach-unlocked-count');

    let totalClaimed = 0;
    if (typeof INFINITE_ACHIEVEMENTS !== 'undefined' && Array.isArray(INFINITE_ACHIEVEMENTS)) {
        INFINITE_ACHIEVEMENTS.forEach(a => {
            totalClaimed += ((userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[a.id]) || 0);
        });
    }

    if (countDisplay) countDisplay.innerText = `إجمالي المستويات المكتملة: ${toArabicNumerals(totalClaimed)}`;
    if (!list) return;
    list.innerHTML = '';

    if (typeof INFINITE_ACHIEVEMENTS !== 'undefined' && Array.isArray(INFINITE_ACHIEVEMENTS)) {
        INFINITE_ACHIEVEMENTS.forEach(ach => {
            const unlockedLvl = (userProgress.infiniteLevels && userProgress.infiniteLevels[ach.id]) || 0;
            const claimedLvl = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[ach.id]) || 0;
            const { isMaxed, lvlData, maxLvl } = getAchievementCurrentLevelData(ach, claimedLvl);

            const currentVal = typeof ach.getProgress === 'function' ? ach.getProgress(userProgress) : 0;
            const targetGoal = lvlData.target;
            const progressPercent = isMaxed ? 100 : Math.min(100, Math.round((currentVal / targetGoal) * 100));
            const canClaim = !isMaxed && (unlockedLvl > claimedLvl);

            const descText = typeof ach.desc === 'function' ? ach.desc(toArabicNumerals(targetGoal)) : (ach.desc || '');

            const card = document.createElement('div');
            card.className = `achievement-card ${canClaim ? 'completed' : ''} ${isMaxed ? 'maxed' : ''}`;

            let claimBtnHtml = '';
            if (isMaxed) {
                claimBtnHtml = `<span class="ach-maxed-badge">مكتمل بالكامل 👑</span>`;
            } else if (canClaim) {
                claimBtnHtml = `<button class="ach-claim-btn" onclick="claimAchievementReward('${ach.id}')"><i class="fa-solid fa-gift"></i> استلام (${lvlData.rewardName || (lvlData.reward + ' عملة')})</button>`;
            } else {
                claimBtnHtml = `<span class="ach-reward-preview"><i class="fa-solid fa-gift"></i> الجائزة: ${lvlData.rewardName || (lvlData.reward + ' عملة')}</span>`;
            }

            card.innerHTML = `
                <div class="ach-icon-box" style="color: ${ach.color || 'var(--accent-yellow)'};">
                    <i class="${ach.icon || 'fa-solid fa-trophy'}"></i>
                </div>
                <div class="ach-info-box">
                    <div class="ach-title-row">
                        <h4>${ach.title || ach.name} <small style="font-size: 0.75rem; color: var(--accent-purple); font-weight: bold;">${isMaxed ? '(مكتمل)' : `(مستوى ${toArabicNumerals(claimedLvl + 1)} من ${toArabicNumerals(maxLvl)})`}</small></h4>
                        ${claimBtnHtml}
                    </div>
                    <div class="ach-desc">${descText}</div>
                    <div class="ach-progress-container">
                        <div class="ach-progress-bar" style="width: ${progressPercent}%; background: ${ach.color || 'var(--accent-green)'};"></div>
                    </div>
                </div>
                <span style="font-size: 0.8rem; color: var(--accent-yellow); font-weight: bold; min-width: 50px; text-align: left;">${toArabicNumerals(Math.min(currentVal, targetGoal))}/${toArabicNumerals(targetGoal)}</span>
            `;

            list.appendChild(card);
        });
    }
}

function claimAchievementReward(achId) {
    const ach = INFINITE_ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return;

    if (!userProgress.claimedInfiniteLevels) userProgress.claimedInfiniteLevels = {};
    const claimedLvl = userProgress.claimedInfiniteLevels[achId] || 0;
    const { isMaxed, lvlData } = getAchievementCurrentLevelData(ach, claimedLvl);
    if (isMaxed) return;

    userProgress.claimedInfiniteLevels[achId] = claimedLvl + 1;
    userProgress.coins = (userProgress.coins || 0) + (lvlData.reward || 50);

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! استلمت مكافأة [ ${ach.title || ach.name} ]: ${lvlData.rewardName || (lvlData.reward + ' عملة ذهبية')}!`, 'إنجاز مكتمل!', '🏆');

    checkAllAchievements();
    updateHeaderStats();
    renderAchievementsList();
    updateAchievementBadge();
}

// --- متجر المساعدات ---
function openShopScreen() {
    switchScreen('shop-screen');
    updateShopDisplay();
}

function updateShopDisplay() {
    const inv50 = document.getElementById('inv-5050');
    const invTime = document.getElementById('inv-time');
    const invSkip = document.getElementById('inv-skip');
    const shopCoins = document.getElementById('shop-coins-display');

    const inv = userProgress.inventory || { hint5050: 0, addTime: 0, skip: 0 };

    if (inv50) inv50.innerText = toArabicNumerals(inv.hint5050 || 0);
    if (invTime) invTime.innerText = toArabicNumerals(inv.addTime || 0);
    if (invSkip) invSkip.innerText = toArabicNumerals(inv.skip || 0);
    if (shopCoins) shopCoins.innerText = toArabicNumerals(userProgress.coins || 0);

    // تحديث أسعار أزرار متجر المساعدات بدقة
    const p50 = (typeof getShopItemPrice === 'function') ? getShopItemPrice('hint5050') : 20;
    const pTime = (typeof getShopItemPrice === 'function') ? getShopItemPrice('addTime') : 15;
    const pSkip = (typeof getShopItemPrice === 'function') ? getShopItemPrice('skip') : 30;
    const pReward = (typeof getShopItemPrice === 'function') ? getShopItemPrice('dailyFreeReward') : 30;

    const btn50 = document.getElementById('btn-buy-5050');
    const btnTime = document.getElementById('btn-buy-time');
    const btnSkip = document.getElementById('btn-buy-skip');
    const rewardDesc = document.getElementById('free-reward-desc');

    if (btn50) btn50.innerHTML = `<i class="fa-solid fa-coins"></i> ${toArabicNumerals(p50)}`;
    if (btnTime) btnTime.innerHTML = `<i class="fa-solid fa-coins"></i> ${toArabicNumerals(pTime)}`;
    if (btnSkip) btnSkip.innerHTML = `<i class="fa-solid fa-coins"></i> ${toArabicNumerals(pSkip)}`;
    if (rewardDesc) rewardDesc.innerText = `احصل على ${toArabicNumerals(pReward)} عملة ذهبية`;

    const isClaimedToday = (userProgress.lastFreeRewardDate === getTodayString());
    const rewardBtn = document.getElementById('claim-reward-btn');
    if (rewardBtn) {
        rewardBtn.disabled = isClaimedToday;
        rewardBtn.innerText = isClaimedToday ? 'تم الاستلام اليوم' : 'استلام مجاناً';
    }
}

function buyItem(itemKey, cost = null, quantity = 1) {
    const itemCost = (cost !== null) ? cost : ((typeof getShopItemPrice === 'function') ? getShopItemPrice(itemKey) : 20);

    if ((userProgress.coins || 0) < itemCost) {
        showCustomAlert('رصيدك من العملات غير كافٍ!', 'تنبيه', '🪙');
        return;
    }

    if (!userProgress.inventory) userProgress.inventory = {};

    userProgress.coins -= itemCost;
    userProgress.inventory[itemKey] = (userProgress.inventory[itemKey] || 0) + quantity;
    userProgress.itemsPurchased = (userProgress.itemsPurchased || 0) + 1;
    
    saveProgress();
    checkAllAchievements();
    updateHeaderStats();
    updateShopDisplay();
    
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();
}

function claimFreeReward() {
    const today = getTodayString();
    if (userProgress.lastFreeRewardDate === today) {
        showCustomAlert('لقد استلمت هديتك المجانية لليوم بالفعل! عُد غداً لهدية جديدة.', 'هدية المتجر', '⏳');
        return;
    }

    userProgress.lastFreeRewardDate = today;
    userProgress.coins = (userProgress.coins || 0) + 30;
    saveProgress();
    updateHeaderStats();
    updateShopDisplay();

    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert('استلمت 30 عملة ذهبية كهدية يومية!', 'مبروك!', '🎉');
}

// --- إحصائيات الشريط العلوي ---
function updateHeaderStats() {
    const val = userProgress.coins || 0;
    const scoreElem = document.getElementById('score-display');
    const headerCoins = document.getElementById('header-coins-val');
    const wheelCoins = document.getElementById('wheel-coins-display');
    const achCoins = document.getElementById('ach-coins-display');
    const shopCoins = document.getElementById('shop-coins-display');
    const lbCoins = document.getElementById('lb-coins-display');

    if (scoreElem) scoreElem.innerText = val;
    if (headerCoins) headerCoins.innerText = val;
    if (wheelCoins) wheelCoins.innerText = val;
    if (achCoins) achCoins.innerText = val;
    if (shopCoins) shopCoins.innerText = val;
    if (lbCoins) lbCoins.innerText = val;

    if (typeof getUserCurrentRank === 'function' && typeof formatUserFullRankName === 'function') {
        const rk = getUserCurrentRank();
        const fullTitle = formatUserFullRankName();
        const headerRank = document.getElementById('header-user-rank-pill');
        const modesTag = document.getElementById('modes-current-rank-tag');

        if (headerRank) {
            headerRank.innerHTML = `<span style="color: ${rk.color}; font-weight: bold;"><i class="${rk.icon}"></i> ${fullTitle}</span>`;
        }

        if (modesTag) {
            const starsOrLp = rk.isApex ? `${userProgress.rankLP || 0} LP` : `${userProgress.rankStars || 0} ⭐`;
            modesTag.innerHTML = `<span style="color: #000; font-weight: 800;"><i class="${rk.icon}"></i> ${fullTitle} (${starsOrLp})</span>`;
        }
    }
}

// --- تثبيت التطبيق كـ PWA ---
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    checkPwaInstallBanner();
});

function checkPwaInstallBanner() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.style.display = isStandalone ? 'none' : 'flex';
    }
}

function installAppPWA() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        showCustomAlert("لتثبيت اللعبة على الآيفون: اضغط على زر المشاركة (Share) أسفل المتصفح ثم اختر إضافة إلى الصفحة الرئيسية.", "تثبيت اللعبة", "📲");
        return;
    }

    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                const banner = document.getElementById('pwa-install-banner');
                if (banner) banner.style.display = 'none';
            }
            deferredInstallPrompt = null;
        });
    } else {
        showCustomAlert("لتثبيت التطبيق على هاتفك: اضغط على قائمة المتصفح (الثلاث نقاط أعلى المتصفح) ثم اختر تثبيت التطبيق أو إضافة للشاشة الرئيسية.", "تثبيت التطبيق", "💡");
    }
}


// js/auth-nav.js - إدارة الحسابات، تسجيل الدخول، والتنقل بين الشاشات

function loginWithGoogle() {
    if (!navigator.onLine || typeof auth === 'undefined' || !auth) {
        showCustomAlert('أنت غير متصل بالإنترنت حالياً. يرجى الاتصال بالإنترنت لتسجيل الدخول.', 'غير متصل', '📶');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            auth.signInWithRedirect(provider);
        } else {
            showCustomAlert('خطأ في تسجيل الدخول: ' + error.message, 'خطأ', '⚠️');
        }
    });
}

function loginAsGuest() {
    if (typeof auth !== 'undefined' && auth && navigator.onLine) {
        auth.signInAnonymously().catch(() => {
            setupLocalGuest();
        });
    } else {
        setupLocalGuest();
    }
}

function setupLocalGuest() {
    const guestUid = localStorage.getItem('law_offline_uid') || ('guest_' + Math.floor(10000 + Math.random() * 90000));
    localStorage.setItem('law_offline_uid', guestUid);
    
    currentUser = {
        uid: guestUid,
        displayName: 'ضيف اللعبة',
        isAnonymous: true,
        photoURL: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    };
    
    localStorage.setItem('local_offline_guest', JSON.stringify(currentUser));
    updateUserProfileUI(currentUser);
    if (typeof updateHeaderStats === 'function') updateHeaderStats();
    if (typeof applyLiveConfigUpdates === 'function') applyLiveConfigUpdates();
    if (typeof checkDailyStatus === 'function') checkDailyStatus();
    if (typeof checkWheelStatus === 'function') checkWheelStatus();
    if (typeof checkAllAchievements === 'function') checkAllAchievements();
    if (typeof drawWheel === 'function') drawWheel();
    
    switchScreen('main-menu', false);
    hideSplashScreenNow();
}

function logoutCurrentUser() {
    showCustomConfirm(
        'هل ترغب حقاً في تسجيل الخروج من حسابك الحالي؟',
        () => {
            localStorage.removeItem('local_offline_guest');
            if (typeof auth !== 'undefined' && auth) {
                auth.signOut().then(() => {
                    localStorage.removeItem('law_ta3raf_progress');
                    switchScreen('auth-screen', false);
                }).catch(() => {
                    switchScreen('auth-screen', false);
                });
            } else {
                switchScreen('auth-screen', false);
            }
        },
        null,
        'تسجيل الخروج',
        'تسجيل الخروج',
        'إلغاء',
        '🚪'
    );
}

function updateUserProfileUI(user) {
    const nameElem = document.getElementById('user-name');
    const avatarElem = document.getElementById('user-avatar');

    if (nameElem) nameElem.innerText = (user.isAnonymous || user.isOffline) ? 'ضيف اللعبة' : (user.displayName || 'لاعب');
    if (avatarElem) avatarElem.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
}

function switchScreen(screenId, pushToHistory = true) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    clearInterval(gameState.timerInterval);
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = '';
    });
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        gameState.currentScreen = screenId;
        window.scrollTo(0, 0);
    }

    if (pushToHistory) {
        history.pushState({ screen: screenId }, "", `#${screenId}`);
    }

    if (typeof updateHeaderStats === 'function') updateHeaderStats();
    if (typeof applyLiveConfigUpdates === 'function') applyLiveConfigUpdates();
    if (screenId === 'achievements-screen' && typeof renderAchievementsList === 'function') renderAchievementsList();
    if (screenId === 'wheel-screen' && typeof drawWheel === 'function') drawWheel();
    if (screenId === 'settings-screen') loadSettingsValues();
    if (screenId === 'shop-screen' && typeof updateShopDisplay === 'function') updateShopDisplay();
}

function handleNavigationBack() {
    // 1. فحص النوافذ المنبثقة أولاً وإغلاقها دون الرجوع لأي شاشة
    const openModals = [
        { id: 'ranked-info-modal', closeFn: closeRankedInfoModal },
        { id: 'player-profile-modal', closeFn: closePlayerProfileModal },
        { id: 'reactions-modal-overlay', closeFn: () => { const m = document.getElementById('reactions-modal-overlay'); if (m) m.classList.remove('show'); } },
        { id: 'image-zoom-modal', closeFn: closeImageZoomModal },
        { id: 'custom-confirm-modal', closeFn: () => closeCustomConfirm(false) },
        { id: 'custom-modal', closeFn: closeCustomAlert },
        { id: 'pvp-category-modal', closeFn: closePvpCategoryModal },
        { id: 'suggest-cat-picker-modal', closeFn: closeSuggestCategoryPicker },
        { id: 'suggest-diff-picker-modal', closeFn: closeSuggestDiffPicker },
        { id: 'suggest-question-modal', closeFn: closeSuggestQuestionModal }
    ];

    for (const modalObj of openModals) {
        const elem = document.getElementById(modalObj.id);
        if (elem && elem.classList.contains('show')) {
            modalObj.closeFn();
            return true;
        }
    }

    const current = gameState.currentScreen || 'main-menu';

    // 2. إذا كان اللاعب داخل جولة لعب حية
    if (current === 'game-screen') {
        showCustomConfirm(
            'هل تريد حقاً مغادرة الجولة الحالية؟ ستفقد تقدمك في هذه الجولة.',
            () => {
                if (gameState.mode === 'pvp') leavePvpRoom();
                else switchScreen('modes-screen', false);
            },
            null,
            'مغادرة الجولة',
            'نعم، خروج',
            'البقاء في اللعبة',
            '🚪'
        );
        return true;
    }

    // 3. شاشات الأونلاين والغرف
    if (current === 'pvp-waiting-screen' || current === 'pvp-lobby-screen' || current === 'pvp-result-screen' || current === 'pvp-waiting-opponent-screen') {
        leavePvpRoom();
        return true;
    }

    // 4. شاشات الرانك والمواجهة
    if (current === 'ranked-versus-screen' || current === 'ranked-result-screen' || current === 'ranked-waiting-opponent-screen') {
        switchScreen('modes-screen', false);
        return true;
    }

    // 5. الشاشات الفرعية -> رجوع مباشر للقائمة الرئيسية دون إظهار نافذة الخروج
    if (current === 'admin-panel-screen') { switchScreen('settings-screen', false); return true; }
    if (current === 'modes-screen' || current === 'leaderboard-screen' || current === 'wheel-screen' || current === 'achievements-screen' || current === 'shop-screen' || current === 'settings-screen') {
        switchScreen('main-menu', false);
        return true;
    }

    if (current === 'result-screen') {
        switchScreen('modes-screen', false);
        return true;
    }

    if (current === 'review-screen') {
        switchScreen('result-screen', false);
        return true;
    }

    // 6. في القائمة الرئيسية فقط: إظهار نافذة تأكيد إغلاق اللعبة
    if (current === 'main-menu') {
        showCustomConfirm(
            'هل ترغب في إغلاق اللعبة والخروج؟',
            () => {
                // محاولة إغلاق النافذة أو الرجوع في سجل المتصفح
                window.close();
                history.back();
            },
            () => {
                history.pushState({ screen: 'main-menu' }, "", "#main-menu");
            },
            'إغلاق اللعبة',
            'خروج',
            'إلغاء',
            '👋'
        );
        return true;
    }

    switchScreen('main-menu', false);
    return true;
}

// مراقبة زر الرجوع في الهاتف (Android Hardware Back Button / Popstate)
let isNavigatingBack = false;
window.addEventListener('popstate', (event) => {
    if (isNavigatingBack) return;
    isNavigatingBack = true;

    handleNavigationBack();

    setTimeout(() => {
        isNavigatingBack = false;
    }, 200);
});

// دفع حالة أساسية في سجل المتصفح لضمان عمل زر الرجوع دائماً
window.addEventListener('DOMContentLoaded', () => {
    if (!history.state || history.state.screen !== 'main-menu') {
        history.replaceState({ screen: 'main-menu' }, "", "#main-menu");
    }
});

function hideSplashScreenNow() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }
}

function openSettingsScreen() { 
    switchScreen('settings-screen'); 
}

function loadSettingsValues() {
    const soundChk = document.getElementById('setting-sound');
    const vibrateChk = document.getElementById('setting-vibrate');
    if (soundChk) soundChk.checked = localStorage.getItem('sound_enabled') !== 'false';
    if (vibrateChk) vibrateChk.checked = localStorage.getItem('vibrate_enabled') !== 'false';
}

function toggleSoundSetting(enabled) {
    localStorage.setItem('sound_enabled', enabled);
    if (enabled && typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function toggleVibrateSetting(enabled) {
    localStorage.setItem('vibrate_enabled', enabled);
    if (enabled && navigator.vibrate) navigator.vibrate(50);
}

function resetAllProgress() {
    showCustomConfirm(
        '⚠️ تحذير: هل أنت متأكد من حذف كل تقدمك وإعادة اللعبة كأنك حملتها للتو؟ لن تتمكن من استرجاع هذا التقدم.',
        () => {
            localStorage.removeItem('law_ta3raf_progress');
            localStorage.removeItem('cached_questions_bank');
            localStorage.removeItem('local_offline_guest');
            if (db && currentUser && !currentUser.isOffline) {
                db.collection('users').doc(currentUser.uid).delete().catch(() => {});
            }
            showCustomAlert('تمت إعادة ضبط اللعبة بالكامل بنجاح!', 'تم الضبط', '🔄');
            setTimeout(() => location.reload(), 1200);
        },
        null,
        'إعادة ضبط التقدم',
        'حذف وضبط',
        'إلغاء',
        '⚠️'
    );
}


// js/app.js - نقطة البداية وتشغيل التطبيق بعد تحميل كافة الملفات

function checkOnlineStatus() {
    const offlineScreen = document.getElementById('offline-screen');
    if (!offlineScreen) return;

    if (!navigator.onLine) {
        offlineScreen.style.display = 'flex';
    } else {
        offlineScreen.style.display = 'none';
    }
}

function checkNetworkAndRetry() {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    if (navigator.onLine) {
        const offlineScreen = document.getElementById('offline-screen');
        if (offlineScreen) offlineScreen.style.display = 'none';
        location.reload();
    } else {
        showCustomAlert('لا زلت غير متصل بالإنترنت! يرجى تشغيل الـ Wi-Fi أو بيانات الهاتف والمحاولة مجدداً.', 'تنبيه الاتصال', '📶');
    }
}

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

function initAuthAndApp() {
    if (typeof auth !== 'undefined' && auth) {
        auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    currentUser = user;
                    updateUserProfileUI(user);
                    await loadCloudProgress(user.uid);
                    
                    if (typeof checkAndApplySeasonReset === 'function') checkAndApplySeasonReset();
                    if (typeof updateHeaderStats === 'function') updateHeaderStats();
                    if (typeof checkAndShowAdminButton === 'function') checkAndShowAdminButton();
                    if (typeof applyCustomizationToHeader === 'function') applyCustomizationToHeader();
                    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();
                    if (typeof checkDailyStatus === 'function') checkDailyStatus();
    if (typeof initLiveConfigListener === 'function') initLiveConfigListener();
                    if (typeof checkWheelStatus === 'function') checkWheelStatus();
                    if (typeof checkAllAchievements === 'function') checkAllAchievements();
                    if (typeof drawWheel === 'function') drawWheel();

                    switchScreen('main-menu', false);
                } else {
                    const localGuest = localStorage.getItem('local_offline_guest');
                    if (localGuest) {
                        try {
                            currentUser = JSON.parse(localGuest);
                            updateUserProfileUI(currentUser);
                            if (typeof checkAndApplySeasonReset === 'function') checkAndApplySeasonReset();
                    if (typeof updateHeaderStats === 'function') updateHeaderStats();
                    if (typeof checkAndShowAdminButton === 'function') checkAndShowAdminButton();
                    if (typeof applyCustomizationToHeader === 'function') applyCustomizationToHeader();
                    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();
                            if (typeof checkDailyStatus === 'function') checkDailyStatus();
    if (typeof initLiveConfigListener === 'function') initLiveConfigListener();
                            if (typeof checkWheelStatus === 'function') checkWheelStatus();
                            if (typeof checkAllAchievements === 'function') checkAllAchievements();
                            if (typeof drawWheel === 'function') drawWheel();
                            switchScreen('main-menu', false);
                        } catch(e) {
                            currentUser = null;
                            switchScreen('auth-screen', false);
                        }
                    } else {
                        currentUser = null;
                        switchScreen('auth-screen', false);
                    }
                }
            } catch (err) {
                console.warn('Auth state processing error:', err);
                switchScreen('auth-screen', false);
            } finally {
                hideSplashScreenNow();
            }
        });
    } else {
        const localGuest = localStorage.getItem('local_offline_guest');
        if (localGuest) {
            try {
                currentUser = JSON.parse(localGuest);
                updateUserProfileUI(currentUser);
                switchScreen('main-menu', false);
            } catch(e) {
                switchScreen('auth-screen', false);
            }
        } else {
            switchScreen('auth-screen', false);
        }
        hideSplashScreenNow();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    history.replaceState({ screen: 'main-menu' }, "", "#main-menu");
    checkOnlineStatus();
    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'flex';
    }

    initAuthAndApp();

    if (navigator.onLine) {
        try {
            await loadQuestionsFromPublishedSheet();
        } catch(e) {}
    }

    setTimeout(hideSplashScreenNow, 1200);
});
