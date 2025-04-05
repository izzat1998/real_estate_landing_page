// Instant Contact Buttons
document.addEventListener('DOMContentLoaded', function() {
    const instantContact = document.getElementById('instantContact');
    const contactToggle = document.querySelector('.contact-toggle');
    
    if (instantContact && contactToggle) {
        // Toggle contact buttons visibility
        contactToggle.addEventListener('click', function() {
            instantContact.classList.toggle('active');
        });
        
        // Close instant contact when clicking outside
        document.addEventListener('click', function(e) {
            if (!instantContact.contains(e.target) && instantContact.classList.contains('active')) {
                instantContact.classList.remove('active');
            }
        });
        
        // Add analytics tracking for contact buttons
        const contactButtons = document.querySelectorAll('.instant-contact-button');
        contactButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get button type (whatsapp, telegram, phone)
                const buttonType = this.classList.contains('whatsapp') ? 'WhatsApp' : 
                                  this.classList.contains('telegram') ? 'Telegram' : 'Phone';
                
                // Log interaction - in a real implementation, this would send data to your analytics service
                console.log(`Contact interaction: ${buttonType}`);
            });
        });
    }
});
