// js/app.js - نقطة البداية وتشغيل التطبيق بعد تحميل كافة الملفات

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

function initAuthAndApp() {
    if (typeof auth !== 'undefined' && auth) {
        auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    currentUser = user;
                    updateUserProfileUI(user);
                    await loadCloudProgress(user.uid);
                    
                    if (typeof checkAndApplySeasonReset === 'function') checkAndApplySeasonReset();
                    if (typeof updateHeaderStats === 'function') updateHeaderStats();
                    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();
                    if (typeof checkDailyStatus === 'function') checkDailyStatus();
                    if (typeof checkWheelStatus === 'function') checkWheelStatus();
                    if (typeof checkAllAchievements === 'function') checkAllAchievements();
                    if (typeof drawWheel === 'function') drawWheel();

                    switchScreen('main-menu', false);
                } else {
                    const localGuest = localStorage.getItem('local_offline_guest');
                    if (localGuest) {
                        try {
                            currentUser = JSON.parse(localGuest);
                            updateUserProfileUI(currentUser);
                            if (typeof checkAndApplySeasonReset === 'function') checkAndApplySeasonReset();
                    if (typeof updateHeaderStats === 'function') updateHeaderStats();
                    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();
                            if (typeof checkDailyStatus === 'function') checkDailyStatus();
                            if (typeof checkWheelStatus === 'function') checkWheelStatus();
                            if (typeof checkAllAchievements === 'function') checkAllAchievements();
                            if (typeof drawWheel === 'function') drawWheel();
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
            } catch (err) {
                console.warn('Auth state processing error:', err);
                switchScreen('auth-screen', false);
            } finally {
                hideSplashScreenNow();
            }
        });
    } else {
        const localGuest = localStorage.getItem('local_offline_guest');
        if (localGuest) {
            try {
                currentUser = JSON.parse(localGuest);
                updateUserProfileUI(currentUser);
                switchScreen('main-menu', false);
            } catch(e) {
                switchScreen('auth-screen', false);
            }
        } else {
            switchScreen('auth-screen', false);
        }
        hideSplashScreenNow();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    history.replaceState({ screen: 'main-menu' }, "", "#main-menu");
    checkOnlineStatus();
    if (typeof checkPwaInstallBanner === 'function') checkPwaInstallBanner();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'flex';
    }

    initAuthAndApp();

    if (navigator.onLine) {
        try {
            await loadQuestionsFromPublishedSheet();
        } catch(e) {}
    }

    setTimeout(hideSplashScreenNow, 1200);
});
