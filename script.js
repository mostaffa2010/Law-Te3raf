// ==========================================================================
// script.js - المحرك البرمجي الشامل للعبة "لَو تِعرَف"
// ==========================================================================

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmve4Q3DU8ITcd4p6CYlEUiP4fvwLGRAevzmiBHwluw_J7k_NTa9pLWoxrHKme0cmlrQqZ2wA8VwlC/pub?output=csv";

// ---------------- تهيئة Firebase السحابية ---------------- //
const firebaseConfig = {
  apiKey: "AIzaSyDELtkkAkxym1CospHaGdLt6TNCEKZAc1A",
  authDomain: "law-te3raf.firebaseapp.com",
  projectId: "law-te3raf",
  storageBucket: "law-te3raf.firebasestorage.app",
  messagingSenderId: "613977492704",
  appId: "1:613977492704:web:53bb5863f419750c9dd485",
  measurementId: "G-RFXCZ62K8F"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

if (typeof firebase.analytics === 'function') {
    firebase.analytics();
}

let currentUser = null;

// مصفوفة المراحل المتوازنة الثابتة
let structuredLevelsBank = [];

// حالة اللعبة العامة
let gameState = {
    currentScreen: 'auth-screen',
    mode: 'levels',
    currentLevel: 1,
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
    leaderboardTab: 'stars',
    // بيانات نمط التحدي الجماعي PvP
    pvpRoomId: null,
    isPvpHost: false,
    pvpUnsubscribe: null,
    pvpRoomData: null
};

// دالة موحدة لضمان جلب بنك الأسئلة الحالي من الشيت
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

// خوارزمية الخلط العشوائي الحقيقية (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function calculateTotalStars() {
    let sum = 0;
    if (userProgress.levelStars) {
        for (let lvl in userProgress.levelStars) {
            sum += (userProgress.levelStars[lvl] || 0);
        }
    }
    return sum;
}

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// عجلة الحظ
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

// نظام الإنجازات (كل إنجاز له سقف مستويات، وبعده يفضل "مكتمل" بلا مكافآت إضافية)
const INFINITE_ACHIEVEMENTS = [
    { id: 'ach_pvp', name: 'سيد التحديات الأونلاين', desc: 'اهزم أصدقاءك في مباريات وتحديات الغرف', icon: '⚔️', stat: 'pvpWins', baseGoal: 1, stepGoal: 3, baseReward: 20, stepReward: 10, maxLevel: 5 },
    { id: 'ach_correct', name: 'موسوعة المعرفة', desc: 'أجب على أسئلة صحيحة عبر كل الأنماط', icon: '🧠', stat: 'totalCorrect', baseGoal: 25, stepGoal: 50, baseReward: 15, stepReward: 10, maxLevel: 6 },
    { id: 'ach_levels', name: 'قاهر المراحل', desc: 'تقدم في رحلة المراحل وافتح آفاقاً جديدة', icon: '🗺️', stat: 'unlockedLevel', baseGoal: 5, stepGoal: 5, baseReward: 20, stepReward: 8, maxLevel: 6 },
    { id: 'ach_streak', name: 'القناص الذي لا يخطئ', desc: 'أجب على أسئلة متتالية صحيحة في نفس الجلسة', icon: '🏹', stat: 'maxCorrectStreak', baseGoal: 5, stepGoal: 10, baseReward: 15, stepReward: 8, maxLevel: 5 },
    { id: 'ach_speed', name: 'سريع كالبرق', desc: 'أجب على الأسئلة في أقل من 3 ثوانٍ', icon: '⚡', stat: 'fastAnswersCount', baseGoal: 10, stepGoal: 20, baseReward: 15, stepReward: 8, maxLevel: 5 },
    { id: 'ach_flawless', name: 'الأداء الأسطوري', desc: 'أنهِ مراحل بـ 3 نجوم كاملة بدون وسائل مساعدة', icon: '💎', stat: 'flawlessWins', baseGoal: 2, stepGoal: 5, baseReward: 20, stepReward: 10, maxLevel: 5 },
    { id: 'ach_endless', name: 'أسطورة الصمود', desc: 'حقق نقاطاً قياسية في المود اللانهائي', icon: '🔥', stat: 'highScore', baseGoal: 30, stepGoal: 40, baseReward: 20, stepReward: 10, maxLevel: 5 },
    { id: 'ach_daily', name: 'المثابر الحديدي', desc: 'حافظ على سلسلة التحدي اليومي', icon: '📅', stat: 'dailyStreak', baseGoal: 3, stepGoal: 5, baseReward: 25, stepReward: 12, maxLevel: 5 },
    { id: 'ach_shopper', name: 'تاجر الأدوات', desc: 'اشترِ وسائل مساعدة من المتجر لدعم رحلتك', icon: '🛍️', stat: 'itemsPurchased', baseGoal: 3, stepGoal: 5, baseReward: 15, stepReward: 8, maxLevel: 5 }
];

// بيانات تقدم اللاعب
let userProgress = JSON.parse(localStorage.getItem('law_ta3raf_progress')) || {
    unlockedLevel: 1,
    levelStars: {},
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
    flawlessWins: 0,
    pvpWins: 0,
    itemsPurchased: 0,
    infiniteLevels: {},
    claimedInfiniteLevels: {},
    endlessSeenAt: {}
};

function getAchGoal(ach, level) { return ach.baseGoal + (level * ach.stepGoal); }
function getAchReward(ach, level) { return ach.baseReward + (level * ach.stepReward); }

