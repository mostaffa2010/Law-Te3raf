// js/customization.js - إدارة تخصيص الحساب والأفاتارات والإطارات والألقاب وبطاقة إحصائيات اللاعب

// قائمة الأفاتارات (شخصيات مرسومة مميزة ذات طابع ألعاب وتحديات)
var AVATARS_DB = window.AVATARS_DB = [
    { id: 'av_default', name: 'المحارب الكلاسيكي', type: 'free', price: 0, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png', unlockDesc: 'مجاني للجميع' },
    { id: 'av_ninja', name: 'النينجا الخفي', type: 'free', price: 0, src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', unlockDesc: 'مجاني للجميع' },
    
    // أفاتارات المتجر (تُشترى بالعملات الذهبية)
    { id: 'av_pharaoh', name: 'الفرعون الذهبي 👑', type: 'shop', price: 400, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333624.png', unlockDesc: 'متجر: 400 عملة' },
    { id: 'av_astro', name: 'رائد الفضاء الكوني 🚀', type: 'shop', price: 700, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333633.png', unlockDesc: 'متجر: 700 عملة' },
    { id: 'av_pirate', name: 'قبطان القراصنة 🏴‍☠️', type: 'shop', price: 1000, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333615.png', unlockDesc: 'متجر: 1,000 عملة' },
    { id: 'av_wizard', name: 'ساحر المعرفة الأكبر 🧙‍♂️', type: 'shop', price: 1500, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333639.png', unlockDesc: 'متجر: 1,500 عملة' },
    { id: 'av_emperor', name: 'إمبراطور الثقافة الذهبي 🏛️', type: 'shop', price: 2000, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333621.png', unlockDesc: 'متجر: 2,000 عملة' },
    
    // أفاتارات حصرية بالإنجازات الصعبة والرانك
    { id: 'av_falcon', name: 'صقر المعرفة الأسطوري 🦅', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333645.png', unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'av_lightning', name: 'سيد الصاعقة والبرق ⚡', type: 'achievement', reqAch: 'ach_speed', reqLvl: 4, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333612.png', unlockDesc: 'إنجاز: 200 إجابة سريعة' },
    { id: 'av_warlord', name: 'ملك التحديات والرانك 👑', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, src: 'https://cdn-icons-png.flaticon.com/512/4333/4333627.png', unlockDesc: 'إنجاز: 100 فوز بالرانك' }
];

// قائمة الإطارات المتوهجة والمتحركة
var FRAMES_DB = window.FRAMES_DB = [
    { id: 'frame_none', name: 'بدون إطار', type: 'free', price: 0, className: 'frame-none', borderCss: 'none', unlockDesc: 'مجاني' },
    
    // إطارات المتجر
    { id: 'frame_neon_cyan', name: 'النيون السماوي المشع 🔵', type: 'shop', price: 500, className: 'frame-neon-cyan', borderCss: '3.5px solid #00f0ff', unlockDesc: 'متجر: 500 عملة' },
    { id: 'frame_imperial_purple', name: 'البنفسجي الإمبراطوري 🟣', type: 'shop', price: 800, className: 'frame-imperial-purple', borderCss: '3.5px solid #a855f7', unlockDesc: 'متجر: 800 عملة' },
    { id: 'frame_radiant_gold', name: 'الذهب الملكي البراق 🟡', type: 'shop', price: 1000, className: 'frame-radiant-gold', borderCss: '3.5px solid #f59e0b', unlockDesc: 'متجر: 1,000 عملة' },
    
    // إطارات حصرية خارقة
    { id: 'frame_flame_animated', name: 'اللهب الناري المتوهج والمتحرك 🔥', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, className: 'frame-flame-animated', borderCss: '3.5px solid #ef4444', unlockDesc: 'إنجاز: سلسلة 10 انتصارات متتالية' },
    { id: 'frame_diamond_crystal', name: 'الكريستال الماسي الأسطوري 💎', type: 'rank', reqRankTier: 'diamond', className: 'frame-diamond-crystal', borderCss: '3.5px solid #38bdf8', unlockDesc: 'بلوغ دوري الماسي' },
    { id: 'frame_challenger_apex', name: 'تاج المتحدي الأسطوري المذهب 👑', type: 'rank', reqRankTier: 'challenger', className: 'frame-challenger-apex', borderCss: '4px solid #fbbf24', unlockDesc: 'بلوغ قمة المتحدي الأسطوري' }
];

// قائمة الألقاب الشرفية الموسعة
var TITLES_DB = window.TITLES_DB = [
    { id: 'title_player', title: 'لاعب', type: 'free', unlockDesc: 'اللقب الافتراضي' },
    { id: 'title_thinker', title: 'المفكر العبقري', type: 'achievement', reqAch: 'ach_correct', reqLvl: 2, unlockDesc: 'إنجاز: 300 سؤال صحيح' },
    { id: 'title_challenger', title: 'عاشق التحدي', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_knight', title: 'فارس الثقافة', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_star_hunter', title: 'صياد النجوم', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_mastermind', title: 'العقل المدبر', type: 'shop', price: 300, unlockDesc: 'متجر: 300 عملة' },
    { id: 'title_speedster', title: 'صاعقة السرعة ⚡', type: 'achievement', reqAch: 'ach_speed', reqLvl: 3, unlockDesc: 'إنجاز: 150 إجابة سريعة' },
    { id: 'title_gladiator', title: 'قاهر الرانك ⚔️', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, unlockDesc: 'إنجاز: 60 فوز بالرانك' },
    { id: 'title_professor', title: 'البروفيسور 🎓', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'title_puzzle_king', title: 'ملك الألغاز 🧩', type: 'shop', price: 500, unlockDesc: 'متجر: 500 عملة' },
    { id: 'title_sniper', title: 'قناص الإجابات 🎯', type: 'shop', price: 600, unlockDesc: 'متجر: 600 عملة' },
    { id: 'title_warlord_title', title: 'سيد التحديات 🏆', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, unlockDesc: 'إنجاز: 100 فوز بالرانك' },
    { id: 'title_encyclopedia', title: 'موسوعة المعرفة 📚', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'title_invincible', title: 'عقل لا يُقهر 🛡️', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, unlockDesc: 'إنجاز: سلسلة 10 انتصارات' },
    { id: 'title_champion', title: 'بطل الأبطال 🌟', type: 'rank', reqRankTier: 'master', unlockDesc: 'بلوغ دوري أستاذ (Master)' },
    { id: 'title_legend', title: 'الأسطورة الخالدة 👑', type: 'rank', reqRankTier: 'challenger', unlockDesc: 'بلوغ قمة تشالنجر الأسطوري' }
];

let activeProfileTab = 'stats';
let pendingAvatar = null;
let pendingFrame = null;
let pendingTitle = null;

function openPlayerProfileModal() {
    ensureUserProgressIntegrity();
    const modal = document.getElementById('player-profile-modal');
    if (!modal) return;

    pendingAvatar = userProgress.equippedAvatar || 'av_default';
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
    }
}

function renderPlayerProfileHeader() {
    const avatarImg = document.getElementById('prof-header-avatar');
    const nameElem = document.getElementById('prof-header-name');
    const titleElem = document.getElementById('prof-header-title');
    const rankElem = document.getElementById('prof-header-rank');
    const frameWrap = document.getElementById('prof-header-avatar-wrap');

    const displayName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'لاعب';
    const currentAvObj = AVATARS_DB.find(a => a.id === pendingAvatar) || AVATARS_DB[0];
    const currentFrObj = FRAMES_DB.find(f => f.id === pendingFrame) || FRAMES_DB[0];
    const userRank = getUserCurrentRank();

    if (nameElem) nameElem.innerText = displayName;
    if (titleElem) titleElem.innerText = pendingTitle || 'لاعب';
    if (avatarImg) avatarImg.src = currentAvObj.src;

    if (frameWrap) {
        frameWrap.className = `prof-avatar-frame-box ${currentFrObj.className || ''}`;
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
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyAvatar('${av.id}', ${av.price})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(av.price)}</button>`;
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
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyFrame('${fr.id}', ${fr.price})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(fr.price)}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${fr.unlockDesc}</span>`;
        }

        const card = document.createElement('div');
        card.className = `custom-item-card ${isSelected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="frame-preview-box ${fr.className || ''}">
                <img src="${currentAvObj.src}" alt="Preview">
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
            actionBtnHtml = `<button class="btn-buy-custom" onclick="buyTitle('${ti.id}', '${ti.title}', ${ti.price})"><i class="fa-solid fa-coins"></i> ${toArabicNumerals(ti.price)}</button>`;
        } else {
            actionBtnHtml = `<span class="locked-req-tag"><i class="fa-solid fa-lock"></i> ${ti.unlockDesc}</span>`;
        }

        const row = document.createElement('div');
        row.className = `custom-title-row ${isSelected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`;
        row.innerHTML = `
            <div class="custom-title-name">🏷️ ${ti.title}</div>
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
    if (!userProgress.unlockedAvatars) userProgress.unlockedAvatars = ['av_default', 'av_ninja'];
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
    userProgress.equippedAvatar = pendingAvatar || 'av_default';
    userProgress.equippedFrame = pendingFrame || 'frame_none';
    userProgress.equippedTitle = pendingTitle || 'لاعب';

    const avObj = AVATARS_DB.find(a => a.id === userProgress.equippedAvatar) || AVATARS_DB[0];
    const frObj = FRAMES_DB.find(f => f.id === userProgress.equippedFrame) || FRAMES_DB[0];

    if (currentUser) {
        currentUser.photoURL = avObj.src;
    }

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    // تحديث ترويسة القائمة الرئيسية مباشرة وبشكل حي
    applyCustomizationToHeader(avObj, frObj, userProgress.equippedTitle);

    showCustomAlert('✨ تم حفظ وتطبيق المظهر الجديد بنجاح!', 'تم الحفظ!', '🎨');
    closePlayerProfileModal();
}

function applyCustomizationToHeader(avObj, frObj, titleStr) {
    const headerAvatar = document.getElementById('user-avatar');
    const headerAvatarBox = document.getElementById('header-avatar-frame-wrap');
    const headerTitleElem = document.getElementById('header-user-title-display');

    if (!avObj) avObj = AVATARS_DB.find(a => a.id === (userProgress.equippedAvatar || 'av_default')) || AVATARS_DB[0];
    if (!frObj) frObj = FRAMES_DB.find(f => f.id === (userProgress.equippedFrame || 'frame_none')) || FRAMES_DB[0];
    if (!titleStr) titleStr = userProgress.equippedTitle || 'لاعب';

    if (headerAvatar) headerAvatar.src = avObj.src;
    if (headerAvatarBox) {
        headerAvatarBox.className = `user-avatar-frame-wrap ${frObj.className || ''}`;
    }
    if (headerTitleElem) {
        headerTitleElem.innerText = `🏷️ ${titleStr}`;
    }
}
