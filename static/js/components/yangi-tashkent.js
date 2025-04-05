// Yangi Tashkent Showcase Gallery
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('#yangiTashkentGallery .gallery-item');
    const modal = document.getElementById('yangiTashkentModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (!galleryItems.length || !modal) return;
    
    let currentImageIndex = 0;
    const totalImages = galleryItems.length;
    
    // Open modal when clicking on a gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openModal(item);
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentImageIndex = index;
                openModal(item);
            }
        });
    });
    
    // Function to open the modal with the clicked image
    function openModal(item) {
        const imageSrc = item.getAttribute('data-image');
        const caption = item.getAttribute('data-caption');
        
        modalImage.src = imageSrc;
        modalCaption.textContent = caption;
        modal.classList.add('active');
        
        // Disable scrolling on body when modal is open
        document.body.style.overflow = 'hidden';
        
        // Set focus to the modal close button for keyboard accessibility
        setTimeout(() => {
            modalClose.focus();
        }, 100);
        
        updateNavButtons();
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Return focus to the gallery item
        galleryItems[currentImageIndex].focus();
    }
    
    // Navigation functions
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateModalImage();
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateModalImage();
    }
    
    function updateModalImage() {
        const currentItem = galleryItems[currentImageIndex];
        const imageSrc = currentItem.getAttribute('data-image');
        const caption = currentItem.getAttribute('data-caption');
        
        // Add a fade-out/fade-in effect
        modalImage.style.opacity = '0';
        modalCaption.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = imageSrc;
            modalCaption.textContent = caption;
            modalImage.style.opacity = '1';
            modalCaption.style.opacity = '1';
        }, 300);
        
        updateNavButtons();
    }
    
    // Update navigation buttons (disable at first/last image if needed)
    function updateNavButtons() {
        // For a circular navigation, no need to disable buttons
        // But we could implement it if needed
    }
    
    // Event listeners for modal controls
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', prevImage);
    modalNext.addEventListener('click', nextImage);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
});
