/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// Utility functions for Habita by @Two-Face
window.utilities = {
    // Hash pass
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    },

    // Validate pass strength
    validatePassword(password) {
        if (!password) {
            return { valid: false, message: 'Password is required' };
        }
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
        }
        return { valid: true, message: 'Password is strong' };
    },

    // User input
    sanitizeInput(input) {
        if (!input) return '';
        return input.replace(/[<>]/g, '');
    },

    //  ISO - Return current date
    formatDate(date) {
        if (!date) {
            date = new Date();
        }
        return date.toISOString();
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Toast
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
            document.body.appendChild(toastContainer);
        }

        // Toast element
        const toast = document.createElement('div');
        toast.role = 'alert';
        
        // Custom styles based on type
        if (type.startsWith('#')) {
            // Custom color provided
            toast.style.backgroundColor = type;
            toast.style.color = '#fff';
            toast.style.padding = '12px 24px';
            toast.style.borderRadius = '4px';
            toast.style.marginBottom = '10px';
            toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            toast.style.minWidth = '200px';
            toast.className = 'fade show';
        } else {
            // BTSR classes
            toast.className = `alert alert-${type} fade show`;
        }

        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" style="float: right; margin-left: 10px;" onclick="this.parentElement.remove();" aria-label="Close"></button>
        `;

        //TOAST
        toastContainer.appendChild(toast);

        // Fade in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 50);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    // Validate email 
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    // Format time
    formatTime(time) {
        try {
            if (!time) return '';
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return time;
        }
    },

    // DAy name
    getDayName(date) {
        try {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[new Date(date).getDay()];
        } catch (error) {
            console.error('Error getting day name:', error);
            return '';
        }
    },

    // Month name
    getMonthName(date) {
        try {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[new Date(date).getMonth()];
        } catch (error) {
            console.error('Error getting month name:', error);
            return '';
        }
    }
};