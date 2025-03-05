document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".tile, .small-tile");
    const gridContainer = document.querySelector('.grid-container');
    
    // Animate tiles
    tiles.forEach((tile, index) => {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.8)";
        setTimeout(() => {
            tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
        }, index * 100);
    });

    // Improved touch handling
    let startY = 0;
    let isScrolling = false;

    gridContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });

    gridContainer.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Determine if scrolling
        if (Math.abs(deltaY) > 10) {
            isScrolling = true;
        }

        // Allow default scrolling behavior
        if (gridContainer.scrollTop === 0 && deltaY > 0) {
            e.preventDefault();
        } else if ((gridContainer.scrollTop + gridContainer.clientHeight) >= gridContainer.scrollHeight && deltaY < 0) {
            e.preventDefault();
        }
    }, { passive: false });

    gridContainer.addEventListener('touchend', () => {
        isScrolling = false;
    }, { passive: true });

    // Prevent pull-to-refresh on the entire document
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
});