// طور اللانهاية: أي سؤال اتشاف، ميظهرش تاني لنفس اللاعب إلا بعد 5 أيام
const ENDLESS_REPEAT_COOLDOWN_MS = 5 * 24 * 60 * 60 * 1000;

function getEndlessQuestionQueue() {
    if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};

    const fullBank = getActiveQuestionsBank();
    const now = Date.now();

    // تنضيف أي تواريخ قديمة أكتر من 5 أيام عشان الملف ميكبرش من غير داعي
    Object.keys(userProgress.endlessSeenAt).forEach(id => {
        if (now - userProgress.endlessSeenAt[id] > ENDLESS_REPEAT_COOLDOWN_MS) {
            delete userProgress.endlessSeenAt[id];
        }
    });

    const fresh = fullBank.filter(q => !userProgress.endlessSeenAt[q.id]);

    // لو بنك الأسئلة (أو الفلتر) قليل جدًا، نكمّل بالأقدم ظهورًا الأول عشان الجولة متقفش
    const stale = fullBank
        .filter(q => userProgress.endlessSeenAt[q.id])
        .sort((a, b) => userProgress.endlessSeenAt[a.id] - userProgress.endlessSeenAt[b.id]);

    return [...shuffleArray(fresh), ...stale];
}

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

// ---------------- المزامنة والحفظ في Firestore ---------------- //

