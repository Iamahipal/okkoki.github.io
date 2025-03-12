document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const appListView = document.getElementById('appListView');
    const gridContainer = document.querySelector('.grid-container');
    
    // Flag to track if initial animation has played
    let initialAnimationPlayed = false;
    
    // Animate tiles with standard Windows animation - only on first load
    function animateTiles() {
        if (!initialAnimationPlayed) {
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
            initialAnimationPlayed = true;
        }
    }
    
    // Run animation on first load
    animateTiles();
    
    // View switching functions
    function switchToTileView() {
        appListView.classList.remove('active');
        gridContainer.style.display = 'grid';
    }
    
    function switchToListView() {
        appListView.classList.add('active');
        gridContainer.style.display = 'none';
    }
    
    // For demo purposes, make the tile view active initially
    switchToTileView();
    
    // Add search functionality
    const searchInput = document.getElementById('searchApps');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const appItems = document.querySelectorAll('.app-item');
        
        appItems.forEach(item => {
            const appName = item.querySelector('.app-name').textContent.toLowerCase();
            if (appName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide/show section headers based on visible apps
        const sections = document.querySelectorAll('.letter-header');
        sections.forEach(section => {
            const sectionId = section.id;
            const sectionApps = document.querySelectorAll(`#${sectionId} + .app-item`);
            let hasVisibleApps = false;
            
            sectionApps.forEach(app => {
                if (app.style.display !== 'none') {
                    hasVisibleApps = true;
                }
            });
            
            section.style.display = hasVisibleApps ? 'inline-block' : 'none';
        });
    });
    
    // Search icon click behavior
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', () => {
        if (searchInput.style.display === 'none') {
            searchInput.style.display = 'block';
            searchInput.focus();
        } else {
            searchInput.style.display = 'none';
            searchInput.value = '';
            // Reset search results
            const appItems = document.querySelectorAll('.app-item');
            appItems.forEach(item => {
                item.style.display = 'flex';
            });
            
            // Show all section headers
            const sections = document.querySelectorAll('.letter-header');
            sections.forEach(section => {
                section.style.display = 'inline-block';
            });
        }
    });
    
    // Add swipe functionality
// Update these variables at the top where touchStartX and touchEndX are defined
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Update these event listeners
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

// Update the handleSwipe function
function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance
    const touchDiffX = touchEndX - touchStartX;
    const touchDiffY = Math.abs(touchEndY - touchStartY);
    
    // For horizontal swipes, vertical movement should be minimal
    const isHorizontalSwipe = touchDiffY < 30; // Tolerance for vertical movement
    
    if (touchDiffX < -swipeThreshold) {
        // Swipe left: always show app list
        switchToListView();
    }
    
    if (touchDiffX > swipeThreshold && isHorizontalSwipe) {
        // Swipe right: show tiles only if horizontal
        switchToTileView();
    }
}
    
    // Add click event handler for letter headers (since we removed the jump list)
    const letterHeaders = document.querySelectorAll('.letter-header');
    letterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Scroll to the section when clicked
            header.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
