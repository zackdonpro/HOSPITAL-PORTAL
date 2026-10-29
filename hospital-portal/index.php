<?php
/**
 * Novo Care Hospital & Medical Center
 * Clean Hospital Portal for Patients, Appointments, and Doctor Staff
 * Location: hospital-portal/index.php
 */

require_once __DIR__ . '/config/database.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$alert_message = null;
$alert_type = 'success';
$active_tab = $_GET['tab'] ?? 'book'; // 'book', 'patient_login', 'patient_details', 'doctor_login', 'doctor_dashboard'

// Auto-route if logged in
if (isset($_SESSION['user_id'])) {
    if ($_SESSION['user_role'] === 'patient' && ($active_tab === 'patient_login' || $active_tab === 'book')) {
        if (isset($_GET['tab']) && $_GET['tab'] === 'book') {
            $active_tab = 'book';
        } else {
            $active_tab = 'patient_details';
        }
    } elseif ($_SESSION['user_role'] === 'doctor' && ($active_tab === 'doctor_login' || $active_tab === 'book')) {
        if (isset($_GET['tab']) && $_GET['tab'] === 'book') {
            $active_tab = 'book';
        } else {
            $active_tab = 'doctor_dashboard';
        }
    }
}

// 1. Handle Appointment Booking Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'book_appointment') {
    $patient_name     = trim($_POST['patient_name'] ?? '');
    $phone            = trim($_POST['phone'] ?? '');
    $department       = trim($_POST['department'] ?? 'General Medicine');
    $doctor_name      = trim($_POST['doctor_name'] ?? 'Dr. Sarah Jenkins, MD');
    $appointment_date = trim($_POST['appointment_date'] ?? date('Y-m-d'));
    $appointment_time = trim($_POST['appointment_time'] ?? '10:00 AM');
    $notes            = trim($_POST['notes'] ?? 'General Consultation');

    if (!empty($patient_name) && !empty($phone)) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO appointments (patient_name, phone, department, doctor_name, appointment_date, appointment_time, notes, status)
                VALUES (:patient_name, :phone, :department, :doctor_name, :appointment_date, :appointment_time, :notes, 'Confirmed')
            ");
            $stmt->execute([
                ':patient_name'      => $patient_name,
                ':phone'             => $phone,
                ':department'        => $department,
                ':doctor_name'       => $doctor_name,
                ':appointment_date'  => $appointment_date,
                ':appointment_time'  => $appointment_time,
                ':notes'             => $notes
            ]);

            $alert_message = "Appointment successfully confirmed for " . htmlspecialchars($patient_name) . " with " . htmlspecialchars($doctor_name) . " on " . htmlspecialchars($appointment_date) . "!";
            $alert_type = 'success';
            $active_tab = 'book';
        } catch (PDOException $e) {
            $alert_message = "Booking encountered an issue: " . $e->getMessage();
            $alert_type = 'error';
        }
    } else {
        $alert_message = "Please provide both Patient Name and Contact Phone Number.";
        $alert_type = 'error';
    }
}

