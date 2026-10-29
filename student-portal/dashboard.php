<?php
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
            Your account is indexed by <code>id</code> (Auto-Incrementing Primary Key), ensuring $O(1)$ query 
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
