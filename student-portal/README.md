# Student Login & Registration System (RDBMS Practical Project)

A complete, college-level Relational Database Management System (RDBMS) web application developed using **HTML, CSS, JavaScript, PHP, and MySQL**.

---

## 1. Project Directory Structure

Save this entire folder in your XAMPP `htdocs` directory at:  
`C:\xampp\htdocs\student-portal\`

```text
student-portal/
├── config/
│   └── database.php         # PDO MySQL connection & error handling
├── includes/
│   ├── auth.php             # Session management, RBAC, XSS & CSRF helpers
│   ├── header.php           # Shared responsive navigation and <head>
│   └── footer.php           # Shared footer and script inclusion
├── assets/
│   ├── css/
│   │   └── style.css        # Clean Navy & Blue responsive stylesheet
│   └── js/
│       └── script.js        # Form validation, show/hide password, alerts
├── index.php                # Portal welcome page with system overview
├── signup.php               # Student account registration with duplicate check
├── login.php                # Authentication with BCRYPT password verification
├── dashboard.php            # Personalized student profile page
├── admin.php                # Admin console with search, count, and delete
├── delete_student.php       # Protected deletion controller with CSRF
├── logout.php               # Session destruction handler
├── database.sql             # Complete schema & sample data for MySQL Workbench
└── README.md                # Project manual & setup documentation
```

---

## 2. Prerequisites
1. **XAMPP** (with Apache and PHP 7.4+ or 8.x)
2. **MySQL Server & MySQL Workbench 8.0 CE**
3. Any modern web browser (Chrome, Edge, Firefox)

---

## 3. Step-by-Step Installation & Setup

### Step 1: Copy Project to XAMPP htdocs
Copy the `student-portal` folder into:
- **Windows:** `C:\xampp\htdocs\student-portal`
- **macOS:** `/Applications/XAMPP/xamppfiles/htdocs/student-portal`
- **Linux:** `/opt/lampp/htdocs/student-portal`

### Step 2: Start Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
4. Ensure both display green status indicators.

### Step 3: Run Database Script in MySQL Workbench 8.0 CE
1. Open **MySQL Workbench 8.0 CE**.
2. Click on your MySQL connection (e.g., `Local instance MySQL80` or `root@localhost:3306`).
3. Enter your MySQL `root` password when prompted.
4. From the top menu, click **File** &rarr; **Open SQL Script...** (or press `Ctrl + Shift + O`).
5. Browse and select `database.sql` located in `student-portal/database.sql`.
6. Click the **Execute** button (the yellow lightning bolt icon ⚡) to run the entire script.
7. In the Schemas tab on the left, right-click and choose **Refresh All**. You will now see the `student_portal` database with the `users` table created and seeded!

### Step 4: Configure Database Credentials
Open `student-portal/config/database.php` in a text editor (VS Code, Notepad++, etc.):

```php
$db_host = 'localhost';
$db_name = 'student_portal';
$db_user = 'root';

// IF YOUR MYSQL HAS A PASSWORD IN MYSQL WORKBENCH:
// Enter it inside the single quotes below:
$db_pass = ''; // e.g. 'root' or 'your_mysql_password'
$db_port = 3306;
```
> **Note:** If using standard XAMPP MySQL default, leave `$db_pass = '';` (empty). If you configured a password in MySQL Workbench 8.0 CE (like `root` or `password123`), enter that exact password here.

---

## 4. How to Run the Application
Open your web browser and navigate to:  
👉 **`http://localhost/student-portal/`**

---

## 5. Seeded Test Credentials

| Role | Email Address | Password | Student ID |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@portal.edu` | `Admin@123` | `ADM-001` |
| **Student 1** | `rohan.sharma@college.edu` | `Student@123` | `STU-2024-001` |
| **Student 2** | `priya.patel@college.edu` | `Student@123` | `STU-2024-002` |

---

## 6. Practical Evaluation & Testing Guide

### A. Testing Student Signup
1. Visit `http://localhost/student-portal/signup.php`.
2. Enter Full Name, unique Student ID (e.g. `STU-2024-105`), Email, and Password.
3. Click the eye icon to test **Show/Hide password**.
4. Click **Complete Registration**. You will be redirected to the login page with a green success message.

