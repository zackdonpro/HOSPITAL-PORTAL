<?php
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
