// Tile click handler (for now, logs to console; we'll add page navigation later)
function tileClick(tileId) {
    console.log(`Clicked ${tileId} tile`);
    alert(`You clicked the ${tileId} tile! We'll add navigation to the ${tileId} page later.`);
}

// WhatsApp click handler (opens WhatsApp with "Hi" pre-filled)
function openWhatsApp() {
    const phone = '+917020340973';
    const message = encodeURIComponent('Hi');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Instagram click handler (opens Instagram profile in a new tab)
function openInstagram() {
    window.open('https://www.instagram.com/okkoki.in/', '_blank');
}

// Twitter (X) click handler (opens X profile in a new tab)
function openTwitter() {
    window.open('https://x.com/OkKoki_in', '_blank');
}

// Phone click handler (dials the number using the device's dialer)
function dialPhone() {
    const phone = '+917020340973';
    window.location.href = `tel:${phone}`;
}

// Email click handler (opens the default email client with pre-filled details)
function openEmail() {
    const email = 'shekhawatokkoki@gmail.com';
    const subject = encodeURIComponent('Inquiry for OkKOKI Services');
    const body = encodeURIComponent('Hi, I’d like to learn more about your digital marketing services.');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Check if the device is mobile and show/hide content
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const desktopWarning = document.getElementById('desktopWarning');
    const mobileContent = document.querySelector('.mobile-only');

    if (isMobile) {
        mobileContent.style.display = 'block';
        if (desktopWarning) desktopWarning.style.display = 'none';
        initSnakeGame(); // Initialize snake game on mobile
    } else {
        mobileContent.style.display = 'none';
        if (desktopWarning) desktopWarning.style.display = 'flex';
    }
});

// Simple Snake Game
function initSnakeGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let snake = [{x: 10, y: 10}];
    let dx = 0, dy = 0;
    let food = {x: 15, y: 15};
    let score = 0;

    function draw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#FFFFFF';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
        });

        // Draw food
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(food.x * 10, food.y * 10, 10, 10);

        // Move snake
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = {x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 20)};
        } else {
            snake.pop();
        }

        // Check wall collision
        if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 20) {
            alert('Game Over! Score: ' + score);
            snake = [{x: 10, y: 10}];
            dx = dy = 0;
            score = 0;
        }

        // Check self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                alert('Game Over! Score: ' + score);
                snake = [{x: 10, y: 10}];
                dx = dy = 0;
                score = 0;
                break;
            }
        }

        setTimeout(draw, 100);
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
        }
    });

    draw();
}