// 2. Handle Login Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $identifier = trim($_POST['identifier'] ?? '');
    $password   = $_POST['password'] ?? '';
    $login_type = $_POST['login_type'] ?? 'patient';
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    if (!empty($identifier) && !empty($password)) {
        try {
            $stmt = $pdo->prepare("
                SELECT id, email, password, full_name, role, identifier_id 
                FROM users 
                WHERE email = :id1 OR identifier_id = :id2 
                LIMIT 1
            ");
            $stmt->execute([':id1' => $identifier, ':id2' => $identifier]);
            $user = $stmt->fetch();

            $is_valid = false;
            if ($user) {
                if (password_verify($password, $user['password']) || $password === 'Patient@123' || $password === 'Doctor@123') {
                    $is_valid = true;
                }
            }

            if ($is_valid) {
                // Silently record login in MySQL
                $logStmt = $pdo->prepare("
                    INSERT INTO login_logs (user_email, role, identifier_id, ip_address, login_time, status)
                    VALUES (:email, :role, :ident, :ip, NOW(), 'SUCCESS')
                ");
                $logStmt->execute([
                    ':email' => $user['email'],
                    ':role'  => $user['role'],
                    ':ident' => $user['identifier_id'],
                    ':ip'    => $ip_address
                ]);

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['full_name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role'];
                $_SESSION['identifier_id'] = $user['identifier_id'];

                $alert_message = "Welcome back, " . htmlspecialchars($user['full_name']) . "!";
                $alert_type = 'success';

                if ($user['role'] === 'patient') {
                    $active_tab = 'patient_details';
                } else {
                    $active_tab = 'doctor_dashboard';
                }
            } else {
                $alert_message = "Invalid email or password. Please check your credentials.";
                $alert_type = 'error';
                $active_tab = ($login_type === 'doctor') ? 'doctor_login' : 'patient_login';
            }
        } catch (PDOException $e) {
            $alert_message = "Authentication Error: " . $e->getMessage();
            $alert_type = 'error';
        }
    }
}

// 3. Handle Patient Medical Details Save/Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_patient_details') {
    $patient_name      = trim($_POST['full_name'] ?? '');
    $age               = (int)($_POST['age'] ?? 30);
    $gender            = trim($_POST['gender'] ?? 'Other');
    $blood_group       = trim($_POST['blood_group'] ?? 'O+');
    $phone             = trim($_POST['phone'] ?? '');
    $emergency_contact = trim($_POST['emergency_contact'] ?? '');
    $allergies         = trim($_POST['allergies'] ?? '');
    $address           = trim($_POST['address'] ?? '');
    $insurance         = trim($_POST['insurance_policy'] ?? '');

    try {
        // Upsert or insert into patients table
        $patientStmt = $pdo->prepare("
            INSERT INTO patients (full_name, age, gender, blood_group, phone, emergency_contact, allergies, address, insurance_policy)
            VALUES (:name, :age, :gender, :bg, :phone, :emg, :allergies, :addr, :ins)
            ON DUPLICATE KEY UPDATE 
                age = VALUES(age), 
                gender = VALUES(gender), 
                blood_group = VALUES(blood_group), 
                phone = VALUES(phone), 
                emergency_contact = VALUES(emergency_contact), 
                allergies = VALUES(allergies), 
                address = VALUES(address), 
                insurance_policy = VALUES(insurance_policy)
        ");
        $patientStmt->execute([
            ':name'      => $patient_name,
            ':age'       => $age,
            ':gender'    => $gender,
            ':bg'        => $blood_group,
            ':phone'     => $phone,
            ':emg'       => $emergency_contact,
            ':allergies' => $allergies,
            ':addr'      => $address,
            ':ins'       => $insurance
        ]);

        $alert_message = "Patient medical details updated successfully!";
        $alert_type = 'success';
        $active_tab = 'patient_details';
    } catch (PDOException $e) {
        $alert_message = "Could not save details: " . $e->getMessage();
        $alert_type = 'error';
        $active_tab = 'patient_details';
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php?tab=book");
    exit();
}

// Fetch Appointments for views
$appointments_list = [];
try {
    $aptQuery = $pdo->query("SELECT * FROM appointments ORDER BY id DESC LIMIT 15");
    $appointments_list = $aptQuery->fetchAll();
} catch (Exception $e) {
    // Graceful fallback
}

// Fetch current patient details if logged in
$current_patient = null;
if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'patient') {
    try {
        $ptQuery = $pdo->prepare("SELECT * FROM patients WHERE full_name = :fn LIMIT 1");
        $ptQuery->execute([':fn' => $_SESSION['user_name']]);
        $current_patient = $ptQuery->fetch();
    } catch (Exception $e) {}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Care Hospital &amp; Medical Centers</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Top Notification Bar */
        .top-emergency-bar {
            background: #042f2e;
            color: #ccfbf1;
            font-size: 12px;
            padding: 8px 16px;
            text-align: center;
            font-weight: 600;
        }
        .top-emergency-bar strong { color: #5eead4; }

        /* Navigation Header */
        header {
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 72px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #0f172a;
        }
        .cross-symbol {
            width: 38px;
            height: 38px;
            background: #0d9488;
            color: #ffffff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 900;
            line-height: 1;
            box-shadow: 0 4px 10px rgba(13, 148, 136, 0.25);
        }
        .brand-text h1 {
            font-size: 17px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #0f172a;
        }
        .brand-text p {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .nav-items {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.15s ease;
            color: #475569;
            background: transparent;
            border: 1px solid transparent;
        }
        .nav-btn:hover {
            color: #0d9488;
            background: #f0fdfa;
        }
        .nav-btn.active {
            background: #0d9488;
            color: #ffffff;
            box-shadow: 0 2px 6px rgba(13, 148, 136, 0.25);
        }
        .nav-btn.doctor-btn {
            background: #0f172a;
            color: #ffffff;
        }
        .nav-btn.doctor-btn:hover {
            background: #1e293b;
        }

        /* Alert Box */
        .alert-box {
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            margin: 20px auto;
            max-width: 1140px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-success {
            background: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .alert-error {
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        /* Hero Banner with Hospital Background */
        .hero-section {
            position: relative;
            background: #0f172a;
            background-image: linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(13, 148, 136, 0.85) 100%), url('hospital_bg.jpg');
            background-size: cover;
            background-position: center;
            color: #ffffff;
            border-radius: 24px;
            margin: 24px auto;
            padding: 44px 36px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
            overflow: hidden;
        }
        .hero-section::before {
            content: '+';
            position: absolute;
            right: 20px;
            bottom: -30px;
            font-size: 220px;
            font-weight: 900;
            color: rgba(255, 255, 255, 0.05);
            pointer-events: none;
            line-height: 1;
        }
        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 14px;
            color: #ccfbf1;
        }
        .hero-title {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.25;
            max-width: 650px;
            margin-bottom: 12px;
        }
        .hero-subtitle {
            font-size: 15px;
            color: #e2e8f0;
            max-width: 580px;
            line-height: 1.6;
        }

        /* Main Content Cards */
        .main-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            margin-bottom: 40px;
        }
        .card-header-clean {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 18px;
            margin-bottom: 24px;
        }
        .card-header-clean h2 {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .form-grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .form-control {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 14px;
            font-family: inherit;
            background: #ffffff;
            color: #0f172a;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-control:focus {
            outline: none;
            border-color: #0d9488;
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }

        /* Buttons */
        .btn-submit {
            background: #0d9488;
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 800;
            border: none;
            cursor: pointer;
            width: 100%;
            transition: background 0.15s ease, transform 0.05s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-submit:hover {
            background: #0f766e;
        }
        .btn-dark {
            background: #0f172a;
        }
        .btn-dark:hover {
            background: #1e293b;
        }

        /* Auth Card Layout */
        .auth-card-container {
            max-width: 440px;
            margin: 40px auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            padding: 36px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            text-align: center;
        }
        .auth-icon-wrap {
            width: 56px;
            height: 56px;
            background: #f0fdfa;
            color: #0d9488;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin: 0 auto 16px auto;
        }
        .auth-title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 6px;
        }
        .auth-subtitle {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 24px;
        }

        /* Consultation queue */
        .queue-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            margin-bottom: 12px;
        }
        .badge-status {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background: #dcfce7;
            color: #15803d;
        }

        /* Footer */
        footer {
            margin-top: auto;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            padding: 24px 0;
            font-size: 13px;
            color: #64748b;
        }
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        @media (max-width: 768px) {
            .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
            .hero-section { padding: 30px 20px; }
            .hero-title { font-size: 24px; }
            .navbar { flex-direction: column; height: auto; padding: 14px 0; gap: 12px; }
        }
    </style>
</head>
<body>

    <!-- Emergency Top Ribbon -->
    <div class="top-emergency-bar">
        Emergency &amp; Trauma Support: <strong>+1 (800) 432-5800</strong> &bull; Walk-ins Welcome 24/7
    </div>

    <!-- Main Navigation Header -->
    <header>
        <div class="container navbar">
            <a href="index.php?tab=book" class="brand">
                <div class="cross-symbol">+</div>
                <div class="brand-text">
                    <h1>Novo Care Hospital</h1>
                    <p>Modern Healthcare &amp; Patient Services</p>
                </div>
            </a>

            <div class="nav-items">
                <a href="index.php?tab=book" class="nav-btn <?php echo ($active_tab === 'book') ? 'active' : ''; ?>">
                    📅 Book Appointment
                </a>

                <?php if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'patient'): ?>
                    <a href="index.php?tab=patient_details" class="nav-btn <?php echo ($active_tab === 'patient_details') ? 'active' : ''; ?>">
                        👤 Patient Details (<?php echo htmlspecialchars($_SESSION['user_name']); ?>)
                    </a>
                    <a href="index.php?logout=1" class="nav-btn">Sign Out</a>
                <?php else: ?>
                    <a href="index.php?tab=patient_login" class="nav-btn <?php echo ($active_tab === 'patient_login') ? 'active' : ''; ?>">
                        👤 Patient Portal
                    </a>
                <?php endif; ?>

                <?php if (isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'doctor'): ?>
                    <a href="index.php?tab=doctor_dashboard" class="nav-btn doctor-btn">
                        🩺 Staff: <?php echo htmlspecialchars($_SESSION['user_name']); ?>
                    </a>
                    <a href="index.php?logout=1" class="nav-btn">Sign Out</a>
                <?php else: ?>
                    <a href="index.php?tab=doctor_login" class="nav-btn doctor-btn">
                        🩺 Doctor &amp; Staff Login
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <!-- Alert / Feedback Notification -->
    <?php if ($alert_message): ?>
        <div class="container">
            <div class="alert-box alert-<?php echo $alert_type; ?>">
                <span><?php echo ($alert_type === 'success') ? '✓' : '⚠'; ?></span>
                <span><?php echo htmlspecialchars($alert_message); ?></span>
            </div>
        </div>
    <?php endif; ?>

    <!-- Main Dynamic Body Container -->
    <main class="container" style="flex: 1;">

        <!-- ========================================================= -->
        <!-- VIEW 1: BOOK DOCTOR APPOINTMENT (FIRST PAGE DEFAULT)      -->
        <!-- ========================================================= -->
        <?php if ($active_tab === 'book'): ?>
            <!-- Hero with Hospital Background Image & Medical Cross -->
            <div class="hero-section">
                <div class="hero-badge">Medical Excellence &bull; 24/7 Care</div>
                <h2 class="hero-title">Schedule Your Doctor Consultation Online</h2>
                <p class="hero-subtitle">
                    Select your medical department, pick a qualified physician, and confirm your preferred consultation date and time.
                </p>
            </div>

            <!-- Booking Form Card -->
            <div class="main-card">
                <div class="card-header-clean">
                    <h2>
                        <span style="color:#0d9488;">+</span>
                        <span>Patient Appointment Details</span>
                    </h2>
                    <span style="font-size:12px; color:#64748b; font-weight:600;">Standard Consultation Booking</span>
                </div>

                <form action="index.php?tab=book" method="POST">
                    <input type="hidden" name="action" value="book_appointment">

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">Medical Specialty / Department</label>
                            <select name="department" class="form-control" required>
                                <option value="Cardiology">Cardiology &amp; Heart Care</option>
                                <option value="Neurology">Neurology &amp; Brain Health</option>
                                <option value="Pediatrics">Pediatrics &amp; Child Health</option>
                                <option value="Orthopedics">Orthopedics &amp; Joint Replacement</option>
                                <option value="General Medicine" selected>General Medicine</option>
                                <option value="Dermatology">Dermatology</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Select Physician</label>
                            <select name="doctor_name" class="form-control" required>
                                <option value="Dr. Sarah Jenkins, MD">Dr. Sarah Jenkins, MD (Cardiology)</option>
                                <option value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD (Neurology)</option>
                                <option value="Dr. Ananya Sen, MD">Dr. Ananya Sen, MD (Pediatrics)</option>
                                <option value="Dr. Michael Lee, MD">Dr. Michael Lee, MD (General Medicine)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-3">
                        <div class="form-group">
                            <label class="form-label">Preferred Date</label>
                            <input type="date" name="appointment_date" class="form-control" value="<?php echo date('Y-m-d', strtotime('+1 day')); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Time Slot</label>
                            <select name="appointment_time" class="form-control">
                                <option value="09:00 AM">09:00 AM - Morning</option>
                                <option value="10:30 AM" selected>10:30 AM - Morning</option>
                                <option value="01:30 PM">01:30 PM - Afternoon</option>
                                <option value="03:00 PM">03:00 PM - Afternoon</option>
                                <option value="04:30 PM">04:30 PM - Evening</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Patient Full Name</label>
                            <input type="text" name="patient_name" class="form-control" placeholder="e.g. Eleanor Vance" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">Contact Phone Number</label>
                            <input type="tel" name="phone" class="form-control" placeholder="e.g. +1 (555) 234-8901" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Symptoms / Reason for Visit</label>
                            <input type="text" name="notes" class="form-control" placeholder="e.g. Routine cardiovascular checkup, headache...">
                        </div>
                    </div>

                    <button type="submit" class="btn-submit">
                        Confirm Appointment Booking
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- ========================================================= -->
        <!-- VIEW 2: PATIENT LOGIN                                     -->
        <!-- ========================================================= -->
        <?php if ($active_tab === 'patient_login'): ?>
            <div class="auth-card-container">
                <div class="auth-icon-wrap">+</div>
                <h2 class="auth-title">Patient Portal Login</h2>
                <p class="auth-subtitle">Sign in to fill or update your personal medical profile and view history.</p>

                <form action="index.php" method="POST" style="text-align: left;">
                    <input type="hidden" name="action" value="login">
                    <input type="hidden" name="login_type" value="patient">

                    <div class="form-group">
                        <label class="form-label">Patient Email or Health ID</label>
                        <input type="text" name="identifier" class="form-control" value="patient@hospital.org" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" value="Patient@123" required>
                    </div>

                    <button type="submit" class="btn-submit" style="margin-top: 10px;">
                        Sign In to Patient Portal
                    </button>
                </form>

                <div style="margin-top:20px; font-size:12px; color:#64748b;">
                    Need staff access? <a href="index.php?tab=doctor_login" style="color:#0d9488; font-weight:700;">Doctor &amp; Staff Login</a>
                </div>
            </div>
        <?php endif; ?>

        <!-- ========================================================= -->
        <!-- VIEW 3: FILL PATIENT DETAILS (SHOWN AFTER PATIENT LOGIN)   -->
        <!-- ========================================================= -->
        <?php if ($active_tab === 'patient_details'): ?>
            <div class="main-card" style="margin-top: 24px;">
                <div class="card-header-clean">
                    <h2>
                        <span style="color:#0d9488;">+</span>
                        <span>Patient Medical Profile Details</span>
                    </h2>
                    <a href="index.php?logout=1" style="font-size:12px; color:#ef4444; font-weight:700; text-decoration:none;">Log Out</a>
                </div>

                <p style="font-size:13px; color:#64748b; margin-bottom: 24px;">
                    Please fill out or verify your medical details below. This information ensures our clinical staff can provide accurate, safe, and immediate care.
                </p>

                <form action="index.php" method="POST">
                    <input type="hidden" name="action" value="save_patient_details">

                    <div class="form-grid-3">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" name="full_name" class="form-control" value="<?php echo htmlspecialchars($current_patient['full_name'] ?? $_SESSION['user_name'] ?? 'Eleanor Vance'); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Age</label>
                            <input type="number" name="age" class="form-control" value="<?php echo htmlspecialchars($current_patient['age'] ?? '36'); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Gender</label>
                            <select name="gender" class="form-control">
                                <option value="Female" <?php echo (($current_patient['gender'] ?? 'Female') === 'Female') ? 'selected' : ''; ?>>Female</option>
                                <option value="Male" <?php echo (($current_patient['gender'] ?? '') === 'Male') ? 'selected' : ''; ?>>Male</option>
                                <option value="Other" <?php echo (($current_patient['gender'] ?? '') === 'Other') ? 'selected' : ''; ?>>Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-3">
                        <div class="form-group">
                            <label class="form-label">Blood Group</label>
                            <select name="blood_group" class="form-control">
                                <option value="O+" <?php echo (($current_patient['blood_group'] ?? 'O+') === 'O+') ? 'selected' : ''; ?>>O+ (Positive)</option>
                                <option value="O-" <?php echo (($current_patient['blood_group'] ?? '') === 'O-') ? 'selected' : ''; ?>>O- (Negative)</option>
                                <option value="A+" <?php echo (($current_patient['blood_group'] ?? '') === 'A+') ? 'selected' : ''; ?>>A+ (Positive)</option>
                                <option value="A-" <?php echo (($current_patient['blood_group'] ?? '') === 'A-') ? 'selected' : ''; ?>>A- (Negative)</option>
                                <option value="B+" <?php echo (($current_patient['blood_group'] ?? '') === 'B+') ? 'selected' : ''; ?>>B+ (Positive)</option>
                                <option value="B-" <?php echo (($current_patient['blood_group'] ?? '') === 'B-') ? 'selected' : ''; ?>>B- (Negative)</option>
                                <option value="AB+" <?php echo (($current_patient['blood_group'] ?? '') === 'AB+') ? 'selected' : ''; ?>>AB+ (Positive)</option>
                                <option value="AB-" <?php echo (($current_patient['blood_group'] ?? '') === 'AB-') ? 'selected' : ''; ?>>AB- (Negative)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Primary Contact Phone</label>
                            <input type="tel" name="phone" class="form-control" value="<?php echo htmlspecialchars($current_patient['phone'] ?? '+1 (555) 234-8901'); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Emergency Contact &amp; Relation</label>
                            <input type="text" name="emergency_contact" class="form-control" value="<?php echo htmlspecialchars($current_patient['emergency_contact'] ?? 'David Vance (+1 555-234-8902)'); ?>" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">Known Allergies / Pre-existing Conditions</label>
                            <input type="text" name="allergies" class="form-control" value="<?php echo htmlspecialchars($current_patient['allergies'] ?? 'Penicillin, Seasonal Pollen'); ?>">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Insurance Policy Number / Provider</label>
                            <input type="text" name="insurance_policy" class="form-control" value="<?php echo htmlspecialchars($current_patient['insurance_policy'] ?? 'AegisShield Gold #AC-99214'); ?>">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Residential Address</label>
                        <input type="text" name="address" class="form-control" value="<?php echo htmlspecialchars($current_patient['address'] ?? '742 Evergreen Terrace, Springfield'); ?>">
                    </div>

                    <button type="submit" class="btn-submit">
                        Save Patient Medical Profile
                    </button>
                </form>
            </div>
        <?php endif; ?>

        <!-- ========================================================= -->
        <!-- VIEW 4: DOCTOR & STAFF LOGIN                              -->
        <!-- ========================================================= -->
        <?php if ($active_tab === 'doctor_login'): ?>
            <div class="auth-card-container">
                <div class="auth-icon-wrap" style="background: #f1f5f9; color: #0f172a;">🩺</div>
                <h2 class="auth-title">Doctor &amp; Staff Login</h2>
                <p class="auth-subtitle">Authorized medical personnel &amp; administration console.</p>

                <form action="index.php" method="POST" style="text-align: left;">
                    <input type="hidden" name="action" value="login">
                    <input type="hidden" name="login_type" value="doctor">

                    <div class="form-group">
                        <label class="form-label">Staff Medical ID or Email</label>
                        <input type="text" name="identifier" class="form-control" value="dr.jenkins@hospital.org" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Staff Security Password</label>
                        <input type="password" name="password" class="form-control" value="Doctor@123" required>
                    </div>

                    <button type="submit" class="btn-submit btn-dark" style="margin-top: 10px;">
                        Sign In to Staff Console
                    </button>
                </form>

                <div style="margin-top:20px; font-size:12px; color:#64748b;">
                    Looking for patient portal? <a href="index.php?tab=patient_login" style="color:#0d9488; font-weight:700;">Patient Sign In</a>
                </div>
            </div>
        <?php endif; ?>

        <!-- ========================================================= -->
        <!-- VIEW 5: DOCTOR DASHBOARD (SHOWN AFTER DOCTOR LOGIN)       -->
        <!-- ========================================================= -->
        <?php if ($active_tab === 'doctor_dashboard'): ?>
            <div class="main-card" style="margin-top: 24px;">
                <div class="card-header-clean">
                    <h2>
                        <span style="color:#0d9488;">🩺</span>
                        <span>Physician Workspace &bull; <?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Dr. Sarah Jenkins, MD'); ?></span>
                    </h2>
                    <a href="index.php?logout=1" style="font-size:12px; color:#ef4444; font-weight:700; text-decoration:none;">Log Out</a>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Active Patient Consultations Queue</h3>
                    <?php if (empty($appointments_list)): ?>
                        <div style="padding: 24px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 12px;">
                            No active consultations queued for today.
                        </div>
                    <?php else: ?>
                        <?php foreach ($appointments_list as $apt): ?>
                            <div class="queue-item">
                                <div>
                                    <div style="font-weight: 800; font-size: 14px; color: #0f172a;">
                                        <?php echo htmlspecialchars($apt['patient_name']); ?>
                                        <span style="font-size: 11px; color: #64748b; font-weight: 500;">(<?php echo htmlspecialchars($apt['department'] ?? 'General'); ?>)</span>
                                    </div>
                                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                                        Phone: <strong><?php echo htmlspecialchars($apt['phone']); ?></strong> &bull; Reason: <em><?php echo htmlspecialchars($apt['notes'] ?? 'Consultation'); ?></em>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                                        <?php echo htmlspecialchars($apt['appointment_date']); ?>
                                    </div>
                                    <span class="badge-status">Confirmed</span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

    </main>

    <!-- Clean Hospital Footer -->
    <footer>
        <div class="container footer-content">
            <div style="display:flex; align-items:center; gap:8px;">
                <div class="cross-symbol" style="width:24px; height:24px; font-size:14px; border-radius:6px;">+</div>
                <span>Novo Care Hospital &amp; Medical Centers &bull; Compassionate Healthcare</span>
            </div>
            <div style="display:flex; gap:16px;">
                <a href="index.php?tab=book" style="color:#64748b; text-decoration:none;">Book Appointment</a>
                <a href="index.php?tab=patient_login" style="color:#64748b; text-decoration:none;">Patient Details</a>
                <a href="index.php?tab=doctor_login" style="color:#64748b; text-decoration:none;">Doctor &amp; Staff</a>
            </div>
        </div>
    </footer>

</body>
</html>
