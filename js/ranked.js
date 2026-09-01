// js/ranked.js - محرك دوريات التصنيف (Ranked Leagues) والبحث السريع عن منافس أونلاين 1v1

var RANKS_CONFIG = window.RANKS_CONFIG = [
    { id: 'iron', name: 'الحديدي', tier: 1, starsToPromote: 3, color: '#94a3b8', bgGradient: 'linear-gradient(135deg, #475569, #334155)', icon: 'fa-solid fa-shield', protectLoss: true },
    { id: 'bronze', name: 'البرونزي', tier: 2, starsToPromote: 3, color: '#cd7f32', bgGradient: 'linear-gradient(135deg, #b45309, #78350f)', icon: 'fa-solid fa-shield-halved', protectLoss: true },
    { id: 'silver', name: 'الفضي', tier: 3, starsToPromote: 4, color: '#e2e8f0', bgGradient: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: 'fa-solid fa-shield-heart', protectLoss: false },
    { id: 'gold', name: 'الذهبي', tier: 4, starsToPromote: 4, color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: 'fa-solid fa-award', protectLoss: false },
    { id: 'platinum', name: 'البلاتيني', tier: 5, starsToPromote: 5, color: '#06b6d4', bgGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', icon: 'fa-solid fa-gem', protectLoss: false },
    { id: 'emerald', name: 'الزمردي', tier: 6, starsToPromote: 5, color: '#10b981', bgGradient: 'linear-gradient(135deg, #10b981, #059669)', icon: 'fa-solid fa-clover', protectLoss: false },
    { id: 'diamond', name: 'الماسي', tier: 7, starsToPromote: 5, color: '#38bdf8', bgGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)', icon: 'fa-solid fa-diamond', protectLoss: false },
    { id: 'master', name: 'أستاذ', tier: 8, starsToPromote: 6, color: '#a855f7', bgGradient: 'linear-gradient(135deg, #a855f7, #7e22ce)', icon: 'fa-solid fa-chess-knight', protectLoss: false },
    { id: 'grandmaster', name: 'أستاذ أعظم', tier: 9, starsToPromote: 6, color: '#ef4444', bgGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', icon: 'fa-solid fa-fire-flame-curved', protectLoss: false },
    { id: 'challenger', name: 'متحدي أسطوري', tier: 10, starsToPromote: 999, color: '#fbbf24', bgGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', icon: 'fa-solid fa-trophy', protectLoss: false }
];

let matchmakingInterval = null;
let matchmakingTimer = 0;
let isMatchmakingActive = false;
let currentRankedOpponent = null;
let opponentSimTimeout = null;
let isPlayerWaitingForOpponent = false;

// أسماء رمزية وصور لمنافسي الرانك الأذكياء
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

function getRankData(rankId) {
    return RANKS_CONFIG.find(r => r.id === rankId) || RANKS_CONFIG[0];
}

function getRankIndex(rankId) {
    const idx = RANKS_CONFIG.findIndex(r => r.id === rankId);
    return idx !== -1 ? idx : 0;
}

function getUserCurrentRank() {
    if (!userProgress.rankTier) userProgress.rankTier = 'iron';
    if (userProgress.rankStars === undefined) userProgress.rankStars = 0;
    return getRankData(userProgress.rankTier);
}

function getRankBadgeHtml(rank, size = '1rem') {
    return `<span class="rk-icon-emblem" style="color: ${rank.color}; font-size: ${size};"><i class="${rank.icon}"></i></span>`;
}

function openRankedInfoModal() {
    const modal = document.getElementById('ranked-info-modal');
    const ranksListElem = document.getElementById('ranked-tiers-list');

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
                    <h4>${r.name} ${isCurrent ? '<span class="tier-curr-badge">رتبتك الحالية</span>' : ''}</h4>
                    <p>${r.tier === 10 ? 'أعلى قمة في اللعبة لأفضل اللاعبين' : `يتطلب ${r.starsToPromote} نجوم للترقية`}</p>
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

    isMatchmakingActive = true;
    matchmakingTimer = 0;
    isPlayerWaitingForOpponent = false;

    const modal = document.getElementById('matchmaking-overlay');
    const timerElem = document.getElementById('mm-timer-text');
    const rankElem = document.getElementById('mm-player-rank-badge');
    const userRank = getUserCurrentRank();

    if (rankElem) {
        rankElem.innerHTML = `<span style="color: ${userRank.color};">${getRankBadgeHtml(userRank)} ${userRank.name}</span>`;
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

        // إيجاد منافس ذكي بعد 3 إلى 5 ثوانٍ
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

    // اختيار رتبة قريبة للخصم
    const opponentIdx = Math.max(0, Math.min(RANKS_CONFIG.length - 1, userIdx + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
    const oppRank = RANKS_CONFIG[opponentIdx];

    const randomRival = SMART_RIVALS_POOL[Math.floor(Math.random() * SMART_RIVALS_POOL.length)];

    currentRankedOpponent = {
        name: randomRival.name,
        avatar: randomRival.avatar,
        rank: oppRank,
        score: 0,
        correctCount: 0,
        answeredIndex: 0,
        accuracy: Math.min(0.92, 0.50 + (oppRank.tier * 0.045)),
        minAnswerTime: Math.max(1.8, 4.5 - (oppRank.tier * 0.25)),
        maxAnswerTime: Math.max(3.2, 6.5 - (oppRank.tier * 0.3))
    };

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
    if (myAvatarElem) myAvatarElem.src = (currentUser && currentUser.photoURL) || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    if (myRankElem) {
        myRankElem.innerHTML = `<span style="color: ${myRank.color};">${getRankBadgeHtml(myRank)} ${myRank.name} (${userProgress.rankStars || 0} ⭐)</span>`;
    }

    if (oppNameElem) oppNameElem.innerText = opponent.name;
    if (oppAvatarElem) oppAvatarElem.src = opponent.avatar;
    if (oppRankElem) {
        oppRankElem.innerHTML = `<span style="color: ${opponent.rank.color};">${getRankBadgeHtml(opponent.rank)} ${opponent.rank.name}</span>`;
    }

    switchScreen('ranked-versus-screen', false);

    // بعد 2.4 ثانية ينطلق التحدي في شاشة اللعب
    setTimeout(() => {
        launchRankedGameSession();
    }, 2400);
}

function launchRankedGameSession() {
    gameState.mode = 'ranked';
    gameState.questions = getSmartQuestions(5); // 5 أسئلة سريعة ومكثفة للرانك
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
        if (!currentRankedOpponent || currentRankedOpponent.answeredIndex >= 5) {
            // المنافس أنهى الـ 5 أسئلة كاملة
            if (isPlayerWaitingForOpponent) {
                // إذا كان اللاعب البشري ينتظر المنافس، ننتقل فوراً للنتيجة
                setTimeout(finishRankedMatchSession, 600);
            }
            return;
        }

        const answerDelay = (currentRankedOpponent.minAnswerTime + Math.random() * (currentRankedOpponent.maxAnswerTime - currentRankedOpponent.minAnswerTime)) * 1000;

        opponentSimTimeout = setTimeout(() => {
            if (!currentRankedOpponent || currentRankedOpponent.answeredIndex >= 5) return;

            const isCorrect = Math.random() <= currentRankedOpponent.accuracy;
            const timeBonus = Math.floor(Math.random() * 8) + 4;

            if (!currentRankedOpponent.answersHistory) currentRankedOpponent.answersHistory = [];

            if (isCorrect) {
                currentRankedOpponent.correctCount++;
                currentRankedOpponent.score += (100 + timeBonus * 10);
                currentRankedOpponent.answersHistory.push(true);
            } else {
                currentRankedOpponent.answersHistory.push(false);
            }

            currentRankedOpponent.answeredIndex++;
            updateRankedOpponentUI();

            if (isPlayerWaitingForOpponent) {
                updateWaitingOpponentUI();
            }

            if (currentRankedOpponent.answeredIndex < 5) {
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
        for (let i = 0; i < 5; i++) {
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
        oppStatusElem.innerText = `أجاب على ${currentRankedOpponent.answeredIndex} من 5 أسئلة (${currentRankedOpponent.score} نقطة)...`;
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
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

// إنهاء ومعالجة نتيجة مباراة الرانك
function finishRankedMatchSession() {
    clearTimeout(opponentSimTimeout);
    isPlayerWaitingForOpponent = false;

    // التأكد من أن المنافس قد أتم الـ 5 أسئلة كاملة
    while (currentRankedOpponent && currentRankedOpponent.answeredIndex < 5) {
        const isCorrect = Math.random() <= currentRankedOpponent.accuracy;
        const timeBonus = Math.floor(Math.random() * 8) + 4;
        if (!currentRankedOpponent.answersHistory) currentRankedOpponent.answersHistory = [];
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
    const starsBefore = userProgress.rankStars || 0;

    let promotedToNext = false;
    let demotedToPrev = false;
    let starsDelta = 0;
    let winStreakBonus = false;

    if (isWinner) {
        userProgress.rankedWins = (userProgress.rankedWins || 0) + 1;
        userProgress.rankedWinStreak = (userProgress.rankedWinStreak || 0) + 1;
        userProgress.coins = (userProgress.coins || 0) + 30;

        // ميزة سلسلة الانتصارات (Win streak bonus)
        if (userProgress.rankedWinStreak >= 3) {
            starsDelta = 2;
            winStreakBonus = true;
        } else {
            starsDelta = 1;
        }

        userProgress.rankStars = (userProgress.rankStars || 0) + starsDelta;

        // التحقق من الترقية للرتبة التالية
        if (userProgress.rankStars >= rankBefore.starsToPromote && rankBefore.tier < 10) {
            const nextRankIdx = getRankIndex(rankBefore.id) + 1;
            const nextRank = RANKS_CONFIG[nextRankIdx];
            userProgress.rankTier = nextRank.id;
            userProgress.rankStars = userProgress.rankStars - rankBefore.starsToPromote;
            userProgress.highestRankTier = nextRank.id;
            promotedToNext = true;
        }
    } else {
        userProgress.rankedLosses = (userProgress.rankedLosses || 0) + 1;
        userProgress.rankedWinStreak = 0;

        // في الحديدي والبرونزي هناك حماية من فقدان النجوم
        if (!rankBefore.protectLoss) {
            if ((userProgress.rankStars || 0) > 0) {
                userProgress.rankStars = Math.max(0, userProgress.rankStars - 1);
                starsDelta = -1;
            } else if (rankBefore.tier > 1) {
                // الهبوط للرتبة السابقة عند 0 نجوم في الرتب المتقدمة
                const prevRankIdx = getRankIndex(rankBefore.id) - 1;
                const prevRank = RANKS_CONFIG[prevRankIdx];
                userProgress.rankTier = prevRank.id;
                userProgress.rankStars = prevRank.starsToPromote - 1;
                demotedToPrev = true;
            }
        }
    }

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();

    renderRankedResultScreen(isWinner, rankBefore, starsBefore, promotedToNext, demotedToPrev, winStreakBonus, starsDelta);
}

function renderRankedResultScreen(isWinner, rankBefore, starsBefore, isPromoted, isDemoted, winStreakBonus, starsDelta) {
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

    if (myScoreElem) myScoreElem.innerText = `${gameState.score} نقطة (${gameState.correctCount}/5)`;
    if (oppScoreElem) oppScoreElem.innerText = `${currentRankedOpponent.score} نقطة (${currentRankedOpponent.correctCount}/5)`;
    if (oppAvatarElem) oppAvatarElem.src = currentRankedOpponent.avatar;
    if (oppNameElem) oppNameElem.innerText = currentRankedOpponent.name;

    if (rankEmblemElem) {
        rankEmblemElem.innerHTML = `<span style="font-size: 38px; color: ${currentRank.color};"><i class="${currentRank.icon}"></i></span>`;
    }
    if (rankTitleElem) {
        rankTitleElem.innerHTML = `<span style="color: ${currentRank.color}; font-weight: 900;">${currentRank.name}</span> (${userProgress.rankStars || 0} / ${currentRank.tier === 10 ? '∞' : currentRank.starsToPromote} ⭐)`;
    }

    if (starsContainer) {
        starsContainer.innerHTML = '';
        const maxStars = currentRank.starsToPromote;
        const currentStars = userProgress.rankStars || 0;

        if (currentRank.tier < 10) {
            for (let i = 0; i < maxStars; i++) {
                const starSlot = document.createElement('span');
                starSlot.className = `rk-star-slot ${i < currentStars ? 'active-star' : ''}`;
                starSlot.innerHTML = '⭐';
                starsContainer.appendChild(starSlot);
            }
        } else {
            starsContainer.innerHTML = `<span style="font-weight: bold; color: var(--accent-yellow); font-size: 1.2rem;">${currentStars} نجمة أسطورية ⭐</span>`;
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
            showCustomAlert(`🎉 مبروك! لقد ارتقيت إلى دوري [ ${currentRank.name} ]! استمر نحو القمة!`, 'ترقية جديدة!', '🚀');
        }, 1200);
    }
}
