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
    
    // Create the animation container
    const animationContainer = document.createElement('div');
    animationContainer.className = 'animation-container';
    
    // Add the original content
    const original = document.createElement('div');
    original.className = 'original-content';
    original.innerHTML = `
        <h1 class="retro-text">OKKOKI</h1>
        <p class="tagline"><span class="static-text">Fueling Small Business </span><span class="growth-text">Growth</span></p>
    `;
    
    // Create the animation stage
    const animationStage = document.createElement('div');
    animationStage.className = 'animation-stage';
    
    // Create sprite containers
    const growthRunner = document.createElement('div');
    growthRunner.className = 'sprite growth-runner';
    
    const chaser = document.createElement('div');
    chaser.className = 'sprite chaser';
    
    // Add elements to the DOM
    animationStage.appendChild(growthRunner);
    animationStage.appendChild(chaser);
    
    animationContainer.appendChild(original);
    animationContainer.appendChild(animationStage);
    
    // Replace original content with animation container
    tileContent.innerHTML = '';
    tileContent.appendChild(animationContainer);
    
    // Add styles for animation
    const style = document.createElement('style');
    style.textContent = `
        .large .tile-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px;
            overflow: hidden;
            position: relative;
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
        
        .animation-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .original-content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .animation-stage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
        }
        
        .sprite {
            position: absolute;
            width: 32px;
            height: 32px;
            background-repeat: no-repeat;
            background-size: cover;
            image-rendering: pixelated;
        }
        
        .growth-runner {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDMtMjBUMTI6MDg6NDUrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAzLTIwVDEyOjEwOjUwKzAxOjAwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDMtMjBUMTI6MTA6NTArMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZiYjZkZTItMmU2My01NzRkLTk3NzYtZGM5ZmNmMDgwOWRhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2YmI2ZGUyLTJlNjMtNTc0ZC05Nzc2LWRjOWZjZjA4MDlkYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ2YmI2ZGUyLTJlNjMtNTc0ZC05Nzc2LWRjOWZjZjA4MDlkYSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDZiYjZkZTItMmU2My01NzRkLTk3NzYtZGM5ZmNmMDgwOWRhIiBzdEV2dDp3aGVuPSIyMDIzLTAzLTIwVDEyOjA4OjQ1KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSBXaW5kb3dzIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkmLFfcAAALbSURBVGiB7Zc9aBRBFMf/b3b3Lsl9F00MN9GkSKMQsQgpRAVFbFIJQYgopImgjaKFIFpoJQlY2FgJQhAxqSwEQdHGLiIKSUSiRkTJXZITculyudu5HSvXwt19X1GKvKb65c3M+/jNzrwVlFIo5jRFmYA55wMIoFGgq8AoYDSDzQr0XwPTR8AbBRgPsHMBqA/oDxLoKIHeBJhmAj1BoM8RaH8A9Z0FevEYcDQKHI0BJwYJdIhAj89qdwE8SBHo3xngtAqcU4CL0qwvRwnjJmHYIYxECfdoBcwUYeIrYdgljLiE4ZRwNlG6ZkHYI4z5hGsKYV8AMJ4ixlPCiEsY8ghXFMLRwP77YVRV1YXCxz4hvocwkhJG/eyZXEJPA3AoW6DP5mZ/5NPqvWylZkD/JtDv5+xdUFBQQHe+xXi+4KYNTgYI9C5ibbQgLwt6vkC/TqAHSqO1HFJ7lGUlSuNqz6z2YCnG7bmz/wnQUQJdLNAny6O51i6N3K0nkJVCRGvl8ZwV6K0C3ZW3+bZq9i/QyZwp+2vDEV+gTxDomswwHyCEEJvG55P9Cv5pqkpG3RyBPuYBGrJHxAkh6JNjm4QQ8vk6VTqJHYqODZ0TJD45PpXDlPkBl7CnNMNsQ0NjU6uiKDUAMD01aX3x8f2r3L6Efp/w1t8ELWGvHYwfupfZyWptrb3/5aVaXfv3/NWbtuTc7CfXti3dNE36dPjAnHndM71QeIBjZALCPsCVIkk1gMFdm9rnZ95Z79KrHxPKimkadspI3/fth3Ozt4OJxLGWXZbdcRxDFKWNE3fu2gLA09HRXdd5A95TxZ2AV98A4c1rqUstGMcFWnTN75SkdYUQlrLyDX0DzXDu0mWfvuuuDUvXdVnUkBcGVjW3AEDXbvvr2JgrywnlTNcuBpqUZXndg1Gt74JEGKmq3rLJME0DAH4CP8NQbOTVhWoAAAAASUVORK5CYII=');
            top: 70%;
            left: -40px;
            transform: translateY(-50%);
            z-index: 3;
        }
        
        .chaser {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDMtMjBUMTI6MDg6NDUrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAzLTIwVDEyOjEwOjM2KzAxOjAwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IFdpbmRvd3MiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDMtMjBUMTI6MTA6MzYrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGU1NmQ0MDAtYTRkMi04ZDRjLTlmZTYtYWQ1MWEzZmRmMGU1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhlNTZkNDAwLWE0ZDItOGQ0Yy05ZmU2LWFkNTFhM2ZkZjBlNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhlNTZkNDAwLWE0ZDItOGQ0Yy05ZmU2LWFkNTFhM2ZkZjBlNSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGU1NmQ0MDAtYTRkMi04ZDRjLTlmZTYtYWQ1MWEzZmRmMGU1IiBzdEV2dDp3aGVuPSIyMDIzLTAzLTIwVDEyOjA4OjQ1KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSBXaW5kb3dzIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/M/J0AAALZSURBVGiB7Ze/T1NRFMc/5713W0uh/LLUxk5q6lI7kRgdTAgxLkwOxoVNE/8AF0dHdXFwIdGEQWNicHIyJiYuEhIxMYFUKBJ+WH5JaeH9erhwe0NL7+MPknjX13Puueee+733nHsVEaGSSypTBOxiKqAqQKoCmAqYStCMgM0E7I0AXwTYkYATA3ZFgD8C7jtgOwoYNYDuCmD6GkgjAkZQwI0KuIKAngh4EeA8A5bcb/jdXsY+vuLvxChKVVBGKcXRzxDT795zMDWHcgRUFvCFgNeKM7sL1gC2I2CdCWAPgDq4Bk5EwD5N+H4Y8Kv5tg8YAYrKj1EBpwfzJCwmQqZPyObKOLUPuEGBcK8j2WzmkQDVZeCmCNgrYUAEjNWtT2C4cVAiCOjnhARsQ8DJFgbYKXAWBIwrOd2CgSsCNiCeGGv68Vo/M07S8N87e2/THPB74sBaFXDWC3R7GeBF9g76+MZzlGGAMsG4N4gx7HdIYJ3gblPbVgC1W7ByLHD4+i0tff3I8TGjD5+y093LxvQiRluMUFcUf1+YYGSEUHgIETs47h9BHBuIZOu2ItBWByy87MfqCpK9HMa/ucbiuxDWZZPscp71b1MI4N/8RX5lmezsAvPZHFZvmNW1MXJLPytOD3AZEK4Ua4CXZwXWw/0s3b3Bzu1eLoyMEBkKszzYwd7qCPvhOOnJNLvfvmNagn1pjNTUFJlXKYYn0kQnliA1X8FbJfx3BowGrhfqbnqFJ9/BkYudnVj1AzvLYB4Nc7OZJOmknVJWv1S43ydNRj5L+XHn2qrqcgAmOJkQXjZLQvWj+J+B2E0/bpCOx1gAGP+UxNz8WWFCa2s1C6oZYJrgpECOgT8RuHQEtgI4gg6xpjfVn95Yg2kCXgHcHDg2ICpZUARABE1FrAHHBpQUc8Bpfn0qH4S+eQbUI+EE8Jtq7vwBRgzjaxYIJ3kAAAAASUVORK5CYII=');
            top: 70%;
            left: -100px;
            transform: translateY(-50%);
            z-index: 2;
        }
        
        @keyframes run {
            0% { background-position: 0px 0; }
            25% { background-position: -32px 0; }
            50% { background-position: -64px 0; }
            75% { background-position: -96px 0; }
            100% { background-position: 0px 0; }
        }
        
        @keyframes moveRunner {
            0% { left: -40px; }
            100% { left: calc(100% + 40px); }
        }
        
        @keyframes moveChaser {
            0% { left: -100px; }
            100% { left: calc(100% + 40px); }
        }
        
        .growth-text {
            position: relative;
            display: inline-block;
        }
        
        @keyframes popIn {
            0% { transform: scale(0.1); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .pop-in {
            animation: popIn 0.5s ease-out forwards;
        }
        
        /* Pixel dust effect */
        .pixel-dust {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 0;
            opacity: 0.8;
            z-index: 1;
        }
        
        @keyframes pixelFade {
            0% { opacity: 0.8; transform: translate(0, 0); }
            100% { opacity: 0; transform: translate(var(--x), var(--y)); }
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
    
    // Apply the animation timeline
    setTimeout(() => {
        // Step 1: Hide the "Growth" text
        const growthText = document.querySelector('.growth-text');
        if (growthText) {
            growthText.style.opacity = '0';
            
            // Step 2: Start the Growth Runner animation
            setTimeout(() => {
                growthRunner.style.animation = 'run 0.5s steps(4) infinite, moveRunner 8s linear forwards';
                
                // Create dust particles following the runner
                const createDust = setInterval(() => {
                    if (parseInt(getComputedStyle(growthRunner).left) > window.innerWidth) {
                        clearInterval(createDust);
                        return;
                    }
                    
                    const dust = document.createElement('div');
                    dust.className = 'pixel-dust';
                    dust.style.left = (parseInt(getComputedStyle(growthRunner).left) + 5) + 'px';
                    dust.style.top = (parseInt(getComputedStyle(growthRunner).top) + 20) + 'px';
                    dust.style.setProperty('--x', (Math.random() * 20 - 10) + 'px');
                    dust.style.setProperty('--y', (Math.random() * 20 - 10) + 'px');
                    dust.style.animation = 'pixelFade 0.8s ease-out forwards';
                    
                    animationStage.appendChild(dust);
                    
                    setTimeout(() => {
                        dust.remove();
                    }, 800);
                }, 200);
                
                // Step 3: After a delay, start the Chaser animation
                setTimeout(() => {
                    chaser.style.animation = 'run 0.5s steps(4) infinite, moveChaser 7s linear forwards';
                    
                    // Create dust particles following the chaser
                    const createChaserDust = setInterval(() => {
                        if (parseInt(getComputedStyle(chaser).left) > window.innerWidth) {
                            clearInterval(createChaserDust);
                            return;
                        }
                        
                        const dust = document.createElement('div');
                        dust.className = 'pixel-dust';
                        dust.style.left = (parseInt(getComputedStyle(chaser).left) + 5) + 'px';
                        dust.style.top = (parseInt(getComputedStyle(chaser).top) + 20) + 'px';
                        dust.style.setProperty('--x', (Math.random() * 20 - 10) + 'px');
                        dust.style.setProperty('--y', (Math.random() * 20 - 10) + 'px');
                        dust.style.animation = 'pixelFade 0.8s ease-out forwards';
                        
                        animationStage.appendChild(dust);
                        
                        setTimeout(() => {
                            dust.remove();
                        }, 800);
                    }, 250);
                    
                    // Step 5: Reset with Pop-Up after both characters exit
                    setTimeout(() => {
                        // Reset runner and chaser positions
                        growthRunner.style.animation = '';
                        chaser.style.animation = '';
                        growthRunner.style.left = '-40px';
                        chaser.style.left = '-100px';
                        
                        // Make the "Growth" text pop back in
                        growthText.style.opacity = '1';
                        growthText.classList.add('pop-in');
                        
                        // After text pops in, restart the animation cycle
                        setTimeout(() => {
                            growthText.classList.remove('pop-in');
                            
                            // Restart animation after a delay
                            setTimeout(() => {
                                startAnimation();
                            }, 5000);
                        }, 1000);
                    }, 10000);
                    
                }, 4000);
            }, 1000);
        }
    }, 3000);
    
    // Function to start the animation cycle
    function startAnimation() {
        const growthText = document.querySelector('.growth-text');
        if (growthText) {
            growthText.style.opacity = '0';
            
            setTimeout(() => {
                growthRunner.style.animation = 'run 0.5s steps(4) infinite, moveRunner 8s linear forwards';
                
                setTimeout(() => {
                    chaser.style.animation = 'run 0.5s steps(4) infinite, moveChaser 7s linear forwards';
                    
                    setTimeout(() => {
                        growthRunner.style.animation = '';
                        chaser.style.animation = '';
                        growthRunner.style.left = '-40px';
                        chaser.style.left = '-100px';
                        
                        growthText.style.opacity = '1';
                        growthText.classList.add('pop-in');
                        
                        setTimeout(() => {
                            growthText.classList.remove('pop-in');
                            
                            setTimeout(() => {
                                startAnimation();
                            }, 5000);
                        }, 1000);
                    }, 10000);
                    
                }, 4000);
            }, 1000);
        }
    }
    
    // Apply a simple fade-in animation for the large tile
    largeTile.style.opacity = "0";
    setTimeout(() => {
        largeTile.style.transition = "opacity 0.7s ease-out";
        largeTile.style.opacity = "1";
    }, 500);
});
