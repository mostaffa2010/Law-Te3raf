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
            if (typeof trackDailyProgress === 'function') trackDailyProgress('wheelSpins', 1);
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

// --- محرك المهام اليومية والأسبوعية والإنجازات الدائمة (3-Tier Quests System) ---

let activeAchievementsTab = 'daily';

function getWeekNumberString() {
    const d = new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
}

function ensureQuestsIntegrity() {
    const today = getTodayString();
    const currentWeek = getWeekNumberString();

    if (!userProgress.dailyStats || userProgress.dailyStatsDate !== today) {
        userProgress.dailyStatsDate = today;
        userProgress.dailyStats = { correct: 0, rankedMatches: 0, fastAnswers: 0, wheelSpins: 0 };
        userProgress.claimedDailyQuests = {};
    }

    if (!userProgress.weeklyStats || userProgress.weeklyStatsWeek !== currentWeek) {
        userProgress.weeklyStatsWeek = currentWeek;
        userProgress.weeklyStats = { rankedWins: 0, correct: 0, maxEndlessScore: 0, pvpMatches: 0 };
        userProgress.claimedWeeklyQuests = {};
    }

    if (!userProgress.claimedDailyQuests) userProgress.claimedDailyQuests = {};
    if (!userProgress.claimedWeeklyQuests) userProgress.claimedWeeklyQuests = {};
    if (!userProgress.infiniteLevels) userProgress.infiniteLevels = {};
    if (!userProgress.claimedInfiniteLevels) userProgress.claimedInfiniteLevels = {};
}

function switchAchievementsTab(tabName) {
    activeAchievementsTab = tabName;
    document.querySelectorAll('.ach-nav-tab').forEach(t => t.classList.remove('active'));

    const btn = document.getElementById(`tab-ach-${tabName}`);
    if (btn) btn.classList.add('active');

    const bannerText = document.getElementById('ach-banner-text');
    if (bannerText) {
        if (tabName === 'daily') bannerText.innerText = 'المهام اليومية تتجدد كل 24 ساعة';
        else if (tabName === 'weekly') bannerText.innerText = 'المهام الأسبوعية تتجدد بداية كل أسبوع';
        else bannerText.innerText = 'الإنجازات الدائمة الكبرى ومسيرة الألقاب الفخرية';
    }

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    renderAchievementsList();
}

function trackDailyProgress(key, amount = 1) {
    ensureQuestsIntegrity();
    if (!userProgress.dailyStats) userProgress.dailyStats = {};
    userProgress.dailyStats[key] = (userProgress.dailyStats[key] || 0) + amount;
    saveProgress();
    updateAchievementBadge();
}

