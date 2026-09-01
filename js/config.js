// الإعدادات الديناميكية القابلة للتعديل المباشر من لوحة المشرف
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
