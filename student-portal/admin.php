<?php
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
