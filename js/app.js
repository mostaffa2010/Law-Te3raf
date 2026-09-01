
function checkOnlineStatus() {
    const offlineScreen = document.getElementById('offline-screen');
    if (!offlineScreen) return;

    if (!navigator.onLine) {
        offlineScreen.style.display = 'flex';
    } else {
        offlineScreen.style.display = 'none';
    }
}

function checkNetworkAndRetry() {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    if (navigator.onLine) {
        const offlineScreen = document.getElementById('offline-screen');
        if (offlineScreen) offlineScreen.style.display = 'none';
        location.reload();
    } else {
        showCustomAlert('لا زلت غير متصل بالإنترنت! يرجى تشغيل الـ Wi-Fi أو بيانات الهاتف والمحاولة مجدداً.', 'تنبيه الاتصال', '📶');
    }
}

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

// js/app.js - نقطة البداية وتشغيل التطبيق

document.addEventListener('DOMContentLoaded', async () => {
    checkOnlineStatus();
    history.replaceState({ screen: 'main-menu' }, "", "#main-menu");

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'flex';
    }

    // فحص المستخدم الحالي
    if (!currentUser) {
        const saved = localStorage.getItem('local_offline_guest');
        if (saved) {
            try {
                currentUser = JSON.parse(saved);
                updateUserProfileUI(currentUser);
                switchScreen('main-menu', false);
            } catch(e) {
                switchScreen('auth-screen', false);
            }
        } else {
            switchScreen('auth-screen', false);
        }
    }

    if (navigator.onLine) {
        try {
            await loadQuestionsFromPublishedSheet();
        } catch(e) {}
    }

    setTimeout(hideSplashScreenNow, 1000);
});
