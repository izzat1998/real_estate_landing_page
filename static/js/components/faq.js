// FAQ Component
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click handler to each FAQ question
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Toggle active class on clicked item
                item.classList.toggle('active');
                
                // Close other items when one is opened
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Add keyboard accessibility
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            // Add tabindex to make questions focusable
            question.setAttribute('tabindex', '0');
            
            // Handle keyboard events
            question.addEventListener('keydown', function(e) {
                // Activate on Enter or Space
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
});
