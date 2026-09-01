// js/community.js - إدارة اقتراح الأسئلة من اللاعبين والمجتمع

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

async function submitSuggestedQuestion() {
    const qInput = document.getElementById('suggest-q-text');
    const catInput = document.getElementById('suggest-cat-select');
    const diffInput = document.getElementById('suggest-diff-select');
    const opt1Input = document.getElementById('suggest-opt1');
    const opt2Input = document.getElementById('suggest-opt2');
    const opt3Input = document.getElementById('suggest-opt3');
    const opt4Input = document.getElementById('suggest-opt4');
    const authorInput = document.getElementById('suggest-author-input');
    const submitBtn = document.getElementById('btn-submit-suggest');

    const qText = qInput ? qInput.value.trim() : '';
    const qCat = catInput ? catInput.value : 'معلومات عامة';
    const qDiff = diffInput ? parseInt(diffInput.value) : 5;
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
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال السؤال للمراجعة';
        }
    }
}
