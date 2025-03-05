document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    const navButtons = document.querySelectorAll('.nav-btn');

    // Tile Animation Functions
    function animateTile(tile) {
        // Random animation type for each tile
        const animationType = Math.floor(Math.random() * 3); // 0: Scale, 1: Rotate, 2: Flip

        switch (animationType) {
            case 0: // Scale Animation
                tile.style.transition = 'transform 0.5s ease';
                tile.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    tile.style.transform = 'scale(1)';
                }, 500);
                break;
            case 1: // Rotate Animation
                tile.style.transition = 'transform 0.5s ease';
                tile.style.transform = 'rotate(10deg)';
                setTimeout(() => {
                    tile.style.transform = 'rotate(0deg)';
                }, 500);
                break;
            case 2: // Flip Animation (3D flip)
                tile.style.transition = 'transform 0.5s ease';
                tile.style.transform = 'rotateY(180deg)';
                setTimeout(() => {
                    tile.style.transform = 'rotateY(0deg)';
                }, 500);
                break;
        }
    }

    // Add hover animation to tiles
    tiles.forEach(tile => {
        tile.addEventListener('mouseover', () => {
            animateTile(tile);
        });

        // Optional: Add click animation for interactivity
        tile.addEventListener('click', () => {
            animateTile(tile);
        });
    });

    // Initial load animation for tiles (staggered effect)
    let delay = 0;
    tiles.forEach(tile => {
        setTimeout(() => {
            animateTile(tile);
        }, delay);
        delay += 200; // Stagger by 200ms for each tile
    });

    // Nav Button Animation (slight scale on hover)
    navButtons.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'scale(1)';
        });
    });
});
