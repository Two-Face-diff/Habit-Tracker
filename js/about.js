/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// about page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Logout func
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // CLR data
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
    
    // Contact BTNS
    const contactButtons = document.querySelectorAll('.contact-btn');
    if (contactButtons.length > 0) {
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const contactType = this.getAttribute('data-contact-type');
                
                switch(contactType) {
                    case 'email':
                        // email client
                        window.location.href = 'mailto:support@habittracker.com';
                        showToast('Opening email client...', 'info');
                        break;
                    case 'chat':
                        // chat interface
                        showToast('Live chat feature coming soon!', 'info');
                        break;
                    default:
                        showToast('Contact method not available', 'warning');
                }
            });
        });
    }
    
    // Hover 
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });
    }
    
    // FAQ 
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        header.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    //  TOAST notification
    function showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // unique ID toast
        const toastId = 'toast-' + Date.now();
        
        //  TOAST HTML
        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${type === 'success' ? 'bg-success text-white' : type === 'info' ? 'bg-info text-white' : 'bg-warning'}">
                    <strong class="me-auto">Habita</strong>
                    <small>Just now</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // TOAST container
        document.querySelector('.toast-container').insertAdjacentHTML('beforeend', toastHTML);
        
        // Initialize toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();
        
        // Remove toast 
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // BACKEND SERVER or smth if we have it
                console.log(`Newsletter signup: ${email}`);
                
                // MSG
                showToast('Thanks for subscribing to our newsletter!');
                
                // CLR form
                this.reset();
            }
        });
    }
    
    // Initialize
    updateStats();
}); 