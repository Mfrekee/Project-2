// js/auth.js
const API_BASE = 'https://reqres.in/api';

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();

    // Pages that require authentication
    const protectedPages = ['dashboard.html', 'courses.html', 'assignments.html', 'profile.html'];
    // Pages that redirect if already authenticated
    const guestPages = ['login.html', 'signup.html', 'forgot-password.html'];

    if (protectedPages.includes(currentPage) && !token) {
        window.location.href = 'login.html';
        return;
    }

    if (guestPages.includes(currentPage) && token) {
        window.location.href = 'dashboard.html';
        return;
    }
}

// Login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        showLoading('login');
        hideMessage('error');

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store auth token
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userEmail', email);

                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.setItem('rememberMe', 'false');
                }

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                throw new Error(data.error || 'Login failed');
            }

        } catch (error) {
            showMessage('error', error.message || 'Login failed. Please try again.');
        } finally {
            hideLoading('login');
        }
    });
}

// Signup functionality
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showMessage('error', 'Passwords do not match.');
            return;
        }

        // Validate password strength (basic)
        if (password.length < 6) {
            showMessage('error', 'Password must be at least 6 characters long.');
            return;
        }

        showLoading('signup');
        hideMessage('error');
        hideMessage('success');

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.id) {
                // Store user info
                localStorage.setItem('authToken', data.token || 'demo-token');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', fullName);

                showMessage('success', 'Account created successfully! Redirecting...');

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);

            } else {
                throw new Error(data.error || 'Registration failed');
            }

        } catch (error) {
            showMessage('error', error.message || 'Registration failed. Please try again.');
        } finally {
            hideLoading('signup');
        }
    });
}

// Forgot password functionality
if (document.getElementById('forgotPasswordForm')) {
    document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;

        showLoading('reset');
        hideMessage('error');
        hideMessage('success');

        try {
            // Simulate API call (ReqRes doesn't have forgot password endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            showMessage('success', 'Password reset link has been sent to your email address.');
            document.getElementById('forgotPasswordForm').reset();

        } catch (error) {
            showMessage('error', 'Failed to send reset link. Please try again.');
        } finally {
            hideLoading('reset');
        }
    });
}

// Utility functions
function showLoading(type) {
    const btn = document.getElementById(`${type}Btn`);
    const text = document.getElementById(`${type}Text`);
    const loader = document.getElementById(`${type}Loader`);

    if (btn && text && loader) {
        btn.disabled = true;
        text.classList.add('hidden');
        loader.classList.remove('hidden');
    }
}

function hideLoading(type) {
    const btn = document.getElementById(`${type}Btn`);
    const text = document.getElementById(`${type}Text`);
    const loader = document.getElementById(`${type}Loader`);

    if (btn && text && loader) {
        btn.disabled = false;
        text.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

function showMessage(type, message) {
    const element = document.getElementById(`${type}Message`);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

function hideMessage(type) {
    const element = document.getElementById(`${type}Message`);
    if (element) {
        element.classList.add('hidden');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', checkAuth);