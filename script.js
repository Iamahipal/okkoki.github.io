document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".tile, .small-tile");

    tiles.forEach((tile, index) => {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.8)";
        
        setTimeout(() => {
            tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
        }, index * 100);
    });

    // Simulate Windows Live Tile Animations
    setInterval(() => {
        tiles.forEach((tile) => {
            if (Math.random() > 0.7) { // Random chance for animation
                tile.style.transform = "scale(1.05)";
                setTimeout(() => {
                    tile.style.transform = "scale(1)";
                }, 300);
            }
        });
    }, 3000);
});
