// js/pvp.js - نظام التحديات الأونلاين والغرف الجماعية

function openPvpLobbyScreen() {
    switchScreen('pvp-lobby-screen');
}

function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

async function createPvpRoom() {
    if (!currentUser) {
        showCustomAlert('يرجى تسجيل الدخول أولاً لتحدي أصدقائك!', 'تنبيه', '🔒');
        return;
    }

    const roomCode = generateRoomCode();
    gameState.pvpRoomId = roomCode;
    gameState.isPvpHost = true;

    const sharedQuestions = getSmartQuestions(10);

    const hostProfile = {
        uid: currentUser.uid,
        name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'المضيف'),
        avatar: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        score: 0,
        correctCount: 0,
        finished: false,
        isHost: true
    };

    const initialPlayers = {};
    initialPlayers[currentUser.uid] = hostProfile;

    try {
        await db.collection('pvp_rooms').doc(roomCode).set({
            code: roomCode,
            status: 'waiting',
            hostUid: currentUser.uid,
            players: initialPlayers,
            questions: sharedQuestions,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        openWaitingRoomUI(roomCode, true);
        listenToPvpRoom(roomCode);
    } catch (e) {
        showCustomAlert('حدث خطأ أثناء إنشاء الغرفة: ' + e.message, 'خطأ', '⚠️');
    }
}

async function joinPvpRoom() {
    if (!currentUser) {
        showCustomAlert('يرجى تسجيل الدخول أولاً!', 'تنبيه', '🔒');
        return;
    }

    const input = document.getElementById('pvp-room-code-input');
    const roomCode = input ? input.value.trim() : '';

    if (!roomCode || roomCode.length !== 5) {
        showCustomAlert('يرجى إدخال كود غرفة صحيح مكون من 5 أرقام!', 'تنبيه', '🔢');
        return;
    }

    try {
        const docRef = db.collection('pvp_rooms').doc(roomCode);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            showCustomAlert('الغرفة غير موجودة! تأكد من صحة الكود من صديقك.', 'خطأ', '❌');
            return;
        }

        const data = docSnap.data();
        if (data.status !== 'waiting') {
            showCustomAlert('عذراً، بدأت هذه المباراة بالفعل ولا يمكن الانضمام إليها الآن!', 'تنبيه', '⏳');
            return;
        }

        gameState.pvpRoomId = roomCode;
        gameState.isPvpHost = (data.hostUid === currentUser.uid);

        const myProfile = {
            uid: currentUser.uid,
            name: currentUser.isAnonymous ? 'ضيف اللعبة' : (currentUser.displayName || 'لاعب'),
            avatar: currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            score: 0,
            correctCount: 0,
            finished: false,
            isHost: gameState.isPvpHost
        };

        const updateObj = {};
        updateObj[`players.${currentUser.uid}`] = myProfile;

        await docRef.update(updateObj);

        openWaitingRoomUI(roomCode, gameState.isPvpHost);
        listenToPvpRoom(roomCode);
    } catch (e) {
        showCustomAlert('خطأ أثناء الانضمام للغرفة: ' + e.message, 'خطأ', '⚠️');
    }
}

function openWaitingRoomUI(code, isHost) {
    document.getElementById('pvp-display-code').innerText = code;
    const countdownBox = document.getElementById('pvp-countdown-box');
    const hostControls = document.getElementById('pvp-host-controls');

    if (countdownBox) countdownBox.style.display = 'none';

    if (hostControls) {
        const startBtn = document.getElementById('btn-start-party-match');
        const waitSub = document.getElementById('pvp-wait-sub');
        if (isHost) {
            if (startBtn) startBtn.style.display = 'block';
            if (waitSub) waitSub.innerText = 'شارك الكود مع أصدقائك، واضغط زر البدء عندما يجتمع الجميع!';
        } else {
            if (startBtn) startBtn.style.display = 'none';
            if (waitSub) waitSub.innerText = 'في انتظار صاحب الغرفة لبدء التحدي ⏳...';
        }
    }

    switchScreen('pvp-waiting-screen');
}

function copyPvpCode() {
    const code = gameState.pvpRoomId;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
        showCustomAlert(`تم نسخ الكود [ ${code} ]! شاركه مع أصدقائك الآن.`, 'تم النسخ', '📋');
    } else {
        showCustomAlert(`كود الغرفة هو: ${code}`, 'كود الغرفة', '🔑');
    }
}

