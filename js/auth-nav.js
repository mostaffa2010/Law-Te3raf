// js/auth-nav.js - إدارة الحسابات، تسجيل الدخول، والتنقل بين الشاشات

if (typeof auth !== 'undefined' && auth) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            updateUserProfileUI(user);
            await loadCloudProgress(user.uid);
            
            updateHeaderStats();
            checkDailyStatus();
            checkWheelStatus();
            checkAllAchievements();
            drawWheel();

            switchScreen('main-menu', false);
        } else {
            // فحص هل يوجد مستخدم ضيف محفوظ محلياً
            const localGuest = localStorage.getItem('local_offline_guest');
            if (localGuest) {
                try {
                    currentUser = JSON.parse(localGuest);
                    updateUserProfileUI(currentUser);
                    updateHeaderStats();
                    checkDailyStatus();
                    checkWheelStatus();
                    checkAllAchievements();
                    drawWheel();
                    switchScreen('main-menu', false);
                } catch(e) {
                    currentUser = null;
                    switchScreen('auth-screen', false);
                }
            } else {
                currentUser = null;
                switchScreen('auth-screen', false);
            }
        }
        hideSplashScreenNow();
    });
} else {
    // حالة العمل بدون فايربيس تماماً
    const localGuest = localStorage.getItem('local_offline_guest');
    if (localGuest) {
        try {
            currentUser = JSON.parse(localGuest);
            updateUserProfileUI(currentUser);
            updateHeaderStats();
            checkDailyStatus();
            checkWheelStatus();
            checkAllAchievements();
            drawWheel();
            switchScreen('main-menu', false);
        } catch(e) {
            switchScreen('auth-screen', false);
        }
    } else {
        switchScreen('auth-screen', false);
    }
    setTimeout(hideSplashScreenNow, 500);
}

function loginWithGoogle() {
    if (!navigator.onLine || typeof auth === 'undefined' || !auth) {
        showCustomAlert('أنت غير متصل بالإنترنت حالياً. يمكنك استخدام خيار "اللعب كضيف" لمتابعة اللعب أوفلاين!', 'غير متصل', '📶');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            auth.signInWithRedirect(provider);
        } else {
            showCustomAlert('خطأ في تسجيل الدخول: ' + error.message, 'خطأ', '⚠️');
        }
    });
}

function loginAsGuest() {
    if (typeof auth !== 'undefined' && auth && navigator.onLine) {
        auth.signInAnonymously().catch(() => {
            setupLocalOfflineGuest();
        });
    } else {
        setupLocalOfflineGuest();
    }
}

function setupLocalOfflineGuest() {
    const offlineUid = localStorage.getItem('law_offline_uid') || ('guest_' + Math.floor(10000 + Math.random() * 90000));
    localStorage.setItem('law_offline_uid', offlineUid);
    
    currentUser = {
        uid: offlineUid,
        displayName: 'ضيف اللعبة',
        isAnonymous: true,
        isOffline: true,
        photoURL: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    };
    
    localStorage.setItem('local_offline_guest', JSON.stringify(currentUser));
    updateUserProfileUI(currentUser);
    updateHeaderStats();
    checkDailyStatus();
    checkWheelStatus();
    checkAllAchievements();
    drawWheel();
    
    switchScreen('main-menu', false);
    hideSplashScreenNow();
}

function logoutCurrentUser() {
    showCustomConfirm(
        'هل ترغب حقاً في تسجيل الخروج من حسابك الحالي؟',
        () => {
            localStorage.removeItem('local_offline_guest');
            if (typeof auth !== 'undefined' && auth) {
                auth.signOut().then(() => {
                    localStorage.removeItem('law_ta3raf_progress');
                    switchScreen('auth-screen', false);
                }).catch(() => {
                    switchScreen('auth-screen', false);
                });
            } else {
                switchScreen('auth-screen', false);
            }
        },
        null,
        'تسجيل الخروج',
        'تسجيل الخروج',
        'إلغاء',
        '🚪'
    );
}

function updateUserProfileUI(user) {
    const nameElem = document.getElementById('user-name');
    const avatarElem = document.getElementById('user-avatar');

    if (nameElem) nameElem.innerText = (user.isAnonymous || user.isOffline) ? 'ضيف اللعبة' : (user.displayName || 'لاعب');
    if (avatarElem) avatarElem.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
}

