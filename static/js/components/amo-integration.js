/**
 * amoCRM Direct Integration
 * 
 * This component handles direct submission to amoCRM API.
 * Note: For production use, consider using a backend proxy for better security.
 */

// Configuration - REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
const AMO_CONFIG = {
    // Domain should be your amoCRM account subdomain
    domain: 'your-account.amocrm.ru',
    // These would typically be stored securely on a backend
    // For testing purposes only - replace with your actual values
    accessToken: '', // Leave empty for security - fill in during testing only
    refreshToken: '', // Leave empty for security - fill in during testing only
    redirectUri: window.location.origin,
    integrationId: '' // Your integration ID
};

/**
 * Initialize amoCRM form handlers
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all forms with data-amo-form attribute
    const amoForms = document.querySelectorAll('form[data-amo-form]');
    
    amoForms.forEach(form => {
        form.addEventListener('submit', handleAmoFormSubmit);
    });
    
    // Add visitor_uid to all forms when amoCRM pixel is loaded
    if (typeof AMOPIXEL_IDENTIFIER_PARAMS !== 'undefined') {
        const originalOnload = AMOPIXEL_IDENTIFIER_PARAMS.onload;
        
        AMOPIXEL_IDENTIFIER_PARAMS.onload = function(pixel_identifier) {
            // Call the original onload function if it exists
            if (typeof originalOnload === 'function') {
                originalOnload(pixel_identifier);
            }
            
            const visitor_uid = pixel_identifier.getVisitorUid();
            if (visitor_uid) {
                amoForms.forEach(form => {
                    ensureVisitorUidField(form, visitor_uid);
                });
            }
        };
    }
});

/**
 * Ensure the form has a visitor_uid hidden field
 */
function ensureVisitorUidField(form, visitor_uid) {
    let visitorField = form.querySelector('input[name="visitor_uid"]');
    
    if (!visitorField) {
        visitorField = document.createElement('input');
        visitorField.type = 'hidden';
        visitorField.name = 'visitor_uid';
        form.appendChild(visitorField);
    }
    
    visitorField.value = visitor_uid;
}

/**
 * Handle form submission to amoCRM
 */
function handleAmoFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    // Disable submit button and show loading state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.innerText;
        submitButton.innerText = 'Отправка...';
    }
    
    // Prepare lead data
    const leadData = {
        name: formData.get('name') || 'Заявка с сайта',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        visitor_uid: formData.get('visitor_uid') || getAmoVisitorUid() || ''
    };
    
    // For demonstration, use the direct API approach
    // In production, consider using a backend proxy
    createAmoLead(leadData)
        .then(response => {
            console.log('Lead created successfully:', response);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerText = 'Спасибо! Ваша заявка отправлена.';
            
            // Clear form and append success message
            form.reset();
            form.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        })
        .catch(error => {
            console.error('Error creating lead:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error-message';
            errorMessage.innerText = 'Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.';
            form.appendChild(errorMessage);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        })
        .finally(() => {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerText = submitButton.dataset.originalText;
            }
        });
}

/**
 * Create a lead in amoCRM
 * Note: In production, this should be handled by a backend service
 */
async function createAmoLead(leadData) {
    // SECURITY WARNING: This is for demonstration purposes only
    // In a production environment, API calls with authentication
    // should be handled by a backend service
    
    if (!AMO_CONFIG.accessToken) {
        throw new Error('Missing amoCRM access token. For security reasons, direct API access requires backend implementation.');
    }
    
    // Prepare lead data for amoCRM API
    const amoLeadData = {
        add: [
            {
                name: leadData.name,
                status_id: 142, // Replace with your pipeline status ID
                visitor_uid: leadData.visitor_uid
            }
        ]
    };
    
    // Add contact information if available
    if (leadData.phone || leadData.email) {
        amoLeadData.add[0].contacts = {
            add: [
                {
                    name: leadData.name,
                    custom_fields: []
                }
            ]
        };
        
        // Add phone if available
        if (leadData.phone) {
            amoLeadData.add[0].contacts.add[0].custom_fields.push({
                id: 'PHONE', // Replace with your actual phone field ID
                values: [
                    {
                        value: leadData.phone,
                        enum: 'WORK'
                    }
                ]
            });
        }
        
        // Add email if available
        if (leadData.email) {
            amoLeadData.add[0].contacts.add[0].custom_fields.push({
                id: 'EMAIL', // Replace with your actual email field ID
                values: [
                    {
                        value: leadData.email,
                        enum: 'WORK'
                    }
                ]
            });
        }
    }
    
    // Make API request
    const response = await fetch(`https://${AMO_CONFIG.domain}/api/v2/leads`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AMO_CONFIG.accessToken}`
        },
        body: JSON.stringify(amoLeadData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`amoCRM API error: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
}

/**
 * Get visitor UID from amoCRM pixel or localStorage
 */
function getAmoVisitorUid() {
    // Try to get from AMOPIXEL_IDENTIFIER first
    if (window.AMOPIXEL_IDENTIFIER && typeof window.AMOPIXEL_IDENTIFIER.getVisitorUid === 'function') {
        return window.AMOPIXEL_IDENTIFIER.getVisitorUid();
    }
    
    // Fall back to localStorage if available
    return localStorage.getItem('amo_visitor_uid');
}