function listenToPvpRoom(code) {
    if (gameState.pvpUnsubscribe) gameState.pvpUnsubscribe();

    gameState.pvpUnsubscribe = db.collection('pvp_rooms').doc(code).onSnapshot((doc) => {
        if (!doc.exists) {
            showCustomAlert('تم إغلاق الغرفة من قِبل المضيف.', 'الغرفة مغلقة', '🚪');
            leavePvpRoom();
            return;
        }

        const data = doc.data();
        gameState.pvpRoomData = data;

        const playersMap = data.players || {};
        const playersList = Object.values(playersMap);

        const countElem = document.getElementById('pvp-player-count');
        const gridElem = document.getElementById('pvp-players-grid');

        if (countElem) countElem.innerText = playersList.length;

        if (gridElem) {
            gridElem.innerHTML = '';
            playersList.forEach(p => {
                const card = document.createElement('div');
                card.className = `pvp-player-card ${p.isHost ? 'is-host' : ''}`;
                card.innerHTML = `
                    <div class="pvp-card-avatar-box">
                        <img class="pvp-card-avatar" src="${p.avatar}" alt="${p.name}">
                        ${p.isHost ? '<span class="pvp-crown-badge">👑</span>' : ''}
                    </div>
                    <div class="pvp-card-details">
                        <span class="pvp-card-name">${p.name}</span>
                        <span class="pvp-card-tag">${p.isHost ? 'المضيف' : 'جاهز ✅'}</span>
                    </div>
                `;
                gridElem.appendChild(card);
            });
        }

        if (data.lastReaction && data.lastReaction.id !== lastSeenReactionId) {
            lastSeenReactionId = data.lastReaction.id;
            const isMe = (currentUser && data.lastReaction.senderUid === currentUser.uid);
            if (!isMe) {
                showFloatingReaction(data.lastReaction.emoji, data.lastReaction.senderName, data.lastReaction.senderAvatar, false);
            }
        }

        if (data.status === 'starting') {
            triggerPvpCountdown(data);
        }

        const allFinished = playersList.length > 0 && playersList.every(p => p.finished === true);
        if (allFinished || data.status === 'finished') {
            renderGroupPvpResults(playersList);
        }
    });
}

async function hostStartPartyMatch() {
    if (!gameState.pvpRoomId || !gameState.isPvpHost) return;

    const catSelect = document.getElementById('pvp-selected-category');
    const chosenCat = (catSelect && catSelect.value !== 'all') ? catSelect.value : null;
    const freshQuestions = getSmartQuestions(10, chosenCat);

    try {
        await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({
            questions: freshQuestions,
            status: 'starting'
        });
    } catch (e) {
        showCustomAlert('خطأ أثناء بدء التحدي: ' + e.message, 'خطأ', '⚠️');
    }
}

function triggerPvpCountdown(roomData) {
    const countdownBox = document.getElementById('pvp-countdown-box');
    const countVal = document.getElementById('pvp-countdown-val');
    if (!countdownBox || countdownBox.style.display === 'block') return;

    countdownBox.style.display = 'block';
    let count = 3;
    countVal.innerText = count;
    if (typeof AudioEngine !== 'undefined') AudioEngine.playTick();

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countVal.innerText = count;
            if (typeof AudioEngine !== 'undefined') AudioEngine.playTick();
        } else {
            clearInterval(timer);
            startPvpMatch(roomData);
        }
    }, 1000);
}

function startPvpMatch(roomData) {
    gameState.mode = 'pvp';
    gameState.questions = roomData.questions;
    gameState.currentIndex = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.lives = 3;
    gameState.score = 0;
    gameState.usedPowerupInSession = false;
    gameState.sessionCorrectStreak = 0;
    gameState.sessionMistakes = [];

    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'none';

    switchScreen('game-screen');
    loadQuestion();
}

async function updatePvpPlayerFinalScore() {
    if (!gameState.pvpRoomId || !currentUser) return;

    const myUid = currentUser.uid;
    const finalScore = gameState.score;
    const correctAnswers = gameState.correctCount;

    try {
        const updateObj = {};
        updateObj[`players.${myUid}.score`] = finalScore;
        updateObj[`players.${myUid}.correctCount`] = correctAnswers;
        updateObj[`players.${myUid}.finished`] = true;

        await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update(updateObj);

        const snap = await db.collection('pvp_rooms').doc(gameState.pvpRoomId).get();
        if (snap.exists) {
            const data = snap.data();
            const playersList = Object.values(data.players || {});
            if (playersList.length > 0 && playersList.every(p => p.finished === true)) {
                await db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({ status: 'finished' });
                renderGroupPvpResults(playersList);
            }
        }
    } catch (e) {
        console.error('Error submitting score:', e);
    }
}