function switchScreen(screenId, pushToHistory = true) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    clearInterval(gameState.timerInterval);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        gameState.currentScreen = screenId;
    }

    if (pushToHistory) {
        history.pushState({ screen: screenId }, "", `#${screenId}`);
    }

    updateHeaderStats();
    if (screenId === 'achievements-screen') renderAchievementsList();
    if (screenId === 'wheel-screen') drawWheel();
    if (screenId === 'settings-screen') loadSettingsValues();
    if (screenId === 'shop-screen') updateShopDisplay();
}

function handleNavigationBack() {
    const current = gameState.currentScreen;

    if (current === 'game-screen') {
        showCustomConfirm(
            'هل تريد حقاً مغادرة الجولة الحالية؟ ستفقد تقدمك في هذه الجولة.',
            () => {
                if (gameState.mode === 'pvp') leavePvpRoom();
                else switchScreen('modes-screen', false);
            },
            () => {
                history.pushState({ screen: 'game-screen' }, "", "#game-screen");
            },
            'مغادرة الجولة',
            'نعم، خروج',
            'البقاء في اللعبة',
            '🚪'
        );
    } else if (current === 'pvp-waiting-screen' || current === 'pvp-lobby-screen' || current === 'pvp-result-screen' || current === 'pvp-waiting-opponent-screen') {
        leavePvpRoom();
    } else if (current === 'modes-screen' || current === 'leaderboard-screen' || current === 'wheel-screen' || current === 'achievements-screen' || current === 'shop-screen' || current === 'settings-screen') {
        switchScreen('main-menu', false);
    } else if (current === 'categories-screen' || current === 'result-screen') {
        switchScreen('modes-screen', false);
    } else if (current === 'review-screen') {
        switchScreen('result-screen', false);
    } else if (current === 'main-menu') {
        showCustomConfirm(
            'هل ترغب في إغلاق اللعبة والخروج؟',
            () => {
                history.back();
            },
            () => {
                history.pushState({ screen: 'main-menu' }, "", "#main-menu");
            },
            'إغلاق اللعبة',
            'خروج',
            'إلغاء',
            '👋'
        );
    } else {
        switchScreen('main-menu', false);
    }
}

window.addEventListener('popstate', () => {
    handleNavigationBack();
});

function hideSplashScreenNow() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hide');
}

function openSettingsScreen() { 
    switchScreen('settings-screen'); 
}

function loadSettingsValues() {
    const soundChk = document.getElementById('setting-sound');
    const vibrateChk = document.getElementById('setting-vibrate');
    if (soundChk) soundChk.checked = localStorage.getItem('sound_enabled') !== 'false';
    if (vibrateChk) vibrateChk.checked = localStorage.getItem('vibrate_enabled') !== 'false';
}

function toggleSoundSetting(enabled) {
    localStorage.setItem('sound_enabled', enabled);
    if (enabled && typeof AudioEngine !== 'undefined') AudioEngine.playClick();
}

function toggleVibrateSetting(enabled) {
    localStorage.setItem('vibrate_enabled', enabled);
    if (enabled && navigator.vibrate) navigator.vibrate(50);
}

function resetAllProgress() {
    showCustomConfirm(
        '⚠️ تحذير: هل أنت متأكد من حذف كل تقدمك وإعادة اللعبة كأنك حملتها للتو؟ لن تتمكن من استرجاع هذا التقدم.',
        () => {
            localStorage.removeItem('law_ta3raf_progress');
            localStorage.removeItem('cached_questions_bank');
            localStorage.removeItem('local_offline_guest');
            if (db && currentUser && !currentUser.isOffline) {
                db.collection('users').doc(currentUser.uid).delete().catch(() => {});
            }
            showCustomAlert('تمت إعادة ضبط اللعبة بالكامل بنجاح!', 'تم الضبط', '🔄');
            setTimeout(() => location.reload(), 1200);
        },
        null,
        'إعادة ضبط التقدم',
        'حذف وضبط',
        'إلغاء',
        '⚠️'
    );
}
