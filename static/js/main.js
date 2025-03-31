// Improved hero slider and carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle with improved functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle the menu icon between bars and X
            this.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            }
        });
    }

    // Smooth scrolling with offset for header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Improved header scroll effect with throttling
    const header = document.querySelector('header');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    header.style.opacity = '1';
                } else if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down - slightly hide header
                    header.style.opacity = '0.9';
                    header.style.transform = 'translateY(-10px)';
                } else {
                    // Scrolling up - show header
                    header.style.opacity = '1';
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Hero Slideshow with improved timing
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const hero = document.querySelector('.hero');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const slideInterval = 8000; // Increased to 8 seconds per slide for better viewing
    let slideTimer;
    let isTransitioning = false;
    let isHovered = false;

    function updateSlideClasses() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next');
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index === (currentSlide + 1) % slides.length) {
                slide.classList.add('next');
            }
        });
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        updateSlideClasses();
        dots[currentSlide].classList.add('active');
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1500);
        
        if (!isHovered) {
            resetTimer();
        }
    }

    function nextSlide() {
        if (!isHovered) {
            goToSlide((currentSlide + 1) % slides.length);
        }
    }

    function resetTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    // Pause slider on hover
    hero.addEventListener('mouseenter', () => {
        isHovered = true;
        clearInterval(slideTimer);
    });
    
    hero.addEventListener('mouseleave', () => {
        isHovered = false;
        resetTimer();
    });

    // Parallax effect on mouse move - only enable on desktop
    if (window.innerWidth > 768) {
        hero.addEventListener('mousemove', (e) => {
            if (isTransitioning) return;
            
            const { offsetWidth: width, offsetHeight: height } = hero;
            const { clientX: x, clientY: y } = e;
            
            const moveX = (x - width / 2) * 0.02;
            const moveY = (y - height / 2) * 0.02;

            const activeSlide = document.querySelector('.hero-slide.active');
            const heroContent = document.querySelector('.hero-content');
            
            if (activeSlide && heroContent) {
                activeSlide.style.transform = `translateZ(0) scale(1) translate(${moveX}px, ${moveY}px)`;
                heroContent.style.transform = `translateZ(50px) translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
            }
        });

        hero.addEventListener('mouseleave', () => {
            const activeSlide = document.querySelector('.hero-slide.active');
            const heroContent = document.querySelector('.hero-content');
            
            if (activeSlide && heroContent) {
                activeSlide.style.transform = 'translateZ(0) scale(1)';
                heroContent.style.transform = 'translateZ(50px)';
            }
        });
    }

    // Manual navigation with dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Touch events for mobile with improved swipe detection
    hero.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous slide
                goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
            } else {
                // Swipe left - go to next slide
                goToSlide((currentSlide + 1) % slides.length);
            }
        }
    }

    // Initialize hero slider
    updateSlideClasses();
    resetTimer();
    
    // Infinite Carousel with improved performance
    const infiniteCarousel = document.querySelector('.infinite-carousel');
    if (infiniteCarousel) {
        const slideCards = infiniteCarousel.querySelectorAll('.slide-card');
        let isDown = false;
        let startX;
        let scrollLeft;
        let animationPaused = false;
        
        // Function to update animation duration based on screen size
        function updateCarouselAnimation() {
            // Remove any existing animation
            infiniteCarousel.style.animation = 'none';
            
            // Force reflow
            void infiniteCarousel.offsetWidth;
            
            // Set appropriate duration based on screen width
            let duration = '30s'; // Default for larger screens - slower for better viewing
            
            if (window.innerWidth <= 576) {
                duration = '25s';
            } else if (window.innerWidth <= 768) {
                duration = '28s';
            }
            
            // Apply the animation
            infiniteCarousel.style.animation = `carousel ${duration} linear infinite`;
        }
        
        // Initialize and handle window resize
        updateCarouselAnimation();
        
        // Debounce resize handler for better performance
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateCarouselAnimation();
            }, 250);
        });
        
        // Make slides interactive
        slideCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Remove active class from all slides
                slideCards.forEach(s => s.classList.remove('active'));
                // Add active class to current slide
                card.classList.add('active');
            });
            
            card.addEventListener('mouseleave', () => {
                // Only remove active if we're leaving to something other than another slide
                setTimeout(() => {
                    const activeElements = document.querySelectorAll('.slide-card.active');
                    if (activeElements.length === 1 && activeElements[0] === card) {
                        card.classList.remove('active');
                    }
                }, 100);
            });
            
            // Add click handling for cards (for mobile)
            card.addEventListener('click', () => {
                // Toggle active state on click for mobile
                const wasActive = card.classList.contains('active');
                
                // First remove active from all
                slideCards.forEach(s => s.classList.remove('active'));
                
                // Then set active on the clicked card, unless it was already active
                if (!wasActive) {
                    card.classList.add('active');
                } else {
                    // Resume animation if the active card was clicked again
                    infiniteCarousel.style.animationPlayState = 'running';
                    animationPaused = false;
                }
            });
        });
        
        // Resume animation when mouse leaves the carousel
        infiniteCarousel.addEventListener('mouseleave', () => {
            if (animationPaused) {
                infiniteCarousel.style.animationPlayState = 'running';
                animationPaused = false;
                
                // Remove active class from all slides when animation resumes
                slideCards.forEach(card => card.classList.remove('active'));
            }
        });
        
        // Mobile touch controls for infinite carousel
        infiniteCarousel.addEventListener('touchstart', (e) => {
            isDown = true;
            infiniteCarousel.style.animationPlayState = 'paused';
            animationPaused = true;
            startX = e.touches[0].clientX;
            scrollLeft = infiniteCarousel.scrollLeft;
        }, { passive: true });
        
        infiniteCarousel.addEventListener('touchend', () => {
            isDown = false;
            
            // Wait a bit before resuming animation to allow for tapping
            setTimeout(() => {
                if (!document.querySelector('.slide-card:hover')) {
                    infiniteCarousel.style.animationPlayState = 'running';
                    animationPaused = false;
                }
            }, 1000);
        }, { passive: true });
        
        infiniteCarousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].clientX;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            infiniteCarousel.scrollLeft = scrollLeft - walk;
        });
        
        // Remove any pause logic on hover
        infiniteCarousel.addEventListener('mouseenter', () => {
            // Ensure the carousel continues
            infiniteCarousel.style.animationPlayState = 'running';
        });
    }
});
// Floor Plans Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    const planOptions = document.querySelectorAll('.plan-option');
    const mainPlanImage = document.querySelector('.main-plan-image');
    const apartmentNumber = document.querySelector('.apartment-number');
    const apartmentArea = document.querySelector('.apartment-details .area');
    
    // Add click event to each plan option
    planOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            planOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update main plan image
            const optionImage = this.querySelector('img').src;
            mainPlanImage.src = optionImage;
            
            // Update apartment details
            const roomCount = this.getAttribute('data-rooms');
            const areaText = this.querySelector('.area').textContent;
            
            apartmentNumber.textContent = roomCount;
            apartmentArea.textContent = areaText;
            
            // Smooth scroll to main plan on mobile
            if (window.innerWidth < 768) {
                const floorPlansSection = document.getElementById('floor-plans');
                floorPlansSection.scrollIntoView({behavior: 'smooth'});
            }
        });
    });
    
    // Add zoom functionality to main floor plan
    const floorPlanMain = document.querySelector('.floor-plan-main');
    let isZoomed = false;
    
    floorPlanMain.addEventListener('click', function(e) {
        // Don't zoom if clicking on the plan info
        if (e.target.closest('.plan-info')) return;
        
        if (!isZoomed) {
            mainPlanImage.style.transform = 'scale(1.5)';
            mainPlanImage.style.cursor = 'zoom-out';
            floorPlanMain.style.overflow = 'auto';
        } else {
            mainPlanImage.style.transform = '';
            mainPlanImage.style.cursor = 'zoom-in';
            floorPlanMain.style.overflow = 'hidden';
        }
        
        isZoomed = !isZoomed;
    });
    
    // Add hover effect to make cursor indicate zoom
    floorPlanMain.addEventListener('mouseenter', function() {
        if (!isZoomed) {
            mainPlanImage.style.cursor = 'zoom-in';
        }
    });
    
    floorPlanMain.addEventListener('mouseleave', function() {
        mainPlanImage.style.cursor = '';
    });
});
// Add a resize handler to improve responsiveness
window.addEventListener('resize', function() {
    // Reset mobile menu when resizing to desktop
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = '';
        }
    }
});
// Project Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all progress cards
    const progressCards = document.querySelectorAll('.progress-card');
    const sliderModals = document.querySelectorAll('.project-slider-modal');
    const sliderCloseButtons = document.querySelectorAll('.slider-close');
    const body = document.body;

    // Add click event to each progress card
    progressCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectType = this.getAttribute('data-project');
            const sliderModal = document.getElementById(`${projectType}-slider`);
            
            if (sliderModal) {
                sliderModal.style.display = 'block';
                body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                
                // Initialize the slider
                initializeSlider(sliderModal);
            }
        });
    });

    // Close slider modal when close button is clicked
    sliderCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sliderModal = this.closest('.project-slider-modal');
            sliderModal.style.display = 'none';
            body.style.overflow = ''; // Restore scrolling
        });
    });

    // Close modal when clicking outside the slider container
    sliderModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            // Close only if the click is directly on the modal background (not on the slider content)
            if (e.target === this) {
                this.style.display = 'none';
                body.style.overflow = '';
            }
        });
    });

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sliderModals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    body.style.overflow = '';
                }
            });
        }
    });

    // Function to initialize slider functionality
    function initializeSlider(sliderModal) {
        const images = sliderModal.querySelectorAll('.slider-image');
        const dots = sliderModal.querySelectorAll('.slider-dot');
        const prevArrow = sliderModal.querySelector('.slider-prev');
        const nextArrow = sliderModal.querySelector('.slider-next');
        let currentSlide = 0;

        // Show current slide
        function showSlide(index) {
            // Remove active class from all images and dots
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current image and dot
            images[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }

        // Next slide
        function nextSlide() {
            showSlide((currentSlide + 1) % images.length);
        }

        // Previous slide
        function prevSlide() {
            showSlide((currentSlide - 1 + images.length) % images.length);
        }

        // Add click events to navigation arrows
        if (prevArrow) {
            prevArrow.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                prevSlide();
            });
        }

        if (nextArrow) {
            nextArrow.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                nextSlide();
            });
        }

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                showSlide(index);
            });
        });

        // Add swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        const sliderContainer = sliderModal.querySelector('.slider-container');
        
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - go to previous slide
                    prevSlide();
                } else {
                    // Swipe left - go to next slide
                    nextSlide();
                }
            }
        }

        // Add keyboard navigation
        sliderModal.addEventListener('keydown', function(e) {
            e.stopPropagation();
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Set first slide as active (in case it's not already)
        showSlide(0);
    }
});