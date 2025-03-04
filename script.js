document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    
    // Staggered Animation
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            tile.style.transition = 'all 0.5s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'scale(1)';
        }, index * 100);
    });

    // Live Tile Animation
    function createLiveTileEffect() {
        const liveTiles = document.querySelectorAll('.tile');
        
        liveTiles.forEach(tile => {
            // Random color shift
            setInterval(() => {
                const randomBlue = Math.floor(Math.random() * 255);
                tile.style.backgroundColor = `rgb(0, ${randomBlue}, 190)`;
            }, 3000);
        });
    }

    createLiveTileEffect();
});
