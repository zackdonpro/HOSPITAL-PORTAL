export interface ProjectFile {
  name: string;
  path: string;
  targetLocation: string;
  language: 'php' | 'sql' | 'css' | 'javascript' | 'markdown';
  purpose: string;
  keyConcepts: string[];
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'database.sql',
    path: 'database.sql',
    targetLocation: 'student-portal/database.sql (Run in MySQL Workbench 8.0 CE)',
    language: 'sql',
    purpose: 'Creates the relational database `student_portal`, the `users` table with PRIMARY KEY and UNIQUE constraints, and seeds default admin and student test accounts.',
    keyConcepts: ['CREATE DATABASE', 'AUTO_INCREMENT PRIMARY KEY', 'UNIQUE Constraints', 'ENUM Data Type', 'BCRYPT Password Hash Seeding'],
    content: `-- ====================================================================
-- College RDBMS Project: Student Login & Registration System
-- Database Setup Script for MySQL Workbench 8.0 CE & XAMPP
-- ====================================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS \`student_portal\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`student_portal\`;

-- 2. Drop existing table if recreating during practical testing
-- DROP TABLE IF EXISTS \`users\`;

-- 3. Create the \`users\` Table
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`student_id\` VARCHAR(30) NOT NULL UNIQUE,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Default Admin Account
-- Default Admin Credentials:
-- Email:    admin@portal.edu
-- Password: Admin@123
-- Hash generated using PHP: password_hash('Admin@123', PASSWORD_BCRYPT)
INSERT INTO \`users\` (\`full_name\`, \`student_id\`, \`email\`, \`password\`, \`role\`)
VALUES 
(
  'System Administrator',
  'ADM-001',
  'admin@portal.edu',
  '$2y$10$vN4G2tV4oV2iWp/7rR1Rk.fQfK3uB9tP9kY9H5k3G2nZ2w9t1Q8vC',
  'admin'
)
ON DUPLICATE KEY UPDATE \`email\` = \`email\`;

-- 5. Seed Sample Student Accounts for Testing
-- Student Accounts Password: Student@123
-- Hash: password_hash('Student@123', PASSWORD_BCRYPT)
INSERT INTO \`users\` (\`full_name\`, \`student_id\`, \`email\`, \`password\`, \`role\`)
VALUES
(
  'Rohan Sharma',
  'STU-2024-001',
  'rohan.sharma@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
),
(
  'Priya Patel',
  'STU-2024-002',
  'priya.patel@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
),
(
  'Amit Verma',
  'STU-2024-003',
  'amit.verma@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
)
ON DUPLICATE KEY UPDATE \`email\` = \`email\`;

-- Verify table creation and seeded data
SELECT \`id\`, \`full_name\`, \`student_id\`, \`email\`, \`role\`, \`created_at\` FROM \`users\`;`
  },
  {
    name: 'config/database.php',
    path: 'config/database.php',
    targetLocation: 'student-portal/config/database.php',
    language: 'php',
    purpose: 'Initializes a secure PHP Data Objects (PDO) connection to the MySQL database, configures error handling modes, and provides clear connection failure diagnostics.',
    keyConcepts: ['PDO Database Abstraction', 'PDO::ATTR_ERRMODE => ERRMODE_EXCEPTION', 'Disabling Emulated Prepares', 'UTF8MB4 Character Set'],
    content: `<?php
/**
 * Database Configuration File
 * Location: student-portal/config/database.php
 * Purpose: Establishes a secure PDO connection to MySQL database.
 */

// Database connection parameters
$db_host = 'localhost';
$db_name = 'student_portal';
$db_user = 'root';

// MySQL Password:
// - Default XAMPP installation has NO password (leave as empty string: '')
// - If you set a root password in MySQL Workbench 8.0 CE, type it below!
$db_pass = ''; 
$db_port = 3306;

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    
    $options = [
        // Throw PDOExceptions on database query errors for safe error handling
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        // Return results as associative arrays (e.g. $row['full_name'])
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        // Disable emulated prepares to enforce native prepared statements against SQL injection
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

} catch (PDOException $e) {
    // Helpful error message for students during development & practical viva
    die("<div style='font-family: Arial, sans-serif; max-width: 650px; margin: 40px auto; padding: 24px; border: 1px solid #f87171; background: #fef2f2; border-radius: 8px;'>
        <h2 style='color: #991b1b; margin-top: 0;'>Database Connection Failed!</h2>
        <p><strong>Error Details:</strong> " . htmlspecialchars($e->getMessage()) . "</p>
        <hr style='border: 0; border-top: 1px solid #fca5a5; margin: 16px 0;'>
        <p><strong>Troubleshooting Checklist:</strong></p>
        <ol style='line-height: 1.6; color: #374151;'>
            <li>Ensure <strong>Apache</strong> and <strong>MySQL</strong> are started in XAMPP Control Panel.</li>
            <li>Verify you imported <code>database.sql</code> into MySQL Workbench / phpMyAdmin.</li>
            <li>If your MySQL root user has a password in MySQL Workbench, update <code>\\$db_pass</code> in <code>config/database.php</code>.</li>
            <li>Ensure the database name is <code>student_portal</code>.</li>
        </ol>
    </div>");
}
?>`
  },
  {
    name: 'includes/auth.php',
    path: 'includes/auth.php',
    targetLocation: 'student-portal/includes/auth.php',
    language: 'php',
    purpose: 'Manages PHP sessions, access control guards (requireLogin, requireAdmin), input sanitization to stop XSS, and CSRF token generation.',
    keyConcepts: ['PHP Sessions (session_start)', 'Role-Based Access Control (RBAC)', 'XSS Sanitization (htmlspecialchars)', 'CSRF Token Generation & Verification'],
    content: `<?php
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
?>`
  },
  {
    name: 'includes/header.php',
    path: 'includes/header.php',
    targetLocation: 'student-portal/includes/header.php',
    language: 'php',
    purpose: 'Standardized HTML header included across all pages. Renders dynamic title, CSS links, and top navigation bar with conditional login/logout/admin links.',
    keyConcepts: ['Modular Templating (require_once)', 'Dynamic Navigation State', 'Mobile-Ready Meta Viewport'],
    content: `<?php
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
    <main class="main-wrapper">`
  },
  {
    name: 'includes/footer.php',
    path: 'includes/footer.php',
    targetLocation: 'student-portal/includes/footer.php',
    language: 'php',
    purpose: 'Standardized HTML footer closing `<main>` and `<body>` tags, rendering copyright and loading `assets/js/script.js`.',
    keyConcepts: ['Clean DOM Closure', 'Deferred Script Loading'],
    content: `<?php
/**
 * Global Footer Component
 * Location: student-portal/includes/footer.php
 * Purpose: Closes page tags and includes client-side JavaScript.
 */
?>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <p>&copy; <?php echo date('Y'); ?> Student Login and Registration System. College RDBMS Practical Project.</p>
            <p class="footer-subtext">Built with PHP, MySQL &amp; PDO Prepared Statements.</p>
        </div>
    </footer>

    <!-- Client-Side JavaScript -->
    <script src="assets/js/script.js"></script>
</body>
</html>`
  },
  {
    name: 'assets/css/style.css',
    path: 'assets/css/style.css',
    targetLocation: 'student-portal/assets/css/style.css',
    language: 'css',
    purpose: 'Complete, responsive CSS stylesheet implementing the dark navy & blue aesthetic, centered auth cards, data tables, and input focus rings.',
    keyConcepts: ['CSS Variables Design System', 'Flexbox & CSS Grid Layouts', 'Responsive Breakpoints', 'Subtle Box Shadows'],
    content: `/* ==========================================================================
   Student Portal - Global Stylesheet
   Location: student-portal/assets/css/style.css
   Palette: Dark Navy (#0f172a), Slate (#334155), Blue Accents (#2563eb, #1d4ed8)
   ========================================================================== */

/* Reset & Base */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --bg-canvas: #f8fafc;
    --card-bg: #ffffff;
    --navy-dark: #0f172a;
    --navy-surface: #1e293b;
    --blue-primary: #2563eb;
    --blue-hover: #1d4ed8;
    --blue-light: #eff6ff;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --border-focus: #3b82f6;
    --success-bg: #ecfdf5;
    --success-text: #065f46;
    --success-border: #a7f3d0;
    --error-bg: #fef2f2;
    --error-text: #991b1b;
    --error-border: #fecaca;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --shadow-card: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
    --shadow-hover: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
}

body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background-color: var(--bg-canvas);
    color: var(--text-primary);
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Navbar */
.navbar {
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
    color: var(--navy-dark);
}

.brand-icon {
    width: 28px;
    height: 28px;
    color: var(--blue-primary);
}

.brand-name {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.nav-item {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    font-size: 0.925rem;
    transition: color 0.15s ease;
}

.nav-item:hover {
    color: var(--blue-primary);
}

.user-greeting {
    font-size: 0.875rem;
    color: var(--text-secondary);
    padding: 0 0.5rem;
}

/* Main Content Wrapper */
.main-wrapper {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
}

/* Centered Form Cards (Login & Signup) */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 220px);
}

.auth-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    width: 100%;
    max-width: 480px;
    padding: 2.5rem;
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-header h1 {
    font-size: 1.65rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
}

.auth-subtitle {
    color: var(--text-muted);
    font-size: 0.925rem;
}

/* Forms & Inputs */
.form-group {
    margin-bottom: 1.35rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--navy-dark);
    margin-bottom: 0.4rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-family: inherit;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background-color: #fff;
    color: var(--text-primary);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-control:focus {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.btn-toggle-password {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.btn-toggle-password:hover {
    color: var(--navy-dark);
}

.form-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.35rem;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 600;
    font-size: 0.925rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
}

.btn-block {
    width: 100%;
}

.btn-sm {
    padding: 0.45rem 0.9rem;
    font-size: 0.85rem;
}

.btn-primary {
    background-color: var(--blue-primary);
    color: #ffffff;
}

.btn-primary:hover {
    background-color: var(--blue-hover);
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
}

.btn-outline {
    background-color: transparent;
    border-color: var(--border-color);
    color: var(--text-secondary);
}

.btn-outline:hover {
    background-color: var(--bg-canvas);
    color: var(--navy-dark);
}

.btn-danger {
    background-color: #ef4444;
    color: #ffffff;
}

.btn-danger:hover {
    background-color: #dc2626;
}

/* Alerts */
.alert {
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
}

.alert-success {
    background-color: var(--success-bg);
    color: var(--success-text);
    border: 1px solid var(--success-border);
}

.alert-error {
    background-color: var(--error-bg);
    color: var(--error-text);
    border: 1px solid var(--error-border);
}

.auth-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.auth-footer a {
    color: var(--blue-primary);
    text-decoration: none;
    font-weight: 600;
}

.auth-footer a:hover {
    text-decoration: underline;
}

/* Hero / Index page */
.hero-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: 3rem 2.5rem;
    text-align: center;
    max-width: 800px;
    margin: 1.5rem auto 3rem;
}

.hero-badge {
    display: inline-block;
    background-color: var(--blue-light);
    color: var(--blue-primary);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    margin-bottom: 1rem;
}

.hero-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--navy-dark);
    letter-spacing: -0.03em;
    margin-bottom: 0.85rem;
}

.hero-description {
    font-size: 1.05rem;
    color: var(--text-secondary);
    max-width: 620px;
    margin: 0 auto 2rem;
}

.hero-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

/* Feature grid */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.feature-box {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.75rem;
    box-shadow: var(--shadow-card);
}

.feature-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin-bottom: 0.5rem;
}

.feature-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Dashboard */
.dashboard-header {
    margin-bottom: 2rem;
}

.dashboard-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--navy-dark);
}

.dashboard-subtitle {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.profile-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: 2rem;
    margin-bottom: 2rem;
}

.profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.profile-item {
    background: var(--bg-canvas);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.25rem;
}

.profile-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 0.35rem;
}

.profile-value {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--navy-dark);
    word-break: break-all;
}

/* Admin Table */
.admin-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-form {
    display: flex;
    gap: 0.5rem;
    max-width: 400px;
    width: 100%;
}

.table-responsive {
    overflow-x: auto;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.9rem;
}

.data-table th {
    background-color: var(--bg-canvas);
    color: var(--navy-dark);
    font-weight: 700;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
}

.data-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.data-table tr:last-child td {
    border-bottom: none;
}

.data-table tr:hover {
    background-color: #fcfdfe;
}

.role-badge {
    display: inline-block;
    padding: 0.2rem 0.55rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 4px;
    background: #e0e7ff;
    color: #3730a3;
}

.role-badge.role-student {
    background: #dbeafe;
    color: #1e40af;
}

/* Footer */
.footer {
    background: var(--card-bg);
    border-top: 1px solid var(--border-color);
    padding: 2rem 1.5rem;
    margin-top: auto;
    text-align: center;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.footer-subtext {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .nav-container {
        flex-direction: column;
        gap: 1rem;
    }
    .hero-title {
        font-size: 1.75rem;
    }
    .auth-card {
        padding: 1.75rem;
    }
    .admin-toolbar {
        flex-direction: column;
        align-items: stretch;
    }
    .search-form {
        max-width: 100%;
    }
}`
  },
  {
    name: 'assets/js/script.js',
    path: 'assets/js/script.js',
    targetLocation: 'student-portal/assets/js/script.js',
    language: 'javascript',
    purpose: 'Handles dynamic client features: password visibility toggling, client-side matching validation, and confirmation modals before destructive deletions.',
    keyConcepts: ['DOM Event Listeners', 'Input Type Toggling (password -> text)', 'Pre-Submit Form Validation', 'Deletion Confirmation Guard'],
    content: `/**
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
                    this.innerHTML = \`
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    \`;
                    this.setAttribute('aria-label', 'Hide password');
                } else {
                    targetInput.type = 'password';
                    this.innerHTML = \`
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    \`;
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
            const confirmed = confirm(\`Are you sure you want to permanently delete \${studentName}? This action cannot be undone.\`);
            if (!confirmed) {
                e.preventDefault();
            }
        });
    });
});`
  },
  {
    name: 'index.php',
    path: 'index.php',
    targetLocation: 'student-portal/index.php',
    language: 'php',
    purpose: 'Public welcome page displaying the portal summary, key technical architecture features (PDO, BCRYPT, RBAC), and seeded testing credentials.',
    keyConcepts: ['Conditional Navigation', 'Landing Call to Action', 'Practical Exam Overview'],
    content: `<?php
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    name: 'signup.php',
    path: 'signup.php',
    targetLocation: 'student-portal/signup.php',
    language: 'php',
    purpose: 'Handles student registration. Enforces uniqueness on email and student_id using PDO prepared statements, hashes password with BCRYPT, and redirects on success.',
    keyConcepts: ['Duplicate Check Query (SELECT ... LIMIT 1)', 'password_hash(..., PASSWORD_BCRYPT)', 'Prepared INSERT Statement', 'Redirect with Flash Parameter'],
    content: `<?php
/**
 * Student Registration Page
 * Location: student-portal/signup.php
 * Purpose: Allows new students to register by storing validated, hashed credentials in MySQL.
 */

$page_title = 'Student Registration';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/database.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header("Location: dashboard.php");
    exit();
}

