// js/customization.js - إدارة تخصيص الحساب والأفاتارات والإطارات والألقاب وبطاقة إحصائيات اللاعب

// قائمة الأفاتارات (20 شخصية فيكتور أصلية عالية الدقة)
var AVATARS_DB = window.AVATARS_DB = [
    // مجانية (2)
    { id: 'av_warrior', name: 'المحارب الفولاذي', type: 'free', price: 0, src: './assets/avatars/avatar_warrior.svg', unlockDesc: 'مجاني للجميع' },
    { id: 'av_ninja', name: 'النينجا الخفي', type: 'free', price: 0, src: './assets/avatars/avatar_ninja.svg', unlockDesc: 'مجاني للجميع' },
    
    // متجر العملات (10)
    { id: 'av_detective', name: 'المحقق الذكي', type: 'shop', price: 400, src: './assets/avatars/avatar_detective.svg', unlockDesc: 'متجر: 400 عملة' },
    { id: 'av_viking', name: 'محارب الفايكنج', type: 'shop', price: 600, src: './assets/avatars/avatar_viking.svg', unlockDesc: 'متجر: 600 عملة' },
    { id: 'av_samurai', name: 'الساموراي الصنديد', type: 'shop', price: 800, src: './assets/avatars/avatar_samurai.svg', unlockDesc: 'متجر: 800 عملة' },
    { id: 'av_pharaoh', name: 'الفرعون الذهبي', type: 'shop', price: 1000, src: './assets/avatars/avatar_pharaoh.svg', unlockDesc: 'متجر: 1,000 عملة' },
    { id: 'av_astro', name: 'رائد الفضاء الكوني', type: 'shop', price: 1200, src: './assets/avatars/avatar_astronaut.svg', unlockDesc: 'متجر: 1,200 عملة' },
    { id: 'av_gladiator', name: 'المصارع الروماني', type: 'shop', price: 1400, src: './assets/avatars/avatar_gladiator.svg', unlockDesc: 'متجر: 1,400 عملة' },
    { id: 'av_pirate', name: 'قبطان القراصنة', type: 'shop', price: 1600, src: './assets/avatars/avatar_pirate.svg', unlockDesc: 'متجر: 1,600 عملة' },
    { id: 'av_alchemist', name: 'عالم الكيمياء', type: 'shop', price: 1800, src: './assets/avatars/avatar_alchemist.svg', unlockDesc: 'متجر: 1,800 عملة' },
    { id: 'av_wizard', name: 'ساحر المعرفة الأكبر', type: 'shop', price: 2000, src: './assets/avatars/avatar_wizard.svg', unlockDesc: 'متجر: 2,000 عملة' },
    { id: 'av_lion', name: 'الأسد الملكي', type: 'shop', price: 2500, src: './assets/avatars/avatar_lion.svg', unlockDesc: 'متجر: 2,500 عملة' },
    
    // حصرية بالإنجازات التعجيزية والرانك (8)
    { id: 'av_cyberpunk', name: 'السايبورغ المتطور', type: 'achievement', reqAch: 'ach_high_score', reqLvl: 3, src: './assets/avatars/avatar_cyberpunk.svg', unlockDesc: 'إنجاز: 200 نقطة باللانهائي' },
    { id: 'av_dragon', name: 'فارس التنين الناري', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, src: './assets/avatars/avatar_dragon.svg', unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'av_emperor', name: 'إمبراطور الثقافة', type: 'achievement', reqAch: 'ach_correct', reqLvl: 3, src: './assets/avatars/avatar_emperor.svg', unlockDesc: 'إنجاز: 700 سؤال صحيح' },
    { id: 'av_phoenix', name: 'طائر الفينيق الخالد', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, src: './assets/avatars/avatar_phoenix.svg', unlockDesc: 'إنجاز: 60 فوز بالرانك' },
    { id: 'av_falcon', name: 'صقر الأساطير', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, src: './assets/avatars/avatar_falcon.svg', unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'av_lightning', name: 'سيد الصاعقة والبرق', type: 'achievement', reqAch: 'ach_speed', reqLvl: 4, src: './assets/avatars/avatar_lightning.svg', unlockDesc: 'إنجاز: 200 إجابة سريعة' },
    { id: 'av_warlord', name: 'بطل التحديات والرانك', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, src: './assets/avatars/avatar_champion.svg', unlockDesc: 'إنجاز: 100 فوز بالرانك' },
    { id: 'av_cosmic_god', name: 'كيان الكون الأسطوري', type: 'rank', reqRankTier: 'challenger', src: './assets/avatars/avatar_cosmic_god.svg', unlockDesc: 'بلوغ قمة تشالنجر الأسطوري' }
];

