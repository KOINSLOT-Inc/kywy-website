// Desktop Selection and Icon Dragging functionality
(function() {
    let isSelecting = false;
    let startX, startY;
    let selectionBox = document.getElementById('selection-box');
    let desktopIcons = document.querySelectorAll('.desktop-icon');
    let selectedIcons = new Set();

    // Make desktop icons draggable
    function makeIconsDraggable() {
        desktopIcons.forEach(icon => {
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };
            let clickTimer = null;
            let clickCount = 0;

            icon.addEventListener('mousedown', function(e) {
                // Prevent default to avoid text selection
                e.preventDefault();
                
                // Check if it's a right click
                if (e.button !== 0) return;

                // Calculate offset from mouse to icon top-left
                const rect = icon.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                // Start dragging immediately on mousedown
                isDragging = false;
                let hasMoved = false;

                function onMouseMove(e) {
                    if (!hasMoved) {
                        // First movement - start dragging
                        hasMoved = true;
                        isDragging = true;
                        icon.style.position = 'fixed';
                        icon.style.zIndex = '1000';
                        document.body.style.userSelect = 'none';
                        
                        // Clear any pending click timers since we're dragging
                        if (clickTimer) {
                            clearTimeout(clickTimer);
                            clickTimer = null;
                            clickCount = 0;
                        }
                    }
                    
                    if (isDragging) {
                        icon.style.left = (e.clientX - dragOffset.x) + 'px';
                        icon.style.top = (e.clientY - dragOffset.y) + 'px';
                    }
                }

                function onMouseUp(e) {
                    if (isDragging) {
                        isDragging = false;
                        document.body.style.userSelect = '';
                        icon.style.zIndex = '';
                    } else if (!hasMoved) {
                        // This was a click (no movement)
                        handleIconClick(icon, e);
                    }
                    
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            // Handle single click selection and double-click opening
            function handleIconClick(icon, e) {
                clickCount++;
                
                if (clickCount === 1) {
                    // First click - select the icon
                    clearSelection();
                    icon.classList.add('selected');
                    selectedIcons.add(icon);
                    
                    // Wait for potential second click
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                        clickTimer = null;
                        // Single click completed - icon is now selected
                    }, 300);
                    
                } else if (clickCount === 2) {
                    // Double click - open the icon
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    clickCount = 0;
                    
                    // Get URL from data-url attribute and open it
                    const url = icon.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
            }
        });
    }

    // Desktop selection functionality
    function initDesktopSelection() {
        document.addEventListener('mousedown', function(e) {
            // Only start selection on empty desktop area (not on windows or icons)
            const target = e.target;
            if (target.closest('.window') || target.closest('.desktop-icon') || target.closest('#taskbar')) {
                return;
            }

            // Clear previous selection
            clearSelection();

            isSelecting = true;
            startX = e.clientX;
            startY = e.clientY;

            selectionBox.style.left = startX + 'px';
            selectionBox.style.top = startY + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isSelecting) return;

            const currentX = e.clientX;
            const currentY = e.clientY;

            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);

            selectionBox.style.left = left + 'px';
            selectionBox.style.top = top + 'px';
            selectionBox.style.width = width + 'px';
            selectionBox.style.height = height + 'px';

            // Check which icons are within selection
            updateIconSelection(left, top, width, height);
        });

        document.addEventListener('mouseup', function(e) {
            if (isSelecting) {
                isSelecting = false;
                selectionBox.style.display = 'none';
            }
        });
    }

    function updateIconSelection(selectionLeft, selectionTop, selectionWidth, selectionHeight) {
        desktopIcons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            
            // Check if icon intersects with selection box
            const intersects = !(rect.right < selectionLeft || 
                               rect.left > selectionLeft + selectionWidth || 
                               rect.bottom < selectionTop || 
                               rect.top > selectionTop + selectionHeight);

            if (intersects) {
                icon.classList.add('selected');
                selectedIcons.add(icon);
            } else {
                icon.classList.remove('selected');
                selectedIcons.delete(icon);
            }
        });
    }

    function clearSelection() {
        desktopIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
        selectedIcons.clear();
    }

    // Click on empty desktop to clear selection
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (!target.closest('.window') && !target.closest('.desktop-icon') && !target.closest('#taskbar')) {
            clearSelection();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            makeIconsDraggable();
            initDesktopSelection();
        });
    } else {
        makeIconsDraggable();
        initDesktopSelection();
    }
})();
