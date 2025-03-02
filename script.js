function toggleSection(id) {
    let section = document.getElementById(id);
    
    // Close all sections first
    document.querySelectorAll('.content').forEach(content => {
        if (content.id !== id) {
            content.style.maxHeight = null;
        }
    });

    // Open or close the clicked section
    if (section.style.maxHeight) {
        section.style.maxHeight = null;
    } else {
        section.style.maxHeight = section.scrollHeight + "px";
    }
}
// Function to Create Floating Stars
function createStars() {
    const numStars = 100; // Adjust number of stars
    const container = document.querySelector(".stars-container");

    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh"; // Spread stars across the whole screen
        star.style.animationDuration = Math.random() * 5 + 3 + "s"; // Random speed
        star.style.animationDelay = Math.random() * 3 + "s"; // Random delay
        star.style.width = Math.random() * 2 + "px"; // Varying star sizes
        star.style.height = star.style.width;

        container.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 8000); // Remove stars after animation to avoid too many elements
    }
}

// Run the function every second to keep generating stars
setInterval(createStars, 1000);
