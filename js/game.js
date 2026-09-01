// js/game.js - المحرك الأساسي للجولات، الأسئلة، والمساعدات

function startEndlessMode() {
    gameState.mode = 'endless';
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    gameState.questions = getEndlessQuestionQueue();
    
    switchScreen('game-screen');
    loadQuestion();
}



function checkDailyStatus() {
    const badge = document.getElementById('daily-status-badge');
    if (!badge) return;
    if (userProgress.lastDailyDate === getTodayString()) {
        badge.innerText = 'تم اليوم';
        badge.style.backgroundColor = 'var(--accent-green)';
    } else {
        badge.innerText = 'متاح';
        badge.style.backgroundColor = 'var(--accent-red)';
    }
}

function openDailyChallenge() {
    if (userProgress.lastDailyDate === getTodayString()) {
        showCustomAlert('لقد أنجزت تحدي اليوم بالفعل! عُد غداً لتحدٍ وجائزة جديدة.', 'التحدي اليومي', '⏳');
        return;
    }

    gameState.mode = 'daily';
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    gameState.questions = getSmartQuestions(10);
    switchScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    gameState.isAnswered = false;
    clearInterval(gameState.timerInterval);

    if (gameState.currentIndex >= gameState.questions.length && gameState.mode === 'endless') {
        gameState.questions = getEndlessQuestionQueue();
        gameState.currentIndex = 0;
    }

    const q = gameState.questions[gameState.currentIndex];
    if (!q) {
        finishGameSession();
        return;
    }

    if (gameState.mode === 'endless') {
        if (!userProgress.endlessSeenAt) userProgress.endlessSeenAt = {};
        userProgress.endlessSeenAt[q.id] = Date.now();
        saveProgress();
    }

    const progressLabel = document.getElementById('question-progress-label');
    if (progressLabel) {
        if (gameState.mode === 'endless') {
            progressLabel.innerHTML = `السؤال رقم <b>${gameState.currentIndex + 1}</b> (سلسلة صحيحة: ${gameState.correctCount})`;
        } else {
            progressLabel.innerHTML = `السؤال <span id="current-q-num">${gameState.currentIndex + 1}</span> من <span id="total-q-num">${gameState.questions.length}</span>`;
        }
    }

    document.getElementById('q-category').innerText = q.category;
    document.getElementById('question-text').innerText = q.question;

    const imgBox = document.getElementById('question-image-box');
    const imgElem = document.getElementById('question-img');
    if (q.image && q.image.trim().startsWith('http')) {
        if (imgElem) {
            imgElem.src = q.image.trim();
        }
        if (imgBox) imgBox.style.display = 'block';
    } else {
        if (imgBox) imgBox.style.display = 'none';
        if (imgElem) imgElem.src = '';
    }

    renderLivesDisplay();
    startTimer();

    const isCompetitiveMode = (gameState.mode === 'ranked' || gameState.mode === 'pvp');

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) {
        pwrBar.style.display = isCompetitiveMode ? 'none' : 'flex';
    }
    if (!isCompetitiveMode) {
        updatePowerupButtons();
    }

    const reactTrigger = document.getElementById('game-reaction-trigger');
    if (reactTrigger) {
        reactTrigger.style.display = isCompetitiveMode ? 'flex' : 'none';
    }

    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
        btn.onclick = () => selectAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function renderLivesDisplay() {
    const container = document.getElementById('lives-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (gameState.mode === 'pvp') {
        container.innerHTML = `<span style="font-size: 0.85rem; color: var(--accent-pink); font-weight: 900;"><i class="fa-solid fa-users-rays"></i> تحدي الغرفة</span>`;
        return;
    }

    for (let i = 0; i < 3; i++) {
        const icon = document.createElement('i');
        icon.className = `fa-solid fa-heart ${i < gameState.lives ? '' : 'opacity-muted'}`;
        if (i >= gameState.lives) icon.style.opacity = '0.2';
        container.appendChild(icon);
    }
}

function startTimer() {
    gameState.timer = 15;
    const timerElem = document.getElementById('timer-count');
    if (!timerElem) return;
    timerElem.innerText = gameState.timer;

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timerElem.innerText = gameState.timer;

        if (gameState.timer <= 5 && gameState.timer > 0 && typeof AudioEngine !== 'undefined') {
            AudioEngine.playTick();
        }

        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            handleMistake(null, true);
        }
    }, 1000);
}

