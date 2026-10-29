<?php
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
