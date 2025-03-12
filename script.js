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
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
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

    // NEW CODE FOR TILE RESIZING FUNCTIONALITY
    // ------------------------------------------

    // Add resize functionality
    const tileResize = {
        activeTile: null,
        longPressTimer: null,
        isResizing: false,
        sizes: ['small', 'medium', 'regular', 'large'],
        
        // Initialize resize functionality
        init() {
            this.loadSavedTileSizes();
            this.addEventListeners();
        },
        
        // Load saved tile sizes from localStorage
        loadSavedTileSizes() {
            try {
                const savedTiles = JSON.parse(localStorage.getItem('tileSizes'));
                if (savedTiles) {
                    Object.keys(savedTiles).forEach(tileId => {
                        const tile = document.getElementById(tileId);
                        if (tile) {
                            this.setTileSize(tile, savedTiles[tileId]);
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading saved tile sizes:', error);
            }
        },
        
        // Add IDs to tiles if they don't have one
        addTileIds() {
            const tiles = document.querySelectorAll('.tile');
            tiles.forEach((tile, index) => {
                if (!tile.id) {
                    // Create ID based on tile content
                    const iconElement = tile.querySelector('i');
                    const spanElement = tile.querySelector('span');
                    let tileId = '';
                    
                    if (spanElement) {
                        tileId = `tile-${spanElement.textContent.toLowerCase().replace(/\s+/g, '-')}`;
                    } else if (iconElement) {
                        tileId = `tile-${iconElement.className.split(' ').pop()}`;
                    } else {
                        tileId = `tile-${index}`;
                    }
                    
                    tile.id = tileId;
                }
            });
        },
        
        // Add event listeners for tile resizing
        addEventListeners() {
            // First, add IDs to all tiles
            this.addTileIds();
            
            // Add resize buttons to tiles
            const tiles = document.querySelectorAll('.tile');
            tiles.forEach(tile => {
                // Skip tiles within small-grid as they're meant to be small
                if (tile.closest('.small-grid')) return;
                
                // Add resize button
                const resizeBtn = document.createElement('div');
                resizeBtn.className = 'resize-btn';
                resizeBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                tile.appendChild(resizeBtn);
                
                // Add long press event listener
                tile.addEventListener('mousedown', this.handleTileMouseDown.bind(this, tile));
                tile.addEventListener('touchstart', this.handleTileTouchStart.bind(this, tile));
                
                // Add right-click event
                tile.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.activateTileSelection(tile);
                });
                
                // Add click event for resize button
                resizeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.cycleSize(tile);
                });
            });
            
            // Add document event listeners to cancel selection
            document.addEventListener('click', (e) => {
                if (this.isResizing && !e.target.closest('.resize-btn') && !e.target.closest('.selected-tile')) {
                    this.deactivateTileSelection();
                }
            });
        },
        
        // Handle mouse down for long press
        handleTileMouseDown(tile, e) {
            if (e.button !== 0) return; // Only for left mouse button
            
            this.longPressTimer = setTimeout(() => {
                this.activateTileSelection(tile);
            }, 2000); // 2 seconds for long press
            
            document.addEventListener('mouseup', () => {
                clearTimeout(this.longPressTimer);
            }, { once: true });
        },
        
        // Handle touch start for long press
        handleTileTouchStart(tile, e) {
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;
            
            this.longPressTimer = setTimeout(() => {
                this.activateTileSelection(tile);
            }, 2000); // 2 seconds for long press
            
            const handleTouchEnd = () => {
                clearTimeout(this.longPressTimer);
                document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchend', handleTouchEnd);
        },
        
        // Activate tile selection mode
        activateTileSelection(tile) {
            // Deactivate any previously selected tile
            this.deactivateTileSelection();
            
            // Mark the selected tile
            this.activeTile = tile;
            this.isResizing = true;
            tile.classList.add('selected-tile');
            
            // Show resize button
            const resizeBtn = tile.querySelector('.resize-btn');
            if (resizeBtn) {
                resizeBtn.classList.add('visible');
            }
        },
        
        // Deactivate tile selection mode
        deactivateTileSelection() {
            if (this.activeTile) {
                this.activeTile.classList.remove('selected-tile');
                const resizeBtn = this.activeTile.querySelector('.resize-btn');
                if (resizeBtn) {
                    resizeBtn.classList.remove('visible');
                }
                this.activeTile = null;
                this.isResizing = false;
            }
        },
        
        // Cycle through tile sizes
        cycleSize(tile) {
            // Get current size
            let currentSize = 'regular';
            if (tile.classList.contains('small')) currentSize = 'small';
            if (tile.classList.contains('medium')) currentSize = 'medium';
            if (tile.classList.contains('large')) currentSize = 'large';
            
            // Get next size
            const currentIndex = this.sizes.indexOf(currentSize);
            const nextIndex = (currentIndex + 1) % this.sizes.length;
            const nextSize = this.sizes[nextIndex];
            
            // Apply new size
            this.setTileSize(tile, nextSize);
            
            // Save the new size
            this.saveTileSize(tile.id, nextSize);
        },
        
        // Set tile size
        setTileSize(tile, size) {
            // Remove all size classes
            tile.classList.remove('small', 'medium', 'regular', 'large');
            
            // Add the new size class
            if (size !== 'regular') {
                tile.classList.add(size);
            }
            
            // Apply grid styling based on size
            switch (size) {
                case 'small':
                    tile.style.gridColumn = 'span 1';
                    tile.style.gridRow = 'span 1';
                    break;
                case 'medium':
                    tile.style.gridColumn = 'span 2';
                    tile.style.gridRow = 'span 1';
                    break;
                case 'regular':
                    tile.style.gridColumn = 'span 2';
                    tile.style.gridRow = 'span 2';
                    break;
                case 'large':
                    tile.style.gridColumn = 'span 3';
                    tile.style.gridRow = 'span 2';
                    break;
            }
        },
        
        // Save tile size to localStorage
        saveTileSize(tileId, size) {
            try {
                let savedTiles = JSON.parse(localStorage.getItem('tileSizes')) || {};
                savedTiles[tileId] = size;
                localStorage.setItem('tileSizes', JSON.stringify(savedTiles));
            } catch (error) {
                console.error('Error saving tile size:', error);
            }
        }
    };
    
    // Initialize tile resize functionality
    tileResize.init();
});