function saveProgress() {
    localStorage.setItem('law_ta3raf_progress', JSON.stringify(userProgress));

    if (currentUser && currentUser.uid) {
        const totalStars = calculateTotalStars();
        const displayName = currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب');
        const photoURL = currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

        db.collection('users').doc(currentUser.uid).set({
            name: displayName,
            photoURL: photoURL,
            isAnonymous: currentUser.isAnonymous,
            totalStars: totalStars,
            unlockedLevel: userProgress.unlockedLevel || 1,
            highScore: userProgress.highScore || 0,
            pvpWins: userProgress.pvpWins || 0,
            progress: userProgress,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(err => console.log('Cloud Sync err:', err));
    }
}

async function loadCloudProgress(uid) {
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

// ---------------- خوارزمية بناء المراحل المتوازنة الثابتة ---------------- //

// بذرة ثابتة للعشوائية الحتمية — نفس النتيجة عند كل اللاعبين طول ما البذرة ثابتة.
// تحذير: متغيرش الرقم ده أبدًا بعد ما اللعبة تنزل للاعبين، غير ده هيغيّر توزيع كل المراحل عندهم كلهم.
const LEVEL_BUILD_SEED = 20260831;

function mulberry32(seed) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function deterministicShuffle(arr, rand) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// أنواع المراحل: سهلة / متوسطة / صعبة، بتتكرر بالدورة على طول تسلسل المراحل
const LEVEL_DIFFICULTY_TIERS = [
    { min: 1, max: 5 },  // سهلة
    { min: 3, max: 8 },  // متوسطة
    { min: 5, max: 10 }, // صعبة
];

// خوارزمية التوزيع الأساسية: بتاخد مجموعة أسئلة (كلها لسه ملهاش مرحلة) وتبنيلها مراحل جديدة،
// بادئة من نوع المرحلة (tier) اللي المفروض يجي بعد آخر مرحلة موجودة فعلاً (startLevelIndex)
function assignQuestionsToTierLevels(questionsList, startLevelIndex, questionsPerLevel = 10) {
    if (!questionsList || questionsList.length === 0) return [];

    const numLevels = Math.floor(questionsList.length / questionsPerLevel);
    if (numLevels === 0) return [];

    const rand = mulberry32(LEVEL_BUILD_SEED);

    const catBuckets = {};
    questionsList.forEach(q => {
        const cat = q.category || 'معلومات عامة';
        if (!catBuckets[cat]) catBuckets[cat] = [];
        catBuckets[cat].push(q);
    });
    const sortedCategories = Object.keys(catBuckets).sort();
    sortedCategories.forEach(cat => {
        catBuckets[cat] = deterministicShuffle(catBuckets[cat], rand);
    });

    const used = new Set();
    const levels = Array.from({ length: numLevels }, () => []);
    let catIndex = 0;

    for (let lvl = 0; lvl < numLevels; lvl++) {
        const tier = LEVEL_DIFFICULTY_TIERS[(startLevelIndex + lvl) % LEVEL_DIFFICULTY_TIERS.length];
        let scanned = 0;
        while (levels[lvl].length < questionsPerLevel && scanned < sortedCategories.length) {
            const cat = sortedCategories[catIndex % sortedCategories.length];
            catIndex++;
            const match = catBuckets[cat].find(q =>
                !used.has(q.id) && (q.difficulty || 1) >= tier.min && (q.difficulty || 1) <= tier.max
            );
            if (match) {
                used.add(match.id);
                levels[lvl].push(match);
                scanned = 0;
            } else {
                scanned++;
            }
        }
    }

    const leftovers = deterministicShuffle(questionsList.filter(q => !used.has(q.id)), rand);
    let leftoverPtr = 0;
    for (let lvl = 0; lvl < numLevels && leftoverPtr < leftovers.length; lvl++) {
        while (levels[lvl].length < questionsPerLevel && leftoverPtr < leftovers.length) {
            const q = leftovers[leftoverPtr];
            if (!used.has(q.id)) {
                used.add(q.id);
                levels[lvl].push(q);
            }
            leftoverPtr++;
        }
    }

    return levels;
}

// بناء المراحل النهائي: المراحل "المجمّدة" (جايه من Firestore، مصدر حقيقة واحد لكل اللاعبين)
// بتفضل زي ما هي حرفيًا، وأي أسئلة جديدة لسه ملهاش مرحلة بتتجمع منها مراحل إضافية جديدة
function buildDeterministicLevelsBank(questionsList, frozenSource, questionsPerLevel = 10) {
    if (!questionsList || questionsList.length === 0) return [];

    const questionsById = new Map();
    questionsList.forEach(q => questionsById.set(q.id, q));

    const source = Array.isArray(frozenSource) ? frozenSource : [];
    const frozenLevels = [];
    const usedIds = new Set();

    source.forEach(idList => {
        const levelQuestions = idList
            .map(id => questionsById.get(id))
            .filter(Boolean); // لو سؤال اتشال من الشيت نفسه، بيتجاهل بدل ما يبوظ المرحلة
        idList.forEach(id => usedIds.add(id));
        frozenLevels.push(levelQuestions);
    });

    const newQuestions = questionsList.filter(q => !usedIds.has(q.id));
    const newLevels = assignQuestionsToTierLevels(newQuestions, frozenLevels.length, questionsPerLevel);

    return [...frozenLevels, ...newLevels];
}

// المزامنة التلقائية: بتقرا آخر نسخة "مجمّدة" من Firestore، ولو فيه أسئلة جديدة كفاية
// لمرحلة كاملة أو أكتر، بتجمّدها هي نفسها بأمان (transaction بتمنع أي تعارض لو أكتر
// من لاعب فتح اللعبة في نفس اللحظة بالظبط) وترجّع النسخة النهائية المحدّثة.
// ده بيحصل تلقائي من غير أي تدخل — أول لاعب يفتح اللعبة بعد إضافة أسئلة جديدة هو اللي "يقفلها".
async function syncLevelsBankWithCloud(liveQuestions, questionsPerLevel = 10) {
    const docRef = db.collection('system').doc('levelsBank');

    try {
        const snap = await docRef.get();
        const cloudFrozen = (snap.exists && Array.isArray(snap.data().levels)) ? snap.data().levels : [];

        const usedIds = new Set();
        cloudFrozen.forEach(idList => idList.forEach(id => usedIds.add(id)));
        const newQuestionsCount = liveQuestions.filter(q => !usedIds.has(q.id)).length;

        // مفيش أسئلة جديدة كفاية لمرحلة كاملة → مفيش داعي نكتب على Firestore خالص
        if (Math.floor(newQuestionsCount / questionsPerLevel) === 0) {
            localStorage.setItem('cached_levels_bank', JSON.stringify(cloudFrozen));
            return cloudFrozen;
        }

        // فيه أسئلة جديدة كفاية، نجمّدها بأمان جوه transaction
        const finalFrozen = await db.runTransaction(async (tx) => {
            const freshSnap = await tx.get(docRef);
            const freshFrozen = (freshSnap.exists && Array.isArray(freshSnap.data().levels)) ? freshSnap.data().levels : [];

            const freshUsedIds = new Set();
            freshFrozen.forEach(idList => idList.forEach(id => freshUsedIds.add(id)));

            const freshNewQuestions = liveQuestions.filter(q => !freshUsedIds.has(q.id));
            const newLevels = assignQuestionsToTierLevels(freshNewQuestions, freshFrozen.length, questionsPerLevel);

            if (newLevels.length === 0) return freshFrozen; // حد تاني سبقنا وجمدها فعلاً

            const updated = [...freshFrozen, ...newLevels.map(lvl => lvl.map(q => q.id))];
            tx.set(docRef, { levels: updated, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            return updated;
        });

        localStorage.setItem('cached_levels_bank', JSON.stringify(finalFrozen));
        return finalFrozen;
    } catch (err) {
        console.log('⚠️ تعذّرت مزامنة المراحل مع Firestore، هنستخدم آخر نسخة معروفة محليًا:', err);
        const cached = localStorage.getItem('cached_levels_bank');
        return cached ? JSON.parse(cached) : [];
    }
}

function getExactLevelQuestions(levelNumber) {
    const bank = getActiveQuestionsBank();
    if (!structuredLevelsBank || structuredLevelsBank.length === 0) {
        const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
        structuredLevelsBank = buildDeterministicLevelsBank(bank, cachedFrozen);
    }

    const index = levelNumber - 1;
    if (structuredLevelsBank[index] && structuredLevelsBank[index].length > 0) {
        return structuredLevelsBank[index];
    }

    return getSmartQuestions(10);
}

// ==========================================================================
// محرك غرف التحدي الجماعي Multiplayer Party Battle
// ==========================================================================

function openPvpLobbyScreen() {
    switchScreen('pvp-lobby-screen');
}

function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

async function createPvpRoom() {
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً لتحدي أصدقائك!');
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
        alert('حدث خطأ أثناء إنشاء الغرفة: ' + e.message);
    }
}

async function joinPvpRoom() {
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً!');
        return;
    }

    const input = document.getElementById('pvp-room-code-input');
    const roomCode = input ? input.value.trim() : '';

    if (!roomCode || roomCode.length !== 5) {
        alert('يرجى إدخال كود غرفة صحيح مكون من 5 أرقام!');
        return;
    }

    try {
        const docRef = db.collection('pvp_rooms').doc(roomCode);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            alert('الغرفة غير موجودة! تأكد من صحة الكود من صديقك.');
            return;
        }

        const data = docSnap.data();
        if (data.status !== 'waiting') {
            alert('عذراً، بدأت هذه المباراة بالفعل ولا يمكن الانضمام إليها الآن!');
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
        alert('خطأ أثناء الانضمام للغرفة: ' + e.message);
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
        alert(`تم نسخ الكود [ ${code} ]! شاركه مع أصدقائك الآن.`);
    } else {
        alert(`كود الغرفة هو: ${code}`);
    }
}

function listenToPvpRoom(code) {
    if (gameState.pvpUnsubscribe) gameState.pvpUnsubscribe();

    gameState.pvpUnsubscribe = db.collection('pvp_rooms').doc(code).onSnapshot((doc) => {
        if (!doc.exists) {
            alert('تم إغلاق الغرفة من قِبل المضيف.');
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

        if (data.status === 'starting') {
            triggerPvpCountdown(data);
        }

        if (playersList.length > 0 && playersList.every(p => p.finished === true)) {
            renderGroupPvpResults(playersList);
        }
    });
}

async function hostStartPartyMatch() {
    if (!gameState.pvpRoomId || !gameState.isPvpHost) return;

    try {
        await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({
            status: 'starting'
        });
    } catch (e) {
        alert('خطأ أثناء بدء التحدي: ' + e.message);
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
    } catch (e) {
        console.error('Error submitting score:', e);
    }
}

function renderGroupPvpResults(playersList) {
    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    switchScreen('pvp-result-screen');

    // الترتيب: حسب الإجابات الصحيحة أولاً، ثم السرعة (النقاط) عند التساوي
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

// ---------------- إدارة لوحة المتصدرين Global Leaderboard ---------------- //

function openLeaderboardScreen() {
    switchScreen('leaderboard-screen');
    fetchAndRenderLeaderboard();
}

function switchLeaderboardTab(tab) {
    gameState.leaderboardTab = tab;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    
    if (tab === 'stars') document.getElementById('tab-lb-stars').classList.add('active');
    else if (tab === 'endless') document.getElementById('tab-lb-endless').classList.add('active');
    else if (tab === 'pvp') document.getElementById('tab-lb-pvp').classList.add('active');

    fetchAndRenderLeaderboard();
}

async function fetchAndRenderLeaderboard() {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('leaderboard-list');

    if (!listContainer) return;
    listContainer.innerHTML = '<div class="lb-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري تحميل الترتيب العالمي...</div>';
    if (podiumContainer) podiumContainer.innerHTML = '';

    const tab = gameState.leaderboardTab;
    let sortField = 'totalStars';
    if (tab === 'endless') sortField = 'highScore';
    else if (tab === 'pvp') sortField = 'pvpWins';

    try {
        const snapshot = await db.collection('users')
            .orderBy(sortField, 'desc')
            .limit(50)
            .get();

        let players = [];
        snapshot.forEach(doc => {
            const d = doc.data();
            players.push({
                uid: doc.id,
                name: d.name || 'لاعب',
                photoURL: d.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                totalStars: d.totalStars || 0,
                unlockedLevel: d.unlockedLevel || 1,
                highScore: d.highScore || 0,
                pvpWins: d.pvpWins || 0
            });
        });

        if (players.length === 0 && currentUser) {
            players.push({
                uid: currentUser.uid,
                name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب'),
                photoURL: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                totalStars: calculateTotalStars(),
                unlockedLevel: userProgress.unlockedLevel || 1,
                highScore: userProgress.highScore || 0,
                pvpWins: userProgress.pvpWins || 0
            });
        }

        renderLeaderboardUI(players, tab);
    } catch (error) {
        console.error('Leaderboard Fetch Error:', error);
        listContainer.innerHTML = '<div class="lb-loading" style="color: var(--accent-red);">تعذر تحميل قائمة المتصدرين حالياً.</div>';
    }
}

function formatLeaderboardScore(p, tab) {
    if (tab === 'stars') return `${p.totalStars} ⭐`;
    if (tab === 'endless') return `${p.highScore} نقطة`;
    return `${p.pvpWins || 0} فوز ⚔️`;
}

function renderLeaderboardUI(players, tab) {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = '';

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
            let subText = `إجمالي النجوم: ${p.totalStars}`;
            if (tab === 'stars') subText = `وصل للمرحلة ${p.unlockedLevel}`;
            else if (tab === 'pvp') subText = `انتصارات الغرف: ${p.pvpWins || 0}`;

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
    const myIndex = players.findIndex(p => p.uid === myUid);
    const myRank = myIndex !== -1 ? `#${myIndex + 1}` : '#50+';

    if (posElem) posElem.innerText = myRank;
    if (nameElem) nameElem.innerText = currentUser.isAnonymous ? 'ضيف اللعبة (أنت)' : (currentUser.displayName || 'أنت');
    if (avatarElem) avatarElem.src = currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    if (tab === 'stars') {
        if (subElem) subElem.innerText = `وصلت للمرحلة ${userProgress.unlockedLevel || 1}`;
        if (valElem) valElem.innerText = `${calculateTotalStars()} ⭐`;
    } else if (tab === 'endless') {
        if (subElem) subElem.innerText = `أعلى سكور صمود`;
        if (valElem) valElem.innerText = `${userProgress.highScore || 0} نقطة`;
    } else if (tab === 'pvp') {
        if (subElem) subElem.innerText = `انتصارات التحدي الجماعي`;
        if (valElem) valElem.innerText = `${userProgress.pvpWins || 0} فوز ⚔️`;
    }
}

// ---------------- إدارة المصادقة ---------------- //

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        updateUserProfileUI(user);
        await loadCloudProgress(user.uid);
        
        renderLevelsGrid();
        updateHeaderStats();
        checkDailyStatus();
        checkWheelStatus();
        checkAllAchievements();
        drawWheel();

        switchScreen('main-menu', false);
    } else {
        currentUser = null;
        switchScreen('auth-screen', false);
    }
    hideSplashScreenNow();
});

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            auth.signInWithRedirect(provider);
        } else {
            alert('خطأ في تسجيل الدخول: ' + error.message);
        }
    });
}

