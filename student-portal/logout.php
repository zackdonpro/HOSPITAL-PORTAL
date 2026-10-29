<?php
/**
 * Logout Handler
 * Location: student-portal/logout.php
 * Purpose: Completely destroys the active session, clears cookies, and redirects to login.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Unset all session variables
$_SESSION = array();

// 2. Destroy the session cookie in browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// 3. Destroy session on server
session_destroy();

// 4. Redirect to login page with logout confirmation notice
header("Location: login.php?logout=1");
exit();
?>