function selectAnswer(selectedIndex, btnElement) {
    if (gameState.isAnswered) return;
    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);

    const q = gameState.questions[gameState.currentIndex];
    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playCorrect();
        btnElement.classList.add('correct');
        btnElement.querySelector('i').className = 'fa-solid fa-circle-check';
        gameState.correctCount++;
        if (gameState.mode === 'ranked') {
            gameState.score += (100 + gameState.timer * 10);
        } else if (gameState.mode === 'pvp') {
            gameState.score += (10 + gameState.timer);
        } else {
            gameState.score += 10;
        }
        userProgress.coins += 2;
        userProgress.totalCorrect = (userProgress.totalCorrect || 0) + 1;

        if (gameState.timer >= 12) {
            userProgress.fastAnswersCount = (userProgress.fastAnswersCount || 0) + 1;
        }

        gameState.sessionCorrectStreak++;
        if (gameState.sessionCorrectStreak > userProgress.maxCorrectStreak) {
            userProgress.maxCorrectStreak = gameState.sessionCorrectStreak;
        }

        saveProgress();
        updateHeaderStats();
        checkAllAchievements();
        proceedNext();
    } else {
        btnElement.classList.add('wrong');
        btnElement.querySelector('i').className = 'fa-solid fa-circle-xmark';
        handleMistake(selectedIndex, false);
    }
}

function handleMistake(selectedIndex = null, isTimeout = false) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playWrong();
    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);
    gameState.wrongCount++;
    if (gameState.mode !== 'pvp') {
        gameState.lives = Math.max(0, gameState.lives - 1);
    }
    gameState.sessionCorrectStreak = 0;

    const q = gameState.questions[gameState.currentIndex];
    if (q) {
        gameState.sessionMistakes.push({
            question: q.question,
            category: q.category,
            image: q.image || '',
            userAnswer: isTimeout ? 'انتهى الوقت دون إجابة' : (selectedIndex !== null ? q.options[selectedIndex] : 'لم يتم الاختيار'),
            correctAnswer: q.options[q.correct]
        });
    }

    renderLivesDisplay();
    revealCorrectAnswer();

    if (gameState.lives <= 0 && gameState.mode !== 'pvp') {
        setTimeout(finishGameSession, 1200);
        return;
    }

    proceedNext();
}