function trackWeeklyProgress(key, amount = 1) {
    ensureQuestsIntegrity();
    if (!userProgress.weeklyStats) userProgress.weeklyStats = {};
    if (key === 'maxEndlessScore') {
        userProgress.weeklyStats[key] = Math.max(userProgress.weeklyStats[key] || 0, amount);
    } else {
        userProgress.weeklyStats[key] = (userProgress.weeklyStats[key] || 0) + amount;
    }
    saveProgress();
    updateAchievementBadge();
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

function renderAchievementsList() {
    ensureQuestsIntegrity();
    checkAllAchievements();

    const list = document.getElementById('achievements-list');
    if (!list) return;
    list.innerHTML = '';

    if (activeAchievementsTab === 'daily') {
        renderDailyQuests(list);
    } else if (activeAchievementsTab === 'weekly') {
        renderWeeklyQuests(list);
    } else {
        renderLifetimeAchievements(list);
    }
}

function renderDailyQuests(list) {
    if (typeof DAILY_QUESTS_CONFIG === 'undefined') return;

    DAILY_QUESTS_CONFIG.forEach(quest => {
        const currentVal = typeof quest.getProgress === 'function' ? quest.getProgress(userProgress) : 0;
        const targetGoal = quest.target;
        const isClaimed = !!(userProgress.claimedDailyQuests && userProgress.claimedDailyQuests[quest.id]);
        const canClaim = !isClaimed && (currentVal >= targetGoal);
        const progressPercent = isClaimed ? 100 : Math.min(100, Math.round((currentVal / targetGoal) * 100));

        const card = document.createElement('div');
        card.className = `achievement-card ${canClaim ? 'completed' : ''} ${isClaimed ? 'maxed' : ''}`;

        let claimBtnHtml = '';
        if (isClaimed) {
            claimBtnHtml = `<span class="ach-maxed-badge">تم الاستلام ✅</span>`;
        } else if (canClaim) {
            claimBtnHtml = `<button class="ach-claim-btn" onclick="claimDailyQuest('${quest.id}')"><i class="fa-solid fa-gift"></i> استلام (${toArabicNumerals(quest.reward)} عملة)</button>`;
        } else {
            claimBtnHtml = `<span class="ach-reward-preview"><i class="fa-solid fa-gift"></i> ${toArabicNumerals(quest.reward)} عملة</span>`;
        }

        card.innerHTML = `
            <div class="ach-icon-box" style="color: ${quest.color || 'var(--accent-yellow)'};">
                <i class="${quest.icon || 'fa-solid fa-trophy'}"></i>
            </div>
            <div class="ach-info-box">
                <div class="ach-title-row">
                    <h4>${quest.title}</h4>
                    ${claimBtnHtml}
                </div>
                <div class="ach-desc">${quest.desc}</div>
                <div class="ach-progress-container">
                    <div class="ach-progress-bar" style="width: ${progressPercent}%; background: ${quest.color || 'var(--accent-green)'};"></div>
                </div>
            </div>
            <span style="font-size: 0.8rem; color: var(--accent-yellow); font-weight: bold; min-width: 50px; text-align: left;">${toArabicNumerals(Math.min(currentVal, targetGoal))}/${toArabicNumerals(targetGoal)}</span>
        `;
        list.appendChild(card);
    });
}

function renderWeeklyQuests(list) {
    if (typeof WEEKLY_QUESTS_CONFIG === 'undefined') return;

    WEEKLY_QUESTS_CONFIG.forEach(quest => {
        const currentVal = typeof quest.getProgress === 'function' ? quest.getProgress(userProgress) : 0;
        const targetGoal = quest.target;
        const isClaimed = !!(userProgress.claimedWeeklyQuests && userProgress.claimedWeeklyQuests[quest.id]);
        const canClaim = !isClaimed && (currentVal >= targetGoal);
        const progressPercent = isClaimed ? 100 : Math.min(100, Math.round((currentVal / targetGoal) * 100));

        const card = document.createElement('div');
        card.className = `achievement-card ${canClaim ? 'completed' : ''} ${isClaimed ? 'maxed' : ''}`;

        let claimBtnHtml = '';
        if (isClaimed) {
            claimBtnHtml = `<span class="ach-maxed-badge">تم الاستلام ✅</span>`;
        } else if (canClaim) {
            claimBtnHtml = `<button class="ach-claim-btn" onclick="claimWeeklyQuest('${quest.id}')"><i class="fa-solid fa-gift"></i> استلام (${toArabicNumerals(quest.reward)} عملة)</button>`;
        } else {
            claimBtnHtml = `<span class="ach-reward-preview"><i class="fa-solid fa-gift"></i> ${toArabicNumerals(quest.reward)} عملة</span>`;
        }

        card.innerHTML = `
            <div class="ach-icon-box" style="color: ${quest.color || 'var(--accent-yellow)'};">
                <i class="${quest.icon || 'fa-solid fa-trophy'}"></i>
            </div>
            <div class="ach-info-box">
                <div class="ach-title-row">
                    <h4>${quest.title}</h4>
                    ${claimBtnHtml}
                </div>
                <div class="ach-desc">${quest.desc}</div>
                <div class="ach-progress-container">
                    <div class="ach-progress-bar" style="width: ${progressPercent}%; background: ${quest.color || 'var(--accent-green)'};"></div>
                </div>
            </div>
            <span style="font-size: 0.8rem; color: var(--accent-yellow); font-weight: bold; min-width: 50px; text-align: left;">${toArabicNumerals(Math.min(currentVal, targetGoal))}/${toArabicNumerals(targetGoal)}</span>
        `;
        list.appendChild(card);
    });
}

function renderLifetimeAchievements(list) {
    if (typeof INFINITE_ACHIEVEMENTS === 'undefined' || !Array.isArray(INFINITE_ACHIEVEMENTS)) return;

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
            claimBtnHtml = `<span class="ach-reward-preview"><i class="fa-solid fa-gift"></i> ${lvlData.rewardName || (lvlData.reward + ' عملة')}</span>`;
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

function claimDailyQuest(questId) {
    ensureQuestsIntegrity();
    const quest = DAILY_QUESTS_CONFIG.find(q => q.id === questId);
    if (!quest) return;

    if (userProgress.claimedDailyQuests[questId]) return;

    userProgress.claimedDailyQuests[questId] = true;
    userProgress.coins = (userProgress.coins || 0) + quest.reward;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! استلمت مكافأة المهمة اليومية [ ${quest.title} ]: +${toArabicNumerals(quest.reward)} عملة ذهبية!`, 'مهمة مكتملة!', '🏆');

    updateHeaderStats();
    renderAchievementsList();
    updateAchievementBadge();
}

function claimWeeklyQuest(questId) {
    ensureQuestsIntegrity();
    const quest = WEEKLY_QUESTS_CONFIG.find(q => q.id === questId);
    if (!quest) return;

    if (userProgress.claimedWeeklyQuests[questId]) return;

    userProgress.claimedWeeklyQuests[questId] = true;
    userProgress.coins = (userProgress.coins || 0) + quest.reward;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! استلمت مكافأة المهمة الأسبوعية [ ${quest.title} ]: +${toArabicNumerals(quest.reward)} عملة ذهبية!`, 'مهمة أسبوعية مكتملة!', '👑');

    updateHeaderStats();
    renderAchievementsList();
    updateAchievementBadge();
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

function updateAchievementBadge() {
    const badge = document.getElementById('achievements-badge');
    if (!badge) return;

    ensureQuestsIntegrity();

    let claimableCount = 0;

    // 1. فحص اليومية
    if (typeof DAILY_QUESTS_CONFIG !== 'undefined') {
        DAILY_QUESTS_CONFIG.forEach(q => {
            const val = typeof q.getProgress === 'function' ? q.getProgress(userProgress) : 0;
            if (!userProgress.claimedDailyQuests[q.id] && val >= q.target) claimableCount++;
        });
    }

    // 2. فحص الأسبوعية
    if (typeof WEEKLY_QUESTS_CONFIG !== 'undefined') {
        WEEKLY_QUESTS_CONFIG.forEach(q => {
            const val = typeof q.getProgress === 'function' ? q.getProgress(userProgress) : 0;
            if (!userProgress.claimedWeeklyQuests[q.id] && val >= q.target) claimableCount++;
        });
    }

    // 3. فحص الدائمة
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
