// js/ranked.js - محرك دوريات التصنيف (Ranked Leagues) والبحث السريع عن منافس أونلاين 1v1

const RANKS_CONFIG = [
    { id: 'iron', name: 'الحديدي', nameEn: 'Iron', tier: 1, starsToPromote: 3, color: '#94a3b8', bgGradient: 'linear-gradient(135deg, #475569, #334155)', icon: '🛡️', faIcon: 'fa-shield', protectLoss: true },
    { id: 'bronze', name: 'البرونزي', nameEn: 'Bronze', tier: 2, starsToPromote: 3, color: '#cd7f32', bgGradient: 'linear-gradient(135deg, #b45309, #78350f)', icon: '🥉', faIcon: 'fa-shield-halved', protectLoss: true },
    { id: 'silver', name: 'الفضي', nameEn: 'Silver', tier: 3, starsToPromote: 4, color: '#e2e8f0', bgGradient: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: '🥈', faIcon: 'fa-shield-virus', protectLoss: false },
    { id: 'gold', name: 'الذهبي', nameEn: 'Gold', tier: 4, starsToPromote: 4, color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '🥇', faIcon: 'fa-award', protectLoss: false },
    { id: 'platinum', name: 'البلاتيني', nameEn: 'Platinum', tier: 5, starsToPromote: 5, color: '#06b6d4', bgGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', icon: '💠', faIcon: 'fa-gem', protectLoss: false },
    { id: 'emerald', name: 'الزمردي', nameEn: 'Emerald', tier: 6, starsToPromote: 5, color: '#10b981', bgGradient: 'linear-gradient(135deg, #10b981, #059669)', icon: '🟢', faIcon: 'fa-clover', protectLoss: false },
    { id: 'diamond', name: 'الماسي', nameEn: 'Diamond', tier: 7, starsToPromote: 5, color: '#38bdf8', bgGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)', icon: '💎', faIcon: 'fa-diamond', protectLoss: false },
    { id: 'master', name: 'الماستر', nameEn: 'Master', tier: 8, starsToPromote: 6, color: '#a855f7', bgGradient: 'linear-gradient(135deg, #a855f7, #7e22ce)', icon: '🟣', faIcon: 'fa-crown', protectLoss: false },
    { id: 'grandmaster', name: 'جراند ماستر', nameEn: 'Grandmaster', tier: 9, starsToPromote: 6, color: '#ef4444', bgGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', icon: '🔴', faIcon: 'fa-fire-flame-curved', protectLoss: false },
    { id: 'challenger', name: 'تشالنجر الأسطوري', nameEn: 'Challenger', tier: 10, starsToPromote: 999, color: '#fbbf24', bgGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', icon: '👑', faIcon: 'fa-trophy', protectLoss: false }
];

let matchmakingInterval = null;
let matchmakingTimer = 0;
let isMatchmakingActive = false;
let currentRankedOpponent = null;
let opponentSimInterval = null;

// أسماء رمزية وصور لمنافسي الرانك الأذكياء
const SMART_RIVALS_POOL = [
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
                <div class="ranked-tier-icon" style="color: ${r.color};">${r.icon}</div>
                <div class="ranked-tier-details">
                    <h4>${r.name} <small>(${r.nameEn})</small> ${isCurrent ? '<span class="tier-curr-badge">رتبتك</span>' : ''}</h4>
                    <p>${r.tier === 10 ? 'أعلى قمة في اللعبة (لأفضل اللاعبين)' : `يتطلب ${r.starsToPromote} نجوم للترقية`}</p>
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
        showCustomAlert('يجب أن تكون متصلاً بالإنترنت للعب مباريات التصنيف (Ranked)!', 'تنبيه', '📶');
        return;
    }

    isMatchmakingActive = true;
    matchmakingTimer = 0;

    const modal = document.getElementById('matchmaking-overlay');
    const timerElem = document.getElementById('mm-timer-text');
    const rankElem = document.getElementById('mm-player-rank-badge');
    const userRank = getUserCurrentRank();

    if (rankElem) {
        rankElem.innerHTML = `<span style="color: ${userRank.color};">${userRank.icon} ${userRank.name}</span>`;
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

        // محاكاة إيجاد منافس حقيقي أو ذكي بعد 4 إلى 7 ثوانٍ
        if (matchmakingTimer >= 5) {
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

    // اختيار رتبة قريبة للخصم (نفس الرتبة أو ±1)
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
        // دقة الخصم تزداد كلما زادت الرتبة
        accuracy: Math.min(0.95, 0.45 + (oppRank.tier * 0.05)),
        minAnswerTime: Math.max(2, 6 - Math.floor(oppRank.tier * 0.4)),
        maxAnswerTime: Math.max(4, 9 - Math.floor(oppRank.tier * 0.5))
    };

    const modal = document.getElementById('matchmaking-overlay');
    if (modal) modal.classList.remove('show');

    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showRankedVersusScreen(currentRankedOpponent);
}

function showRankedVersusScreen(opponent) {
    const versusScreen = document.getElementById('ranked-versus-screen');
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
        myRankElem.innerHTML = `<span style="color: ${myRank.color};">${myRank.icon} ${myRank.name} (${userProgress.rankStars || 0} ⭐)</span>`;
    }

    if (oppNameElem) oppNameElem.innerText = opponent.name;
    if (oppAvatarElem) oppAvatarElem.src = opponent.avatar;
    if (oppRankElem) {
        oppRankElem.innerHTML = `<span style="color: ${opponent.rank.color};">${opponent.rank.icon} ${opponent.rank.name}</span>`;
    }

    switchScreen('ranked-versus-screen', false);

    // بعد 2.5 ثانية ينطلق التحدي في شاشة اللعب
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

    currentRankedOpponent.score = 0;
    currentRankedOpponent.correctCount = 0;
    currentRankedOpponent.answeredIndex = 0;

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'none'; // بدون مساعدات في الرانك لضمان العدالة التنافسية!

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
    clearInterval(opponentSimInterval);

    function scheduleNextOpponentAnswer() {
        if (gameState.mode !== 'ranked' || !currentRankedOpponent || currentRankedOpponent.answeredIndex >= 5) {
            clearInterval(opponentSimInterval);
            return;
        }

        const answerDelay = (currentRankedOpponent.minAnswerTime + Math.random() * (currentRankedOpponent.maxAnswerTime - currentRankedOpponent.minAnswerTime)) * 1000;

        opponentSimInterval = setTimeout(() => {
            if (gameState.mode !== 'ranked' || !currentRankedOpponent) return;

            const isCorrect = Math.random() <= currentRankedOpponent.accuracy;
            const timeBonus = Math.floor(Math.random() * 8) + 4;

            if (isCorrect) {
                currentRankedOpponent.correctCount++;
                currentRankedOpponent.score += (100 + timeBonus * 10);
            }

            currentRankedOpponent.answeredIndex++;
            updateRankedOpponentUI();

            if (currentRankedOpponent.answeredIndex < 5) {
                scheduleNextOpponentAnswer();
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
            dot.className = `opp-progress-dot ${i < currentRankedOpponent.answeredIndex ? 'answered' : ''}`;
            dotsContainer.appendChild(dot);
        }
    }
}

// إنهاء ومعالجة نتيجة مباراة الرانك
function finishRankedMatchSession() {
    clearInterval(opponentSimInterval);

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
        rankEmblemElem.innerHTML = `<span style="font-size: 42px; color: ${currentRank.color};">${currentRank.icon}</span>`;
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
            showCustomAlert(`🎉 مبروك! لقد ارتقيت إلى دوري [ ${currentRank.name} ${currentRank.icon} ]! استمر نحو القمة!`, 'ترقية جديدة!', '🚀');
        }, 1200);
    }
}
