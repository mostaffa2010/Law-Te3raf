// js/community.js - إدارة اقتراح الأسئلة من اللاعبين والمجتمع

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
                authorUid: currentUser ? currentUser.uid : 'anon',
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
    return !!(currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim()));
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
        if (!db) throw new Error("No database connection");

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
            if (st === 'approved') statusBadge = `<span class="admin-status-badge approved">✅ مقبول ومعتمد</span>`;
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
                    <button class="btn-adm-approve" onclick="updateQuestionStatus('${q.docId}', 'approved')"><i class="fa-solid fa-check"></i> قبول</button>
                    <button class="btn-adm-reject" onclick="updateQuestionStatus('${q.docId}', 'rejected')"><i class="fa-solid fa-xmark"></i> رفض</button>
                    <button class="btn-adm-copy" onclick="copyQuestionAsCSV('${q.docId}')"><i class="fa-solid fa-copy"></i> نسخ CSV</button>
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

async function updateQuestionStatus(docId, newStatus) {
    if (!db) return;
    try {
        await db.collection('suggested_questions').doc(docId).update({
            status: newStatus,
            reviewedAt: Date.now()
        });
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
            if (!db) return;
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

async function copyQuestionAsCSV(docId) {
    if (!db) return;
    try {
        const doc = await db.collection('suggested_questions').doc(docId).get();
        if (!doc.exists) return;
        const q = doc.data();

        // format: ID,Category,Difficulty,Question,Opt1,Opt2,Opt3,Opt4,Correct,Image,Author
        const csvLine = `[ID],${q.category},${q.difficulty},"${q.question.replace(/"/g, '""')}","${(q.options[0]||'').replace(/"/g, '""')}","${(q.options[1]||'').replace(/"/g, '""')}","${(q.options[2]||'').replace(/"/g, '""')}","${(q.options[3]||'').replace(/"/g, '""')}",0,,${q.authorName || 'لاعب'}`;

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(csvLine);
            showCustomAlert('تم نسخ سطر السؤال بصيغة CSV وجاهز للصق في الشيت مباشرة!', 'تم النسخ', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}

async function copyAllApprovedAsCSV() {
    if (!db) return;
    try {
        const snapshot = await db.collection('suggested_questions').where('status', '==', 'approved').get();
        if (snapshot.empty) {
            showCustomAlert('لا توجد أسئلة مقبولة حالياً لنسخها!', 'تنبيه', 'ℹ️');
            return;
        }

        let lines = [];
        snapshot.forEach(doc => {
            const q = doc.data();
            const csvLine = `[ID],${q.category},${q.difficulty},"${q.question.replace(/"/g, '""')}","${(q.options[0]||'').replace(/"/g, '""')}","${(q.options[1]||'').replace(/"/g, '""')}","${(q.options[2]||'').replace(/"/g, '""')}","${(q.options[3]||'').replace(/"/g, '""')}",0,,${q.authorName || 'لاعب'}`;
            lines.push(csvLine);
        });

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(lines.join('\n'));
            showCustomAlert(`تم نسخ ${lines.length} سؤال معتمد كـ CSV ومستعد للصق في شيت جوجل!`, 'تم النسخ الشامل', '📋');
        }
    } catch (e) {
        console.error(e);
    }
}
