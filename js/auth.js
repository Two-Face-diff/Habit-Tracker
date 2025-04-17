/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// auth page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');

    // Check user 
    const currentUser = dataManager.getCurrentUser();
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }

    // Login form 
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = utilities.sanitizeInput(document.getElementById('loginEmail').value);
            const password = document.getElementById('loginPassword').value;
            
            // Validate inputs
            if (!email || !password) {
                utilities.showToast('Please fill in all fields', 'danger');
                return;
            }
            
            // Validate email format
            if (!utilities.validateEmail(email)) {
                utilities.showToast('Please enter a valid email address', 'danger');
                return;
            }
            
            // Attempt login
            try {
            if (dataManager.login(email, password)) {
                    utilities.showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                    utilities.showToast('Invalid email or password', 'danger');
                }
            } catch (error) {
                console.error('Login error:', error);
                utilities.showToast('An error occurred during login', 'danger');
            }
        });
    }

    // Signup form 
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = utilities.sanitizeInput(document.getElementById('signupName').value);
            const email = utilities.sanitizeInput(document.getElementById('signupEmail').value);
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                utilities.showToast('Please fill in all fields', 'danger');
                return;
            }
            
            // Validate email format
            if (!utilities.validateEmail(email)) {
                utilities.showToast('Please enter a valid email address', 'danger');
                return;
            }
            
            // Validate pass
            const passwordValidation = utilities.validatePassword(password);
            if (!passwordValidation.valid) {
                utilities.showToast(passwordValidation.message, 'danger');
                return;
            }
            
            // pass match
            if (password !== confirmPassword) {
                utilities.showToast('Passwords do not match', 'danger');
                return;
            }
            
            // Check email exists
            if (dataManager.getUserByEmail(email)) {
                utilities.showToast('Email already registered', 'danger');
                return;
            }
            
            try {
            // Create new user
            const newUser = {
                    id: utilities.generateId(),
                name: name,
                email: email,
                    password: utilities.hashPassword(password),
                habits: [],
                goals: [],
                    reminders: [],
                    createdAt: new Date().toISOString()
            };
            
                dataManager.addUser(newUser);
            dataManager.currentUser = newUser;
            dataManager.saveUserData();
            
                utilities.showToast('Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
            } catch (error) {
                console.error('Signup error:', error);
                utilities.showToast('An error occurred during signup', 'danger');
            }
        });
    }

    // Switching
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
        });
        
        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
        });
    }

    // validation feedback
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });

    // PASS strength indicator
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = utilities.validatePassword(this.value);
            const strengthIndicator = document.getElementById('passwordStrength');
            if (strengthIndicator) {
                strengthIndicator.textContent = strength.message;
                strengthIndicator.className = `text-${strength.valid ? 'success' : 'danger'}`;
            }
        });
    }
});

// Authentication func 
window.auth = {
    // Initialize auth functionality
    init() {
        console.log('Initializing auth...');
        
        // Login form 
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Found login form');
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                console.log('Attempting login with:', email);
                const success = await this.login(email, password);
                if (success) {
                    console.log('Login successful, redirecting...');
                    window.location.href = 'home.html';
                }
            });
        }

        // Signup form 
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            console.log('Found signup form');
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Signup form submitted');
                
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                // Pass match
                if (password !== confirmPassword) {
                    console.log('Passwords do not match');
                    window.utilities.showToast('Passwords do not match', 'danger');
                    return;
                }

                console.log('Attempting signup with:', email);
                const success = await this.signup(name, email, password);
                if (success) {
                    console.log('Signup successful, redirecting...');
                    window.location.href = 'home.html';
                }
            });

            // PASS indicator
            const passwordInput = document.getElementById('signupPassword');
            if (passwordInput) {
                console.log('Setting up password strength indicator');
                passwordInput.addEventListener('input', () => {
                    const strength = window.utilities.validatePassword(passwordInput.value);
                    const strengthIndicator = document.getElementById('passwordStrength');
                    if (strengthIndicator) {
                        strengthIndicator.textContent = strength.message;
                        strengthIndicator.className = `form-text text-${strength.valid ? 'success' : 'danger'}`;
                    }
                });
            }
        }

        // Validation feedback
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        });
    },

    // Login func
    async login(email, password) {
        try {
            console.log('Login attempt:', email);
            
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!window.utilities.validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === window.utilities.hashPassword(password));

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Current user
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name
            }));

            window.utilities.showToast('Login successful!', 'success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            window.utilities.showToast(error.message, 'danger');
            return false;
        }
    },

    // Signup func
    async signup(name, email, password) {
        try {
            console.log('Signup attempt:', email);
            
            if (!name || !email || !password) {
                throw new Error('All fields are required');
            }

            if (!window.utilities.validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            const passwordValidation = window.utilities.validatePassword(password);
            if (!passwordValidation.valid) {
                throw new Error(passwordValidation.message);
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            const newUser = {
                id: window.utilities.generateId(),
                name: window.utilities.sanitizeInput(name),
                email: email,
                password: window.utilities.hashPassword(password),
                habits: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Current user
            localStorage.setItem('currentUser', JSON.stringify({
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }));

            window.utilities.showToast('Account created successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            window.utilities.showToast(error.message, 'danger');
            return false;
        }
    },

    // Logout func
    logout() {
        try {
            localStorage.removeItem('currentUser');
            window.utilities.showToast('Logged out successfully', 'success');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            window.utilities.showToast('Error logging out', 'danger');
            return false;
        }
    },

    // Check user logged?
    isLoggedIn() {
        try {
            return !!localStorage.getItem('currentUser');
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    },

    // Current user
    getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
};

// Initialize auth 
console.log('Auth script loaded');
window.auth.init();