/**
 * Client-Side JavaScript
 * Location: student-portal/assets/js/script.js
 * Purpose: Handles interactive UI, client validation, show/hide passwords, and delete confirmations.
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Password Visibility Toggle
    const toggleButtons = document.querySelectorAll('.btn-toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    this.innerHTML = `
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    `;
                    this.setAttribute('aria-label', 'Hide password');
                } else {
                    targetInput.type = 'password';
                    this.innerHTML = `
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    `;
                    this.setAttribute('aria-label', 'Show password');
                }
            }
        });
    });

    // 2. Signup Form Client-Side Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                e.preventDefault();
                return;
            }

            if (password !== confirmPassword) {
                alert('Password and Confirm Password do not match. Please re-enter.');
                e.preventDefault();
                return;
            }
        });
    }

    // 3. Confirm Delete Confirmation for Admin Actions
    const deleteForms = document.querySelectorAll('.delete-student-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const studentName = this.getAttribute('data-name') || 'this student';
            const confirmed = confirm(`Are you sure you want to permanently delete ${studentName}? This action cannot be undone.`);
            if (!confirmed) {
                e.preventDefault();
            }
        });
    });
});