// قائمة الإطارات المزخرفة الأصلية (Ornate SVG Frame Overlays)
var FRAMES_DB = window.FRAMES_DB = [
    { id: 'frame_none', name: 'بدون إطار', type: 'free', price: 0, overlaySvg: '', unlockDesc: 'مجاني للجميع' },
    
    // متجر العملات
    { id: 'frame_cyber_neon', name: 'السايبر والنيون التكنولوجي', type: 'shop', price: 500, overlaySvg: './assets/frames/frame_cyber_neon.svg', unlockDesc: 'متجر: 500 عملة' },
    { id: 'frame_royal_laurel', name: 'أوراق الغار الملكية والياقوت', type: 'shop', price: 800, overlaySvg: './assets/frames/frame_royal_laurel.svg', unlockDesc: 'متجر: 800 عملة' },
    { id: 'frame_dragon_fire', name: 'أجنحة التنين واللهب المشع', type: 'shop', price: 1000, overlaySvg: './assets/frames/frame_dragon_fire.svg', unlockDesc: 'متجر: 1,000 عملة' },
    
    // إطارات حصرية خارقة
    { id: 'frame_inferno_flame', name: 'اللهب البركاني المتوهج', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, overlaySvg: './assets/frames/frame_inferno_flame.svg', unlockDesc: 'إنجاز: سلسلة 10 انتصارات متتالية' },
    { id: 'frame_diamond_crystal', name: 'الكريستال الماسي الأسطوري', type: 'rank', reqRankTier: 'diamond', overlaySvg: './assets/frames/frame_diamond_crystal.svg', unlockDesc: 'بلوغ دوري الماسي' },
    { id: 'frame_challenger_crown', name: 'تاج المتحدي الأسطوري المذهب', type: 'rank', reqRankTier: 'challenger', overlaySvg: './assets/frames/frame_challenger_crown.svg', unlockDesc: 'بلوغ قمة المتحدي الأسطوري' }
];

// قائمة الألقاب الشرفية النقية (بدون أي إيموجي)
var TITLES_DB = window.TITLES_DB = [
    { id: 'title_player', title: 'لاعب', type: 'free', unlockDesc: 'اللقب الافتراضي' },
    { id: 'title_thinker', title: 'المفكر العبقري', type: 'achievement', reqAch: 'ach_correct', reqLvl: 2, unlockDesc: 'إنجاز: 300 سؤال صحيح' },
    { id: 'title_challenger', title: 'عاشق التحدي', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_knight', title: 'فارس الثقافة', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_star_hunter', title: 'صياد النجوم', type: 'free', unlockDesc: 'متاح للجميع' },
    { id: 'title_mastermind', title: 'العقل المدبر', type: 'shop', price: 300, unlockDesc: 'متجر: 300 عملة' },
    { id: 'title_speedster', title: 'صاعقة السرعة', type: 'achievement', reqAch: 'ach_speed', reqLvl: 3, unlockDesc: 'إنجاز: 150 إجابة سريعة' },
    { id: 'title_gladiator', title: 'قاهر الرانك', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 3, unlockDesc: 'إنجاز: 60 فوز بالرانك' },
    { id: 'title_professor', title: 'البروفيسور', type: 'achievement', reqAch: 'ach_streak', reqLvl: 3, unlockDesc: 'إنجاز: سلسلة 7 انتصارات' },
    { id: 'title_puzzle_king', title: 'ملك الألغاز', type: 'shop', price: 500, unlockDesc: 'متجر: 500 عملة' },
    { id: 'title_sniper', title: 'قناص الإجابات', type: 'shop', price: 600, unlockDesc: 'متجر: 600 عملة' },
    { id: 'title_warlord_title', title: 'سيد التحديات', type: 'achievement', reqAch: 'ach_pvp', reqLvl: 4, unlockDesc: 'إنجاز: 100 فوز بالرانك' },
    { id: 'title_encyclopedia', title: 'موسوعة المعرفة', type: 'achievement', reqAch: 'ach_correct', reqLvl: 4, unlockDesc: 'إنجاز: 1,500 سؤال صحيح' },
    { id: 'title_invincible', title: 'عقل لا يُقهر', type: 'achievement', reqAch: 'ach_streak', reqLvl: 4, unlockDesc: 'إنجاز: سلسلة 10 انتصارات' },
    { id: 'title_champion', title: 'بطل الأبطال', type: 'rank', reqRankTier: 'master', unlockDesc: 'بلوغ دوري أستاذ' },
    { id: 'title_legend', title: 'الأسطورة الخالدة', type: 'rank', reqRankTier: 'challenger', unlockDesc: 'بلوغ قمة تشالنجر الأسطوري' }
];

let activeProfileTab = 'stats';
let activeCustomSubTab = 'avatars';