function renderGroupPvpResults(playersList) {
    const pwrBar = document.getElementById('game-powerups-bar');
    if (pwrBar) pwrBar.style.display = 'flex';

    switchScreen('pvp-result-screen');

    const sorted = [...playersList].sort((a, b) => {
        const aCorrect = a.correctCount !== undefined ? a.correctCount : 0;
        const bCorrect = b.correctCount !== undefined ? b.correctCount : 0;
        if (bCorrect !== aCorrect) {
            return bCorrect - aCorrect;
        }
        return (b.score || 0) - (a.score || 0);
    });

    const listContainer = document.getElementById('pvp-group-results-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const winner = sorted[0];
    const isMeWinner = currentUser && (winner.uid === currentUser.uid);
    const winnerCorrect = winner.correctCount !== undefined ? winner.correctCount : 0;

    const titleElem = document.getElementById('pvp-res-title');
    const msgElem = document.getElementById('pvp-res-message');
    const iconElem = document.getElementById('pvp-res-icon');
    const rewardBadge = document.getElementById('pvp-reward-badge');

    if (isMeWinner) {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playWin();
        iconElem.innerText = '👑';
        titleElem.innerText = 'مبروك! أنت بطل الغرفة!';
        msgElem.innerText = `حققت المركز الأول بإجابة ${winnerCorrect} من 10 صحيحة وتفوقت على الجميع!`;
        rewardBadge.style.display = 'inline-block';
        userProgress.coins += 50;
        userProgress.pvpWins = (userProgress.pvpWins || 0) + 1;
    } else {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playGameOver();
        iconElem.innerText = '⚔️';
        titleElem.innerText = 'انتهى التحدي الجماعي!';
        msgElem.innerText = `الفائز هو [ ${winner.name} ] بإجابة ${winnerCorrect} من 10 صحيحة!`;
        rewardBadge.style.display = 'none';
    }

    const rankEmojis = ['🥇', '🥈', '🥉'];

    sorted.forEach((p, index) => {
        const isMe = currentUser && (p.uid === currentUser.uid);
        const rankText = index < 3 ? rankEmojis[index] : `#${index + 1}`;
        const pCorrect = p.correctCount !== undefined ? p.correctCount : 0;

        const row = document.createElement('div');
        row.className = `pvp-res-row ${index === 0 ? 'first-place' : ''}`;
        row.innerHTML = `
            <div class="pvp-res-rank-num">${rankText}</div>
            <img class="pvp-res-avatar" src="${p.avatar}" alt="${p.name}">
            <div class="pvp-res-info">
                <span class="pvp-res-name">${p.name} ${isMe ? '<small style="color:var(--accent-purple); font-weight:bold;">(أنت)</small>' : ''}</span>
            </div>
            <div class="pvp-res-score" style="color: var(--accent-green);">${pCorrect} من 10 ✅</div>
        `;
        listContainer.appendChild(row);
    });

    saveProgress();
    checkAllAchievements();
    updateHeaderStats();
}

function leavePvpRoom() {
    if (gameState.pvpUnsubscribe) {
        gameState.pvpUnsubscribe();
        gameState.pvpUnsubscribe = null;
    }

    if (gameState.pvpRoomId && gameState.isPvpHost) {
        db.collection('pvp_rooms').doc(gameState.pvpRoomId).delete().catch(() => {});
    }

    gameState.pvpRoomId = null;
    gameState.isPvpHost = false;
    switchScreen('modes-screen');
}


const PVP_CATEGORIES = [
    { id: 'all', name: 'جميع الأقسام (منوع)', icon: '🌟' },
    { id: 'إسلاميات', name: 'إسلاميات', icon: '🕌' },
    { id: 'رياضة وكورة', name: 'رياضة وكورة', icon: '⚽' },
    { id: 'علوم وفضاء', name: 'علوم وفضاء', icon: '🔬' },
    { id: 'تاريخ', name: 'تاريخ وحضارات', icon: '🏛️' },
    { id: 'جغرافيا', name: 'جغرافيا وعواصم', icon: '🌍' },
    { id: 'سينما وفن', name: 'سينما وفن', icon: '🎬' },
    { id: 'طبيعة وحيوانات', name: 'طبيعة وحيوانات', icon: '🐾' },
    { id: 'تكنولوجيا وألعاب', name: 'تكنولوجيا وألعاب', icon: '🎮' },
    { id: 'أدب ولغات', name: 'أدب ولغات', icon: '📚' },
    { id: 'ألغاز وذكاء', name: 'ألغاز وذكاء', icon: '🧩' },
    { id: 'سيارات ومحركات', name: 'سيارات ومحركات', icon: '🏎️' },
    { id: 'معلومات عامة', name: 'معلومات عامة', icon: '💡' }
];

function openPvpCategoryModal() {
    const modal = document.getElementById('pvp-category-modal');
    const listElem = document.getElementById('pvp-categories-list');
    const currentVal = document.getElementById('pvp-selected-category') ? document.getElementById('pvp-selected-category').value : 'all';

    if (listElem) {
        listElem.innerHTML = '';
        PVP_CATEGORIES.forEach(cat => {
            const isSelected = (cat.id === currentVal);
            const item = document.createElement('div');
            item.className = `pvp-cat-option-item ${isSelected ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="pvp-cat-option-info">
                    <span class="pvp-cat-option-icon">${cat.icon}</span>
                    <span class="pvp-cat-option-name">${cat.name}</span>
                </div>
                <i class="fa-solid ${isSelected ? 'fa-circle-dot' : 'fa-circle'} pvp-cat-radio"></i>
            `;
            item.onclick = () => selectPvpCategory(cat.id, `${cat.icon} ${cat.name}`);
            listElem.appendChild(item);
        });
    }

    if (modal) modal.classList.add('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function closePvpCategoryModal() {
    const modal = document.getElementById('pvp-category-modal');
    if (modal) modal.classList.remove('show');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function selectPvpCategory(catId, catLabel) {
    const hiddenInput = document.getElementById('pvp-selected-category');
    const triggerLabel = document.getElementById('pvp-cat-selected-label');

    if (hiddenInput) hiddenInput.value = catId;
    if (triggerLabel) triggerLabel.innerText = catLabel;

    closePvpCategoryModal();
}


// --- محرك التفاعلات والرياكشنات الحية ---
let lastSentReactionTime = 0;
let lastSeenReactionId = null;

function toggleReactionsDrawer() {
    const drawer = document.getElementById('reactions-drawer');
    if (!drawer) return;
    drawer.classList.toggle('open');
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function sendLiveReaction(emoji) {
    const now = Date.now();
    if (now - lastSentReactionTime < 1000) {
        return; // منع السبام (Cooldown 1 ثانية)
    }
    lastSentReactionTime = now;

    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    const myName = (currentUser && !currentUser.isAnonymous) ? currentUser.displayName : 'أنت';
    const myAvatar = (currentUser && currentUser.photoURL) || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    // إظهار الرياكشن محلياً للمستخدم فوراً
    showFloatingReaction(emoji, myName, myAvatar, true);

    // إغلاق الدرج بعد الاختيار
    const drawer = document.getElementById('reactions-drawer');
    if (drawer) drawer.classList.remove('open');

    // إرسال للغرفة في Firebase إذا كان في مود PvP
    if (gameState.mode === 'pvp' && gameState.pvpRoomId && db) {
        const reactionObj = {
            id: now + '_' + Math.random().toString(36).substr(2, 5),
            emoji: emoji,
            senderUid: currentUser ? currentUser.uid : 'anon',
            senderName: myName,
            senderAvatar: myAvatar,
            timestamp: now
        };

        db.collection('pvp_rooms').doc(gameState.pvpRoomId).update({
            lastReaction: reactionObj
        }).catch(() => {});
    }

    // تفاعل المنافس الذكي في مود الرانك
    if (gameState.mode === 'ranked' && typeof currentRankedOpponent !== 'undefined' && currentRankedOpponent) {
        if (Math.random() > 0.35) {
            const botReactions = ['🔥', '👏', '😂', '🎯', '😱', '🧠'];
            const randomReaction = botReactions[Math.floor(Math.random() * botReactions.length)];
            setTimeout(() => {
                showFloatingReaction(randomReaction, currentRankedOpponent.name, currentRankedOpponent.avatar, false);
            }, 1200 + Math.random() * 1500);
        }
    }
}

function showFloatingReaction(emoji, senderName, senderAvatar, isMe) {
    const container = document.getElementById('floating-reactions-box');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `floating-bubble ${isMe ? 'is-me' : 'is-opponent'}`;
    bubble.innerHTML = `
        <img class="float-avatar" src="${senderAvatar}" alt="${senderName}">
        <span class="float-sender">${senderName}</span>
        <span class="float-emoji">${emoji}</span>
    `;

    container.appendChild(bubble);

    // إزالة العنصر بعد انتهاء الأنيميشن
    setTimeout(() => {
        if (bubble && bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 2800);
}
