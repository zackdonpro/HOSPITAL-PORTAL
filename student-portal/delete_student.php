<?php
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
?>
