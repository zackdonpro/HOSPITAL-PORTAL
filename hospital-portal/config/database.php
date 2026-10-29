<?php
/**
 * Database Connection File
 * Location: hospital-portal/config/database.php
 * Configured with root password: arcsinsin@Vin06
 */

$db_host = 'localhost';
$db_name = 'hospital_db';
$db_user = 'root';
$db_pass = 'arcsinsin@Vin06'; // User's MySQL Workbench 8.0 CE root password
$db_port = 3306;

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'MySQL Database Connection Failed: ' . $e->getMessage(),
        'tip' => 'Ensure MySQL service is running on port 3306 and password is arcsinsin@Vin06.'
    ]);
    exit();
}
?>
