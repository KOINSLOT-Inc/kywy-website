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

                // Desktop icons are no longer draggable. Only selection and double-click opening are enabled.
                function makeIconsDraggable() {
                    desktopIcons.forEach(icon => {
                        let clickTimer = null;
                        let clickCount = 0;

                        // Handle single click selection and double-click opening
                        // Single click to select
                        icon.addEventListener('click', function(e) {
                            if (e.button !== 0) return;
                            clearSelection();
                            icon.classList.add('selected');
                            selectedIcons.add(icon);
                        });

                        // Double click to open
                        icon.addEventListener('dblclick', function(e) {
                            if (e.button !== 0) return;
                            const url = icon.getAttribute('data-url');
                            if (url) {
                                window.open(url, '_blank');
                            }
                        });

                        function handleIconClick(icon, e) {
                            clickCount++;
                            if (clickCount === 1) {
                                clearSelection();
                                icon.classList.add('selected');
                                selectedIcons.add(icon);
                                clickTimer = setTimeout(() => {
                                    clickCount = 0;
                                    clickTimer = null;
                                }, 300);
                            } else if (clickCount === 2) {
                                clearTimeout(clickTimer);
                                clickTimer = null;
                                clickCount = 0;
                                const url = icon.getAttribute('data-url');
                                if (url) {
                                    window.open(url, '_blank');
                                }
                            }
                        }
                    });
                }
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
        desktopIcons.forEach(function(icon) {
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
        desktopIcons.forEach(function(icon) {
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
