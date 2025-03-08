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
    
    // Get the tile content
    const tileContent = largeTile.querySelector('.tile-content');
    
    // Add styles for properly centered text with 8-bit font
    const style = document.createElement('style');
    style.textContent = `
        .large .tile-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px;
        }
        
        .retro-text, .tagline {
            font-family: 'Press Start 2P', cursive;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        
        .retro-text {
            font-size: 32px;
            margin-bottom: 20px;
        }
        
        .tagline {
            font-size: 14px;
        }
        
        @media screen and (max-width: 600px) {
            .retro-text {
                font-size: 24px;
            }
            
            .tagline {
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Apply a simple fade-in animation for the large tile
    largeTile.style.opacity = "0";
    setTimeout(() => {
        largeTile.style.transition = "opacity 0.7s ease-out";
        largeTile.style.opacity = "1";
    }, 500);
});
