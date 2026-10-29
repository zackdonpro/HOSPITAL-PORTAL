<?php
/**
 * Landing Page
 * Location: student-portal/index.php
 * Purpose: Entry point for students and visitors with quick navigation and system highlights.
 */

$page_title = 'Welcome';
require_once __DIR__ . '/includes/header.php';
?>

<div class="hero-card">
    <span class="hero-badge">RDBMS Practical Project</span>
    <h1 class="hero-title">Student Login &amp; Registration System</h1>
    <p class="hero-description">
        A secure college portal demonstration built with PHP, MySQL PDO, prepared statements, 
        BCRYPT password hashing, and role-based access control.
    </p>

    <div class="hero-actions">
        <?php if (isLoggedIn()): ?>
            <a href="dashboard.php" class="btn btn-primary">Go to My Dashboard</a>
            <?php if (isAdmin()): ?>
                <a href="admin.php" class="btn btn-outline">Go to Admin Panel</a>
            <?php endif; ?>
        <?php else: ?>
            <a href="login.php" class="btn btn-primary">Student / Admin Login</a>
            <a href="signup.php" class="btn btn-outline">New Student Registration</a>
        <?php endif; ?>
    </div>
</div>

<div class="feature-grid">
    <div class="feature-box">
        <h3 class="feature-title">Secure Authentication</h3>
        <p class="feature-text">
            Passwords are encrypted using PHP's native <code>password_hash()</code> with BCRYPT algorithm.
            Plaintext passwords are never stored in the database.
        </p>
    </div>

    <div class="feature-box">
        <h3 class="feature-title">SQL Injection Prevention</h3>
        <p class="feature-text">
            All database operations utilize <strong>PDO Prepared Statements</strong> with bound parameters 
            to completely neutralize SQL injection vulnerabilities.
        </p>
    </div>

    <div class="feature-box">
        <h3 class="feature-title">Role-Based Access Control</h3>
        <p class="feature-text">
            Granular access levels separating Students and Administrators. Normal students cannot 
            access administrative controls, and session tampering is prevented.
        </p>
    </div>
</div>

<div style="margin-top: 3rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; text-align: left;">
    <h4 style="color: #0f172a; margin-bottom: 0.5rem; font-size: 1rem;">Demo &amp; Testing Credentials</h4>
    <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1rem;">
        These sample accounts are seeded via <code>database.sql</code> for instant practical evaluation:
    </p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; font-size: 0.85rem;">
        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="color: #1e40af;">Admin Account:</strong><br>
            Email: <code>admin@portal.edu</code><br>
            Password: <code>Admin@123</code>
        </div>
        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong style="color: #047857;">Sample Student Account:</strong><br>
            Email: <code>rohan.sharma@college.edu</code><br>
            Password: <code>Student@123</code>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
