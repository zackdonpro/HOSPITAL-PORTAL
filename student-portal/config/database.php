<?php
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
            <li>If your MySQL root user has a password in MySQL Workbench, update <code>\$db_pass</code> in <code>config/database.php</code>.</li>
            <li>Ensure the database name is <code>student_portal</code>.</li>
        </ol>
    </div>");
}
?>