function switchCustomSubTab(subTabName) {
    activeCustomSubTab = subTabName;
    document.querySelectorAll('.custom-sub-tab').forEach(t => t.classList.remove('active'));

    const btn = document.getElementById(`subtab-${subTabName}`);
    if (btn) btn.classList.add('active');

    const contentAv = document.getElementById('subtab-content-avatars');
    const contentFr = document.getElementById('subtab-content-frames');
    const contentTi = document.getElementById('subtab-content-titles');

    if (contentAv) contentAv.style.display = (subTabName === 'avatars') ? 'block' : 'none';
    if (contentFr) contentFr.style.display = (subTabName === 'frames') ? 'block' : 'none';
    if (contentTi) contentTi.style.display = (subTabName === 'titles') ? 'block' : 'none';

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

let pendingAvatar = null;
let pendingFrame = null;
let pendingTitle = null;

function openPlayerProfileModal() {
    ensureUserProgressIntegrity();
    const modal = document.getElementById('player-profile-modal');
    if (!modal) return;

    pendingAvatar = userProgress.equippedAvatar || 'av_warrior';
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
    const frameImg = document.getElementById('prof-header-frame-overlay');
    const nameElem = document.getElementById('prof-header-name');
    const titleElem = document.getElementById('prof-header-title');
    const rankElem = document.getElementById('prof-header-rank');

    const displayName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'لاعب';
    const currentAvObj = AVATARS_DB.find(a => a.id === pendingAvatar) || AVATARS_DB[0];
    const currentFrObj = FRAMES_DB.find(f => f.id === pendingFrame) || FRAMES_DB[0];
    const userRank = getUserCurrentRank();

    if (nameElem) nameElem.innerText = displayName;
    if (titleElem) titleElem.innerText = pendingTitle || 'لاعب';
    if (avatarImg) avatarImg.src = currentAvObj.src;

    if (frameImg) {
        if (currentFrObj.overlaySvg) {
            frameImg.src = currentFrObj.overlaySvg;
            frameImg.style.display = 'block';
        } else {
            frameImg.style.display = 'none';
        }
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
    if (av.type === 'rank') {
        const userRank = getUserCurrentRank();
        const reqRank = getRankData(av.reqRankTier);
        return userRank.tier >= reqRank.tier;
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
            <div class="custom-avatar-wrapper">
                <img class="custom-card-img" src="${av.src}" alt="${av.name}">
            </div>
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
            <div class="frame-preview-box">
                <img class="avatar-face-img" src="${currentAvObj.src}" alt="Preview">
                ${fr.overlaySvg ? `<img class="avatar-frame-overlay" src="${fr.overlaySvg}" alt="Frame">` : ''}
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
            <div class="custom-title-name">${ti.title}</div>
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
    if (!userProgress.unlockedAvatars) userProgress.unlockedAvatars = ['av_warrior', 'av_ninja'];
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
    userProgress.equippedAvatar = pendingAvatar || 'av_warrior';
    userProgress.equippedFrame = pendingFrame || 'frame_none';
    userProgress.equippedTitle = pendingTitle || 'لاعب';

    const avObj = AVATARS_DB.find(a => a.id === userProgress.equippedAvatar) || AVATARS_DB[0];
    const frObj = FRAMES_DB.find(f => f.id === userProgress.equippedFrame) || FRAMES_DB[0];

    if (currentUser) {
        currentUser.photoURL = avObj.src;
    }

    saveProgress();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

    applyCustomizationToHeader(avObj, frObj, userProgress.equippedTitle);

    showCustomAlert('✨ تم حفظ وتطبيق مظهرك الجديد بنجاح!', 'تم الحفظ!', '🎨');
    closePlayerProfileModal();
}

function applyCustomizationToHeader(avObj, frObj, titleStr) {
    const headerAvatar = document.getElementById('user-avatar');
    const headerFrameOverlay = document.getElementById('header-avatar-frame-overlay');
    const headerTitleElem = document.getElementById('header-user-title-display');

    if (!avObj) avObj = AVATARS_DB.find(a => a.id === (userProgress.equippedAvatar || 'av_warrior')) || AVATARS_DB[0];
    if (!frObj) frObj = FRAMES_DB.find(f => f.id === (userProgress.equippedFrame || 'frame_none')) || FRAMES_DB[0];
    if (!titleStr) titleStr = userProgress.equippedTitle || 'لاعب';

    if (headerAvatar) headerAvatar.src = avObj.src;

    if (headerFrameOverlay) {
        if (frObj.overlaySvg) {
            headerFrameOverlay.src = frObj.overlaySvg;
            headerFrameOverlay.style.display = 'block';
        } else {
            headerFrameOverlay.style.display = 'none';
        }
    }

    if (headerTitleElem) {
        headerTitleElem.innerText = `${titleStr}`;
    }
}
