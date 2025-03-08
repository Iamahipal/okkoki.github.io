document.addEventListener("DOMContentLoaded", () => {
    // Animate tiles with standard Windows animation
    const tiles = document.querySelectorAll(".tile, .small");
    tiles.forEach((tile, index) => {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.8)";
        setTimeout(() => {
            tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
        }, index * 100);
    });

    // Get the large tile
    const largeTile = document.querySelector('.large');
    const tileContent = largeTile.querySelector('.tile-content');
    
    // Make sure OKKOKI and subheadline are using 8-bit font
    const titleElement = document.querySelector('.retro-text');
    const taglineElement = document.querySelector('.tagline');
    
    // Ensure the title is using the 8-bit font
    titleElement.style.fontFamily = "'Press Start 2P', cursive";
    
    // Simple fade-in for the large tile with a slight delay
    largeTile.style.opacity = "0";
    setTimeout(() => {
        largeTile.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        largeTile.style.opacity = "1";
    }, 500);
    
    // Simple tile flip animation (just once, not continuously)
    setTimeout(() => {
        tileContent.style.transition = "transform 0.8s ease-in-out";
        tileContent.style.transform = "rotateY(180deg)";
        
        // Create back side with message
        const backSide = document.createElement('div');
        backSide.className = 'tile-back';
        backSide.innerHTML = `
            <div style="
                font-family: 'Press Start 2P', cursive; 
                color: white; 
                text-align: center; 
                font-size: 16px;
                padding: 0 15px;
            ">📟 "Let's Build Something Cool!"</div>
        `;
        backSide.style.position = "absolute";
        backSide.style.top = "0";
        backSide.style.left = "0";
        backSide.style.width = "100%";
        backSide.style.height = "100%";
        backSide.style.display = "flex";
        backSide.style.justifyContent = "center";
        backSide.style.alignItems = "center";
        backSide.style.backfaceVisibility = "hidden";
        backSide.style.transform = "rotateY(180deg)";
        backSide.style.backgroundColor = "rgba(0, 87, 183, 0.95)";
        
        tileContent.appendChild(backSide);
        
        // Flip back after 5 seconds
        setTimeout(() => {
            tileContent.style.transform = "rotateY(0deg)";
            // Remove back side after animation completes
            setTimeout(() => {
                if (backSide.parentNode === tileContent) {
                    tileContent.removeChild(backSide);
                }
            }, 800);
        }, 5000);
    }, 3000);
});