function loginAsGuest() {
    auth.signInAnonymously().catch((error) => {
        alert('خطأ أثناء الدخول كضيف: ' + error.message);
    });
}

function logoutCurrentUser() {
    auth.signOut().then(() => {
        localStorage.removeItem('law_ta3raf_progress');
        switchScreen('auth-screen', false);
    });
}

function updateUserProfileUI(user) {
    const nameElem = document.getElementById('user-name');
    const avatarElem = document.getElementById('user-avatar');

    if (nameElem) nameElem.innerText = user.isAnonymous ? 'ضيف اللعبة' : (user.displayName || 'لاعب');
    if (avatarElem) avatarElem.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
}

// ---------------- التنقل وإدارة زر الرجوع الذكي ---------------- //

function switchScreen(screenId, pushToHistory = true) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    clearInterval(gameState.timerInterval);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        gameState.currentScreen = screenId;
    }

    if (pushToHistory) {
        history.pushState({ screen: screenId }, "", `#${screenId}`);
    }

    updateHeaderStats();
    if (screenId === 'achievements-screen') renderAchievementsList();
    if (screenId === 'levels-screen') renderLevelsGrid();
    if (screenId === 'wheel-screen') drawWheel();
    if (screenId === 'settings-screen') loadSettingsValues();
    if (screenId === 'shop-screen') updateShopDisplay();
}

