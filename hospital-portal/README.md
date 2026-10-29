# Hospital Management System: MySQL Workbench 8.0 CE Connection Guide

Your MySQL Root Password: **`arcsinsin@Vin06`**  
Database Name: **`hospital_db`**  
Port: **`3306`**

---

## 1. Quick Setup in MySQL Workbench 8.0 CE

### Step 1: Open MySQL Workbench 8.0 CE
1. Launch **MySQL Workbench 8.0 CE** on your computer.
2. Under **MySQL Connections**, click **Local instance 3306** (User: `root`).
3. Enter your root password:  
   👉 **`arcsinsin@Vin06`**  
   *(Check "Save password in vault" if you prefer).*

### Step 2: Run `database.sql`
1. In MySQL Workbench, click **File** &rarr; **Open SQL Script...** (or press `Ctrl + Shift + O`).
2. Select `hospital-portal/database.sql`.
3. Click the yellow **Lightning Bolt icon (⚡)** to execute the script.
4. On the left sidebar under the **Schemas** tab, right-click and click **Refresh All**.
5. You will see `hospital_db` with tables:
   - `users`
   - `patients`
   - `appointments`
   - `login_logs`

---

## 2. Setting Up in XAMPP

1. Copy the `hospital-portal` folder to:
   - **Windows:** `C:\xampp\htdocs\hospital-portal`
2. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
3. Open `hospital-portal/config/database.php` and verify the password is set:
   ```php
   $db_pass = 'arcsinsin@Vin06';
   ```
4. Access the website in your browser:  
   👉 **`http://localhost/hospital-portal/`**

---

## 3. How to See Live Entries in MySQL Workbench 8.0 CE

Open a SQL query tab in MySQL Workbench (`Ctrl + T`), select database `hospital_db`, and run these commands as you use the website:

### A. To See New Doctor Appointments:
Whenever someone books an appointment on the website, run:
```sql
USE hospital_db;
SELECT * FROM appointments ORDER BY id DESC;
```
👉 *You will immediately see the newly booked patient name, phone, department, doctor, and date!*

### B. To See Live Login Logs (Who logged in and when):
Whenever a patient or doctor signs in on the website, run:
```sql
USE hospital_db;
SELECT * FROM login_logs ORDER BY id DESC;
```
👉 *You will see the user email, role ('patient' or 'doctor'), IP address, timestamp, and status ('SUCCESS')!*

### C. To See All Registered Patients & Doctors:
```sql
USE hospital_db;
SELECT id, email, full_name, role, identifier_id, created_at FROM users;
```

### D. To View Complete Medical Details of a Patient:
```sql
USE hospital_db;
SELECT 
    u.full_name,
    p.patient_id,
    p.age,
    p.gender,
    p.blood_group,
    p.phone,
    p.blood_pressure,
    p.heart_rate,
    p.recent_diagnosis
FROM users u
JOIN patients p ON u.id = p.user_id;
```

---

## 4. Test Credentials Seeded in Database

| Role | Email / ID | Password | Identifier ID |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@hospital.org` | `Patient@123` | `PT-89420` |
| **Doctor** | `dr.jenkins@hospital.org` | `Doctor@123` | `DOC-102` |

---

## 5. Troubleshooting

- **Error: Access Denied for 'root'@'localhost':**  
  Double check that the password in `config/database.php` matches `arcsinsin@Vin06`.
- **Error: Unknown Database 'hospital_db':**  
  Execute `database.sql` in MySQL Workbench to create `hospital_db`.
