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
    const titleElement = document.querySelector('.retro-text');
    const taglineElement = document.querySelector('.tagline');
    
    // Store original text content
    const originalTitle = titleElement.textContent;
    const originalTagline = taglineElement.textContent;
    
    // Create surprise messages for the back of the tile
    const surpriseMessages = [
        "Let's Build Something Cool!",
        "Ready to Scale Your Business?",
        "Innovative Solutions Await",
        "Transform Your Digital Presence"
    ];
    
    // Clear the text content to start typewriter effect
    titleElement.textContent = '';
    taglineElement.textContent = '';
    
    // Add a blinking cursor element
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.innerHTML = '_';
    cursor.style.animation = 'blink 0.7s infinite';
    titleElement.appendChild(cursor);
    
    // Add CSS for the cursor blink animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .tile.large {
            perspective: 1000px;
            transform-style: preserve-3d;
        }
        .tile-front, .tile-back {
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: transform 0.8s;
        }
        .tile-back {
            transform: rotateY(180deg);
            background-color: rgba(0, 87, 183, 0.95);
        }
        .surprise-message {
            font-family: 'Press Start 2P', cursive;
            color: white;
            text-align: center;
            font-size: 16px;
            padding: 0 15px;
        }
        .flipped .tile-front {
            transform: rotateY(180deg);
        }
        .flipped .tile-back {
            transform: rotateY(0deg);
        }
    `;
    document.head.appendChild(style);
    
    // Create front and back sides for the flip effect
    const tileContent = largeTile.querySelector('.tile-content');
    const tileContentHTML = tileContent.innerHTML;
    
    // Create front and back containers
    const frontSide = document.createElement('div');
    frontSide.className = 'tile-front';
    frontSide.innerHTML = tileContentHTML;
    
    const backSide = document.createElement('div');
    backSide.className = 'tile-back';
    
    // Choose a random surprise message
    const surpriseMessage = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    backSide.innerHTML = `<div class="surprise-message">📟 "${surpriseMessage}"</div>`;
    
    // Clear and setup the tile content
    tileContent.innerHTML = '';
    tileContent.appendChild(frontSide);
    tileContent.appendChild(backSide);
    
    // Get the newly added elements after DOM manipulation
    const newTitleElement = frontSide.querySelector('.retro-text');
    const newTaglineElement = frontSide.querySelector('.tagline');
    
    // Clear them again for the typewriter effect
    newTitleElement.textContent = '';
    newTaglineElement.textContent = '';
    
    // Add cursor to the title element
    const newCursor = document.createElement('span');
    newCursor.className = 'cursor';
    newCursor.innerHTML = '_';
    newTitleElement.appendChild(newCursor);
    
    // Typewriter effect for title
    let titleIndex = 0;
    function typeTitle() {
        if (titleIndex < originalTitle.length) {
            newTitleElement.insertBefore(
                document.createTextNode(originalTitle.charAt(titleIndex)),
                newCursor
            );
            titleIndex++;
            setTimeout(typeTitle, 150);
        } else {
            // Move cursor to tagline
            newTitleElement.removeChild(newCursor);
            newTaglineElement.appendChild(newCursor);
            
            // Start typing tagline
            setTimeout(typeTagline, 500);
        }
    }
    
    // Typewriter effect for tagline
    let taglineIndex = 0;
    function typeTagline() {
        if (taglineIndex < originalTagline.length) {
            newTaglineElement.insertBefore(
                document.createTextNode(originalTagline.charAt(taglineIndex)),
                newCursor
            );
            taglineIndex++;
            setTimeout(typeTagline, 100);
        } else {
            // Remove cursor when done
            setTimeout(() => {
                newTaglineElement.removeChild(newCursor);
                
                // After typewriter effect completes, flip the tile
                setTimeout(() => {
                    largeTile.classList.add('flipped');
                    
                    // Flip back after 5 seconds
                    setTimeout(() => {
                        largeTile.classList.remove('flipped');
                        
                        // Restart the whole animation cycle after a delay
                        setTimeout(restartAnimation, 3000);
                    }, 5000);
                }, 1000);
            }, 500);
        }
    }
    
    // Function to restart the entire animation
    function restartAnimation() {
        // Reset text content
        newTitleElement.textContent = '';
        newTaglineElement.textContent = '';
        
        // Add cursor back to title
        newTitleElement.appendChild(newCursor);
        
        // Reset indices
        titleIndex = 0;
        taglineIndex = 0;
        
        // Start the typewriter effect again
        typeTitle();
    }
    
    // Start the typewriter effect
    setTimeout(typeTitle, 1000);
});
