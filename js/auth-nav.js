// js/auth-nav.js - إدارة الحسابات، تسجيل الدخول، والتنقل بين الشاشات

function loginWithGoogle() {
    if (!navigator.onLine || typeof auth === 'undefined' || !auth) {
        showCustomAlert('أنت غير متصل بالإنترنت حالياً. يرجى الاتصال بالإنترنت لتسجيل الدخول.', 'غير متصل', '📶');
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
            setupLocalGuest();
        });
    } else {
        setupLocalGuest();
    }
}

function setupLocalGuest() {
    const guestUid = localStorage.getItem('law_offline_uid') || ('guest_' + Math.floor(10000 + Math.random() * 90000));
    localStorage.setItem('law_offline_uid', guestUid);
    
    currentUser = {
        uid: guestUid,
        displayName: 'ضيف اللعبة',
        isAnonymous: true,
        photoURL: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    };
    
    localStorage.setItem('local_offline_guest', JSON.stringify(currentUser));
    updateUserProfileUI(currentUser);
    if (typeof updateHeaderStats === 'function') updateHeaderStats();
    if (typeof applyLiveConfigUpdates === 'function') applyLiveConfigUpdates();
    if (typeof checkDailyStatus === 'function') checkDailyStatus();
    if (typeof checkWheelStatus === 'function') checkWheelStatus();
    if (typeof checkAllAchievements === 'function') checkAllAchievements();
    if (typeof drawWheel === 'function') drawWheel();
    
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
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = '';
    });
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        gameState.currentScreen = screenId;
        window.scrollTo(0, 0);
    }

    if (pushToHistory) {
        history.pushState({ screen: screenId }, "", `#${screenId}`);
    }

    if (typeof updateHeaderStats === 'function') updateHeaderStats();
    if (typeof applyLiveConfigUpdates === 'function') applyLiveConfigUpdates();
    if (screenId === 'achievements-screen' && typeof renderAchievementsList === 'function') renderAchievementsList();
    if (screenId === 'wheel-screen' && typeof drawWheel === 'function') drawWheel();
    if (screenId === 'settings-screen') loadSettingsValues();
    if (screenId === 'shop-screen' && typeof updateShopDisplay === 'function') updateShopDisplay();
}

function handleNavigationBack() {
    // 1. فحص النوافذ المنبثقة أولاً وإغلاقها دون الرجوع لأي شاشة
    const openModals = [
        { id: 'ranked-info-modal', closeFn: closeRankedInfoModal },
        { id: 'player-profile-modal', closeFn: closePlayerProfileModal },
        { id: 'reactions-modal-overlay', closeFn: () => { const m = document.getElementById('reactions-modal-overlay'); if (m) m.classList.remove('show'); } },
        { id: 'image-zoom-modal', closeFn: closeImageZoomModal },
        { id: 'custom-confirm-modal', closeFn: () => closeCustomConfirm(false) },
        { id: 'custom-modal', closeFn: closeCustomAlert },
        { id: 'pvp-category-modal', closeFn: closePvpCategoryModal },
        { id: 'suggest-cat-picker-modal', closeFn: closeSuggestCategoryPicker },
        { id: 'suggest-diff-picker-modal', closeFn: closeSuggestDiffPicker },
        { id: 'suggest-question-modal', closeFn: closeSuggestQuestionModal }
    ];

    for (const modalObj of openModals) {
        const elem = document.getElementById(modalObj.id);
        if (elem && elem.classList.contains('show')) {
            modalObj.closeFn();
            return true;
        }
    }

    const current = gameState.currentScreen || 'main-menu';

    // 2. إذا كان اللاعب داخل جولة لعب حية
    if (current === 'game-screen') {
        showCustomConfirm(
            'هل تريد حقاً مغادرة الجولة الحالية؟ ستفقد تقدمك في هذه الجولة.',
            () => {
                if (gameState.mode === 'pvp') leavePvpRoom();
                else switchScreen('modes-screen', false);
            },
            null,
            'مغادرة الجولة',
            'نعم، خروج',
            'البقاء في اللعبة',
            '🚪'
        );
        return true;
    }

    // 3. شاشات الأونلاين والغرف
    if (current === 'pvp-waiting-screen' || current === 'pvp-lobby-screen' || current === 'pvp-result-screen' || current === 'pvp-waiting-opponent-screen') {
        leavePvpRoom();
        return true;
    }

    // 4. شاشات الرانك والمواجهة
    if (current === 'ranked-versus-screen' || current === 'ranked-result-screen' || current === 'ranked-waiting-opponent-screen') {
        switchScreen('modes-screen', false);
        return true;
    }

    // 5. الشاشات الفرعية -> رجوع مباشر للقائمة الرئيسية دون إظهار نافذة الخروج
    if (current === 'admin-panel-screen') { switchScreen('settings-screen', false); return true; }
    if (current === 'modes-screen' || current === 'leaderboard-screen' || current === 'wheel-screen' || current === 'achievements-screen' || current === 'shop-screen' || current === 'settings-screen') {
        switchScreen('main-menu', false);
        return true;
    }

    if (current === 'result-screen') {
        switchScreen('modes-screen', false);
        return true;
    }

    if (current === 'review-screen') {
        switchScreen('result-screen', false);
        return true;
    }

    // 6. في القائمة الرئيسية فقط: إظهار نافذة تأكيد إغلاق اللعبة
    if (current === 'main-menu') {
        showCustomConfirm(
            'هل ترغب في إغلاق اللعبة والخروج؟',
            () => {
                // محاولة إغلاق النافذة أو الرجوع في سجل المتصفح
                window.close();
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
        return true;
    }

    switchScreen('main-menu', false);
    return true;
}

// مراقبة زر الرجوع في الهاتف (Android Hardware Back Button / Popstate)
let isNavigatingBack = false;
window.addEventListener('popstate', (event) => {
    if (isNavigatingBack) return;
    isNavigatingBack = true;

    handleNavigationBack();

    setTimeout(() => {
        isNavigatingBack = false;
    }, 200);
});

// دفع حالة أساسية في سجل المتصفح لضمان عمل زر الرجوع دائماً
window.addEventListener('DOMContentLoaded', () => {
    if (!history.state || history.state.screen !== 'main-menu') {
        history.replaceState({ screen: 'main-menu' }, "", "#main-menu");
    }
});

function hideSplashScreenNow() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }
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
