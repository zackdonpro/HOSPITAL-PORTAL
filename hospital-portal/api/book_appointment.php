<?php
/**
 * Book Doctor Appointment API Endpoint
 * Location: hospital-portal/api/book_appointment.php
 * Inserts appointment record into MySQL `hospital_db.appointments`
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST requests allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$patient_name     = trim($input['patient_name'] ?? '');
$phone            = trim($input['phone'] ?? '');
$department       = trim($input['department'] ?? 'General Medicine');
$doctor_name      = trim($input['doctor_name'] ?? 'Hospital Duty Physician');
$appointment_date = trim($input['appointment_date'] ?? date('Y-m-d'));

if (empty($patient_name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Patient name and phone are required']);
    exit();
}

try {
    // Insert into MySQL Workbench table
    $stmt = $pdo->prepare("
        INSERT INTO appointments (patient_name, phone, department, doctor_name, appointment_date, status)
        VALUES (:patient_name, :phone, :department, :doctor_name, :appointment_date, 'Confirmed')
    ");

    $stmt->execute([
        ':patient_name'     => $patient_name,
        ':phone'            => $phone,
        ':department'       => $department,
        ':doctor_name'      => $doctor_name,
        ':appointment_date' => $appointment_date
    ]);

    $inserted_id = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Appointment booked successfully and recorded in MySQL!',
        'appointment_id' => $inserted_id,
        'mysql_query' => "SELECT * FROM appointments WHERE id = {$inserted_id};"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database Insertion Failed: ' . $e->getMessage()
    ]);
}
?>
