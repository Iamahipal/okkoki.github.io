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
    
    // Set up 3D container on the large tile
    largeTile.style.perspective = "1000px";
    
    // Get the tile content
    const tileContent = largeTile.querySelector('.tile-content');
    
    // Store original content
    const originalContent = tileContent.innerHTML;
    
    // Prepare front and back elements
    const frontSide = document.createElement('div');
    frontSide.className = 'tile-front';
    frontSide.innerHTML = originalContent;
    
    const backSide = document.createElement('div');
    backSide.className = 'tile-back';
    backSide.innerHTML = `
        <div class="back-message">Let's Build Something Cool!</div>
    `;
    
    // Add styles for 3D flip and properly centered text
    const style = document.createElement('style');
    style.textContent = `
        .large .tile-content {
            transform-style: preserve-3d;
            transition: transform 0.8s;
            position: relative;
        }
        
        .tile-front, .tile-back {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 87, 183, 0.95);
        }
        
        .tile-back {
            transform: rotateY(180deg);
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
        
        .back-message {
            font-family: 'Press Start 2P', cursive;
            color: white;
            text-align: center;
            font-size: 16px;
            padding: 0 15px;
        }
        
        @media screen and (max-width: 600px) {
            .retro-text {
                font-size: 24px;
            }
            
            .tagline {
                font-size: 12px;
            }
            
            .back-message {
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Clear and rebuild the content with front and back sides
    tileContent.innerHTML = '';
    tileContent.appendChild(frontSide);
    tileContent.appendChild(backSide);
    
    // Flip the tile after a delay
    setTimeout(() => {
        tileContent.style.transform = 'rotateY(180deg)';
        
        // Flip back after 5 seconds
        setTimeout(() => {
            tileContent.style.transform = 'rotateY(0deg)';
        }, 5000);
    }, 3000);
});