function handleNavigationBack() {
    const current = gameState.currentScreen;

    if (current === 'game-screen') {
        if (confirm('هل تريد حقاً مغادرة الجولة الحالية؟')) {
            if (gameState.mode === 'pvp') leavePvpRoom();
            else switchScreen('modes-screen', false);
        } else {
            history.pushState({ screen: 'game-screen' }, "", "#game-screen");
        }
    } else if (current === 'pvp-waiting-screen' || current === 'pvp-lobby-screen' || current === 'pvp-result-screen' || current === 'pvp-waiting-opponent-screen') {
        leavePvpRoom();
    } else if (current === 'modes-screen' || current === 'leaderboard-screen' || current === 'wheel-screen' || current === 'achievements-screen' || current === 'shop-screen' || current === 'settings-screen') {
        switchScreen('main-menu', false);
    } else if (current === 'levels-screen' || current === 'categories-screen' || current === 'result-screen') {
        switchScreen('modes-screen', false);
    } else if (current === 'review-screen') {
        switchScreen('result-screen', false);
    } else if (current === 'main-menu') {
        if (confirm('هل ترغب في إغلاق اللعبة والخروج؟')) {
            history.back();
        } else {
            history.pushState({ screen: 'main-menu' }, "", "#main-menu");
        }
    } else {
        switchScreen('main-menu', false);
    }
}

window.addEventListener('popstate', () => {
    handleNavigationBack();
});

document.addEventListener('DOMContentLoaded', async () => {
    history.replaceState({ screen: 'main-menu' }, "", "#main-menu");

    // دعم إظهار بانر التثبيت على أجهزة iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'flex';
    }

    if (!auth.currentUser) switchScreen('auth-screen', false);
    if (navigator.onLine) await loadQuestionsFromPublishedSheet();
    setTimeout(hideSplashScreenNow, 1200);
});

function hideSplashScreenNow() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hide');
}

// ---------------- الإعدادات وعجلة الحظ ---------------- //

function openSettingsScreen() { switchScreen('settings-screen'); }

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
    if (confirm('⚠️ تحذير: هل أنت متأكد من حذف كل تقدمك وإعادة اللعبة كأنك حملتها للتو؟')) {
        localStorage.removeItem('law_ta3raf_progress');
        localStorage.removeItem('cached_questions_bank');
        if (currentUser) db.collection('users').doc(currentUser.uid).delete();
        alert('تمت إعادة ضبط اللعبة!');
        location.reload();
    }
}

function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
    const isFree = userProgress.lastWheelDate !== getTodayString();

    if (badge) badge.style.display = isFree ? 'flex' : 'none';
    if (spinText) spinText.innerText = isFree ? 'تدوير مجاني' : 'تدوير (25 عملة)';
    if (statusText) {
        statusText.innerText = isFree 
            ? 'لديك لفة مجانية متاحة اليوم!' 
            : 'اللفة اليومية تم استخدامها، يمكنك التدوير بـ 25 عملة.';
    }
}

function openWheelScreen() {
    checkWheelStatus();
    switchScreen('wheel-screen');
}

