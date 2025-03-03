// Tile click handler for existing tiles (for now, logs to console; we'll add page navigation later)
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

// Add subtle star animations (optional, using Particles.js)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Particles !== 'undefined') {
        Particles.init({
            selector: 'body',
            maxParticles: 50,
            sizeVariations: 2,
            speed: 0.5,
            color: '#00BFFF',
            connectParticles: false
        });
    }
});
