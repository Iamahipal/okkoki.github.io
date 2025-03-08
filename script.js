document.addEventListener("DOMContentLoaded", () => {
    // Animate tiles
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

    // Get the large tile and its content
    const largeTile = document.querySelector('.large');
    const tileContent = largeTile.querySelector('.tile-content');
    
    // Store original content
    const originalHTML = tileContent.innerHTML;
    const originalTitle = document.querySelector('.retro-text').textContent;
    const originalTagline = document.querySelector('.tagline').textContent;
    
    // Create front and back containers
    const frontSide = document.createElement('div');
    frontSide.className = 'tile-front';
    
    const backSide = document.createElement('div');
    backSide.className = 'tile-back';
    
    // Set specific surprise message
    const surpriseMessage = "Let's Build Something Cool!";
    backSide.innerHTML = `<div class="surprise-message">📟 "${surpriseMessage}"</div>`;
    
    // Setup the front side with empty text fields for typewriter effect
    frontSide.innerHTML = `
        <div class="tile-content">
            <h1 class="retro-text"><span class="typed-title"></span><span class="cursor">_</span></h1>
            <p class="tagline"><span class="typed-tagline"></span></p>
        </div>
    `;
    
    // Clear and setup the tile content with both sides
    tileContent.innerHTML = '';
    tileContent.appendChild(frontSide);
    tileContent.appendChild(backSide);
    
    // Get references to new elements
    const typedTitle = frontSide.querySelector('.typed-title');
    const typedTagline = frontSide.querySelector('.typed-tagline');
    const cursor = frontSide.querySelector('.cursor');
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .cursor {
            font-weight: bold;
            animation: blink 0.7s infinite;
            display: inline-block;
        }
        
        .tile.large {
            perspective: 1000px;
        }
        
        .tile-content {
            transform-style: preserve-3d;
            transition: transform 0.8s;
            width: 100%;
            height: 100%;
        }
        
        .tile-front, .tile-back {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .tile-back {
            transform: rotateY(180deg);
            background-color: rgba(0, 87, 183, 0.95);
        }
        
        .flipped .tile-content {
            transform: rotateY(180deg);
        }
        
        .surprise-message {
            font-family: 'Press Start 2P', cursive;
            color: white;
            text-align: center;
            font-size: 16px;
            padding: 0 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Typewriter effect for title
    let titleIndex = 0;
    function typeTitle() {
        if (titleIndex < originalTitle.length) {
            typedTitle.textContent += originalTitle.charAt(titleIndex);
            titleIndex++;
            setTimeout(typeTitle, 150);
        } else {
            // Move cursor to tagline after typing title
            cursor.remove();
            typedTagline.insertAdjacentHTML('afterend', '<span class="cursor">_</span>');
            
            // Start typing tagline after a short delay
            setTimeout(typeTagline, 500);
        }
    }
    
    // Typewriter effect for tagline
    let taglineIndex = 0;
    function typeTagline() {
        if (taglineIndex < originalTagline.length) {
            typedTagline.textContent += originalTagline.charAt(taglineIndex);
            taglineIndex++;
            setTimeout(typeTagline, 100);
        } else {
            // When typing is complete, wait a bit then flip the tile
            setTimeout(() => {
                // Remove cursor
                const currentCursor = document.querySelector('.cursor');
                if (currentCursor) currentCursor.remove();
                
                // Flip the tile to show the back side
                tileContent.style.transform = 'rotateY(180deg)';
                
                // Flip back after 5 seconds
                setTimeout(() => {
                    tileContent.style.transform = 'rotateY(0deg)';
                    
                    // Restart the whole animation cycle after a delay
                    setTimeout(restartAnimation, 3000);
                }, 5000);
            }, 1000);
        }
    }
    
    // Function to restart the entire animation
    function restartAnimation() {
        // Reset text
        typedTitle.textContent = '';
        typedTagline.textContent = '';
        
        // Add cursor back to title
        const currentCursor = document.querySelector('.cursor');
        if (currentCursor) currentCursor.remove();
        typedTitle.insertAdjacentHTML('afterend', '<span class="cursor">_</span>');
        
        // Reset indices
        titleIndex = 0;
        taglineIndex = 0;
        
        // Start the typewriter effect again
        typeTitle();
    }
    
    // Start the typewriter effect after a short delay
    setTimeout(typeTitle, 1000);
});
