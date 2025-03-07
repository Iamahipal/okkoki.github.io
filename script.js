document.addEventListener("DOMContentLoaded", () => {
    // Animate tiles with faster animation
    const tiles = document.querySelectorAll(".tile, .small");
    tiles.forEach((tile, index) => {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.8)";
        setTimeout(() => {
            tile.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
            tile.style.opacity = "1";
            tile.style.transform = "scale(1)";
        }, index * 50);
    });

    // Initialize the snake game in the large tile
    initSnakeGame();

    // Create dotted text effect for the title
    const dottedText = document.querySelector('.dotted-text');
    if (dottedText) {
        const text = dottedText.textContent; // "OKKOKI"
        let dottedHTML = '';
        
        for (let char of text) {
            if (char === ' ') {
                dottedHTML += ' ';
            } else {
                // Create a series of dots to form each letter with data attribute for the game
                const letterHTML = createDottedLetter(char);
                dottedHTML += letterHTML;
            }
        }
        
        dottedText.innerHTML = dottedHTML;
    }
});

// Function to create dotted letters with individual span for each dot
function createDottedLetter(char) {
    return `<span class="letter" data-char="${char}">${char}</span>`;
}

// Snake game initialization
function initSnakeGame() {
    const largeTile = document.querySelector('.tile.large');
    if (!largeTile) return;
    
    // Create canvas element for the snake game
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    canvas.classList.add('snake-game');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Below the text
    
    // Insert canvas before the tile content
    largeTile.insertBefore(canvas, largeTile.firstChild);
    
    // Game variables
    const ctx = canvas.getContext('2d');
    let snake = [{ x: 10, y: 50 }]; // Start with just the head
    let direction = 'right';
    let foodPositions = [];
    let letterElements = [];
    let gameSpeed = 150;
    let lastRenderTime = 0;
    let gameOver = false;
    let letterIndex = 0;
    const pixelSize = 5;
    
    // Initialize food positions based on "OKKOKI" letters only
    function initFoodPositions() {
        letterElements = document.querySelectorAll('.letter');
        const targetText = "OKKOKI"; // Only allow these letters
        foodPositions = [];
        
        letterElements.forEach((letter, index) => {
            const char = letter.getAttribute('data-char');
            if (targetText.includes(char)) { // Only include "O", "K", "I" from "OKKOKI"
                const rect = letter.getBoundingClientRect();
                const tileRect = largeTile.getBoundingClientRect();
                
                // Calculate position relative to canvas
                const x = Math.floor((rect.left - tileRect.left) / pixelSize) * pixelSize;
                const y = Math.floor((rect.top - tileRect.top) / pixelSize) * pixelSize;
                
                // Add food at letter position
                foodPositions.push({
                    x: x,
                    y: y,
                    letter: char,
                    eaten: false
                });
            }
        });
    }
    
    // Draw 8-bit style snake
    function drawSnake() {
        ctx.fillStyle = 'white';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, pixelSize, pixelSize);
        });
    }
    
    // Draw food (letters)
    function drawFood() {
        ctx.fillStyle = '#33ff33'; // 8-bit green
        foodPositions.forEach(food => {
            if (!food.eaten) {
                ctx.fillRect(food.x, food.y, pixelSize, pixelSize);
            }
        });
    }
    
    // Update snake position
    function updateSnake() {
        const head = { ...snake[0] };
        
        // Move based on direction
        switch (direction) {
            case 'up':
                head.y -= pixelSize;
                break;
            case 'down':
                head.y += pixelSize;
                break;
            case 'left':
                head.x -= pixelSize;
                break;
            case 'right':
                head.x += pixelSize;
                break;
        }
        
        // Check boundaries and wrap around
        if (head.x < 0) head.x = canvas.width - pixelSize;
        if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - pixelSize;
        if (head.y >= canvas.height) head.y = 0;
        
        // Add new head
        snake.unshift(head);
        
        // Check for food collision (only "OKKOKI" letters)
        let ateFood = false;
        for (let i = 0; i < foodPositions.length; i++) {
            if (!foodPositions[i].eaten && 
                Math.abs(head.x - foodPositions[i].x) < pixelSize * 2 && 
                Math.abs(head.y - foodPositions[i].y) < pixelSize * 2) {
                foodPositions[i].eaten = true;
                ateFood = true;
                
                // Hide the actual letter element
                if (letterElements[i]) {
                    letterElements[i].style.opacity = '0';
                    letterElements[i].style.transition = 'opacity 0.5s';
                }
                
                // Grow the snake
                for (let j = 0; j < 3; j++) {
                    snake.push({ ...snake[snake.length - 1] });
                }
                
                // Break after eating one letter
                break;
            }
        }
        
        // Remove tail if didn't eat food
        if (!ateFood) {
            snake.pop();
        }

        // Check if all "OKKOKI" food is eaten
        if (foodPositions.every(food => food.eaten)) {
            // Reset the letters
            letterElements.forEach(letter => {
                const char = letter.getAttribute('data-char');
                if (targetText.includes(char)) {
                    letter.style.opacity = '1';
                    letter.style.transition = 'opacity 0.5s';
                }
            });
            
            // Reset food
            foodPositions.forEach(food => {
                food.eaten = false;
            });
        }
    }
    
    // Game loop
    function gameLoop(currentTime) {
        if (gameOver) return;
        
        window.requestAnimationFrame(gameLoop);
        
        const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
        if (secondsSinceLastRender < gameSpeed / 1000) return;
        
        lastRenderTime = currentTime;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw
        updateSnake();
        drawFood();
        drawSnake();
    }
    
    // Change direction based on random movement
    function changeDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        const currentDirIndex = directions.indexOf(direction);
        
        // Don't allow complete reversal
        const possibleDirs = directions.filter((dir, index) => {
            if (currentDirIndex === 0 && index === 1) return false; // up → down
            if (currentDirIndex === 1 && index === 0) return false; // down → up
            if (currentDirIndex === 2 && index === 3) return false; // left → right
            if (currentDirIndex === 3 && index === 2) return false; // right → left
            return true;
        });
        
        // Choose random valid direction
        const newDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        direction = newDir;
    }
    
    // Set random direction changes
    setInterval(changeDirection, 2000);
    
    // Adjust to title container after slight delay to ensure elements are positioned
    setTimeout(() => {
        const tileContentRect = largeTile.querySelector('.tile-content').getBoundingClientRect();
        canvas.width = tileContentRect.width;
        canvas.height = tileContentRect.height;
        
        // Initialize food positions after elements are properly rendered
        initFoodPositions();
        
        // Start the game
        requestAnimationFrame(gameLoop);
    }, 500);
}
