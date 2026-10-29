import React, { useState } from 'react';
import { BookOpen, CheckCircle, HelpCircle, Code2, ShieldAlert, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface VivaQuestion {
  question: string;
  category: 'Security' | 'RDBMS' | 'PHP Architecture' | 'Database Design';
  shortAnswer: string;
  detailedExplanation: string;
  codeSnippet?: string;
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    category: 'Security',
    question: 'How does this project prevent SQL Injection attacks?',
    shortAnswer: 'By exclusively using PDO Prepared Statements with bound parameters instead of string concatenation.',
    detailedExplanation: `In traditional insecure PHP, queries were written using concatenation (e.g., "SELECT * FROM users WHERE email = '" . $email . "'"). If an attacker inputs: ' OR '1'='1, the SQL syntax itself is manipulated.

With PDO prepared statements ($pdo->prepare() and $stmt->execute()), the SQL template is compiled on the MySQL database server FIRST. When user parameters are sent, the database engine treats them strictly as data literals, never executable code. It is mathematically impossible for user input to break out of the data context into the command context.`,
    codeSnippet: `// ❌ INSECURE (Vulnerable to SQL Injection):
$sql = "SELECT * FROM users WHERE email = '$email'";

// ✅ SECURE (PDO Prepared Statement with Bound Parameter):
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);`
  },
  {
    category: 'Security',
    question: 'Why do we use password_hash() with BCRYPT instead of MD5 or SHA-256?',
    shortAnswer: 'MD5 and SHA-256 are fast hash functions vulnerable to rainbow tables. BCRYPT is an intentionally slow, salted, adaptive key derivation algorithm.',
    detailedExplanation: `1. Salt Generation: password_hash() automatically generates a cryptographically secure 22-character random salt per user. This renders pre-computed rainbow table attacks completely useless.
2. Computational Work Factor: BCRYPT introduces a configurable computational cost factor (default 10 = 2^10 = 1024 rounds of Key Stretching). Even if hackers obtain the database dump, brute-forcing passwords with GPUs would take millennia.
3. Plaintext Never Stored: Storing plaintext or unsalted hashes fails basic compliance. When authenticating, password_verify() extracts the salt from the hash string, runs the candidate password through the same rounds, and compares using a constant-time check hash_equals().`,
    codeSnippet: `// Registration:
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
// Produces 60-character string like: $2y$10$vN4G2tV4oV2iWp/7rR1Rk...

// Login Verification:
if (password_verify($candidate_password, $user['password'])) {
    // Valid password
}`
  },
  {
    category: 'Database Design',
    question: 'What is the difference between the PRIMARY KEY and UNIQUE KEY in the users table?',
    shortAnswer: 'PRIMARY KEY uniquely identifies a database row and serves as clustered index; UNIQUE keys enforce business uniqueness constraints on other columns.',
    detailedExplanation: `In our \`users\` table:
- \`id\` is the PRIMARY KEY: It guarantees entity integrity, cannot contain NULL values, and MySQL InnoDB uses it to physically order data on disk (Clustered Index).
- \`student_id\` and \`email\` are UNIQUE KEYS: They permit at most one non-duplicate entry per column, ensuring no two students share the same college ID or email, but they do not serve as the table's primary relational key.

In relational normalization, \`id\`, \`student_id\`, and \`email\` are all "Candidate Keys", and \`id\` was selected as the Primary Key.`,
    codeSnippet: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- Primary Key
  student_id VARCHAR(30) NOT NULL UNIQUE, -- Candidate Key / Unique Constraint
  email VARCHAR(150) NOT NULL UNIQUE,     -- Candidate Key / Unique Constraint
  ...
);`
  },
  {
    category: 'Security',
    question: 'Why is session_regenerate_id(true) executed immediately after successful login?',
    shortAnswer: 'To defend against Session Fixation attacks.',
    detailedExplanation: `In a Session Fixation attack:
1. An attacker obtains a valid session ID from the web server (e.g. PHPSESSID=12345).
2. The attacker tricks the victim into using that specific session ID (via a phishing link or cookie injection).
3. The victim logs into the portal using their username and password.
4. If the server keeps the existing session ID, the attacker can now use PHPSESSID=12345 to access the victim's authenticated dashboard!

By calling session_regenerate_id(true) immediately upon verifying user credentials, PHP invalidates the old pre-login session ID and issues a brand-new cryptographically secure session identifier.`,
    codeSnippet: `if ($user && password_verify($password, $user['password'])) {
    // Invalidate old session ID, issue brand new token:
    session_regenerate_id(true);
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
}`
  },
  {
    category: 'PHP Architecture',
    question: 'Why choose PDO over MySQLi or the deprecated mysql_* functions?',
    shortAnswer: 'PDO offers a consistent object-oriented abstraction layer, named parameters, and unified exception handling across multiple database engines.',
    detailedExplanation: `1. Multi-Database Support: PDO (PHP Data Objects) works with MySQL, PostgreSQL, SQLite, Oracle, and SQL Server. If the college switches from MySQL to PostgreSQL, only the DSN connection string changes, not all the query code.
2. Named Parameters: PDO supports intuitive placeholders like :email and :student_id, whereas MySQLi only supports positional ? placeholders which become confusing in queries with 10+ columns.
3. Native Prepared Statements: By disabling PDO::ATTR_EMULATE_PREPARES, true binary-level prepared statement execution is handled by the MySQL server.
4. The old mysql_* extension was officially removed in PHP 7.0 for critical security flaws.`,
    codeSnippet: `// Connecting with PDO:
$pdo = new PDO("mysql:host=localhost;dbname=student_portal;charset=utf8mb4", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);`
  },
  {
    category: 'Database Design',
    question: 'How would you extend this schema to implement Student Course Enrollments (Many-to-Many)?',
    shortAnswer: 'By creating a `courses` table and an associative junction table `enrollments` with two FOREIGN KEY constraints.',
    detailedExplanation: `A student can enroll in multiple courses, and a course has multiple students. In Relational Database Design, a Many-to-Many relationship (M:N) is decomposed into two One-to-Many (1:N) relationships via a Junction/Associative Table:
1. \`users\` table (students)
2. \`courses\` table (course_id, course_name, credits)
3. \`enrollments\` table (enrollment_id, student_id, course_id, enrolled_at) with FOREIGN KEY constraints pointing to users(id) and courses(id) with ON DELETE CASCADE.`,
    codeSnippet: `CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  credits INT NOT NULL DEFAULT 3
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, course_id)
);`
  }
];

