document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const appListView = document.getElementById('appListView');
    const showTilesBtn = document.getElementById('showTiles');
    const showListBtn = document.getElementById('showList');
    const gridContainer = document.querySelector('.grid-container');
    
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
    
    // Toggle between views
    showTilesBtn.addEventListener('click', () => {
        switchToTileView();
    });
    
    showListBtn.addEventListener('click', () => {
        switchToListView();
    });
    
    function switchToTileView() {
        appListView.classList.remove('active');
        gridContainer.style.display = 'grid';
        showListBtn.classList.remove('active');
        showTilesBtn.classList.add('active');
        
        // Re-trigger the tile animations
        tiles.forEach((tile, index) => {
            tile.style.opacity = "0";
            tile.style.transform = "scale(0.8)";
            setTimeout(() => {
                tile.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
                tile.style.opacity = "1";
                tile.style.transform = "scale(1)";
            }, index * 100);
        });
    }
    
    function switchToListView() {
        appListView.classList.add('active');
        gridContainer.style.display = 'none';
        showTilesBtn.classList.remove('active');
        showListBtn.classList.add('active');
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
        }
    });
    
    // Add swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left: show app list
            switchToListView();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right: show tiles
            switchToTileView();
        }
    }
});