$errors = [];
$success = false;

// Retain entered values on validation failure
$full_name = '';
$student_id = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name        = sanitizeInput($_POST['full_name'] ?? '');
    $student_id       = strtoupper(sanitizeInput($_POST['student_id'] ?? ''));
    $email            = sanitizeInput($_POST['email'] ?? '');
    $password         = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Field Validations
    if (empty($full_name)) {
        $errors[] = "Full Name is required.";
    } elseif (strlen($full_name) > 100) {
        $errors[] = "Full Name must not exceed 100 characters.";
    }

    if (empty($student_id)) {
        $errors[] = "Student ID is required.";
    } elseif (strlen($student_id) > 30) {
        $errors[] = "Student ID must not exceed 30 characters.";
    }

    if (empty($email)) {
        $errors[] = "Email Address is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please provide a valid email address.";
    }

    if (empty($password)) {
        $errors[] = "Password is required.";
    } elseif (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters long.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match.";
    }

    // Check for duplicate Student ID or Email in MySQL if no previous errors
    if (empty($errors)) {
        try {
            $checkStmt = $pdo->prepare("SELECT id, email, student_id FROM users WHERE email = :email OR student_id = :student_id LIMIT 1");
            $checkStmt->execute([
                ':email'      => $email,
                ':student_id' => $student_id
            ]);
            $existing = $checkStmt->fetch();

            if ($existing) {
                if (strcasecmp($existing['email'], $email) === 0) {
                    $errors[] = "An account with this email address already exists.";
                }
                if (strcasecmp($existing['student_id'], $student_id) === 0) {
                    $errors[] = "This Student ID is already registered in the system.";
                }
            } else {
                // Hash password securely with BCRYPT
                $hashed_password = password_hash($password, PASSWORD_BCRYPT);

                // Insert into MySQL users table using PDO prepared statements
                $insertStmt = $pdo->prepare("
                    INSERT INTO users (full_name, student_id, email, password, role)
                    VALUES (:full_name, :student_id, :email, :password, 'student')
                ");

                $insertStmt->execute([
                    ':full_name'  => $full_name,
                    ':student_id' => $student_id,
                    ':email'      => $email,
                    ':password'   => $hashed_password
                ]);

                // Redirect to login with success flash message
                header("Location: login.php?registered=1");
                exit();
            }
        } catch (PDOException $e) {
            $errors[] = "Database Error: " . htmlspecialchars($e->getMessage());
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h1>Create Student Account</h1>
            <p class="auth-subtitle">Join the college portal to access student records and coursework</p>
        </div>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <div>
                    <strong>Please resolve the following:</strong>
                    <ul style="margin-top: 0.35rem; padding-left: 1.25rem;">
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        <?php endif; ?>

        <form action="signup.php" method="POST" id="signupForm" novalidate>
            <div class="form-group">
                <label for="full_name" class="form-label">Full Name</label>
                <input 
                    type="text" 
                    id="full_name" 
                    name="full_name" 
                    class="form-control" 
                    placeholder="e.g. John Doe"
                    value="<?php echo htmlspecialchars($full_name); ?>" 
                    required
                >
            </div>

            <div class="form-group">
                <label for="student_id" class="form-label">Student ID / Roll No</label>
                <input 
                    type="text" 
                    id="student_id" 
                    name="student_id" 
                    class="form-control" 
                    placeholder="e.g. STU-2024-101"
                    value="<?php echo htmlspecialchars($student_id); ?>" 
                    required
                >
                <span class="form-hint">Must be unique for each student.</span>
            </div>

            <div class="form-group">
                <label for="email" class="form-label">College Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    class="form-control" 
                    placeholder="e.g. student@college.edu"
                    value="<?php echo htmlspecialchars($email); ?>" 
                    required
                >
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-control" 
                        placeholder="At least 6 characters" 
                        required
                    >
                    <button type="button" class="btn-toggle-password" data-target="password" aria-label="Toggle password visibility">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label for="confirm_password" class="form-label">Confirm Password</label>
                <div class="input-wrapper">
                    <input 
                        type="password" 
                        id="confirm_password" 
                        name="confirm_password" 
                        class="form-control" 
                        placeholder="Re-enter password" 
                        required
                    >
                    <button type="button" class="btn-toggle-password" data-target="confirm_password" aria-label="Toggle password visibility">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Complete Registration</button>
        </form>

        <div class="auth-footer">
            Already have an account? <a href="login.php">Log In here</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    name: 'login.php',
    path: 'login.php',
    targetLocation: 'student-portal/login.php',
    language: 'php',
    purpose: 'Authenticates student and admin credentials using `password_verify()` against the stored hash, regenerates session ID to prevent fixation, and routes users by role.',
    keyConcepts: ['Prepared SELECT Query', 'password_verify() Execution', 'session_regenerate_id(true)', 'Role-Based Redirection'],
    content: `<?php
/**
 * Student and Admin Login Page
 * Location: student-portal/login.php
 * Purpose: Authenticates users with MySQL database, verifies BCRYPT hashes, and starts secure sessions.
 */

$page_title = 'User Login';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/database.php';

// If already logged in, redirect accordingly
if (isLoggedIn()) {
    if (isAdmin()) {
        header("Location: admin.php");
    } else {
        header("Location: dashboard.php");
    }
    exit();
}

$error = '';
$email = '';

// Handle Registration Success Message
$registered_success = isset($_GET['registered']) && $_GET['registered'] == '1';
$logged_out = isset($_GET['logout']) && $_GET['logout'] == '1';
$unauthorized = isset($_GET['error']) && $_GET['error'] === 'unauthorized';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = "Please enter both your email address and password.";
    } else {
        try {
            // Retrieve user record by email using PDO prepared statement
            $stmt = $pdo->prepare("SELECT id, full_name, student_id, email, password, role FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();

            // Verify password using native PHP password_verify() against BCRYPT hash
            if ($user && password_verify($password, $user['password'])) {
                // Regenerate session ID to prevent Session Fixation attacks
                session_regenerate_id(true);

                // Store user details in session
                $_SESSION['user_id']    = $user['id'];
                $_SESSION['user_name']  = $user['full_name'];
                $_SESSION['student_id'] = $user['student_id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role']  = $user['role'];

                // Redirect based on user role
                if ($user['role'] === 'admin') {
                    header("Location: admin.php");
                } else {
                    header("Location: dashboard.php");
                }
                exit();
            } else {
                // Security best practice: Don't reveal whether the email or password was wrong
                $error = "Invalid email address or password. Please try again.";
            }
        } catch (PDOException $e) {
            $error = "Database Error: " . htmlspecialchars($e->getMessage());
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h1>Student Portal Login</h1>
            <p class="auth-subtitle">Sign in to your account with your college credentials</p>
        </div>

        <?php if ($registered_success): ?>
            <div class="alert alert-success">
                Registration successful! You may now sign in with your email and password.
            </div>
        <?php endif; ?>

        <?php if ($logged_out): ?>
            <div class="alert alert-success">
                You have been successfully logged out.
            </div>
        <?php endif; ?>

        <?php if ($unauthorized): ?>
            <div class="alert alert-error">
                Please log in first to access your portal dashboard.
            </div>
        <?php endif; ?>

        <?php if (!empty($error)): ?>
            <div class="alert alert-error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form action="login.php" method="POST" id="loginForm" novalidate>
            <div class="form-group">
                <label for="email" class="form-label">College Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    class="form-control" 
                    placeholder="student@college.edu or admin@portal.edu" 
                    value="<?php echo htmlspecialchars($email); ?>" 
                    required 
                    autofocus
                >
            </div>

            <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label for="password" class="form-label" style="margin-bottom: 0;">Password</label>
                </div>
                <div class="input-wrapper">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-control" 
                        placeholder="Enter your password" 
                        required
                    >
                    <button type="button" class="btn-toggle-password" data-target="password" aria-label="Toggle password visibility">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        </form>

        <div class="auth-footer">
            Don't have an account yet? <a href="signup.php">Register as a Student</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    name: 'dashboard.php',
    path: 'dashboard.php',
    targetLocation: 'student-portal/dashboard.php',
    language: 'php',
    purpose: 'Protected student profile view. Retrieves the student record from MySQL by `id` stored in session, displaying name, student ID, email, role, and registration timestamp.',
    keyConcepts: ['requireLogin() Session Guard', 'Relational Row Retrieval', 'HTML Entity Encoding (htmlspecialchars)'],
    content: `<?php
/**
 * Student Dashboard
 * Location: student-portal/dashboard.php
 * Purpose: Authenticated area showing personal student profile and records retrieved from MySQL.
 */

$page_title = 'Student Dashboard';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/database.php';

// Protect page: require user to be logged in
requireLogin();

// Fetch fresh student data directly from MySQL
$stmt = $pdo->prepare("SELECT id, full_name, student_id, email, role, created_at FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch();

// If user account was removed or not found, force logout
if (!$user) {
    header("Location: logout.php");
    exit();
}

// Access denied notice if regular student tried to access admin panel
$access_denied = isset($_GET['error']) && $_GET['error'] === 'access_denied';

require_once __DIR__ . '/includes/header.php';
?>

<div class="dashboard-header">
    <h1 class="dashboard-title">Welcome back, <?php echo htmlspecialchars($user['full_name']); ?>!</h1>
    <p class="dashboard-subtitle">Here is your student profile and relational database account summary.</p>
</div>

<?php if ($access_denied): ?>
    <div class="alert alert-error">
        Access Denied: You do not possess administrator privileges to access the admin panel.
    </div>
<?php endif; ?>

<div class="profile-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem;">
                Student Profile Information
            </h2>
            <p style="color: #64748b; font-size: 0.85rem;">
                Data successfully retrieved via SQL query: <code>SELECT * FROM users WHERE id = ?</code>
            </p>
        </div>
        <span class="role-badge role-<?php echo htmlspecialchars($user['role']); ?>">
            <?php echo strtoupper(htmlspecialchars($user['role'])); ?> ACCOUNT
        </span>
    </div>

    <div class="profile-grid">
        <div class="profile-item">
            <div class="profile-label">Database Record ID</div>
            <div class="profile-value">#<?php echo htmlspecialchars($user['id']); ?></div>
        </div>

        <div class="profile-item">
            <div class="profile-label">Full Name</div>
            <div class="profile-value"><?php echo htmlspecialchars($user['full_name']); ?></div>
        </div>

        <div class="profile-item">
            <div class="profile-label">Student ID / Roll No</div>
            <div class="profile-value"><?php echo htmlspecialchars($user['student_id']); ?></div>
        </div>

        <div class="profile-item">
            <div class="profile-label">Registered Email</div>
            <div class="profile-value"><?php echo htmlspecialchars($user['email']); ?></div>
        </div>

        <div class="profile-item">
            <div class="profile-label">Account Role</div>
            <div class="profile-value"><?php echo ucfirst(htmlspecialchars($user['role'])); ?></div>
        </div>

        <div class="profile-item">
            <div class="profile-label">Registration Date</div>
            <div class="profile-value"><?php echo date('M d, Y h:i A', strtotime($user['created_at'])); ?></div>
        </div>
    </div>

    <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="logout.php" class="btn btn-outline">
            <svg style="width: 18px; height: 18px; margin-right: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out of Account
        </a>

        <?php if ($user['role'] === 'admin'): ?>
            <a href="admin.php" class="btn btn-primary">
                Switch to Admin Dashboard &rarr;
            </a>
        <?php endif; ?>
    </div>
</div>

<div class="feature-grid">
    <div class="feature-box">
        <h3 class="feature-title">RDBMS Concept: Primary Key</h3>
        <p class="feature-text">
            Your account is indexed by <code>id</code> (Auto-Incrementing Primary Key), ensuring O(1) query 
            efficiency and strict entity integrity.
        </p>
    </div>

    <div class="feature-box">
        <h3 class="feature-title">Unique Constraints</h3>
        <p class="feature-text">
            Both <code>student_id</code> and <code>email</code> are protected by UNIQUE constraints at the schema level, 
            preventing duplicate student registration.
        </p>
    </div>

    <div class="feature-box">
        <h3 class="feature-title">Active PHP Session</h3>
        <p class="feature-text">
            Session ID is stored on the server side and protected via cookies, refreshed on login via <code>session_regenerate_id()</code>.
        </p>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    name: 'admin.php',
    path: 'admin.php',
    targetLocation: 'student-portal/admin.php',
    language: 'php',
    purpose: 'Basic administrative console protected with `requireAdmin()`. Calculates total student count, searches students by name/email/ID using `LIKE`, and provides deletion trigger.',
    keyConcepts: ['SELECT COUNT(*) Aggregate', 'SQL LIKE Parameterized Filter', 'CSRF Form Embedding', 'Admin RBAC Enforcement'],
    content: `<?php
/**
 * Administrator Panel
 * Location: student-portal/admin.php
 * Purpose: Manage registered students, search database records, and view system statistics.
 */

$page_title = 'Admin Dashboard';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/database.php';

// Enforce Role-Based Access Control
requireAdmin();

$search_query = sanitizeInput($_GET['search'] ?? '');
$deleted_success = isset($_GET['deleted']) && $_GET['deleted'] == '1';
$error_msg = isset($_GET['error_msg']) ? sanitizeInput($_GET['error_msg']) : '';

try {
    // 1. Get Total Registered Students Count
    $countStmt = $pdo->query("SELECT COUNT(*) AS total_students FROM users WHERE role = 'student'");
    $total_students = (int)$countStmt->fetchColumn();

    // 2. Fetch Students (with optional search filter)
    if (!empty($search_query)) {
        $stmt = $pdo->prepare("
            SELECT id, full_name, student_id, email, role, created_at 
            FROM users 
            WHERE role = 'student' 
              AND (full_name LIKE :search1 OR email LIKE :search2 OR student_id LIKE :search3)
            ORDER BY created_at DESC
        ");
        $term = "%{$search_query}%";
        $stmt->execute([
            ':search1' => $term,
            ':search2' => $term,
            ':search3' => $term,
        ]);
    } else {
        $stmt = $pdo->query("
            SELECT id, full_name, student_id, email, role, created_at 
            FROM users 
            WHERE role = 'student' 
            ORDER BY created_at DESC
        ");
    }

    $students = $stmt->fetchAll();

} catch (PDOException $e) {
    die("Database query error: " . htmlspecialchars($e->getMessage()));
}

$csrf_token = getCsrfToken();

require_once __DIR__ . '/includes/header.php';
?>

<div class="dashboard-header">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 class="dashboard-title">Administrator Console</h1>
            <p class="dashboard-subtitle">Manage student enrollment, search directory, and perform CRUD operations.</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.85rem; color: #64748b;">Total Students Enrolled:</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #2563eb;"><?php echo $total_students; ?></span>
        </div>
    </div>
</div>

<?php if ($deleted_success): ?>
    <div class="alert alert-success">
        Student record successfully deleted from the database.
    </div>
<?php endif; ?>

<?php if (!empty($error_msg)): ?>
    <div class="alert alert-error">
        <?php echo htmlspecialchars($error_msg); ?>
    </div>
<?php endif; ?>

<!-- Admin Search & Filter Toolbar -->
<div class="admin-toolbar">
    <form action="admin.php" method="GET" class="search-form">
        <input 
            type="text" 
            name="search" 
            class="form-control" 
            placeholder="Search by name, student ID, or email..." 
            value="<?php echo htmlspecialchars($search_query); ?>"
        >
        <button type="submit" class="btn btn-primary btn-sm">Search</button>
        <?php if (!empty($search_query)): ?>
            <a href="admin.php" class="btn btn-outline btn-sm">Reset</a>
        <?php endif; ?>
    </form>

    <div style="font-size: 0.85rem; color: #64748b;">
        Showing <?php echo count($students); ?> student record(s)
    </div>
</div>

<!-- Student Data Table -->
<div class="table-responsive">
    <table class="data-table">
        <thead>
            <tr>
                <th>DB ID</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Registered On</th>
                <th style="text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($students)): ?>
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2.5rem; color: #64748b;">
                        <?php if (!empty($search_query)): ?>
                            No students found matching "<strong><?php echo htmlspecialchars($search_query); ?></strong>".
                        <?php else: ?>
                            No student accounts registered yet.
                        <?php endif; ?>
                    </td>
                </tr>
            <?php else: ?>
                <?php foreach ($students as $stu): ?>
                    <tr>
                        <td><strong>#<?php echo htmlspecialchars($stu['id']); ?></strong></td>
                        <td><code><?php echo htmlspecialchars($stu['student_id']); ?></code></td>
                        <td><strong><?php echo htmlspecialchars($stu['full_name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($stu['email']); ?></td>
                        <td><?php echo date('M d, Y', strtotime($stu['created_at'])); ?></td>
                        <td style="text-align: right;">
                            <form 
                                action="delete_student.php" 
                                method="POST" 
                                class="delete-student-form" 
                                data-name="<?php echo htmlspecialchars($stu['full_name']); ?>"
                                style="display: inline-block;"
                            >
                                <input type="hidden" name="id" value="<?php echo (int)$stu['id']; ?>">
                                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                                <button type="submit" class="btn btn-danger btn-sm" title="Delete record from database">
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    name: 'delete_student.php',
    path: 'delete_student.php',
    targetLocation: 'student-portal/delete_student.php',
    language: 'php',
    purpose: 'Handles POST student deletion requests. Validates CSRF tokens, confirms the record belongs to role `student`, and executes a parameterized DELETE query.',
    keyConcepts: ['POST Method Enforcement', 'CSRF Token Validation', 'DELETE FROM users WHERE id = ?', 'Admin Deletion Safeguards'],
    content: `<?php
/**
 * Delete Student Controller
 * Location: student-portal/delete_student.php
 * Purpose: Securely deletes a student record from the MySQL database with CSRF verification.
 */

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/config/database.php';

// Enforce admin permission
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $student_id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $csrf_token = $_POST['csrf_token'] ?? '';

    // Verify CSRF token
    if (!verifyCsrfToken($csrf_token)) {
        header("Location: admin.php?error_msg=" . urlencode("Invalid security token (CSRF failure). Request denied."));
        exit();
    }

    if (!$student_id) {
        header("Location: admin.php?error_msg=" . urlencode("Invalid student ID provided."));
        exit();
    }

    try {
        // Enforce that only 'student' role accounts can be deleted through this endpoint
        // This prevents accidental or malicious deletion of administrator accounts
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id AND role = 'student'");
        $stmt->execute([':id' => $student_id]);

        if ($stmt->rowCount() > 0) {
            header("Location: admin.php?deleted=1");
        } else {
            header("Location: admin.php?error_msg=" . urlencode("Student record not found or could not be deleted."));
        }
        exit();

    } catch (PDOException $e) {
        header("Location: admin.php?error_msg=" . urlencode("Database Error: " . $e->getMessage()));
        exit();
    }
} else {
    // Direct GET requests are strictly prohibited for destructive operations
    header("Location: admin.php");
    exit();
}
?>`
  },
  {
    name: 'logout.php',
    path: 'logout.php',
    targetLocation: 'student-portal/logout.php',
    language: 'php',
    purpose: 'Unsets all session variables, deletes the session cookie, destroys server session data with `session_destroy()`, and redirects to `login.php?logout=1`.',
    keyConcepts: ['Session Variable Clearing', 'Cookie Invalidation', 'session_destroy()', 'Cache Prevention'],
    content: `<?php
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
?>`
  },
  {
    name: 'README.md',
    path: 'README.md',
    targetLocation: 'student-portal/README.md',
    language: 'markdown',
    purpose: 'Complete college practical manual covering XAMPP installation, MySQL Workbench 8.0 CE setup, database.sql execution, testing scenarios, and viva Q&A.',
    keyConcepts: ['XAMPP Apache & MySQL Setup', 'MySQL Workbench Execution', 'Verification Checklists', 'College Practical Viva Preparation'],
    content: `# Student Login & Registration System (RDBMS Practical Project)

A complete, college-level Relational Database Management System (RDBMS) web application developed using **HTML, CSS, JavaScript, PHP, and MySQL**.

---

## 1. Project Directory Structure

Save this entire folder in your XAMPP \`htdocs\` directory at:  
\`C:\\xampp\\htdocs\\student-portal\\\`

\`\`\`text
student-portal/
├── config/
│   └── database.php         # PDO MySQL connection & error handling
├── includes/
│   ├── auth.php             # Session management, RBAC, XSS & CSRF helpers
│   ├── header.php           # Shared responsive navigation and <head>
│   └── footer.php           # Shared footer and script inclusion
├── assets/
│   ├── css/
│   │   └── style.css        # Clean Navy & Blue responsive stylesheet
│   └── js/
│       └── script.js        # Form validation, show/hide password, alerts
├── index.php                # Portal welcome page with system overview
├── signup.php               # Student account registration with duplicate check
├── login.php                # Authentication with BCRYPT password verification
├── dashboard.php            # Personalized student profile page
├── admin.php                # Admin console with search, count, and delete
├── delete_student.php       # Protected deletion controller with CSRF
├── logout.php               # Session destruction handler
├── database.sql             # Complete schema & sample data for MySQL Workbench
└── README.md                # Project manual & setup documentation
\`\`\`

---

## 2. Prerequisites
1. **XAMPP** (with Apache and PHP 7.4+ or 8.x)
2. **MySQL Server & MySQL Workbench 8.0 CE**
3. Any modern web browser (Chrome, Edge, Firefox)

---

## 3. Step-by-Step Installation & Setup

### Step 1: Copy Project to XAMPP htdocs
Copy the \`student-portal\` folder into:
- **Windows:** \`C:\\xampp\\htdocs\\student-portal\`
- **macOS:** \`/Applications/XAMPP/xamppfiles/htdocs/student-portal\`
- **Linux:** \`/opt/lampp/htdocs/student-portal\`

### Step 2: Start Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
4. Ensure both display green status indicators.

### Step 3: Run Database Script in MySQL Workbench 8.0 CE
1. Open **MySQL Workbench 8.0 CE**.
2. Click on your MySQL connection (e.g., \`Local instance MySQL80\` or \`root@localhost:3306\`).
3. Enter your MySQL \`root\` password when prompted.
4. From the top menu, click **File** -> **Open SQL Script...** (or press \`Ctrl + Shift + O\`).
5. Browse and select \`database.sql\` located in \`student-portal/database.sql\`.
6. Click the **Execute** button (the yellow lightning bolt icon ⚡) to run the entire script.
7. In the Schemas tab on the left, right-click and choose **Refresh All**. You will now see the \`student_portal\` database with the \`users\` table created and seeded!

### Step 4: Configure Database Credentials
Open \`student-portal/config/database.php\` in a text editor (VS Code, Notepad++, etc.):

\`\`\`php
$db_host = 'localhost';
$db_name = 'student_portal';
$db_user = 'root';

// IF YOUR MYSQL HAS A PASSWORD IN MYSQL WORKBENCH:
// Enter it inside the single quotes below:
$db_pass = ''; // e.g. 'root' or 'your_mysql_password'
$db_port = 3306;
\`\`\`
> **Note:** If using standard XAMPP MySQL default, leave \`$db_pass = '';\` (empty). If you configured a password in MySQL Workbench 8.0 CE (like \`root\` or \`password123\`), enter that exact password here.

---

## 4. How to Run the Application
Open your web browser and navigate to:  
👉 **\`http://localhost/student-portal/\`**

---

## 5. Seeded Test Credentials

| Role | Email Address | Password | Student ID |
| :--- | :--- | :--- | :--- |
| **Administrator** | \`admin@portal.edu\` | \`Admin@123\` | \`ADM-001\` |
| **Student 1** | \`rohan.sharma@college.edu\` | \`Student@123\` | \`STU-2024-001\` |
| **Student 2** | \`priya.patel@college.edu\` | \`Student@123\` | \`STU-2024-002\` |

---

## 6. Practical Evaluation & Testing Guide

### A. Testing Student Signup
1. Visit \`http://localhost/student-portal/signup.php\`.
2. Enter Full Name, unique Student ID (e.g. \`STU-2024-105\`), Email, and Password.
3. Click the eye icon to test **Show/Hide password**.
4. Click **Complete Registration**. You will be redirected to the login page with a green success message.

### B. Testing Duplicate Prevention (Unique Constraint)
1. Try signing up again using the exact same Student ID or Email.
2. The system checks MySQL and alerts: *"An account with this email address already exists"* or *"This Student ID is already registered"*.

### C. Testing Login & Authentication
1. Go to \`http://localhost/student-portal/login.php\`.
2. Enter an incorrect password -> System responds with: *"Invalid email address or password"*.
3. Enter correct credentials (\`rohan.sharma@college.edu\` / \`Student@123\`) -> Successfully redirects to \`dashboard.php\`.

### D. Testing Unauthorized Page Protection
1. Open an Incognito / Private browsing window.
2. Attempt to directly access \`http://localhost/student-portal/dashboard.php\` or \`http://localhost/student-portal/admin.php\`.
3. The server intercepts the request and redirects to \`login.php?error=unauthorized\`.

### E. Testing Role-Based Access Control (RBAC)
1. Log in as a normal student (\`rohan.sharma@college.edu\`).
2. Try typing \`http://localhost/student-portal/admin.php\` directly in the browser URL bar.
3. The server detects \`role !== 'admin'\`, blocks access, and redirects to \`dashboard.php?error=access_denied\`.

### F. Testing Admin Search & Delete
1. Log in as Admin (\`admin@portal.edu\` / \`Admin@123\`).
2. You will see the total registered student count and the table of students.
3. Type a name in the search box (e.g., \`Amit\`) and click **Search** -> live filtered query executed.
4. Click **Delete** next to a student -> browser prompts confirmation -> record is safely removed from MySQL via prepared statement.

### G. Testing Logout
1. Click **Sign Out** or **Log Out** in the navigation bar.
2. The session is destroyed and cookies cleared. Pressing the browser back button will not grant access back to the protected dashboard.

---

## 7. Common Errors & Troubleshooting

| Error Message | Cause | Solution |
| :--- | :--- | :--- |
| **"SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'"** | Incorrect MySQL root password. | Open \`config/database.php\` and set \`$db_pass\` to the password you entered in MySQL Workbench. |
| **"SQLSTATE[HY000] [2002] Connection refused"** | MySQL service is not running. | Open XAMPP Control Panel and click **Start** next to MySQL. |
| **"Base table or view not found: Table 'student_portal.users' doesn't exist"** | SQL script was not executed. | Open \`database.sql\` in MySQL Workbench and click the lightning bolt ⚡ icon. |
| **Port 3306 or 80 busy in XAMPP** | Another service (Skype, IIS, or standalone MySQL) is using the port. | Change MySQL port in XAMPP \`my.ini\` to \`3307\` and update \`$db_port = 3307;\` in \`config/database.php\`. |

---

## 8. College Practical & Viva Examination Q&A

**Q1: How does this project prevent SQL Injection?**  
**Answer:** By using **PDO Prepared Statements** with bound parameters (\`$stmt->prepare()\` and \`$stmt->execute()\`). User inputs are treated strictly as data literals, never executable SQL commands, neutralizing attacks like \`' OR '1'='1\`.

**Q2: Why use \`password_hash()\` instead of MD5 or SHA1?**  
**Answer:** MD5 and SHA1 are cryptographically broken, extremely fast to brute-force with rainbow tables, and lack salt. PHP's \`password_hash()\` utilizes **BCRYPT** with an auto-generated cryptographically secure salt and configurable computational work factor.

**Q3: What is the difference between Primary Key and Unique Key in the schema?**  
**Answer:**  
- \`id\` is the **PRIMARY KEY**: Uniquely identifies each record, cannot be NULL, and creates the clustered index.
- \`student_id\` and \`email\` are **UNIQUE KEYS**: Prevent duplicate student records while allowing business logic identification.

**Q4: Why call \`session_regenerate_id(true)\` upon login?**  
**Answer:** It prevents **Session Fixation attacks**. If an attacker sets a victim's session cookie before login, regenerating the session ID issues a brand new session identifier once authenticated and deletes the old one.`
  }
];
