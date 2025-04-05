// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsContainer = document.getElementById('testimonialsSlider');
    const testimonialCards = document.querySelectorAll('#testimonialsSlider .testimonial-card');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonialsContainer || testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    let cardWidth = testimonialCards[0].offsetWidth + parseInt(window.getComputedStyle(testimonialCards[0]).marginRight);
    let autoSlideInterval;
    
    // Initialize slider
    updateSliderPosition();
    startAutoSlide();
    
    // Reset card width on window resize
    window.addEventListener('resize', function() {
        cardWidth = testimonialCards[0].offsetWidth + parseInt(window.getComputedStyle(testimonialCards[0]).marginRight);
        updateSliderPosition();
    });
    
    // Navigation buttons
    prevButton.addEventListener('click', function() {
        goToSlide(currentIndex - 1);
    });
    
    nextButton.addEventListener('click', function() {
        goToSlide(currentIndex + 1);
    });
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Mouse events to pause auto slide
    testimonialsContainer.addEventListener('mouseenter', function() {
        clearInterval(autoSlideInterval);
    });
    
    testimonialsContainer.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialsContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, { passive: true });
    
    testimonialsContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - go to previous
            goToSlide(currentIndex - 1);
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - go to next
            goToSlide(currentIndex + 1);
        }
    }
    
    // Function to update slider position
    function updateSliderPosition() {
        // Calculate how many cards are visible based on container width
        const containerWidth = testimonialsContainer.offsetWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth);
        
        // Don't allow currentIndex to exceed the maximum
        const maxIndex = testimonialCards.length - visibleCards;
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        // Update position
        testimonialsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        testimonialsContainer.style.transition = 'transform 0.5s ease';
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update buttons state
        if (currentIndex === 0) {
            prevButton.style.opacity = '0.5';
        } else {
            prevButton.style.opacity = '1';
        }
        
        if (currentIndex >= maxIndex) {
            nextButton.style.opacity = '0.5';
        } else {
            nextButton.style.opacity = '1';
        }
    }
    
    // Function to go to a specific slide
    function goToSlide(index) {
        // Calculate how many cards are visible
        const containerWidth = testimonialsContainer.offsetWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth);
        
        // Don't allow index to exceed boundaries
        if (index < 0) {
            index = 0;
        } else if (index > testimonialCards.length - visibleCards) {
            index = testimonialCards.length - visibleCards;
        }
        
        currentIndex = index;
        updateSliderPosition();
    }
    
    // Function to start auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            // Calculate how many cards are visible
            const containerWidth = testimonialsContainer.offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            
            // If at the end, go back to start
            if (currentIndex >= testimonialCards.length - visibleCards) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            
            updateSliderPosition();
        }, 5000);
    }
    
    // Create placeholder image elements for badges if not available
    const badges = document.querySelectorAll('.trust-badge img');
    badges.forEach(badge => {
        if (badge.getAttribute('src').includes('badges/') && !imageExists(badge.getAttribute('src'))) {
            createPlaceholderBadge(badge);
        }
    });
    
    function imageExists(url) {
        const http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
            http.send();
            return http.status !== 404;
        } catch(e) {
            return false;
        }
    }
    
    function createPlaceholderBadge(imgElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 80;
        canvas.height = 80;
        
        // Draw badge background
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.arc(40, 40, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw badge icon
        ctx.fillStyle = '#A48444';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Get first letter of alt text for icon
        const altText = imgElement.getAttribute('alt');
        const iconText = altText ? altText.charAt(0).toUpperCase() : 'A';
        ctx.fillText(iconText, 40, 40);
        
        // Replace the original image src with data URL
        imgElement.src = canvas.toDataURL('image/png');
    }
});
