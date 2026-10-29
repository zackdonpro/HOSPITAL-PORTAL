<?php
/**
 * Global Header Component
 * Location: student-portal/includes/header.php
 * Purpose: Provides unified HTML head, styling, and navigation across all pages.
 */

// Include auth helper if not already loaded
require_once __DIR__ . '/auth.php';

// Default page title if not set
$page_title = isset($page_title) ? $page_title : 'Student Portal';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?> | Student Portal</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Stylesheet -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Top Navigation Bar -->
    <header class="navbar">
        <div class="nav-container">
            <a href="index.php" class="brand">
                <svg class="brand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
                <span class="brand-name">Student Portal</span>
            </a>

            <nav class="nav-links">
                <a href="index.php" class="nav-item">Home</a>

                <?php if (isLoggedIn()): ?>
                    <a href="dashboard.php" class="nav-item">My Dashboard</a>
                    <?php if (isAdmin()): ?>
                        <a href="admin.php" class="nav-item">Admin Panel</a>
                    <?php endif; ?>
                    <div class="user-greeting">
                        <span>Hi, <strong><?php echo htmlspecialchars($_SESSION['user_name'] ?? 'User'); ?></strong></span>
                    </div>
                    <a href="logout.php" class="btn btn-outline btn-sm">Log Out</a>
                <?php else: ?>
                    <a href="login.php" class="nav-item">Log In</a>
                    <a href="signup.php" class="btn btn-primary btn-sm">Register</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-wrapper">
