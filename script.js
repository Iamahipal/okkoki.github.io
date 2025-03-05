document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".tile, .small-tile");

    // Allow touch scrolling (Removed preventDefault)
    document.body.addEventListener('touchmove', (e) => {
        // Only prevent default if not scrolling
        if (!e.target.closest('.grid-container')) {
            e.preventDefault();
        }
    }, { passive: true });

    tiles.forEach((tile, index) => {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.8)";
        setTimeout(() => {
            tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
        }, index * 100);
    });
});
