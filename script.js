// Check if the device is mobile and show/hide content
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const desktopWarning = document.getElementById('desktopWarning');
    const mobileContent = document.querySelector('.mobile-only');

    if (isMobile) {
        mobileContent.style.display = 'block';
        if (desktopWarning) desktopWarning.style.display = 'none';
    } else {
        mobileContent.style.display = 'none';
        if (desktopWarning) desktopWarning.style.display = 'flex';
    }
});
