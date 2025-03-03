// Tile click handler (for now, logs to console; we'll add page navigation later)
function tileClick(tileId) {
    console.log(`Clicked ${tileId} tile`);
    alert(`You clicked the ${tileId} tile! We'll add navigation to the ${tileId} page later.`);
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
