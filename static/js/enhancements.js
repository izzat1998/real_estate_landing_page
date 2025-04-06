document.addEventListener('DOMContentLoaded', function() {
    // Initialize sticky navigation
    initStickyNav();
    
    // Initialize back to top button
    initBackToTop();
    
    
    // Initialize interactive map
    initInteractiveMap();
    
    // Initialize contact floating button
    initContactFloat();
    
    // Add accessibility features
    enhanceAccessibility();
    
    // Initialize enhanced sliders
    enhanceSliders();
});

// Sticky Navigation
function initStickyNav() {
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Add sticky-nav class to header
    header.classList.add('sticky-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        // Make navbar transparent at top
        if (scrollTop < 50) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Back to Top Button
function initBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Language Toggle
function initLanguageToggle() {
    // Create language toggle
    const languageToggle = document.createElement('div');
    languageToggle.className = 'language-toggle';
    languageToggle.innerHTML = `
        <button class="active" data-lang="ru">RU</button>
        <button data-lang="en">EN</button>
    `;
    document.body.appendChild(languageToggle);
    
    // Handle language switching
    const langButtons = languageToggle.querySelectorAll('button');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would implement actual language switching
            // For now, we'll just show an alert
            const lang = this.getAttribute('data-lang');
            console.log(`Switching to ${lang} language`);
            
            // In a real implementation, you would load language files
            // and replace text content throughout the site
        });
    });
}

// Interactive Map
function initInteractiveMap() {
    // Find map container
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Add interactive-map class
    mapContainer.classList.add('interactive-map');
    
    // Create map markers
    const markers = [
        { top: '40%', left: '50%', label: 'YANGI BOZOR RESIDENCE' },
        { top: '35%', left: '60%', label: 'Торговый центр' },
        { top: '45%', left: '30%', label: 'Школа' },
        { top: '30%', left: '40%', label: 'Парк' }
    ];
    
    markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = 'map-marker';
        markerElement.style.top = marker.top;
        markerElement.style.left = marker.left;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.textContent = marker.label;
        
        mapContainer.appendChild(markerElement);
        mapContainer.appendChild(tooltip);
        
        // Position tooltip near marker
        markerElement.addEventListener('mouseenter', function() {
            const markerRect = markerElement.getBoundingClientRect();
            const mapRect = mapContainer.getBoundingClientRect();
            
            tooltip.style.top = (markerRect.top - mapRect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (markerRect.left - mapRect.left - (tooltip.offsetWidth / 2) + (markerRect.width / 2)) + 'px';
        });
    });
}

// Contact Floating Button
function initContactFloat() {
    // Create contact floating button
    const contactFloat = document.createElement('div');
    contactFloat.className = 'contact-float';
    contactFloat.innerHTML = `
        <i class="fas fa-comments"></i>
        <div class="contact-options">
            <a href="tel:+998712345678" class="contact-option">
                <i class="fas fa-phone"></i>
                <span>+998 71 234 5678</span>
            </a>
            <a href="https://t.me/yangibozor_residence_uylari" class="contact-option">
                <i class="fab fa-telegram"></i>
                <span>Telegram</span>
            </a>
            <a href="mailto:info@yangibozor.uz" class="contact-option">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
            </a>
        </div>
    `;
    document.body.appendChild(contactFloat);
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Перейти к содержимому';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add alt text to images that don't have it
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        // Extract alt text from parent or sibling elements if possible
        const parentText = img.parentElement.textContent.trim();
        if (parentText) {
            img.alt = parentText.substring(0, 50);
        } else {
            img.alt = 'Изображение жилого комплекса';
        }
    });
    
    // Make sure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
        if (!el.getAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
    });
}

// Enhanced Sliders
function enhanceSliders() {
    // Enhance hero slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    
    if (heroSlides.length > 0) {
        // Add swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        const hero = document.querySelector('.hero');
        hero.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        hero.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const currentIndex = Array.from(heroSlides).findIndex(slide => slide.classList.contains('active'));
            let newIndex;
            
            if (touchEndX < touchStartX - 50) {
                // Swipe left - next slide
                newIndex = (currentIndex + 1) % heroSlides.length;
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right - previous slide
                newIndex = (currentIndex - 1 + heroSlides.length) % heroSlides.length;
            } else {
                return;
            }
            
            // Update active slide
            heroSlides.forEach(slide => slide.classList.remove('active', 'next'));
            slideDots.forEach(dot => dot.classList.remove('active'));
            
            heroSlides[newIndex].classList.add('active');
            slideDots[newIndex].classList.add('active');
            
            // Set next slide
            const nextIndex = (newIndex + 1) % heroSlides.length;
            heroSlides[nextIndex].classList.add('next');
        }
        
        // Make dots clickable
        slideDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                heroSlides.forEach(slide => slide.classList.remove('active', 'next'));
                slideDots.forEach(dot => dot.classList.remove('active'));
                
                heroSlides[index].classList.add('active');
                dot.classList.add('active');
                
                // Set next slide
                const nextIndex = (index + 1) % heroSlides.length;
                heroSlides[nextIndex].classList.add('next');
            });
        });
    }
    
    // Enhance floor plan options
    const planOptions = document.querySelectorAll('.plan-option');
    if (planOptions.length > 0) {
        planOptions.forEach(option => {
            // Add hover effect
            option.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            });
            
            option.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
}
