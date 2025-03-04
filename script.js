// Tile click handler (for now, logs to console; we'll add page navigation later)
function tileClick(tileId) {
    console.log(`Clicked ${tileId} tile`);
    alert(`You clicked the ${tileId} tile! We'll add navigation to the ${tileId} page later.`);
}

// WhatsApp click handler (opens WhatsApp with "Hi" pre-filled)
function openWhatsApp() {
    const phone = '+917020340973';
    const message = encodeURIComponent('Hi');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Instagram click handler (opens Instagram profile in a new tab)
function openInstagram() {
    window.open('https://www.instagram.com/okkoki.in/', '_blank');
}

// Twitter (X) click handler (opens X profile in a new tab)
function openTwitter() {
    window.open('https://x.com/OkKoki_in', '_blank');
}

// Phone click handler (dials the number using the device's dialer)
function dialPhone() {
    const phone = '+917020340973';
    window.location.href = `tel:${phone}`;
}

// Email click handler (opens the default email client with pre-filled details)
function openEmail() {
    const email = 'shekhawatokkoki@gmail.com';
    const subject = encodeURIComponent('Inquiry for OkKOKI Services');
    const body = encodeURIComponent('Hi, I’d like to learn more about your digital marketing services.');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

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

    // Center-align header content dynamically
    const headerTile = document.getElementById('header-tile');
    if (headerTile) {
        headerTile.style.display = 'flex';
        headerTile.style.flexDirection = 'column';
        headerTile.style.justifyContent = 'center';
        headerTile.style.alignItems = 'center';
    }
});
