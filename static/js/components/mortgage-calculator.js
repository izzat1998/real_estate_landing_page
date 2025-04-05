// Mortgage Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const propertyPriceSlider = document.getElementById('propertyPrice');
    const propertyPriceValue = document.getElementById('propertyPriceValue');
    const downPaymentSlider = document.getElementById('downPayment');
    const downPaymentValue = document.getElementById('downPaymentValue');
    const downPaymentAmount = document.getElementById('downPaymentAmount');
    const loanTermSlider = document.getElementById('loanTerm');
    const loanTermValue = document.getElementById('loanTermValue');
    const interestRateSlider = document.getElementById('interestRate');
    const interestRateValue = document.getElementById('interestRateValue');
    
    // Results elements
    const monthlyPayment = document.getElementById('monthlyPayment');
    const loanAmount = document.getElementById('loanAmount');
    const totalPayment = document.getElementById('totalPayment');
    
    // Check if calculator elements exist
    if (!propertyPriceSlider || !downPaymentSlider || !loanTermSlider || !interestRateSlider) {
        return;
    }
    
    // Initialize with default values
    updateCalculator();
    
    // Add event listeners to all sliders
    propertyPriceSlider.addEventListener('input', function() {
        propertyPriceValue.textContent = formatNumber(this.value);
        updateDownPaymentAmount();
        updateCalculator();
    });
    
    downPaymentSlider.addEventListener('input', function() {
        downPaymentValue.textContent = this.value;
        updateDownPaymentAmount();
        updateCalculator();
    });
    
    loanTermSlider.addEventListener('input', function() {
        loanTermValue.textContent = this.value;
        updateCalculator();
    });
    
    interestRateSlider.addEventListener('input', function() {
        interestRateValue.textContent = this.value;
        updateCalculator();
    });
    
    // Update down payment amount based on property price and percentage
    function updateDownPaymentAmount() {
        const price = parseInt(propertyPriceSlider.value);
        const percentage = parseInt(downPaymentSlider.value);
        const amount = price * (percentage / 100);
        downPaymentAmount.textContent = formatNumber(amount);
    }
    
    // Calculate mortgage and update results
    function updateCalculator() {
        const price = parseInt(propertyPriceSlider.value);
        const downPaymentPercent = parseInt(downPaymentSlider.value);
        const term = parseInt(loanTermSlider.value);
        const rate = parseFloat(interestRateSlider.value);
        
        // Calculate loan amount
        const downPaymentAmount = price * (downPaymentPercent / 100);
        const principal = price - downPaymentAmount;
        
        // Convert annual rate to monthly rate
        const monthlyRate = rate / 100 / 12;
        
        // Convert term in years to term in months
        const termMonths = term * 12;
        
        // Calculate monthly payment using the formula: P = r*PV / (1 - (1 + r)^-n)
        // Where:
        // P = Monthly payment
        // r = Monthly interest rate
        // PV = Loan amount (Principal)
        // n = Total number of payments (term in months)
        
        let monthlyPaymentAmount;
        if (rate === 0) {
            // If interest rate is 0, simple division
            monthlyPaymentAmount = principal / termMonths;
        } else {
            // Standard formula
            monthlyPaymentAmount = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
        }
        
        // Calculate total payment
        const totalPaymentAmount = monthlyPaymentAmount * termMonths;
        
        // Update the UI with formatted numbers
        loanAmount.textContent = formatNumber(principal) + ' сум';
        monthlyPayment.textContent = formatNumber(monthlyPaymentAmount) + ' сум';
        totalPayment.textContent = formatNumber(totalPaymentAmount) + ' сум';
    }
    
    // Helper function to format numbers with commas for thousands
    function formatNumber(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
