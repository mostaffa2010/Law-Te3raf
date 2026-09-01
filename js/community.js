// js/community.js - إدارة اقتراح الأسئلة من اللاعبين والمجتمع ولوحة تحكم المشرف

const SUGGEST_CATEGORIES = [
    { id: 'إسلاميات', name: 'إسلاميات', icon: 'fa-solid fa-mosque', color: '#10b981' },
    { id: 'رياضة وكورة', name: 'رياضة وكورة', icon: 'fa-solid fa-futbol', color: '#38bdf8' },
    { id: 'علوم وفضاء', name: 'علوم وفضاء', icon: 'fa-solid fa-atom', color: '#a855f7' },
    { id: 'تاريخ', name: 'تاريخ', icon: 'fa-solid fa-landmark-dome', color: '#f59e0b' },
    { id: 'جغرافيا', name: 'جغرافيا', icon: 'fa-solid fa-earth-americas', color: '#06b6d4' },
    { id: 'سينما وفن', name: 'سينما وفن', icon: 'fa-solid fa-film', color: '#ec4899' },
    { id: 'طبيعة وحيوانات', name: 'طبيعة وحيوانات', icon: 'fa-solid fa-paw', color: '#84cc16' },
    { id: 'تكنولوجيا وألعاب', name: 'تكنولوجيا وألعاب', icon: 'fa-solid fa-gamepad', color: '#6366f1' },
    { id: 'أدب ولغات', name: 'أدب ولغات', icon: 'fa-solid fa-book-open', color: '#14b8a6' },
    { id: 'سيارات ومحركات', name: 'سيارات ومحركات', icon: 'fa-solid fa-car', color: '#ef4444' },
    { id: 'ألغاز وذكاء', name: 'ألغاز وذكاء', icon: 'fa-solid fa-puzzle-piece', color: '#f97316' },
    { id: 'معلومات عامة', name: 'معلومات عامة', icon: 'fa-solid fa-globe', color: '#eab308' }
];

