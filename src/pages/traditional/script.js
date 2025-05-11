
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Handle OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === this.maxLength) {
                    // Move to the next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                }
                
                // Combine all OTP values
                if (document.getElementById('otp')) {
                    let otpValue = '';
                    otpInputs.forEach(input => {
                        otpValue += input.value;
                    });
                    document.getElementById('otp').value = otpValue;
                    
                    // Enable signup button if OTP is complete
                    const signupBtn = document.getElementById('signupBtn');
                    if (signupBtn) {
                        signupBtn.disabled = otpValue.length !== 6;
                    }
                }
            });
            
            // Handle backspace key
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !this.value) {
                    // Move to previous input when backspace is pressed on empty input
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });
        });
    }
    
    // Send OTP button logic
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            const phoneInput = document.getElementById('phone');
            if (phoneInput && phoneInput.value.length >= 10) {
                // Show OTP input container
                document.getElementById('otpContainer').style.display = 'block';
                
                // Change button text
                sendOtpBtn.textContent = 'OTP Sent';
                sendOtpBtn.disabled = true;
                
                // Show toast notification
                showToast('OTP sent successfully!');
                
                // Focus on first OTP input
                otpInputs[0].focus();
                
                // In a real app, this would call an API to send OTP
            }
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message and redirect to work selection
            showToast('Signup successful!');
            setTimeout(() => {
                window.location.href = 'work-selection.html';
            }, 1500);
        });
    }
    
    // Work selection page
    if (currentPage === 'work-selection.html') {
        // Initialize date picker
        if (document.getElementById('appointmentDate')) {
            flatpickr('#appointmentDate', {
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
                minDate: 'today',
                time_24hr: true
            });
        }
        
        // Service card selection
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length > 0) {
            serviceCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Remove selected class from all cards
                    serviceCards.forEach(c => c.classList.remove('selected'));
                    
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    
                    // Update hidden input
                    document.getElementById('selectedService').value = this.getAttribute('data-service');
                });
            });
        }
        
        // Work selection form submission
        const workSelectionForm = document.getElementById('workSelectionForm');
        if (workSelectionForm) {
            workSelectionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(workSelectionForm);
                const selectedService = formData.get('selectedService');
                
                // Redirect to available workers page
                window.location.href = 'available-workers.html';
            });
        }
    }
    
    // Worker profile page
    if (currentPage === 'worker-profile.html') {
        const cancelButton = document.getElementById('cancelButton');
        const hireButton = document.getElementById('hireButton');
        const modal = document.getElementById('modal');
        const otpModal = document.getElementById('otpModal');
        const closeButton = document.querySelector('.close-button');
        const goBackBtn = document.getElementById('goBackBtn');
        const confirmCancelBtn = document.getElementById('confirmCancelBtn');
        
        // Show modal when cancel button is clicked
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                modal.classList.add('active');
            });
        }
        
        // Close modal when close button is clicked
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Go back to worker profile when go back button is clicked
        if (goBackBtn) {
            goBackBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Redirect to available workers when confirm cancel button is clicked
        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', function() {
                window.location.href = 'available-workers.html';
            });
        }
        
        // Show OTP modal when hire button is clicked
        if (hireButton) {
            hireButton.addEventListener('click', function() {
                otpModal.classList.add('active');
                
                // In a real app, this would call an API to send OTP to the worker
            });
        }
        
        // Verify OTP and redirect to payment page
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', function() {
                // In a real app, this would verify the OTP with the server
                window.location.href = 'payment.html';
            });
        }
    }
    
    // Payment page
    if (currentPage === 'payment.html') {
        const paymentMethods = document.querySelectorAll('.payment-method');
        const cardPaymentForm = document.getElementById('cardPaymentForm');
        const upiPaymentForm = document.getElementById('upiPaymentForm');
        const payButton = document.getElementById('payButton');
        const successModal = document.getElementById('successModal');
        
        // Payment method selection
        if (paymentMethods.length > 0) {
            paymentMethods.forEach(method => {
                method.addEventListener('click', function() {
                    // Remove selected class from all methods
                    paymentMethods.forEach(m => m.classList.remove('selected'));
                    
                    // Add selected class to clicked method
                    this.classList.add('selected');
                    
                    // Update hidden input
                    document.getElementById('selectedPayment').value = this.getAttribute('data-method');
                    
                    // Show appropriate payment form
                    const selectedMethod = this.getAttribute('data-method');
                    if (selectedMethod === 'card') {
                        cardPaymentForm.style.display = 'block';
                        upiPaymentForm.style.display = 'none';
                    } else if (selectedMethod === 'upi') {
                        cardPaymentForm.style.display = 'none';
                        upiPaymentForm.style.display = 'block';
                    } else {
                        cardPaymentForm.style.display = 'none';
                        upiPaymentForm.style.display = 'none';
                    }
                    
                    // Enable pay button
                    payButton.disabled = false;
                });
            });
        }
        
        // Process payment
        if (payButton) {
            payButton.addEventListener('click', function() {
                // Show success modal
                successModal.classList.add('active');
                
                // In a real app, this would process the payment
            });
        }
    }
});

// Toast notification function
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }
}