### B. Testing Duplicate Prevention (Unique Constraint)
1. Try signing up again using the exact same Student ID or Email.
2. The system checks MySQL and alerts: *"An account with this email address already exists"* or *"This Student ID is already registered"*.

### C. Testing Login & Authentication
1. Go to `http://localhost/student-portal/login.php`.
2. Enter an incorrect password &rarr; System responds with: *"Invalid email address or password"*.
3. Enter correct credentials (`rohan.sharma@college.edu` / `Student@123`) &rarr; Successfully redirects to `dashboard.php`.

### D. Testing Unauthorized Page Protection
1. Open an Incognito / Private browsing window.
2. Attempt to directly access `http://localhost/student-portal/dashboard.php` or `http://localhost/student-portal/admin.php`.
3. The server intercepts the request and redirects to `login.php?error=unauthorized`.

### E. Testing Role-Based Access Control (RBAC)
1. Log in as a normal student (`rohan.sharma@college.edu`).
2. Try typing `http://localhost/student-portal/admin.php` directly in the browser URL bar.
3. The server detects `role !== 'admin'`, blocks access, and redirects to `dashboard.php?error=access_denied`.

### F. Testing Admin Search & Delete
1. Log in as Admin (`admin@portal.edu` / `Admin@123`).
2. You will see the total registered student count and the table of students.
3. Type a name in the search box (e.g., `Amit`) and click **Search** &rarr; live filtered query executed.
4. Click **Delete** next to a student &rarr; browser prompts confirmation &rarr; record is safely removed from MySQL via prepared statement.

### G. Testing Logout
1. Click **Sign Out** or **Log Out** in the navigation bar.
2. The session is destroyed and cookies cleared. Pressing the browser back button will not grant access back to the protected dashboard.

---

## 7. Common Errors & Troubleshooting

| Error Message | Cause | Solution |
| :--- | :--- | :--- |
| **"SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'"** | Incorrect MySQL root password. | Open `config/database.php` and set `$db_pass` to the password you entered in MySQL Workbench. |
| **"SQLSTATE[HY000] [2002] Connection refused"** | MySQL service is not running. | Open XAMPP Control Panel and click **Start** next to MySQL. |
| **"Base table or view not found: Table 'student_portal.users' doesn't exist"** | SQL script was not executed. | Open `database.sql` in MySQL Workbench and click the lightning bolt ⚡ icon. |
| **Port 3306 or 80 busy in XAMPP** | Another service (Skype, IIS, or standalone MySQL) is using the port. | Change MySQL port in XAMPP `my.ini` to `3307` and update `$db_port = 3307;` in `config/database.php`. |

---

## 8. College Practical & Viva Examination Q&A

**Q1: How does this project prevent SQL Injection?**  
**Answer:** By using **PDO Prepared Statements** with bound parameters (`$stmt->prepare()` and `$stmt->execute()`). User inputs are treated strictly as data literals, never executable SQL commands, neutralizing attacks like `' OR '1'='1`.

**Q2: Why use `password_hash()` instead of MD5 or SHA1?**  
**Answer:** MD5 and SHA1 are cryptographically broken, extremely fast to brute-force with rainbow tables, and lack salt. PHP's `password_hash()` utilizes **BCRYPT** with an auto-generated cryptographically secure salt and configurable computational work factor.

**Q3: What is the difference between Primary Key and Unique Key in the schema?**  
**Answer:**  
- `id` is the **PRIMARY KEY**: Uniquely identifies each record, cannot be NULL, and creates the clustered index.
- `student_id` and `email` are **UNIQUE KEYS**: Prevent duplicate student records while allowing business logic identification.

**Q4: Why call `session_regenerate_id(true)` upon login?**  
**Answer:** It prevents **Session Fixation attacks**. If an attacker sets a victim's session cookie before login, regenerating the session ID issues a brand new session identifier once authenticated and deletes the old one.