function openSuggestQuestionModal() {
    const modal = document.getElementById('suggest-question-modal');
    if (!modal) return;

    // ملء اسم الكاتب تلقائياً باسم اللاعب المسجل
    const authorInput = document.getElementById('suggest-author-input');
    if (authorInput) {
        authorInput.value = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : (userProgress.equippedTitle ? `${userProgress.equippedTitle}` : '');
    }

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestQuestionModal() {
    const modal = document.getElementById('suggest-question-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

// نافذة اختيار القسم المخصصة
function openSuggestCategoryPicker() {
    const modal = document.getElementById('suggest-cat-picker-modal');
    const list = document.getElementById('suggest-cat-picker-list');
    if (!modal || !list) return;

    const currentVal = document.getElementById('suggest-cat-value').value || 'معلومات عامة';
    list.innerHTML = '';

    SUGGEST_CATEGORIES.forEach(cat => {
        const isSelected = (cat.id === currentVal);
        const item = document.createElement('div');
        item.className = `pvp-cat-option-item ${isSelected ? 'selected' : ''}`;
        item.onclick = () => selectSuggestCategory(cat.id, cat.name, cat.icon, cat.color);

        item.innerHTML = `
            <div class="pvp-cat-option-info">
                <i class="${cat.icon}" style="color: ${cat.color};"></i>
                <span class="pvp-cat-option-name">${cat.name}</span>
            </div>
            <i class="fa-solid fa-circle-dot pvp-cat-radio"></i>
        `;
        list.appendChild(item);
    });

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestCategoryPicker() {
    const modal = document.getElementById('suggest-cat-picker-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectSuggestCategory(catId, catName, catIcon, catColor) {
    const valInput = document.getElementById('suggest-cat-value');
    const labelElem = document.getElementById('suggest-cat-selected-label');

    if (valInput) valInput.value = catId;
    if (labelElem) labelElem.innerHTML = `<i class="${catIcon}" style="color: ${catColor}; margin-left: 6px;"></i> ${catName}`;

    closeSuggestCategoryPicker();
}

// نافذة اختيار مستوى الصعوبة المخصصة
function openSuggestDiffPicker() {
    const modal = document.getElementById('suggest-diff-picker-modal');
    if (!modal) return;

    modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeSuggestDiffPicker() {
    const modal = document.getElementById('suggest-diff-picker-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectSuggestDiff(diffVal, diffLabel) {
    const valInput = document.getElementById('suggest-diff-value');
    const labelElem = document.getElementById('suggest-diff-selected-label');

    if (valInput) valInput.value = diffVal;
    if (labelElem) labelElem.innerText = diffLabel;

    closeSuggestDiffPicker();
}

async function submitSuggestedQuestion() {
    const qInput = document.getElementById('suggest-q-text');
    const catInput = document.getElementById('suggest-cat-value');
    const diffInput = document.getElementById('suggest-diff-value');
    const opt1Input = document.getElementById('suggest-opt1');
    const opt2Input = document.getElementById('suggest-opt2');
    const opt3Input = document.getElementById('suggest-opt3');
    const opt4Input = document.getElementById('suggest-opt4');
    const authorInput = document.getElementById('suggest-author-input');
    const submitBtn = document.getElementById('btn-submit-suggest');

    const qText = qInput ? qInput.value.trim() : '';
    const qCat = catInput ? catInput.value : 'معلومات عامة';
    const qDiff = diffInput ? parseInt(diffInput.value) : 4;
    const opt1 = opt1Input ? opt1Input.value.trim() : '';
    const opt2 = opt2Input ? opt2Input.value.trim() : '';
    const opt3 = opt3Input ? opt3Input.value.trim() : '';
    const opt4 = opt4Input ? opt4Input.value.trim() : '';
    const author = authorInput ? authorInput.value.trim() : 'لاعب مجهول';

    if (!qText || qText.length < 8) {
        showCustomAlert('يرجى كتابة نص سؤال واضح ومفيد (8 أحرف على الأقل)!', 'تنبيه', '✍️');
        return;
    }

    if (!opt1 || !opt2 || !opt3 || !opt4) {
        showCustomAlert('يرجى كتابة جميع الخيارات الأربعة (الإجابة الصحيحة و3 خيارات خاطئة)!', 'بيانات ناقصة', '⚠️');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'جاري الإرسال...';
    }

    try {
        if (typeof db !== 'undefined' && db) {
            await db.collection('suggested_questions').add({
                question: qText,
                category: qCat,
                difficulty: qDiff,
                options: [opt1, opt2, opt3, opt4],
                correct: 0,
                authorName: author || 'صديق اللعبة',
                authorUid: (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : 'anon',
                status: 'pending',
                createdAt: Date.now()
            });
        }

        // مكافأة فورية 20 عملة لتشجيع المساهمة
        userProgress.coins = (userProgress.coins || 0) + 20;
        saveProgress();
        updateHeaderStats();

        if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();

        closeSuggestQuestionModal();

        // تصفير الحقول
        if (qInput) qInput.value = '';
        if (opt1Input) opt1Input.value = '';
        if (opt2Input) opt2Input.value = '';
        if (opt3Input) opt3Input.value = '';
        if (opt4Input) opt4Input.value = '';

        showCustomAlert(`🎉 شكراً لمساهمتك يا ${author || 'بطل'}! تم إرسال سؤالك للمراجعة وسينضم لشيت الأسئلة باسمك الكريم فور اعتماده (+20 عملة هدية)!`, 'تم استلام سؤالك!', '💡');
    } catch (e) {
        console.error("Error submitting question:", e);
        showCustomAlert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.', 'خطأ', '❌');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال السؤال للمراجعة (+20 عملة) 🚀';
        }
    }
}

// --- إدارة لوحة المشرف السرية (Admin Panel) ---
const ADMIN_EMAILS = ['mostaffa201021@gmail.com'];

function isCurrentUserAdmin() {
    return !!(typeof currentUser !== 'undefined' && currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim()));
}

function checkAndShowAdminButton() {
    const adminBtn = document.getElementById('btn-admin-panel');
    if (adminBtn) {
        adminBtn.style.display = isCurrentUserAdmin() ? 'flex' : 'none';
    }
}

function openAdminPanelScreen() {
    if (!isCurrentUserAdmin()) {
        showCustomAlert('هذه الصفحة مخصصة لمدير اللعبة فقط!', 'غير مصرح', '🚫');
        return;
    }
    switchScreen('admin-panel-screen');
    fetchAndRenderAdminQuestions();
}

async function fetchAndRenderAdminQuestions() {
    const feed = document.getElementById('admin-questions-feed');
    const countPending = document.getElementById('admin-stat-pending');
    const countApproved = document.getElementById('admin-stat-approved');
    const countRejected = document.getElementById('admin-stat-rejected');

    if (!feed) return;
    feed.innerHTML = '<div class="lb-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري جلب الأسئلة من السيرفر...</div>';

    try {
        if (typeof db === 'undefined' || !db) throw new Error("No database connection");

        const snapshot = await db.collection('suggested_questions').orderBy('createdAt', 'desc').limit(100).get();

        let pending = 0, approved = 0, rejected = 0;
        let questions = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            data.docId = doc.id;
            questions.push(data);

            const st = data.status || 'pending';
            if (st === 'approved') approved++;
            else if (st === 'rejected') rejected++;
            else pending++;
        });

        if (countPending) countPending.innerText = pending;
        if (countApproved) countApproved.innerText = approved;
        if (countRejected) countRejected.innerText = rejected;

        if (questions.length === 0) {
            feed.innerHTML = '<div class="lb-loading">لا توجد أي أسئلة مقترحة حالياً.</div>';
            return;
        }

        feed.innerHTML = '';

        questions.forEach(q => {
            const card = document.createElement('div');
            const st = q.status || 'pending';
            card.className = `admin-q-card status-${st}`;

            const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            const catStyle = (typeof CATEGORY_STYLES !== 'undefined' && CATEGORY_STYLES[q.category]) || { icon: 'fa-solid fa-shapes', color: '#a855f7' };

            let statusBadge = `<span class="admin-status-badge pending">⏳ بانتظار المراجعة</span>`;
            if (st === 'approved') statusBadge = `<span class="admin-status-badge approved">✅ مقبول ومعتمد (ID #${q.assignedId || '---'})</span>`;
            if (st === 'rejected') statusBadge = `<span class="admin-status-badge rejected">❌ مرفوض</span>`;

            card.innerHTML = `
                <div class="admin-q-header">
                    <div class="admin-q-cat-box">
                        <i class="${catStyle.icon}" style="color: ${catStyle.color};"></i>
                        <span>${q.category || 'عام'} (صعوبة: ${q.difficulty || 5})</span>
                    </div>
                    ${statusBadge}
                </div>

                <h4 class="admin-q-title">${q.question}</h4>

                <div class="admin-q-options">
                    <div class="admin-opt-item correct"><i class="fa-solid fa-check"></i> ${q.options ? q.options[0] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[1] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[2] : ''}</div>
                    <div class="admin-opt-item wrong"><i class="fa-solid fa-xmark"></i> ${q.options ? q.options[3] : ''}</div>
                </div>

                <div class="admin-q-meta">
                    <span>✍️ الكاتب: <b>${q.authorName || 'لاعب'}</b></span>
                    <span>🕒 ${dateStr}</span>
                </div>

                <div class="admin-q-actions">
                    <button class="btn-adm-approve" onclick="updateQuestionStatus('${q.docId}', 'approved')"><i class="fa-solid fa-check"></i> قبول وحجز ID</button>
                    <button class="btn-adm-reject" onclick="updateQuestionStatus('${q.docId}', 'rejected')"><i class="fa-solid fa-xmark"></i> رفض</button>
                    <button class="btn-adm-copy" onclick="copyQuestionAsTSV('${q.docId}')"><i class="fa-solid fa-table-cells"></i> نسخ TSV</button>
                    <button class="btn-adm-del" onclick="deleteSuggestedQuestion('${q.docId}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            feed.appendChild(card);
        });

    } catch (err) {
        console.error("Admin fetch error:", err);
        feed.innerHTML = '<div class="lb-loading">تعذر جلب الأسئلة أو لا توجد صلاحيات كافية.</div>';
    }
}

function getNextAvailableQuestionId() {
    if (typeof window !== 'undefined' && window.questionsBank && Array.isArray(window.questionsBank) && window.questionsBank.length > 0) {
        let maxId = 0;
        window.questionsBank.forEach(q => {
            const idNum = parseInt(q.id);
            if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
        });
        return maxId > 0 ? maxId + 1 : 2587;
    }
    return 2587;
}

function formatQuestionToTSV(q, assignedId) {
    const id = assignedId || getNextAvailableQuestionId();
    const cat = q.category || 'معلومات عامة';
    const diff = q.difficulty || 4;
    const cleanStr = (s) => (s || '').toString().split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').trim();
    const questionText = cleanStr(q.question);
    const opt1 = cleanStr(q.options && q.options[0]);
    const opt2 = cleanStr(q.options && q.options[1]);
    const opt3 = cleanStr(q.options && q.options[2]);
    const opt4 = cleanStr(q.options && q.options[3]);
    const correct = 0;
    const image = q.image ? q.image.trim() : '';
    const author = cleanStr(q.authorName || 'لاعب');

    return `${id}\t${cat}\t${diff}\t${questionText}\t${opt1}\t${opt2}\t${opt3}\t${opt4}\t${correct}\t${image}\t${author}`;
}

async function updateQuestionStatus(docId, newStatus) {
    if (typeof db === 'undefined' || !db) return;
    try {
        const updateData = {
            status: newStatus,
            reviewedAt: Date.now()
        };
        if (newStatus === 'approved') {
            updateData.assignedId = getNextAvailableQuestionId();
        }
        await db.collection('suggested_questions').doc(docId).update(updateData);
        if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
        fetchAndRenderAdminQuestions();
    } catch (e) {
        showCustomAlert('فشل تحديث حالة السؤال!', 'خطأ', '❌');
    }
}

async function deleteSuggestedQuestion(docId) {
    showCustomConfirm(
        'هل تريد حقاً حذف هذا السؤال المقترح نهائياً؟',
        async () => {
            if (typeof db === 'undefined' || !db) return;
            await db.collection('suggested_questions').doc(docId).delete().catch(() => {});
            fetchAndRenderAdminQuestions();
        },
        null,
        'تأكيد الحذف',
        'حذف',
        'إلغاء',
        '🗑️'
    );
}

async function copyQuestionAsTSV(docId) {
    if (typeof db === 'undefined' || !db) return;
    try {
        const doc = await db.collection('suggested_questions').doc(docId).get();
        if (!doc.exists) return;
        const q = doc.data();

        const assignedId = q.assignedId || getNextAvailableQuestionId();
        const tsvLine = formatQuestionToTSV(q, assignedId);

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(tsvLine);
            showCustomAlert(`تم نسخ السؤال بالمعرف #${assignedId} بصيغة TSV! الصقه مباشرة في شيت جوجل في خلية ID وسيتوزع تلقائياً على الأعمدة الـ 11.`, 'تم النسخ كـ TSV', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}

async function copyAllApprovedAsTSV() {
    if (typeof db === 'undefined' || !db) return;
    try {
        const snapshot = await db.collection('suggested_questions').where('status', '==', 'approved').get();
        if (snapshot.empty) {
            showCustomAlert('لا توجد أسئلة مقبولة حالياً لنسخها!', 'تنبيه', 'ℹ️');
            return;
        }

        let startId = getNextAvailableQuestionId();
        let lines = [];
        let count = 0;

        snapshot.forEach(doc => {
            const q = doc.data();
            const currentId = q.assignedId || (startId + count);
            lines.push(formatQuestionToTSV(q, currentId));
            count++;
        });

        const tsvPayload = lines.join('\n');

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(tsvPayload);
            showCustomAlert(`تم نسخ ${count} سؤال معتمد بمعرفات تسلسلية فريدة (من #${startId} إلى #${startId + count - 1}) بصيغة TSV جاهزة للصق في شيت جوجل مباشرة!`, 'تم النسخ الشامل', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}


// --- محرك لوحة التحكم والإعدادات الحية للمشرف (Admin Dashboard Controller) ---

let activeAdminTab = 'questions';

function switchAdminTab(tabName) {
    activeAdminTab = tabName;
    document.querySelectorAll('.adm-sub-tab').forEach(t => t.classList.remove('active'));

    const btn = document.getElementById(`adm-tab-${tabName}`);
    if (btn) btn.classList.add('active');

    const secQuestions = document.getElementById('adm-sec-questions');
    const secPrices = document.getElementById('adm-sec-prices');
    const secCustomPrices = document.getElementById('adm-sec-custom-prices');
    const secAnnounce = document.getElementById('adm-sec-announcement');

    if (secQuestions) secQuestions.style.display = (tabName === 'questions') ? 'block' : 'none';
    if (secPrices) secPrices.style.display = (tabName === 'prices') ? 'block' : 'none';
    if (secCustomPrices) secCustomPrices.style.display = (tabName === 'custom-prices') ? 'block' : 'none';
    if (secAnnounce) secAnnounce.style.display = (tabName === 'announcement') ? 'block' : 'none';

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    if (tabName === 'questions') fetchAndRenderAdminQuestions();
    if (tabName === 'prices') loadAdminPricesForm();
    if (tabName === 'custom-prices') loadAdminCustomPricesForm();
    if (tabName === 'announcement') loadAdminAnnouncementForm();
}

function loadAdminPricesForm() {
    const p = (window.APP_CONFIG && window.APP_CONFIG.prices) || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    setVal('adm-price-5050', p.hint5050 || 20);
    setVal('adm-price-time', p.addTime || 15);
    setVal('adm-price-skip', p.skip || 30);
    setVal('adm-reward-daily', p.dailyFreeReward || 30);
    setVal('adm-price-wheel', p.wheelExtraSpin || 25);
}

function loadAdminCustomPricesForm() {
    const cp = (window.APP_CONFIG && window.APP_CONFIG.customPrices) || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    // Avatars
    setVal('adm-price-av-detective', cp.av_detective || 400);
    setVal('adm-price-av-viking', cp.av_viking || 600);
    setVal('adm-price-av-samurai', cp.av_samurai || 800);
    setVal('adm-price-av-pharaoh', cp.av_pharaoh || 1000);
    setVal('adm-price-av-astro', cp.av_astro || 1200);
    setVal('adm-price-av-gladiator', cp.av_gladiator || 1400);
    setVal('adm-price-av-pirate', cp.av_pirate || 1600);
    setVal('adm-price-av-alchemist', cp.av_alchemist || 1800);
    setVal('adm-price-av-wizard', cp.av_wizard || 2000);
    setVal('adm-price-av-lion', cp.av_lion || 2500);

    // Frames
    setVal('adm-price-frame-neon', cp.frame_cyber_neon || 500);
    setVal('adm-price-frame-laurel', cp.frame_royal_laurel || 800);
    setVal('adm-price-frame-dragon', cp.frame_dragon_fire || 1000);

    // Titles
    setVal('adm-price-title-mastermind', cp.title_mastermind || 300);
    setVal('adm-price-title-puzzle', cp.title_puzzle_king || 500);
    setVal('adm-price-title-sniper', cp.title_sniper || 600);
}

function loadAdminAnnouncementForm() {
    const txtInput = document.getElementById('adm-announce-text');
    const chkInput = document.getElementById('adm-announce-active');

    if (txtInput) txtInput.value = (window.APP_CONFIG && window.APP_CONFIG.announcement) || '';
    if (chkInput) chkInput.checked = !!(window.APP_CONFIG && window.APP_CONFIG.announcementActive);
}

// دالة حفظ الإعدادات في التخزين المحلي وفولباك فايرستور
async function persistGlobalConfig(configData) {
    // 1. الحفظ الفوري محلياً لضمان العمل دائماً 100%
    try {
        localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
    } catch (e) {}

    // 2. الحفظ في فايرستور مع فولباك آمن لمجموعة users المفتوحة
    if (typeof db !== 'undefined' && db) {
        try {
            await db.collection('app_config').doc('settings').set(configData, { merge: true });
        } catch (err1) {
            console.warn("Retrying config save to users/global_config fallback:", err1);
            try {
                await db.collection('users').doc('global_config').set(configData, { merge: true });
            } catch (err2) {
                console.warn("Firestore config save permission restricted, saved locally:", err2);
            }
        }
    }
}

async function saveAdminPrices() {
    const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseInt(el.value) || def : def; };

    const newPrices = {
        hint5050: getVal('adm-price-5050', 20),
        addTime: getVal('adm-price-time', 15),
        skip: getVal('adm-price-skip', 30),
        dailyFreeReward: getVal('adm-reward-daily', 30),
        wheelExtraSpin: getVal('adm-price-wheel', 25)
    };

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.prices = newPrices;

    await persistGlobalConfig({ prices: newPrices });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم حفظ وتطبيق أسعار المتجر والمساعدات بنجاح!', 'تم الحفظ', '🪙');
}

async function saveAdminCustomPrices() {
    const getVal = (id, def) => { const el = document.getElementById(id); return el ? parseInt(el.value) || def : def; };

    const newCustomPrices = {
        av_detective: getVal('adm-price-av-detective', 400),
        av_viking: getVal('adm-price-av-viking', 600),
        av_samurai: getVal('adm-price-av-samurai', 800),
        av_pharaoh: getVal('adm-price-av-pharaoh', 1000),
        av_astro: getVal('adm-price-av-astro', 1200),
        av_gladiator: getVal('adm-price-av-gladiator', 1400),
        av_pirate: getVal('adm-price-av-pirate', 1600),
        av_alchemist: getVal('adm-price-av-alchemist', 1800),
        av_wizard: getVal('adm-price-av-wizard', 2000),
        av_lion: getVal('adm-price-av-lion', 2500),
        frame_cyber_neon: getVal('adm-price-frame-neon', 500),
        frame_royal_laurel: getVal('adm-price-frame-laurel', 800),
        frame_dragon_fire: getVal('adm-price-frame-dragon', 1000),
        title_mastermind: getVal('adm-price-title-mastermind', 300),
        title_puzzle_king: getVal('adm-price-title-puzzle', 500),
        title_sniper: getVal('adm-price-title-sniper', 600)
    };

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.customPrices = newCustomPrices;

    await persistGlobalConfig({ customPrices: newCustomPrices });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم حفظ وتطبيق أسعار الأفاتارات والإطارات والألقاب بنجاح!', 'تم الحفظ', '🎨');
}

async function saveAdminAnnouncement() {
    const txtInput = document.getElementById('adm-announce-text');
    const chkInput = document.getElementById('adm-announce-active');

    const announceText = txtInput ? txtInput.value.trim() : '';
    const isActive = chkInput ? chkInput.checked : false;

    if (!window.APP_CONFIG) window.APP_CONFIG = {};
    window.APP_CONFIG.announcement = announceText;
    window.APP_CONFIG.announcementActive = isActive;

    await persistGlobalConfig({
        announcement: announceText,
        announcementActive: isActive
    });

    applyLiveConfigUpdates();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
    showCustomAlert('✨ تم نشر وتفعيل شريط الإعلان لجميع اللاعبين بنجاح!', 'تم النشر', '📢');
}

// تحميل ومزامنة الإعدادات على الفور
function initLiveConfigListener() {
    // استرجاع الإعدادات المحفوظة محلياً أولاً
    try {
        const cachedConfig = localStorage.getItem('law_ta3raf_app_config');
        if (cachedConfig) {
            const parsed = JSON.parse(cachedConfig);
            if (parsed.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...parsed.prices };
            if (parsed.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...parsed.customPrices };
            if (parsed.announcement !== undefined) window.APP_CONFIG.announcement = parsed.announcement;
            if (parsed.announcementActive !== undefined) window.APP_CONFIG.announcementActive = parsed.announcementActive;
            applyLiveConfigUpdates();
        }
    } catch (e) {}

    if (typeof db === 'undefined' || !db) return;

    // الاستماع عبر app_config أو users/global_config
    const handleConfigDoc = (doc) => {
        if (doc && doc.exists) {
            const data = doc.data();
            if (data.prices) window.APP_CONFIG.prices = { ...window.APP_CONFIG.prices, ...data.prices };
            if (data.customPrices) window.APP_CONFIG.customPrices = { ...window.APP_CONFIG.customPrices, ...data.customPrices };
            if (data.announcement !== undefined) window.APP_CONFIG.announcement = data.announcement;
            if (data.announcementActive !== undefined) window.APP_CONFIG.announcementActive = data.announcementActive;

            try {
                localStorage.setItem('law_ta3raf_app_config', JSON.stringify(window.APP_CONFIG));
            } catch (e) {}

            applyLiveConfigUpdates();
        }
    };

    db.collection('app_config').doc('settings').onSnapshot(handleConfigDoc, () => {
        db.collection('users').doc('global_config').onSnapshot(handleConfigDoc, () => {});
    });
}