function revealCorrectAnswer() {
    const q = gameState.questions[gameState.currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    if (buttons[q.correct]) {
        buttons[q.correct].classList.add('correct');
        buttons[q.correct].querySelector('i').className = 'fa-solid fa-circle-check';
    }
}

function proceedNext() {
    setTimeout(() => {
        gameState.currentIndex++;
        if (gameState.currentIndex >= gameState.questions.length) {
            finishGameSession();
        } else {
            loadQuestion();
        }
    }, 1200);
}

async function finishGameSession() {
    const reactDock = document.getElementById('game-reactions-dock');
    if (reactDock) reactDock.style.display = 'none';
    if (gameState.mode === 'ranked') {
        const oppWidget = document.getElementById('game-ranked-opp-bar');
        if (oppWidget) oppWidget.style.display = 'none';

        // فحص هل المنافس أنهى أسئلته الـ 5 كاملة أم لا يزال يجاوب
        if (currentRankedOpponent && currentRankedOpponent.answeredIndex < 5) {
            isPlayerWaitingForOpponent = true;
            updateWaitingOpponentUI();
            switchScreen('ranked-waiting-opponent-screen', false);
            // أقصى مهلة انتظار أمان 8 ثوانٍ
            setTimeout(() => {
                if (isPlayerWaitingForOpponent) {
                    finishRankedMatchSession();
                }
            }, 8000);
            return;
        }

        if (typeof finishRankedMatchSession === 'function') {
            finishRankedMatchSession();
        }
        return;
    }

    if (gameState.mode === 'pvp') {
        await updatePvpPlayerFinalScore();
        switchScreen('pvp-waiting-opponent-screen');
        return;
    }

    switchScreen('result-screen');

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const reviewBtn = document.getElementById('review-mistakes-btn');

    document.getElementById('res-correct').innerText = gameState.correctCount;
    document.getElementById('res-wrong').innerText = gameState.wrongCount;

    if (reviewBtn) {
        if (gameState.sessionMistakes && gameState.sessionMistakes.length > 0) {
            reviewBtn.style.display = 'flex';
            reviewBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> مراجعة الأخطاء (${gameState.sessionMistakes.length})`;
        } else {
            reviewBtn.style.display = 'none';
        }
    }

    if (gameState.mode === 'endless') {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        resultIcon.innerText = '🔥';
        resultTitle.innerText = 'انتهت المحاولات!';
        resultMessage.innerText = `جمعت ${gameState.correctCount} إجابة صحيحة (${gameState.score} نقطة).`;

        if (gameState.score > userProgress.highScore) {
            userProgress.highScore = gameState.score;
            resultMessage.innerText += ' 🌟 رقم قياسي جديد!';
        }
    } else if (gameState.mode === 'daily') {
        if (gameState.correctCount >= 7) {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
            resultIcon.innerText = '👑';
            resultTitle.innerText = 'بطل اليوم!';
            resultMessage.innerText = 'أكملت التحدي اليومي بنجاح وزادت سلسلة أيامك!';
            userProgress.dailyStreak = (userProgress.dailyStreak || 0) + 1;
            userProgress.lastDailyDate = getTodayString();
            userProgress.coins += 25;
            checkDailyStatus();
        } else {
            if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
            resultIcon.innerText = '⏳';
            resultTitle.innerText = 'فاتتك فرصة اليوم';
            resultMessage.innerText = 'حاولت في التحدي ولكن لم تصل لـ 7 إجابات صحيحة.';
        }
    } 

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();
}

function openReviewScreen() {
    const list = document.getElementById('review-list');
    if (!list) return;
    list.innerHTML = '';

    if (!gameState.sessionMistakes || gameState.sessionMistakes.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد أخطاء لمراجعتها!</p>';
    } else {
        gameState.sessionMistakes.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'review-card';
            const imgHtml = (item.image && item.image.startsWith('http')) 
                ? `<div class="review-img-box"><img src="${item.image}" alt="صورة السؤال" onclick="openImageZoomModal('${item.image}')"></div>` 
                : '';
            card.innerHTML = `
                <div class="review-header-tag"><i class="fa-solid fa-shapes"></i> ${item.category} (سؤال ${index + 1})</div>
                ${imgHtml}
                <h4>${item.question}</h4>
                <div class="review-answer-row">
                    <div><i class="fa-solid fa-xmark" style="color: var(--accent-red);"></i> إجابتك: <span class="user-mistake-val">${item.userAnswer}</span></div>
                    <div><i class="fa-solid fa-check" style="color: var(--accent-green);"></i> الإجابة الصحيحة: <span class="correct-answer-val">${item.correctAnswer}</span></div>
                </div>
            `;
            list.appendChild(card);
        });
    }

    switchScreen('review-screen');
}

function restartGame() {
    if (gameState.mode === 'endless') startEndlessMode();
    
    else switchScreen('modes-screen');
}

function updatePowerupButtons() {
    const btn50 = document.getElementById('btn-5050');
    const btnTime = document.getElementById('btn-time');
    const btnSkip = document.getElementById('btn-skip');

    const badge50 = document.getElementById('badge-5050');
    const badgeTime = document.getElementById('badge-time');
    const badgeSkip = document.getElementById('badge-skip');

    const has50 = (userProgress.inventory.hint5050 > 0);
    const hasTime = (userProgress.inventory.addTime > 0);
    const hasSkip = (userProgress.inventory.skip > 0);

    if (badge50) badge50.innerText = has50 ? `لديك (${userProgress.inventory.hint5050})` : '20 عملة';
    if (badgeTime) badgeTime.innerText = hasTime ? `لديك (${userProgress.inventory.addTime})` : '15 عملة';
    if (badgeSkip) badgeSkip.innerText = hasSkip ? `لديك (${userProgress.inventory.skip})` : '30 عملة';

    if (btn50) btn50.disabled = !has50 && userProgress.coins < 20;
    if (btnTime) btnTime.disabled = !hasTime && userProgress.coins < 15;
    if (btnSkip) btnSkip.disabled = !hasSkip && userProgress.coins < 30;
}

function use5050() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.hint5050 > 0) userProgress.inventory.hint5050--;
    else if (userProgress.coins >= 20) userProgress.coins -= 20;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    document.getElementById('btn-5050').disabled = true;

    const q = gameState.questions[gameState.currentIndex];
    const buttons = Array.from(document.querySelectorAll('.option-btn'));

    let wrongIndices = [];
    q.options.forEach((_, idx) => { if (idx !== q.correct) wrongIndices.push(idx); });

    wrongIndices = shuffleArray(wrongIndices);
    wrongIndices.slice(0, 2).forEach(idx => {
        if (buttons[idx]) buttons[idx].classList.add('hidden-option');
    });
}

function useAddTime() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.addTime > 0) userProgress.inventory.addTime--;
    else if (userProgress.coins >= 15) userProgress.coins -= 15;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    gameState.timer += 10;
    document.getElementById('timer-count').innerText = gameState.timer;
    document.getElementById('btn-time').disabled = true;
}

function useSkipQuestion() {
    if (gameState.isAnswered) return;
    gameState.usedPowerupInSession = true;

    if (userProgress.inventory.skip > 0) userProgress.inventory.skip--;
    else if (userProgress.coins >= 30) userProgress.coins -= 30;
    else return;

    saveProgress();
    updateHeaderStats();
    if (typeof AudioEngine !== 'undefined') AudioEngine.playPowerup();

    gameState.isAnswered = true;
    clearInterval(gameState.timerInterval);
    document.getElementById('btn-skip').disabled = true;

    proceedNext();
}

function openImageZoomModal(customSrc = null) {
    const modal = document.getElementById('image-zoom-modal');
    const zoomImg = document.getElementById('image-zoom-img');
    const qImg = document.getElementById('question-img');

    const src = customSrc || (qImg ? qImg.src : '');
    if (!src) return;

    if (zoomImg) zoomImg.src = src;
    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closeImageZoomModal() {
    const modal = document.getElementById('image-zoom-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}