function spinLuckyWheel() {
    if (isWheelSpinning) return;

    const isFree = userProgress.lastWheelDate !== getTodayString();
    if (!isFree) {
        if (userProgress.coins < 25) {
            alert('تحتاج 25 عملة للتدوير الإضافي!');
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
        userProgress.coins += sector.value;
        alert(`🎉 مبروك! فزت بـ ${sector.value} عملة ذهبية!`);
    } else if (sector.type === "item") {
        userProgress.inventory[sector.value] = (userProgress.inventory[sector.value] || 0) + 1;
        alert(`🎉 مبروك! فزت بوسيلة مساعدة: [${sector.label}] في مخزونك!`);
    }

    saveProgress();
    updateHeaderStats();
}

// ---------------- الإنجازات ---------------- //

function checkAllAchievements() {
    let newlyUnlocked = false;

    INFINITE_ACHIEVEMENTS.forEach(ach => {
        const currentLvl = userProgress.infiniteLevels[ach.id] || 0;
        const claimedLvl = userProgress.claimedInfiniteLevels[ach.id] || 0;
        const currentVal = userProgress[ach.stat] || 0;

        const targetGoal = getAchGoal(ach, claimedLvl);

        if (claimedLvl < ach.maxLevel && currentVal >= targetGoal && currentLvl === claimedLvl) {
            userProgress.infiniteLevels[ach.id] = claimedLvl + 1;
            newlyUnlocked = true;
            showAchievementToast(ach, claimedLvl + 1);
        }
    });

    if (newlyUnlocked) saveProgress();
    updateAchievementBadge();
}

function showAchievementToast(ach, level) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    const toast = document.getElementById('achievement-toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastName = document.getElementById('toast-name');

    if (toast && toastIcon && toastName) {
        toastIcon.innerText = ach.icon;
        toastName.innerText = `${ach.name} (مستوى ${level})`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

function updateAchievementBadge() {
    const badge = document.getElementById('achievements-badge');
    if (!badge) return;

    let unclaimedCount = 0;
    INFINITE_ACHIEVEMENTS.forEach(ach => {
        const unl = userProgress.infiniteLevels[ach.id] || 0;
        const clm = userProgress.claimedInfiniteLevels[ach.id] || 0;
        if (unl > clm) unclaimedCount += (unl - clm);
    });

    if (unclaimedCount > 0) {
        badge.style.display = 'flex';
        badge.innerText = unclaimedCount;
    } else {
        badge.style.display = 'none';
    }
}

function openAchievementsScreen() {
    renderAchievementsList();
    switchScreen('achievements-screen');
}

function renderAchievementsList() {
    const list = document.getElementById('achievements-list');
    const countDisplay = document.getElementById('ach-unlocked-count');

    let totalClaimedLevels = 0;
    INFINITE_ACHIEVEMENTS.forEach(a => {
        totalClaimedLevels += (userProgress.claimedInfiniteLevels[a.id] || 0);
    });

    if (countDisplay) countDisplay.innerText = `إجمالي المستويات المحققة: ${totalClaimedLevels}`;
    if (!list) return;
    list.innerHTML = '';

    INFINITE_ACHIEVEMENTS.forEach(ach => {
        const unlockedLvl = userProgress.infiniteLevels[ach.id] || 0;
        const claimedLvl = userProgress.claimedInfiniteLevels[ach.id] || 0;
        const currentVal = userProgress[ach.stat] || 0;
        const isMaxed = claimedLvl >= ach.maxLevel;

        const currentTargetGoal = isMaxed ? getAchGoal(ach, ach.maxLevel - 1) : getAchGoal(ach, claimedLvl);
        const currentReward = isMaxed ? 0 : getAchReward(ach, claimedLvl);
        const progressPercent = isMaxed ? 100 : Math.min(100, Math.round((currentVal / currentTargetGoal) * 100));
        const canClaim = !isMaxed && (unlockedLvl > claimedLvl);

        const card = document.createElement('div');
        card.className = `achievement-card ${canClaim ? 'completed' : ''}`;

        card.innerHTML = `
            <div class="ach-icon-box">${ach.icon}</div>
            <div class="ach-info-box">
                <div class="ach-title-row">
                    <h4>${ach.name} <small style="font-size: 0.75rem; color: var(--accent-purple); font-weight: bold;">${isMaxed ? '(مكتمل)' : `(مستوى ${claimedLvl + 1})`}</small></h4>
                    ${isMaxed ? '' : `<div class="ach-reward"><i class="fa-solid fa-coins"></i> +${currentReward}</div>`}
                </div>
                <div class="ach-desc">${ach.desc}</div>
                <div class="ach-progress-container">
                    <div class="ach-progress-bar" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
            ${isMaxed
                ? `<span style="font-size: 1.1rem;">🏆</span>`
                : canClaim
                    ? `<button class="ach-claim-btn" onclick="claimAchievementReward('${ach.id}', ${currentReward})">استلام</button>`
                    : `<span style="font-size: 0.8rem; color: var(--accent-yellow); font-weight: bold; min-width: 45px; text-align: left;">${currentVal}/${currentTargetGoal}</span>`}
        `;

        list.appendChild(card);
    });
}

function claimAchievementReward(achId, rewardAmount) {
    const ach = INFINITE_ACHIEVEMENTS.find(a => a.id === achId);
    const claimedLvl = userProgress.claimedInfiniteLevels[achId] || 0;
    if (ach && claimedLvl >= ach.maxLevel) return;

    userProgress.claimedInfiniteLevels[achId] = claimedLvl + 1;
    userProgress.coins = (userProgress.coins || 0) + rewardAmount;
    
    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    checkAllAchievements();
    updateHeaderStats();
    renderAchievementsList();
    updateAchievementBadge();
}

// ---------------- جلب الأسئلة وتوليد المراحل من الشيت ---------------- //

function getTotalAvailableLevels() {
    const bank = getActiveQuestionsBank();
    if (!structuredLevelsBank || structuredLevelsBank.length === 0) {
        const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
        structuredLevelsBank = buildDeterministicLevelsBank(bank, cachedFrozen);
    }
    return Math.max(1, structuredLevelsBank.length);
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

            const frozenBank = await syncLevelsBankWithCloud(parsedQuestions);
            structuredLevelsBank = buildDeterministicLevelsBank(parsedQuestions, frozenBank);
            console.log(`✅ تم تحميل ${parsedQuestions.length} سؤال من الشيت السحابي بنجاح! (${structuredLevelsBank.length} مرحلة)`);
            
            if (gameState.currentScreen === 'levels-screen' || document.getElementById('levels-grid')) {
                renderLevelsGrid();
            }
        }
    } catch (err) {
        console.log('Using cached bank:', err);
        const cached = localStorage.getItem('cached_questions_bank');
        if (cached) {
            window.questionsBank = JSON.parse(cached);
            const cachedFrozen = JSON.parse(localStorage.getItem('cached_levels_bank') || '[]');
            structuredLevelsBank = buildDeterministicLevelsBank(window.questionsBank, cachedFrozen);
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
            correct: parseInt(cols[8]) || 0
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

// ---------------- أنماط اللعب ---------------- //

function startLevelMode() {
    renderLevelsGrid();
    switchScreen('levels-screen');
}

function renderLevelsGrid() {
    const grid = document.getElementById('levels-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const totalLevels = getTotalAvailableLevels();

    for (let i = 1; i <= totalLevels; i++) {
        const isUnlocked = i <= userProgress.unlockedLevel;
        const isCurrent = i === userProgress.unlockedLevel;
        const stars = userProgress.levelStars[i] || 0;

        const node = document.createElement('div');
        node.className = `level-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
        
        let starsHtml = stars > 0 ? `<div class="level-stars">${'⭐'.repeat(stars)}</div>` : '';
        node.innerHTML = `<span>${i}</span>${starsHtml}`;

        if (isUnlocked) node.onclick = () => startSpecificLevel(i);
        grid.appendChild(node);
    }
}

function startSpecificLevel(lvl) {
    gameState.mode = 'levels';
    gameState.currentLevel = lvl;
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

    gameState.questions = getExactLevelQuestions(lvl);
    switchScreen('game-screen');
    loadQuestion();
}

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

    const fullBank = getActiveQuestionsBank();
    gameState.questions = getEndlessQuestionQueue();
    
    switchScreen('game-screen');
    loadQuestion();
}

function openCategoriesScreen() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const bank = getActiveQuestionsBank();
    const categories = [...new Set(bank.map(q => q.category))];

    categories.forEach(cat => {
        const style = CATEGORY_STYLES[cat] || { icon: 'fa-solid fa-shapes', color: 'var(--accent-purple)' };
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <i class="${style.icon}" style="color: ${style.color};"></i>
            <h4>${cat}</h4>
        `;
        card.onclick = () => startCategoryMode(cat);
        grid.appendChild(card);
    });

    switchScreen('categories-screen');
}

function startCategoryMode(cat) {
    gameState.mode = 'category';
    gameState.selectedCategory = cat;
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

    gameState.questions = getSmartQuestions(10, cat);
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
        alert('لقد أنجزت تحدي اليوم بالفعل! عُد غداً لتحدٍ وجائزة جديدة.');
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

// ---------------- إدارة السؤال والمؤقت ---------------- //

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

    renderLivesDisplay();
    startTimer();
    updatePowerupButtons();

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

    const iconClass = gameState.mode === 'endless' ? 'fa-heart' : 'fa-star';
    
    for (let i = 0; i < 3; i++) {
        const icon = document.createElement('i');
        icon.className = `fa-solid ${iconClass} ${i < gameState.lives ? (gameState.mode === 'endless' ? '' : 'active-star') : 'opacity-muted'}`;
        if (i >= gameState.lives && gameState.mode === 'endless') icon.style.opacity = '0.2';
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
    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playCorrect();
        btnElement.classList.add('correct');
        btnElement.querySelector('i').className = 'fa-solid fa-circle-check';
        gameState.correctCount++;
        gameState.score += (gameState.mode === 'pvp' ? (10 + gameState.timer) : 10);
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
    if (gameState.mode !== 'pvp') {
        gameState.lives = Math.max(0, gameState.lives - 1);
    }
    gameState.sessionCorrectStreak = 0;

    const q = gameState.questions[gameState.currentIndex];
    if (q) {
        gameState.sessionMistakes.push({
            question: q.question,
            category: q.category,
            userAnswer: isTimeout ? 'انتهى الوقت دون إجابة' : (selectedIndex !== null ? q.options[selectedIndex] : 'لم يتم الاختيار'),
            correctAnswer: q.options[q.correct]
        });
    }

    renderLivesDisplay();
    revealCorrectAnswer();

    if (gameState.mode === 'endless' && gameState.lives <= 0) {
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

// ---------------- النتائج والمراجعة ---------------- //

async function finishGameSession() {
    if (gameState.mode === 'pvp') {
        await updatePvpPlayerFinalScore();
        switchScreen('pvp-waiting-opponent-screen');
        return;
    }

    switchScreen('result-screen');

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const starsWrapper = document.getElementById('res-stars-wrapper');
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

    if (gameState.mode === 'levels') {
        const isSuccess = gameState.lives > 0 && gameState.correctCount >= 7;
        if (starsWrapper) starsWrapper.style.display = 'flex';
        document.getElementById('res-stars').innerText = '⭐'.repeat(gameState.lives) || '❌';

        if (isSuccess) {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
            resultIcon.innerText = '🏆';
            resultTitle.innerText = 'مبروك الفوز!';
            resultMessage.innerText = `اجتزت المرحلة بـ ${gameState.lives} نجوم!`;

            if (gameState.lives === 3 && !gameState.usedPowerupInSession) {
                userProgress.flawlessWins = (userProgress.flawlessWins || 0) + 1;
            }

            if (gameState.lives > (userProgress.levelStars[gameState.currentLevel] || 0)) {
                userProgress.levelStars[gameState.currentLevel] = gameState.lives;
            }
            if (gameState.currentLevel === userProgress.unlockedLevel) {
                userProgress.unlockedLevel++;
            }
        } else {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
            resultIcon.innerText = '💔';
            resultTitle.innerText = 'حاول مرة أخرى';
            resultMessage.innerText = 'تحتاج للحفاظ على نجمة واحدة (7 إجابات صحيحة) للمرور.';
        }
    } else if (gameState.mode === 'endless') {
        if (starsWrapper) starsWrapper.style.display = 'none';
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        resultIcon.innerText = '🔥';
        resultTitle.innerText = 'انتهت المحاولات!';
        resultMessage.innerText = `جمعت ${gameState.correctCount} إجابة صحيحة (${gameState.score} نقطة).`;

        if (gameState.score > userProgress.highScore) {
            userProgress.highScore = gameState.score;
            resultMessage.innerText += ' 🌟 رقم قياسي جديد!';
        }
    } else if (gameState.mode === 'daily') {
        if (starsWrapper) starsWrapper.style.display = 'none';
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
    } else if (gameState.mode === 'category') {
        if (starsWrapper) starsWrapper.style.display = 'none';
        if (gameState.correctCount >= 7 && typeof AudioEngine !== 'undefined') AudioEngine.playWin();
        else if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();

        resultIcon.innerText = '🎯';
        resultTitle.innerText = 'انتهى التدريب!';
        resultMessage.innerText = `أجبت على ${gameState.correctCount} من 10 في قسم ${gameState.selectedCategory}.`;
    }

    saveProgress();
    checkAllAchievements();
    renderLevelsGrid();
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
            card.innerHTML = `
                <div class="review-header-tag"><i class="fa-solid fa-shapes"></i> ${item.category} (سؤال ${index + 1})</div>
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
}

function restartGame() {
    if (gameState.mode === 'levels') startSpecificLevel(gameState.currentLevel);
    else if (gameState.mode === 'endless') startEndlessMode();
    else if (gameState.mode === 'category') startCategoryMode(gameState.selectedCategory);
    else switchScreen('modes-screen');
}

// ---------------- وسائل المساعدة والمتجر ---------------- //

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

function openShopScreen() {
    updateShopDisplay();
    switchScreen('shop-screen');
}

function updateShopDisplay() {
    const inv50 = document.getElementById('inv-5050');
    const invTime = document.getElementById('inv-time');
    const invSkip = document.getElementById('inv-skip');

    if (inv50) inv50.innerText = userProgress.inventory.hint5050 || 0;
    if (invTime) invTime.innerText = userProgress.inventory.addTime || 0;
    if (invSkip) invSkip.innerText = userProgress.inventory.skip || 0;

    const isClaimedToday = (userProgress.lastFreeRewardDate === getTodayString());
    const rewardBtn = document.getElementById('claim-reward-btn');
    if (rewardBtn) {
        rewardBtn.disabled = isClaimedToday;
        rewardBtn.innerText = isClaimedToday ? 'تم الاستلام اليوم' : 'استلام مجاناً';
    }
}

function buyItem(itemKey, cost, quantity = 1) {
    if (userProgress.coins < cost) {
        alert('رصيدك من العملات غير كافٍ!');
        return;
    }

    userProgress.coins -= cost;
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
        alert('لقد استلمت هديتك المجانية لليوم بالفعل! عُد غداً لهدية جديدة.');
        return;
    }

    userProgress.lastFreeRewardDate = today;
    userProgress.coins = (userProgress.coins || 0) + 30;
    saveProgress();
    updateHeaderStats();
    updateShopDisplay();

    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    alert('🎉 مبروك! استلمت 30 عملة ذهبية كهدية يومية!');
}

// ---------------- إدارة PWA و Splash Screen ---------------- //

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !window.matchMedia('(display-mode: standalone)').matches) {
        banner.style.display = 'flex';
    }
});

function installAppPWA() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        alert('لتثبيت اللعبة على الآيفون:\n1. اضغط على زر المشاركة (Share ⎋) أسفل المتصفح.\n2. اختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).');
        return;
    }

    if (!deferredInstallPrompt) {
        alert('يمكنك تثبيت التطبيق من قائمة المتصفح (الثلاث نقاط) -> "تثبيت التطبيق"');
        return;
    }
    
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            const banner = document.getElementById('pwa-install-banner');
            if (banner) banner.style.display = 'none';
        }
        deferredInstallPrompt = null;
    });
}
