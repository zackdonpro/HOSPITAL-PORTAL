<?php
/**
 * Authentication and Security Helper File
 * Location: student-portal/includes/auth.php
 * Purpose: Manages user sessions, access control, sanitization, and CSRF protection.
 */

// Start session if not already active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Checks if the current visitor is logged in.
 *
 * @return bool
 */
function isLoggedIn(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Ensures the user is authenticated. If not, redirects to login page.
 */
function requireLogin(): void {
    if (!isLoggedIn()) {
        header("Location: login.php?error=unauthorized");
        exit();
    }
}

/**
 * Checks if the logged-in user is an administrator.
 *
 * @return bool
 */
function isAdmin(): bool {
    return isLoggedIn() && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

/**
 * Enforces role-based access control (RBAC).
 * Restricts page access strictly to admins.
 */
function requireAdmin(): void {
    requireLogin();
    if (!isAdmin()) {
        header("Location: dashboard.php?error=access_denied");
        exit();
    }
}

/**
 * Sanitizes string input to prevent XSS (Cross-Site Scripting) attacks.
 *
 * @param mixed $data
 * @return string
 */
function sanitizeInput($data): string {
    if (is_null($data)) {
        return '';
    }
    $data = trim((string)$data);
    $data = stripslashes($data);
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

/**
 * Generates or retrieves a CSRF token stored in the session.
 *
 * @return string
 */
function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validates the provided CSRF token against the session token.
 *
 * @param string|null $token
 * @return bool
 */
function verifyCsrfToken(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}
?>
