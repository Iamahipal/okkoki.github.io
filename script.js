function toggleSection(id) {
    let section = document.getElementById(id);
    
    // Close all sections first
    document.querySelectorAll('.content').forEach(content => {
        if (content.id !== id) {
            content.style.maxHeight = null;
        }
    });

    // Toggle the clicked section
    if (section.style.maxHeight) {
        section.style.maxHeight = null;
    } else {
        section.style.maxHeight = section.scrollHeight + "px";
    }
}

// Scroll to Contact on CTA click
function scrollToContact() {
    document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
}

// Add starry background particles (optional, using Particles.js)
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
