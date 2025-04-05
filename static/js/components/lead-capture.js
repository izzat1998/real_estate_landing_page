// Lead Capture Form
document.addEventListener('DOMContentLoaded', function() {
    const leadCaptureForm = document.getElementById('leadCaptureForm');
    const closeButton = document.querySelector('.floating-form-close');
    const formSubmit = document.getElementById('floatingLeadForm');
    
    // Show form after 30 seconds
    let formTimer = setTimeout(() => {
        if (!sessionStorage.getItem('formClosed') && !sessionStorage.getItem('formSubmitted')) {
            showLeadForm();
        }
    }, 30000);
    
    // Close button handler
    closeButton.addEventListener('click', () => {
        hideLeadForm();
        sessionStorage.setItem('formClosed', 'true');
    });
    
    // Form submission handler
    formSubmit.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(formSubmit);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const apartmentType = formData.get('apartmentType');
        
        // Here you would normally send this data to your server/CRM
        console.log('Lead captured:', { name, phone, email, apartmentType });
        
        // Show thank you message
        formSubmit.innerHTML = `
            <div class="form-success">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #A48444; margin-bottom: 15px;"></i>
                <h4>Спасибо за интерес!</h4>
                <p>Мы отправили каталог на указанный вами email. Наш менеджер свяжется с вами в ближайшее время.</p>
            </div>
        `;
        
        // Hide form after 5 seconds
        setTimeout(() => {
            hideLeadForm();
        }, 5000);
        
        // Remember that form was submitted
        sessionStorage.setItem('formSubmitted', 'true');
    });
    
    // Exit intent detection
    document.addEventListener('mouseleave', function(e) {
        // Only trigger if mouse leaves from the top of the page
        if (e.clientY <= 0 && 
            !sessionStorage.getItem('formClosed') && 
            !sessionStorage.getItem('formSubmitted') &&
            !leadCaptureForm.classList.contains('visible')) {
            
            // Clear the original timer
            clearTimeout(formTimer);
            
            // Show the form immediately
            showLeadForm();
        }
    });
    
    // Functions to show/hide form
    function showLeadForm() {
        leadCaptureForm.classList.add('visible');
    }
    
    function hideLeadForm() {
        leadCaptureForm.classList.remove('visible');
    }
    
    // Add name attributes to form fields for FormData collection
    document.querySelector('#floatingLeadForm input[type="text"]').setAttribute('name', 'name');
    document.querySelector('#floatingLeadForm input[type="tel"]').setAttribute('name', 'phone');
    document.querySelector('#floatingLeadForm input[type="email"]').setAttribute('name', 'email');
    document.querySelector('#floatingLeadForm select').setAttribute('name', 'apartmentType');
});
