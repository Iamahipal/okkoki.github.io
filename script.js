// Wait for the document to load
document.addEventListener("DOMContentLoaded", function () {
    animateHeroSection();
    addTileClickEffects();
});

// HERO SECTION ANIMATION (Windows Phone Style)
function animateHeroSection() {
    const hero = document.querySelector(".hero");
    hero.style.opacity = 0;
    hero.style.transform = "scale(0.9)";
    
    setTimeout(() => {
        hero.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        hero.style.opacity = 1;
        hero.style.transform = "scale(1)";
    }, 300);
}

// ADDING CLICK EFFECTS TO TILES (Mimic Windows Phone Live Tiles)
function addTileClickEffects() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.addEventListener("click", function () {
            this.classList.add("tile-press-effect");

            // Remove the effect after animation
            setTimeout(() => {
                this.classList.remove("tile-press-effect");
            }, 200);
        });
    });
}

// OPTIONAL: Smooth Scroll to Sections when Clicked (if sections expand later)
document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        if (targetId) {
            document.getElementById(targetId).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