export const VivaGuide: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Security', 'RDBMS', 'PHP Architecture', 'Database Design'];

  const filteredQuestions = selectedCategory === 'All' 
    ? VIVA_QUESTIONS 
    : VIVA_QUESTIONS.filter(q => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              College RDBMS Practical &amp; Viva Exam Preparation
            </h2>
            <p className="text-xs text-slate-500">
              High-yield questions and model answers frequently asked by external examiners during practical demonstrations.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-2">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    Q{index + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.question}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {item.shortAnswer}
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                    <strong>Quick Summary Answer for Examiner:</strong> {item.shortAnswer}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {item.detailedExplanation}
                  </div>

                  {item.codeSnippet && (
                    <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-950 mt-2">
                      <div className="bg-slate-900 px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800">
                        Code Demonstration
                      </div>
                      <div className="p-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                        <pre>
                          <code>{item.codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RDBMS ACID Principles Cheatsheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          ACID Properties Demonstrated in MySQL InnoDB
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="font-bold text-blue-700 text-sm block">Atomicity</span>
            <p className="text-slate-600 mt-1">
              "All or nothing". Either the entire user registration and log succeed, or any failure triggers a rollback.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="font-bold text-emerald-700 text-sm block">Consistency</span>
            <p className="text-slate-600 mt-1">
              Enforced by <code>UNIQUE</code> and <code>NOT NULL</code> constraints in MySQL. Corrupted or partial states are rejected.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="font-bold text-amber-700 text-sm block">Isolation</span>
            <p className="text-slate-600 mt-1">
              Concurrent student signups execute without interfering with one another via InnoDB row-level locking.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="font-bold text-purple-700 text-sm block">Durability</span>
            <p className="text-slate-600 mt-1">
              Once an <code>INSERT</code> or <code>DELETE</code> completes, data persists on disk in MySQL even if the server restarts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
