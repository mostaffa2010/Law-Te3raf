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
