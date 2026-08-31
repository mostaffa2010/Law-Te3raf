// js/app.js - نقطة البداية وتشغيل التطبيق

document.addEventListener('DOMContentLoaded', async () => {
    history.replaceState({ screen: 'main-menu' }, "", "#main-menu");

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'flex';
    }

    if (!auth.currentUser) switchScreen('auth-screen', false);
    if (navigator.onLine) await loadQuestionsFromPublishedSheet();
    setTimeout(hideSplashScreenNow, 1200);
});
