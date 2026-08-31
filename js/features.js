// js/features.js - المتصدرين، عجلة الحظ، الإنجازات، المتجر، وتثبيت PWA

// --- المتصدرين ---
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

// --- عجلة الحظ اليومية ---
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
        userProgress.coins += sector.value;
        showCustomAlert(`فزت بـ ${sector.value} عملة ذهبية!`, 'مبروك!', '🎉');
    } else if (sector.type === "item") {
        userProgress.inventory[sector.value] = (userProgress.inventory[sector.value] || 0) + 1;
        showCustomAlert(`فزت بوسيلة مساعدة: [${sector.label}] في مخزونك!`, 'مبروك!', '🎁');
    }

    saveProgress();
    updateHeaderStats();
}

// --- سجل الإنجازات ---
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

// --- متجر المساعدات ---
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
        showCustomAlert('رصيدك من العملات غير كافٍ!', 'تنبيه', '🪙');
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
}

// --- تثبيت التطبيق كـ PWA ---
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
