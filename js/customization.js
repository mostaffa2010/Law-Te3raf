// js/customization.js - إدارة تخصيص الحساب (الأفاتارات، الإطارات، الألقاب) وبطاقة إحصائيات اللاعب

// قائمة الأفاتارات (صور مصغرة عالية الجودة عبر CDN)
var AVATARS_DB = window.AVATARS_DB = [
    { id: 'av_default', name: 'لاعب كلاسيكي', type: 'free', price: 0, src: 'https://cdn-icons-png.flaticon.com/512/847/847969.png', unlockDesc: 'مجاني للجميع' },
    { id: 'av_ninja', name: 'المحارب المقنع', type: 'free', price: 0, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', unlockDesc: 'مجاني للجميع' },
    
    // أفاتارات المتجر (تُشترى بالعملات الذهبية)
    { id: 'av_pharaoh', name: 'الفرعون الذهبي', type: 'shop', price: 400, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', unlockDesc: 'متجر: 400 عملة' },
    { id: 'av_astro', name: 'رائد الفضاء', type: 'shop', price: 700, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png', unlockDesc: 'متجر: 700 عملة' },
    { id: 'av_pirate', name: 'القرصان المغامر', type: 'shop', price: 1000, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png', unlockDesc: 'متجر: 1,000 عملة' },
    { id: 'av_wizard', name: 'الحكيم العظيم', type: 'shop', price: 1500, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135823.png', unlockDesc: 'متجر: 1,500 عملة' },
    { id: 'av_king', name: 'ملك المعرفة', type: 'shop', price: 2000, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135728.png', unlockDesc: 'متجر: 2,000 عملة' },
    
    // أفاتارات حصرية بالإنجازات والرانك
    { id: 'av_falcon', name: 'صقر المعرفة الأسطوري', type: 'achievement', reqAch: 'ach_correct', reqLvl: 5, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135805.png', unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'av_lightning', name: 'البرق الخاطف', type: 'achievement', reqAch: 'ach_speed', reqLvl: 4, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135773.png', unlockDesc: 'إنجاز: 200 إجابة سريعة' },
    { id: 'av_warlord', name: 'ملك التحديات', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135798.png', unlockDesc: 'إنجاز: 100 فوز في الرانك' }
];

// قائمة الإطارات الملونة والمتحركة
var FRAMES_DB = window.FRAMES_DB = [
    { id: 'frame_none', name: 'بدون إطار', type: 'free', price: 0, className: '', borderCss: 'none', unlockDesc: 'مجاني' },
    
    // إطارات المتجر
    { id: 'frame_neon_blue', name: 'النيون السماوي', type: 'shop', price: 500, className: 'frame-neon-blue', borderCss: '3px solid #38bdf8', unlockDesc: 'متجر: 500 عملة' },
    { id: 'frame_royal_purple', name: 'البنفسجي الملكي', type: 'shop', price: 800, className: 'frame-royal-purple', borderCss: '3px solid #a855f7', unlockDesc: 'متجر: 800 عملة' },
    { id: 'frame_gold_shine', name: 'الذهب البراق', type: 'shop', price: 1000, className: 'frame-gold-shine', borderCss: '3px solid #f59e0b', unlockDesc: 'متجر: 1,000 عملة' },
    
    // إطارات الإنجازات والرانك الحصرية
    { id: 'frame_flame_animated', name: 'اللهب الناري المتوهج', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, className: 'frame-flame-animated', borderCss: '3px solid #ef4444', unlockDesc: 'إنجاز: سلسلة 10 انتصارات' },
    { id: 'frame_diamond_crest', name: 'الماسي الملكي', type: 'rank', reqRankTier: 'diamond', className: 'frame-diamond-crest', borderCss: '3px solid #06b6d4', unlockDesc: 'بلوغ دوري الماسي' },
    { id: 'frame_challenger_apex', name: 'المتحدي الأسطوري', type: 'rank', reqRankTier: 'challenger', className: 'frame-challenger-apex', borderCss: '3px solid #fbbf24', unlockDesc: 'بلوغ دوري تشالنجر الأسطوري' }
];

// قائمة الألقاب
var TITLES_DB = window.TITLES_DB = [
    { id: 'title_player', title: 'لاعب', type: 'free', unlockDesc: 'اللقب الافتراضي' },
    { id: 'title_thinker', title: 'المفكر الذكي', type: 'achievement', reqAch: 'ach_correct', reqLvl: 2, unlockDesc: 'إنجاز: 300 سؤال صحيح' },
    { id: 'title_speedster', title: 'صاعقة السرعة', type: 'achievement', reqAch: 'ach_speed', reqLvl: 3, unlockDesc: 'إنجاز: 100 إجابة سريعة' },
    { id: 'title_gladiator', title: 'قاهر الرانك', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, unlockDesc: 'إنجاز: 50 فوز بالرانك' },
    { id: 'title_professor', title: 'البروفيسور', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'title_legend', title: 'الأسطورة الخالدة', type: 'rank', reqRankTier: 'challenger', unlockDesc: 'بلوغ قمة تشالنجر الأسطوري' }
];

let activeProfileTab = 'stats';

function openPlayerProfileModal() {
    ensureUserProgressIntegrity();
    const modal = document.getElementById('player-profile-modal');
    if (!modal) return;

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
    }
}

function renderPlayerProfileHeader() {
    const avatarImg = document.getElementById('prof-header-avatar');
    const nameElem = document.getElementById('prof-header-name');
    const titleElem = document.getElementById('prof-header-title');
    const rankElem = document.getElementById('prof-header-rank');
    const frameWrap = document.getElementById('prof-header-avatar-wrap');

    const displayName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'لاعب';
    const equippedAv = getEquippedAvatarObj();
    const equippedFr = getEquippedFrameObj();
    const equippedTitle = userProgress.equippedTitle || 'لاعب';
    const userRank = getUserCurrentRank();

    if (nameElem) nameElem.innerText = displayName;
    if (titleElem) titleElem.innerText = equippedTitle;
    if (avatarImg) avatarImg.src = equippedAv.src;

    if (frameWrap) {
        frameWrap.className = `prof-avatar-frame-box ${equippedFr.className || ''}`;
        frameWrap.style.borderColor = equippedFr.borderCss !== 'none' ? '' : 'transparent';
    }

    if (rankElem) {
        rankElem.innerHTML = `<span style="color: ${userRank.color}; font-weight: 800;"><i class="${userRank.icon}"></i> ${formatUserFullRankName()}</span>`;
    }
}

function renderPlayerStatsContent() {
    // 1. General Records
    const totalRankedWins = userProgress.rankedWins || 0;
    const totalRankedLosses = userProgress.rankedLosses || 0;
    const totalRankedMatches = totalRankedWins + totalRankedLosses;
    const winRate = totalRankedMatches > 0 ? Math.round((totalRankedWins / totalRankedMatches) * 100) : 0;

    const rkWinsElem = document.getElementById('stat-val-rk-wins');
    const winRateElem = document.getElementById('stat-val-winrate');
    const highScoreElem = document.getElementById('stat-val-highscore');
    const maxStreakElem = document.getElementById('stat-val-maxstreak');
    const totalCorrectElem = document.getElementById('stat-val-totalcorrect');

    if (rkWinsElem) rkWinsElem.innerText = totalRankedWins;
    if (winRateElem) winRateElem.innerText = `${winRate}%`;
    if (highScoreElem) highScoreElem.innerText = userProgress.highScore || 0;
    if (maxStreakElem) maxStreakElem.innerText = userProgress.maxCorrectStreak || 0;
    if (totalCorrectElem) totalCorrectElem.innerText = userProgress.totalCorrect || 0;

    // 2. Category Accuracy Breakdown (Vertical List)
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
        let statusTag = 'ممتاز 🟢';
        if (catData.total === 0) {
            barColor = 'rgba(255, 255, 255, 0.2)';
            statusTag = 'لم يُلعب بعد';
        } else if (accuracy < 40) {
            barColor = 'var(--accent-red)';
            statusTag = 'يحتاج تدريب 🔴';
        } else if (accuracy < 65) {
            barColor = 'var(--accent-yellow)';
            statusTag = 'متوسط 🟠';
        } else if (accuracy < 80) {
            barColor = 'var(--accent-purple)';
            statusTag = 'جيد جداً 🔵';
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
                    <span class="cat-stat-percent" style="color: ${barColor};">${accuracy}%</span>
                    <small class="cat-stat-ratio">(${catData.correct}/${catData.total})</small>
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

function getEquippedAvatarObj() {
    const eqId = userProgress.equippedAvatar || 'av_default';
    return AVATARS_DB.find(a => a.id === eqId) || AVATARS_DB[0];
}

function getEquippedFrameObj() {
    const eqId = userProgress.equippedFrame || 'frame_none';
    return FRAMES_DB.find(f => f.id === eqId) || FRAMES_DB[0];
}

function isAvatarUnlocked(av) {
    if (av.type === 'free') return true;
    if (userProgress.unlockedAvatars && userProgress.unlockedAvatars.includes(av.id)) return true;

    if (av.type === 'achievement') {
        const achLvl = (userProgress.claimedInfiniteLevels && userProgress.claimedInfiniteLevels[av.reqAch]) || 0;
        return achLvl >= av.reqLvl;
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

    const eqId = userProgress.equippedAvatar || 'av_default';

    AVATARS_DB.forEach(av => {
        const unlocked = isAvatarUnlocked(av);
        const isEquipped = (av.id === eqId);

        const card = document.createElement('div');
        card.className = `custom-item-card ${isEquipped ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;

        let actionBtnHtml = '';
        if (isEquipped) {
            actionBtnHtml = `<span class="equipped-tag">مجهز ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="equipAvatar('${av.id}')">تجهيز</button>`;
        } else if (av.type === 'shop') {
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyAvatar('${av.id}', ${av.price})"><i class="fa-solid fa-coins"></i> ${av.price}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${av.unlockDesc}</span>`;
        }

        card.innerHTML = `
            <img class="custom-card-img" src="${av.src}" alt="${av.name}">
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

    const eqId = userProgress.equippedFrame || 'frame_none';

    FRAMES_DB.forEach(fr => {
        const unlocked = isFrameUnlocked(fr);
        const isEquipped = (fr.id === eqId);

        let actionBtnHtml = '';
        if (isEquipped) {
            actionBtnHtml = `<span class="equipped-tag">مجهز ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="equipFrame('${fr.id}')">تجهيز</button>`;
        } else if (fr.type === 'shop') {
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyFrame('${fr.id}', ${fr.price})"><i class="fa-solid fa-coins"></i> ${fr.price}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${fr.unlockDesc}</span>`;
        }

        const card = document.createElement('div');
        card.className = `custom-item-card ${isEquipped ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="frame-preview-box ${fr.className || ''}" style="${fr.borderCss !== 'none' ? '' : 'border: 2px dashed rgba(255,255,255,0.2);'}">
                <img src="${getEquippedAvatarObj().src}" alt="Preview">
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

    const eqTitle = userProgress.equippedTitle || 'لاعب';

    TITLES_DB.forEach(ti => {
        const unlocked = isTitleUnlocked(ti);
        const isEquipped = (ti.title === eqTitle);

        let actionBtnHtml = '';
        if (isEquipped) {
            actionBtnHtml = `<span class="equipped-tag">مجهز ✅</span>`;
        } else if (unlocked) {
            actionBtnHtml = `<button class="btn-equip" onclick="equipTitle('${ti.title}')">تجهيز</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${ti.unlockDesc}</span>`;
        }

        const row = document.createElement('div');
        row.className = `custom-title-row ${isEquipped ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        row.innerHTML = `
            <div class="custom-title-name">🏷️ ${ti.title}</div>
            ${actionBtnHtml}
        `;
        list.appendChild(row);
    });
}

function equipAvatar(avId) {
    const av = AVATARS_DB.find(a => a.id === avId);
    if (!av || !isAvatarUnlocked(av)) return;

    userProgress.equippedAvatar = av.id;
    saveProgress();

    if (currentUser) {
        currentUser.photoURL = av.src;
    }

    renderPlayerProfileHeader();
    renderAvatarsGrid();
    renderFramesGrid();
    updateUserProfileUI(currentUser);
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();
}

function buyAvatar(avId, price) {
    const av = AVATARS_DB.find(a => a.id === avId);
    if (!av) return;

    if ((userProgress.coins || 0) < price) {
        showCustomAlert('رصيدك من العملات غير كافٍ لشراء هذا الأفاتار!', 'رصيد غير كافٍ', '🪙');
        return;
    }

    userProgress.coins -= price;
    if (!userProgress.unlockedAvatars) userProgress.unlockedAvatars = ['av_default', 'av_ninja'];
    if (!userProgress.unlockedAvatars.includes(avId)) {
        userProgress.unlockedAvatars.push(avId);
    }
    userProgress.equippedAvatar = avId;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! قمت بشراء وتجهيز أفاتار [ ${av.name} ]!`, 'تم الشراء!', '🎭');
    renderPlayerProfileHeader();
    renderAvatarsGrid();
    updateHeaderStats();
}

function equipFrame(frId) {
    const fr = FRAMES_DB.find(f => f.id === frId);
    if (!fr || !isFrameUnlocked(fr)) return;

    userProgress.equippedFrame = fr.id;
    saveProgress();

    renderPlayerProfileHeader();
    renderFramesGrid();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();
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
    userProgress.equippedFrame = frId;

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    showCustomAlert(`🎉 مبروك! قمت بشراء وتجهيز إطار [ ${fr.name} ]!`, 'تم الشراء!', '🖼️');
    renderPlayerProfileHeader();
    renderFramesGrid();
    updateHeaderStats();
}

function equipTitle(titleStr) {
    userProgress.equippedTitle = titleStr;
    saveProgress();

    renderPlayerProfileHeader();
    renderTitlesList();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();
}
