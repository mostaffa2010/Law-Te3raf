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
    if (typeof trackDailyProgress === 'function') trackDailyProgress('rankedMatches', 1);
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
            if (typeof trackWeeklyProgress === 'function') trackWeeklyProgress('rankedWins', 1);

        if (!userProgress.dailyQuestsProgress) userProgress.dailyQuestsProgress = {};
        userProgress.dailyQuestsProgress.daily_ranked = (userProgress.dailyQuestsProgress.daily_ranked || 0) + 1;

        if (!userProgress.weeklyQuestsProgress) userProgress.weeklyQuestsProgress = {};
        userProgress.weeklyQuestsProgress.weekly_ranked_wins = (userProgress.weeklyQuestsProgress.weekly_ranked_wins || 0) + 1;

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
