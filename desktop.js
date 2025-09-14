// Desktop Selection and Icon Click/DblClick functionality
(function() {
    let isSelecting = false;
    let startX = 0, startY = 0;
    const selectionBox = document.getElementById('selection-box');
    let desktopIcons = [];
    const selectedIcons = new Set();

    function refreshIcons() {
        desktopIcons = Array.from(document.querySelectorAll('.desktop-icon'));
    }

    function updateIconSelection(selectionLeft, selectionTop, selectionWidth, selectionHeight) {
        desktopIcons.forEach(function(icon) {
            const rect = icon.getBoundingClientRect();
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
        desktopIcons.forEach(function(icon) { icon.classList.remove('selected'); });
        selectedIcons.clear();
    }

    function initDesktopSelection() {
        refreshIcons();

        // Handle drag selection box
        document.addEventListener('mousedown', function(e) {
            // Only left button and not clicking inside a window or on an icon
            if (e.button !== 0) return;
            if (e.target.closest('.window') || e.target.closest('.desktop-icon')) return;

            isSelecting = true;
            startX = e.clientX; startY = e.clientY;
            if (selectionBox) {
                selectionBox.style.left = startX + 'px';
                selectionBox.style.top = startY + 'px';
                selectionBox.style.width = '0px';
                selectionBox.style.height = '0px';
                selectionBox.style.display = 'block';
            }
            clearSelection();
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isSelecting || !selectionBox) return;
            const currentX = e.clientX, currentY = e.clientY;
            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            selectionBox.style.left = left + 'px';
            selectionBox.style.top = top + 'px';
            selectionBox.style.width = width + 'px';
            selectionBox.style.height = height + 'px';
            updateIconSelection(left, top, width, height);
        });

        document.addEventListener('mouseup', function(e) {
            if (isSelecting) {
                isSelecting = false;
                if (selectionBox) selectionBox.style.display = 'none';
            }
        });

        // Click and double-click handling for icons
        desktopIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                if (e.button !== 0) return;
                clearSelection();
                icon.classList.add('selected');
                selectedIcons.add(icon);
            });

            icon.addEventListener('dblclick', function(e) {
                if (e.button !== 0) return;
                const url = icon.getAttribute('data-url');
                if (url) window.open(url, '_blank');
            });
        });
    }

    // Clear selection when clicking empty desktop area
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (!target.closest('.window') && !target.closest('.desktop-icon') && !target.closest('#taskbar')) {
            clearSelection();
        }
    });

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initDesktopSelection();
        });
    } else {
        initDesktopSelection();
    }

})();
