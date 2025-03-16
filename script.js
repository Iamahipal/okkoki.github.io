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
    
    // Add swipe functionality with improved horizontal detection
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
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
        const angleThreshold = 30; // Maximum angle in degrees for horizontal swipe
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Calculate the angle of the swipe (in degrees)
        const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
        const isHorizontalSwipe = angle <= angleThreshold || angle >= (180 - angleThreshold);
        
        if (deltaX < -swipeThreshold && isHorizontalSwipe) {
            // Swipe left: show app list
            switchToListView();
        }
        
        if (deltaX > swipeThreshold && isHorizontalSwipe) {
            // Swipe right: show tiles
            switchToTileView();
        }
    }

    // Tile Selection & Resizing Implementation
    let selectedTile = null;
    let selectionOverlay = document.createElement('div');
    selectionOverlay.className = 'selection-overlay';
    document.body.appendChild(selectionOverlay);

    // Track if we're in selection mode
    let isSelectionMode = false;

    // Add long press detection for all tiles
    function addLongPressToTiles() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            let pressTimer;
            let startX, startY;
            
            // For touch devices
            tile.addEventListener('touchstart', e => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                
                pressTimer = setTimeout(() => {
                    enterSelectionMode(tile);
                }, 1000); // 1000ms (1 second) long press time as requested
            });
            
            tile.addEventListener('touchmove', e => {
                // Cancel if moved too far
                const moveX = e.touches[0].clientX;
                const moveY = e.touches[0].clientY;
                
                if (Math.abs(moveX - startX) > 10 || Math.abs(moveY - startY) > 10) {
                    clearTimeout(pressTimer);
                }
            });
            
            tile.addEventListener('touchend', e => {
                clearTimeout(pressTimer);
            });
            
            // For mouse users
            tile.addEventListener('mousedown', e => {
                startX = e.clientX;
                startY = e.clientY;
                
                pressTimer = setTimeout(() => {
                    enterSelectionMode(tile);
                }, 1000);
            });
            
            tile.addEventListener('mousemove', e => {
                // Cancel if moved too far
                if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
                    clearTimeout(pressTimer);
                }
            });
            
            tile.addEventListener('mouseup', e => {
                clearTimeout(pressTimer);
            });
            
            tile.addEventListener('mouseleave', e => {
                clearTimeout(pressTimer);
            });
        });
    }

    // Enter selection mode
    function enterSelectionMode(tile) {
        if (isSelectionMode) return;
        
        // Provide haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        isSelectionMode = true;
        selectedTile = tile;
        
        // Add selected class to tile
        tile.classList.add('selected');
        
        // Create floating effect on other tiles
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(t => {
            if (t !== tile) {
                t.classList.add('floating');
            }
        });
        
        // Show selection overlay
        selectionOverlay.classList.add('active');
        
        // Add action buttons
        addActionButtons(tile);
    }

    // Add action buttons to the selected tile - Updated for Windows Phone style
    function addActionButtons(tile) {
        const actionContainer = document.createElement('div');
        actionContainer.className = 'tile-actions';
        
        // Unpin button - Top left
        const unpinBtn = document.createElement('div');
        unpinBtn.className = 'wp-action-btn unpin-btn';
        unpinBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        unpinBtn.addEventListener('click', () => unpinTile(tile));
        
        // Resize button - Bottom right
        const resizeBtn = document.createElement('div');
        resizeBtn.className = 'wp-action-btn resize-btn';
        resizeBtn.innerHTML = '<i class="fa-solid fa-arrow-down-right"></i>';
        resizeBtn.addEventListener('click', () => resizeTile(tile));
        
        actionContainer.appendChild(unpinBtn);
        actionContainer.appendChild(resizeBtn);
        tile.appendChild(actionContainer);
    }

    // Exit selection mode
    function exitSelectionMode() {
        if (!isSelectionMode) return;
        
        isSelectionMode = false;
        
        // Remove selected class
        if (selectedTile) {
            selectedTile.classList.remove('selected');
            
            // Remove action buttons
            const actions = selectedTile.querySelector('.tile-actions');
            if (actions) {
                selectedTile.removeChild(actions);
            }
        }
        
        // Remove floating effect from all tiles
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(tile => {
            tile.classList.remove('floating');
        });
        
        // Hide selection overlay
        selectionOverlay.classList.remove('active');
        
        selectedTile = null;
    }

    // Unpin a tile
    function unpinTile(tile) {
        // Add removing animation
        tile.classList.add('removing');
        
        // Store tile data for potentially pinning later
        const tileName = tile.querySelector('span')?.textContent || '';
        const tileIcon = tile.querySelector('i')?.className || '';
        
        setTimeout(() => {
            // Remove the tile from the grid
            if (tile.parentElement.classList.contains('small-grid')) {
                const smallGrid = tile.parentElement;
                smallGrid.removeChild(tile);
                
                // If small-grid is now empty, remove it
                if (smallGrid.children.length === 0) {
                    gridContainer.removeChild(smallGrid);
                }
            } else {
                gridContainer.removeChild(tile);
            }
            
            // Exit selection mode
            exitSelectionMode();
            
            // Rearrange the grid
            rearrangeGrid();
        }, 300);
    }

    // Cycle through tile sizes - Fixed small tile implementation
    function resizeTile(tile) {
        // Add resizing class for smooth transition
        tile.classList.add('resizing');
        
        // Determine current size and cycle to next size
        if (tile.classList.contains('small')) {
            // Small -> Regular
            tile.classList.remove('small');
            
            // Add back the text if it was hidden
            const tileName = tile.getAttribute('data-name');
            if (tileName) {
                const tileContent = tile.querySelector('.tile-content');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = tileName;
                tileContent.appendChild(nameSpan);
            }
            
            // If it's in a small-grid, move it out
            if (tile.parentElement.classList.contains('small-grid')) {
                const smallGrid = tile.parentElement;
                const gridPos = Array.from(gridContainer.children).indexOf(smallGrid);
                
                gridContainer.insertBefore(tile, gridContainer.children[gridPos + 1]);
            }
        } else if (!tile.classList.contains('medium') && !tile.classList.contains('large')) {
            // Regular -> Medium
            tile.classList.add('medium');
        } else if (tile.classList.contains('medium')) {
            // Medium -> Large
            tile.classList.remove('medium');
            tile.classList.add('large');
        } else if (tile.classList.contains('large')) {
            // Large -> Small
            tile.classList.remove('large');
            
            // Store the tile name before removing it for small size
            const nameSpan = tile.querySelector('span');
            if (nameSpan) {
                tile.setAttribute('data-name', nameSpan.textContent);
                nameSpan.remove();
            }
            
            // Find existing small-grid with space or create a new one
            let smallGrid = Array.from(gridContainer.children).find(el => 
                el.classList.contains('small-grid') && el.children.length < 4
            );
            
            if (!smallGrid) {
                smallGrid = document.createElement('div');
                smallGrid.className = 'small-grid';
                gridContainer.appendChild(smallGrid);
            }
            
            // Add small class and move to small-grid
            tile.classList.add('small');
            smallGrid.appendChild(tile);
        }
        
        // Rearrange the grid after resizing
        setTimeout(() => {
            rearrangeGrid();
            
            // Remove resizing class after transition
            setTimeout(() => {
                tile.classList.remove('resizing');
            }, 300);
            
            // Exit selection mode after resizing
            exitSelectionMode();
        }, 300);
    }

    // Rearrange the grid to maintain layout
    function rearrangeGrid() {
        // Find all small-grids with fewer than 2 tiles and redistribute
        const smallGrids = document.querySelectorAll('.small-grid');
        smallGrids.forEach(grid => {
            if (grid.children.length < 2) {
                // Move remaining tiles out of this small-grid
                while (grid.firstChild) {
                    const tile = grid.firstChild;
                    
                    // Restore name if it was stored
                    const tileName = tile.getAttribute('data-name');
                    if (tileName && !tile.querySelector('span')) {
                        const tileContent = tile.querySelector('.tile-content');
                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = tileName;
                        tileContent.appendChild(nameSpan);
                    }
                    
                    tile.classList.remove('small');
                    gridContainer.appendChild(tile);
                }
                
                // Remove the empty small-grid
                gridContainer.removeChild(grid);
            }
        });
        
        // Consolidate small-grids if there are multiple with space
        const smallGridsArray = Array.from(document.querySelectorAll('.small-grid'));
        if (smallGridsArray.length > 1) {
            for (let i = 1; i < smallGridsArray.length; i++) {
                const currentGrid = smallGridsArray[i];
                const previousGrid = smallGridsArray[i-1];
                
                // If both grids together have 4 or fewer tiles, merge them
                if (currentGrid.children.length + previousGrid.children.length <= 4) {
                    while (currentGrid.firstChild) {
                        previousGrid.appendChild(currentGrid.firstChild);
                    }
                    
                    // Remove the now empty grid
                    gridContainer.removeChild(currentGrid);
                }
            }
        }
    }

    // Implement pin functionality in app list
    function addPinFunctionalityToAppList() {
        const appItems = document.querySelectorAll('.app-item');
        
        appItems.forEach(item => {
            // Add long press functionality to app items
            let pressTimer;
            let startX, startY;
            
            item.addEventListener('touchstart', e => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                
                pressTimer = setTimeout(() => {
                    showPinOptions(item);
                }, 1000);
            });
            
            item.addEventListener('touchmove', e => {
                const moveX = e.touches[0].clientX;
                const moveY = e.touches[0].clientY;
                
                if (Math.abs(moveX - startX) > 10 || Math.abs(moveY - startY) > 10) {
                    clearTimeout(pressTimer);
                }
            });
            
            item.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });
            
            // Mouse support
            item.addEventListener('mousedown', e => {
                startX = e.clientX;
                startY = e.clientY;
                
                pressTimer = setTimeout(() => {
                    showPinOptions(item);
                }, 1000);
            });
            
            item.addEventListener('mousemove', e => {
                if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
                    clearTimeout(pressTimer);
                }
            });
            
            item.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
            });
            
            item.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
            });
        });
    }

    // Show pin options for app list items - Windows Phone style
    function showPinOptions(appItem) {
        // Provide haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        const appName = appItem.querySelector('.app-name').textContent;
        const appIcon = appItem.querySelector('.app-icon i').className;
        
        // Create pin option directly on the app item
        const pinBtn = document.createElement('div');
        pinBtn.className = 'wp-action-btn pin-btn';
        pinBtn.innerHTML = '<i class="fa-solid fa-thumbtack"></i>';
        
        // Position the pin button
        pinBtn.style.position = 'absolute';
        pinBtn.style.right = '10px';
        
        pinBtn.addEventListener('click', () => {
            pinAppToStart(appName, appIcon);
            appItem.removeChild(pinBtn);
        });
        
        // Add button to app item
        appItem.appendChild(pinBtn);
        
        // Remove button when clicking elsewhere
        const removeButton = (e) => {
            if (!pinBtn.contains(e.target) && e.target !== appItem) {
                if (appItem.contains(pinBtn)) {
                    appItem.removeChild(pinBtn);
                }
                document.removeEventListener('click', removeButton);
            }
        };
        
        // Delay adding event listener to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', removeButton);
        }, 10);
    }

    // Pin app to start screen
    function pinAppToStart(appName, iconClass) {
        // Switch to tile view
        switchToTileView();
        
        // Create new tile
        const newTile = document.createElement('div');
        newTile.className = 'tile';
        
        const tileContent = document.createElement('div');
        tileContent.className = 'tile-content';
        
        // Add icon
        const icon = document.createElement('i');
        icon.className = iconClass;
        
        // Add name
        const name = document.createElement('span');
        name.textContent = appName;
        
        tileContent.appendChild(icon);
        tileContent.appendChild(name);
        newTile.appendChild(tileContent);
        
        // Add tile to grid
        gridContainer.appendChild(newTile);
        
        // Add selection functionality to new tile
        addLongPressToTiles();
        
        // Add appear animation
        newTile.style.opacity = '0';
        newTile.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            newTile.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            newTile.style.opacity = '1';
            newTile.style.transform = 'scale(1)';
        }, 10);
    }

    // Add click event to selection overlay to exit selection mode
    selectionOverlay.addEventListener('click', exitSelectionMode);

    // Initialize long press detection for tiles
    addLongPressToTiles();
    
    // Initialize pin functionality for app list
    addPinFunctionalityToAppList();

    // Add a mutation observer to watch for new tiles
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Re-add long press detection for new tiles
                addLongPressToTiles();
            }
        });
    });

    observer.observe(gridContainer, { childList: true, subtree: true });
    
    // Add click event handler for letter headers
    const letterHeaders = document.querySelectorAll('.letter-header');
    letterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Scroll to the section when clicked
            header.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
