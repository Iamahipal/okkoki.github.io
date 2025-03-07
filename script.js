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

    // Create dotted text effect for the title
    const dottedText = document.querySelector('.dotted-text');
    if (dottedText) {
        const text = dottedText.textContent;
        let dottedHTML = '';
        
        for (let char of text) {
            if (char === ' ') {
                dottedHTML += ' ';
            } else {
                // Create a series of dots to form each letter
                const letterHTML = createDottedLetter(char);
                dottedHTML += letterHTML;
            }
        }
        
        dottedText.innerHTML = dottedHTML;
    }
});

// Function to create dotted letters (simplified version)
function createDottedLetter(char) {
    // This is a simplified representation - in a real implementation
    // you would have patterns for each letter
    return `<span class="letter">${char}</span>`;
}
