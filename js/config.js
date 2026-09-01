// js/config.js - إعدادات النظام، التهيئة، والمتغيرات العامة

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmve4Q3DU8ITcd4p6CYlEUiP4fvwLGRAevzmiBHwluw_J7k_NTa9pLWoxrHKme0cmlrQqZ2wA8VwlC/pub?output=csv";

// إعدادات Firebase
const firebaseConfig = {
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

        // تفعيل حفظ البيانات أوفلاين في Firestore
        if (db && db.enablePersistence) {
            db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
                console.warn('Firestore offline persistence status:', err.code);
            });
        }

        if (typeof firebase.analytics === 'function') {
            firebase.analytics();
        }
    } catch (e) {
        console.warn('Firebase init warning (offline mode):', e);
    }
}

// المتغيرات العامة للحالة
let currentUser = null;

let gameState = {
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
    leaderboardTab: 'endless',
    pvpRoomId: null,
    isPvpHost: false,
    pvpUnsubscribe: null,
    pvpRoomData: null
};

// إعدادات عجلة الحظ
const WHEEL_SECTORS = [
    { label: "15 عملة", type: "coins", value: 15, color: "#3b82f6" },
    { label: "50:50", type: "item", value: "hint5050", color: "#8b5cf6" },
    { label: "30 عملة", type: "coins", value: 30, color: "#10b981" },
    { label: "+10 ثواني", type: "item", value: "addTime", color: "#f59e0b" },
    { label: "50 عملة", type: "coins", value: 50, color: "#06b6d4" },
    { label: "تخطي", type: "item", value: "skip", color: "#ec4899" },
    { label: "150 عملة", type: "coins", value: 150, color: "#eab308" },
    { label: "20 عملة", type: "coins", value: 20, color: "#6366f1" }
];

let isWheelSpinning = false;
let wheelCurrentAngle = 0;

// إعدادات الإنجازات
const INFINITE_ACHIEVEMENTS = [
    { id: 'ach_pvp', name: 'سيد التحديات الأونلاين', desc: 'اهزم أصدقاءك في مباريات وتحديات الغرف', icon: '⚔️', stat: 'pvpWins', baseGoal: 1, stepGoal: 3, baseReward: 20, stepReward: 10, maxLevel: 5 },
    { id: 'ach_correct', name: 'موسوعة المعرفة', desc: 'أجب على أسئلة صحيحة عبر كل الأنماط', icon: '🧠', stat: 'totalCorrect', baseGoal: 25, stepGoal: 50, baseReward: 15, stepReward: 10, maxLevel: 6 },
    { id: 'ach_streak', name: 'القناص الذي لا يخطئ', desc: 'أجب على أسئلة متتالية صحيحة في نفس الجلسة', icon: '🏹', stat: 'maxCorrectStreak', baseGoal: 5, stepGoal: 10, baseReward: 15, stepReward: 8, maxLevel: 5 },
    { id: 'ach_speed', name: 'سريع كالبرق', desc: 'أجب على الأسئلة في أقل من 3 ثوانٍ', icon: '⚡', stat: 'fastAnswersCount', baseGoal: 10, stepGoal: 20, baseReward: 15, stepReward: 8, maxLevel: 5 },
    { id: 'ach_endless', name: 'أسطورة الصمود', desc: 'حقق نقاطاً قياسية في المود اللانهائي', icon: '🔥', stat: 'highScore', baseGoal: 30, stepGoal: 40, baseReward: 20, stepReward: 10, maxLevel: 5 },
    { id: 'ach_daily', name: 'المثابر الحديدي', desc: 'حافظ على سلسلة التحدي اليومي', icon: '📅', stat: 'dailyStreak', baseGoal: 3, stepGoal: 5, baseReward: 25, stepReward: 12, maxLevel: 5 },
    { id: 'ach_shopper', name: 'تاجر الأدوات', desc: 'اشترِ وسائل مساعدة من المتجر لدعم رحلتك', icon: '🛍️', stat: 'itemsPurchased', baseGoal: 3, stepGoal: 5, baseReward: 15, stepReward: 8, maxLevel: 5 }
];

// أيقونات وتنسيقات الأقسام
const CATEGORY_STYLES = {
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

// ثوابت النمط اللانهائي
const ENDLESS_REPEAT_COOLDOWN_MS = 5 * 24 * 60 * 60 * 1000;

// بيانات تقدم المستخدم المحفوظة
let userProgress = JSON.parse(localStorage.getItem('law_ta3raf_progress')) || {
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
    endlessSeenAt: {}
};

// استعادة الجلسة المحفوظة أوفلاين إن وجدت
const savedOfflineGuest = localStorage.getItem('local_offline_guest');
if (savedOfflineGuest) {
    try {
        currentUser = JSON.parse(savedOfflineGuest);
    } catch(e) {}
}

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
            progress: userProgress,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(err => console.log('Cloud Sync err:', err));
    }
}

async function loadCloudProgress(uid) {
    if (!db) return;
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists && doc.data().progress) {
            userProgress = { ...userProgress, ...doc.data().progress };
            localStorage.setItem('law_ta3raf_progress', JSON.stringify(userProgress));
        } else {
            saveProgress();
        }
    } catch (e) {
        console.log('Error loading cloud progress:', e);
    }
}
