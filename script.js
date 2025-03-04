document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    
    // Staggered Entry Animation
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            tile.style.transition = 'all 0.5s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'scale(1)';
        }, index * 100);
    });
});
