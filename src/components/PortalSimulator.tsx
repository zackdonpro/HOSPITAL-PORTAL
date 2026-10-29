import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  IdCard, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Database, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface SimulatedUser {
  id: number;
  full_name: string;
  student_id: string;
  email: string;
  password: string; // Plaintext representation for simulator comparison
  password_hash: string;
  role: 'student' | 'admin';
  created_at: string;
}

interface SqlQueryLog {
  query: string;
  params: Record<string, any>;
  action: string;
  securityNote: string;
  timestamp: string;
}

const INITIAL_USERS: SimulatedUser[] = [
  {
    id: 1,
    full_name: 'System Administrator',
    student_id: 'ADM-001',
    email: 'admin@portal.edu',
    password: 'Admin@123',
    password_hash: '$2y$10$vN4G2tV4oV2iWp/7rR1Rk.fQfK3uB9tP9kY9H5k3G2nZ2w9t1Q8vC',
    role: 'admin',
    created_at: '2026-09-01 09:00:00'
  },
  {
    id: 2,
    full_name: 'Rohan Sharma',
    student_id: 'STU-2024-001',
    email: 'rohan.sharma@college.edu',
    password: 'Student@123',
    password_hash: '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
    role: 'student',
    created_at: '2026-09-05 11:20:15'
  },
  {
    id: 3,
    full_name: 'Priya Patel',
    student_id: 'STU-2024-002',
    email: 'priya.patel@college.edu',
    password: 'Student@123',
    password_hash: '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
    role: 'student',
    created_at: '2026-09-08 14:15:30'
  },
  {
    id: 4,
    full_name: 'Amit Verma',
    student_id: 'STU-2024-003',
    email: 'amit.verma@college.edu',
    password: 'Student@123',
    password_hash: '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
    role: 'student',
    created_at: '2026-09-12 16:45:10'
  }
];

export const PortalSimulator: React.FC = () => {
  // Database simulation state
  const [users, setUsers] = useState<SimulatedUser[]>(INITIAL_USERS);
  const [currentSessionUser, setCurrentSessionUser] = useState<SimulatedUser | null>(null);
  
  // Navigation within simulation: 'home' | 'login' | 'signup' | 'dashboard' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'login' | 'signup' | 'dashboard' | 'admin'>('home');
  
  // Flash messages
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin panel state
  const [adminSearch, setAdminSearch] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState<SimulatedUser | null>(null);

  // Query logs for students to inspect the SQL and security operations
  const [queryLogs, setQueryLogs] = useState<SqlQueryLog[]>([
    {
      action: 'BOOTSTRAP',
      query: 'USE student_portal; SELECT * FROM users LIMIT 10;',
      params: {},
      securityNote: 'Database initialized with 1 Admin and 3 seeded Student accounts.',
      timestamp: '10:00:00'
    }
  ]);

  const addQueryLog = (action: string, query: string, params: Record<string, any>, securityNote: string) => {
    const time = new Date().toLocaleTimeString();
    setQueryLogs(prev => [
      { action, query, params, securityNote, timestamp: time },
      ...prev.slice(0, 7) // keep latest 8 logs
    ]);
  };

  // Switch route with auth guards
  const navigateTo = (route: 'home' | 'login' | 'signup' | 'dashboard' | 'admin') => {
    setFlashMessage(null);

    // Auth guard for protected routes
    if (route === 'dashboard') {
      if (!currentSessionUser) {
        setFlashMessage({ type: 'error', text: 'Please log in first to access your portal dashboard.' });
        setCurrentRoute('login');
        return;
      }
    }

    if (route === 'admin') {
      if (!currentSessionUser) {
        setFlashMessage({ type: 'error', text: 'Please log in with admin credentials to access the Admin Panel.' });
        setCurrentRoute('login');
        return;
      }
      if (currentSessionUser.role !== 'admin') {
        setFlashMessage({ type: 'error', text: 'Access Denied: You do not possess administrator privileges.' });
        setCurrentRoute('dashboard');
        return;
      }
    }

    setCurrentRoute(route);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setFlashMessage({ type: 'error', text: 'Please enter both your email address and password.' });
      return;
    }

    // Simulate PDO prepared statement: SELECT * FROM users WHERE email = :email LIMIT 1
    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    addQueryLog(
      'PDO SELECT',
      'SELECT id, full_name, student_id, email, password, role FROM users WHERE email = :email LIMIT 1',
      { ':email': loginEmail.trim() },
      'Prepared statement prevents SQL Injection. Testing password via password_verify().'
    );

    if (foundUser && foundUser.password === loginPassword) {
      // Successful authentication
      setCurrentSessionUser(foundUser);
      setFlashMessage({ type: 'success', text: `Welcome back, ${foundUser.full_name}!` });

      addQueryLog(
        'SESSION REGENERATE',
        'session_regenerate_id(true); $_SESSION[\'user_id\'] = ' + foundUser.id,
        { 'role': foundUser.role, 'session_status': 'active' },
        'Session fixation defense triggered. User role verified.'
      );

      if (foundUser.role === 'admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('dashboard');
      }
    } else {
      setFlashMessage({ type: 'error', text: 'Invalid email address or password. Please try again.' });
    }
  };

  // Handle Signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName.trim() || !signupStudentId.trim() || !signupEmail.trim() || !signupPassword) {
      setFlashMessage({ type: 'error', text: 'All registration fields are required.' });
      return;
    }

    if (signupPassword.length < 6) {
      setFlashMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setFlashMessage({ type: 'error', text: 'Password and Confirm Password do not match.' });
      return;
    }

    // Check duplicate email or student ID
    const duplicateEmail = users.find(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase());
    const duplicateId = users.find(u => u.student_id.toUpperCase() === signupStudentId.trim().toUpperCase());

    addQueryLog(
      'PDO DUPLICATE CHECK',
      'SELECT id, email, student_id FROM users WHERE email = :email OR student_id = :student_id LIMIT 1',
      { ':email': signupEmail.trim(), ':student_id': signupStudentId.trim().toUpperCase() },
      'Enforcing UNIQUE constraints before executing insertion query.'
    );

    if (duplicateEmail) {
      setFlashMessage({ type: 'error', text: 'An account with this email address already exists.' });
      return;
    }

    if (duplicateId) {
      setFlashMessage({ type: 'error', text: 'This Student ID is already registered in the system.' });
      return;
    }

    // Insert new user
    const newUser: SimulatedUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      full_name: signupName.trim(),
      student_id: signupStudentId.trim().toUpperCase(),
      email: signupEmail.trim(),
      password: signupPassword,
      password_hash: `$2y$10$demoHashed${Math.random().toString(36).substring(2, 12)}`,
      role: 'student',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setUsers(prev => [...prev, newUser]);

    addQueryLog(
      'PDO INSERT',
      'INSERT INTO users (full_name, student_id, email, password, role) VALUES (:full_name, :student_id, :email, :password, \'student\')',
      { 
        ':full_name': newUser.full_name, 
        ':student_id': newUser.student_id, 
        ':email': newUser.email,
        ':password': '[BCRYPT_HASH_255_CHARS]' 
      },
      'Password hashed with native password_hash(..., PASSWORD_BCRYPT). Saved to MySQL.'
    );

    // Clear form
    setSignupName('');
    setSignupStudentId('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');

    setFlashMessage({ type: 'success', text: 'Registration successful! You may now sign in with your email and password.' });
    setCurrentRoute('login');
  };

  // Handle Logout
  const handleLogout = () => {
    const userName = currentSessionUser?.full_name || 'User';
    setCurrentSessionUser(null);
    setFlashMessage({ type: 'success', text: `You have been successfully logged out.` });
    
    addQueryLog(
      'SESSION DESTROY',
      'session_unset(); session_destroy(); setcookie(session_name(), \'\', time() - 42000);',
      { 'user': userName },
      'Session cookies invalidated and cleared on server and client.'
    );

    setCurrentRoute('login');
  };

  // Handle Delete Student
  const confirmDelete = () => {
    if (!deleteCandidate) return;

    setUsers(prev => prev.filter(u => u.id !== deleteCandidate.id));

    addQueryLog(
      'PDO DELETE',
      'DELETE FROM users WHERE id = :id AND role = \'student\'',
      { ':id': deleteCandidate.id, 'csrf_token': 'verified_valid' },
      `Student #${deleteCandidate.id} (${deleteCandidate.full_name}) deleted by admin.`
    );

    setFlashMessage({ type: 'success', text: `Student ${deleteCandidate.full_name} was removed from the database.` });
    setDeleteCandidate(null);
  };

  // Reset database to initial
  const handleResetDatabase = () => {
    setUsers(INITIAL_USERS);
    setCurrentSessionUser(null);
    setCurrentRoute('home');
    setFlashMessage({ type: 'success', text: 'Simulated database re-seeded with default admin and students.' });
    addQueryLog('DB RE-SEED', 'TRUNCATE TABLE users; INSERT INTO users ... (Admin + 3 Students)', {}, 'Database state reset to pristine seeded state.');
  };

  // Quick fill helper for testing
  const quickFillLogin = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setLoginEmail('admin@portal.edu');
      setLoginPassword('Admin@123');
    } else {
      setLoginEmail('rohan.sharma@college.edu');
      setLoginPassword('Student@123');
    }
  };

  // Filter students for admin view
  const studentList = users.filter(u => u.role === 'student');
  const filteredStudents = studentList.filter(s => {
    if (!adminSearch.trim()) return true;
    const term = adminSearch.toLowerCase();
    return s.full_name.toLowerCase().includes(term) || 
           s.email.toLowerCase().includes(term) || 
           s.student_id.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Simulation Info Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            PHP
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Interactive PHP & MySQL Portal Simulation</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Simulating XAMPP / Apache / MySQL
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Current Page URL: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">http://localhost/student-portal/{currentRoute === 'home' ? 'index.php' : `${currentRoute}.php`}</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDatabase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset database to default seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Database
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport Frame */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
        {/* Browser Mock Navigation Bar */}
        <div className="bg-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-slate-400 ml-2 font-mono text-[11px]">
              http://localhost/student-portal/{currentRoute === 'home' ? 'index.php' : `${currentRoute}.php`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Active Session:</span>
            {currentSessionUser ? (
              <span className="text-emerald-400 font-medium font-mono">
                {currentSessionUser.full_name} ({currentSessionUser.role.toUpperCase()})
              </span>
            ) : (
              <span className="text-slate-400 font-mono">Guest (None)</span>
            )}
          </div>
        </div>

        {/* Portal Navbar Header (matches includes/header.php) */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
            <button 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-blue-700 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              <span>Student Portal</span>
            </button>

            <nav className="flex items-center gap-4 text-sm font-medium">
              <button
                onClick={() => navigateTo('home')}
                className={`transition-colors ${currentRoute === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Home
              </button>

              {currentSessionUser ? (
                <>
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className={`transition-colors ${currentRoute === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    My Dashboard
                  </button>

                  {currentSessionUser.role === 'admin' && (
                    <button
                      onClick={() => navigateTo('admin')}
                      className={`transition-colors ${currentRoute === 'admin' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Admin Panel
                    </button>
                  )}

                  <div className="hidden sm:block text-xs text-slate-500 pl-2">
                    Hi, <strong className="text-slate-800">{currentSessionUser.full_name}</strong>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo('login')}
                    className={`transition-colors ${currentRoute === 'login' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigateTo('signup')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Register
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Inner Page Content */}
        <div className="max-w-5xl mx-auto px-6 py-8 min-h-[460px]">
          {/* Flash Alert Banner */}
          {flashMessage && (
            <div 
              className={`mb-6 p-3.5 rounded-lg text-sm flex items-start gap-2.5 ${
                flashMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {flashMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{flashMessage.text}</div>
              <button 
                onClick={() => setFlashMessage(null)} 
                className="text-xs underline text-slate-500 hover:text-slate-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 1. HOME / INDEX.PHP */}
          {currentRoute === 'home' && (
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xs">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-3">
                  RDBMS College Project
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Student Login &amp; Registration System
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  A simple, secure college web portal demonstrating MySQL database connectivity, 
                  prepared statements, BCRYPT encryption, and role-based access control.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {currentSessionUser ? (
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Go to My Dashboard &rarr;
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigateTo('login')}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                      >
                        Student / Admin Login
                      </button>
                      <button
                        onClick={() => navigateTo('signup')}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        New Student Registration
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Technical Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">BCRYPT Encryption</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Passwords hashed via PHP native <code>password_hash()</code>. Plaintext is never stored in MySQL.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">SQL Injection Defense</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Uses PDO parameterized prepared statements (<code>:email</code>, <code>:student_id</code>) for all inputs.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Role-Based Access</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Separate dashboards and permissions for students vs. admins using verified session roles.
                  </p>
                </div>
              </div>

              {/* Seeded Credentials Helper Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Pre-configured Accounts for Practical Evaluation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="font-bold text-blue-900 flex justify-between items-center mb-1">
                      <span>Administrator Account</span>
                      <button
                        onClick={() => {
                          quickFillLogin('admin');
                          navigateTo('login');
                        }}
                        className="text-blue-600 hover:underline text-[11px]"
                      >
                        Auto-fill Login &rarr;
                      </button>
                    </div>
                    <div className="text-slate-600 space-y-0.5 font-mono">
                      <div>Email: <strong>admin@portal.edu</strong></div>
                      <div>Pass: <strong>Admin@123</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="font-bold text-emerald-900 flex justify-between items-center mb-1">
                      <span>Student Account</span>
                      <button
                        onClick={() => {
                          quickFillLogin('student');
                          navigateTo('login');
                        }}
                        className="text-blue-600 hover:underline text-[11px]"
                      >
                        Auto-fill Login &rarr;
                      </button>
                    </div>
                    <div className="text-slate-600 space-y-0.5 font-mono">
                      <div>Email: <strong>rohan.sharma@college.edu</strong></div>
                      <div>Pass: <strong>Student@123</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. LOGIN.PHP */}
          {currentRoute === 'login' && (
            <div className="flex justify-center items-center py-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs w-full max-w-md p-7">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Student Portal Login</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in with your registered college email and password
                  </p>
                </div>

                {/* Quick Auto-Fill Buttons for Viva/Demo */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => quickFillLogin('student')}
                    className="flex-1 py-1 px-2 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-center"
                  >
                    Fill Student Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFillLogin('admin')}
                    className="flex-1 py-1 px-2 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors text-center"
                  >
                    Fill Admin Credentials
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      College Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@college.edu or admin@portal.edu"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        title={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Sign In
                  </button>
                </form>

                <div className="text-center mt-5 text-xs text-slate-600">
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => navigateTo('signup')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Register as a Student
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. SIGNUP.PHP */}
          {currentRoute === 'signup' && (
            <div className="flex justify-center items-center py-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs w-full max-w-lg p-7">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Create Student Account</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Register in the college database to access student records
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Student ID / Roll No (UNIQUE)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <IdCard className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={signupStudentId}
                        onChange={(e) => setSignupStudentId(e.target.value)}
                        placeholder="e.g. STU-2024-105"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        required
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Enforced unique constraint in MySQL users table.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      College Email Address (UNIQUE)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. new.student@college.edu"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="At least 6 chars"
                          className="w-full px-3 py-2 pr-9 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full px-3 py-2 pr-9 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs mt-2"
                  >
                    Complete Registration
                  </button>
                </form>

                <div className="text-center mt-5 text-xs text-slate-600">
                  Already registered?{' '}
                  <button
                    onClick={() => navigateTo('login')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Log In here
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. DASHBOARD.PHP */}
          {currentRoute === 'dashboard' && currentSessionUser && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Welcome back, {currentSessionUser.full_name}!
                  </h1>
                  <p className="text-xs text-slate-500">
                    Your authenticated student profile retrieved via MySQL query: <code>SELECT * FROM users WHERE id = {currentSessionUser.id}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider bg-blue-100 text-blue-800">
                    {currentSessionUser.role} Account
                  </span>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                  Student Record Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database ID</span>
                    <div className="text-base font-bold text-slate-900 mt-1 font-mono">#{currentSessionUser.id}</div>
                    <span className="text-[10px] text-slate-500">Primary Key (Auto-Increment)</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student ID / Roll No</span>
                    <div className="text-base font-bold text-blue-700 mt-1 font-mono">{currentSessionUser.student_id}</div>
                    <span className="text-[10px] text-slate-500">Unique Identifier</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                    <div className="text-base font-bold text-slate-900 mt-1">{currentSessionUser.full_name}</div>
                    <span className="text-[10px] text-slate-500">VARCHAR(100)</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Email</span>
                    <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{currentSessionUser.email}</div>
                    <span className="text-[10px] text-slate-500">Unique Constraint</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role</span>
                    <div className="text-sm font-semibold text-slate-900 mt-1 capitalize">{currentSessionUser.role}</div>
                    <span className="text-[10px] text-slate-500">ENUM('student', 'admin')</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Created</span>
                    <div className="text-sm font-semibold text-slate-900 mt-1">{currentSessionUser.created_at}</div>
                    <span className="text-[10px] text-slate-500">TIMESTAMP Default Current</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out (Destroy Session)
                  </button>

                  {currentSessionUser.role === 'admin' && (
                    <button
                      onClick={() => navigateTo('admin')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Go to Admin Console &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. ADMIN.PHP */}
          {currentRoute === 'admin' && currentSessionUser && currentSessionUser.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Administrator Console</h1>
                  <p className="text-xs text-slate-500">
                    Query, search, and perform CRUD operations across the student database.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Total Registered Students:</span>
                  <span className="text-lg font-extrabold text-blue-600 font-mono">
                    {studentList.length}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative max-w-sm w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by name, student ID, or email..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Showing {filteredStudents.length} of {studentList.length} student record(s)
                </div>
              </div>

              {/* Students Data Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">DB ID</th>
                        <th className="py-3 px-4">Student ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Email Address</th>
                        <th className="py-3 px-4">Registration Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            {adminSearch ? `No students found matching "${adminSearch}".` : 'No registered students in database.'}
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((stu) => (
                          <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">#{stu.id}</td>
                            <td className="py-3 px-4 font-mono font-medium text-blue-700">{stu.student_id}</td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{stu.full_name}</td>
                            <td className="py-3 px-4 text-slate-600">{stu.email}</td>
                            <td className="py-3 px-4 text-slate-500">{stu.created_at}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setDeleteCandidate(stu)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Delete Confirmation (simulates delete_student.php confirmation) */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">Confirm Student Deletion</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Are you sure you want to permanently delete record for <strong>{deleteCandidate.full_name}</strong> (ID: {deleteCandidate.student_id})? 
                This will trigger a parameterized <code>DELETE FROM users WHERE id = :id AND role = 'student'</code>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live SQL & PDO Query Inspector Console */}
        <div className="border-t border-slate-300 bg-slate-900 text-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100">Live SQL Query &amp; PDO Inspector</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Real-time RDBMS execution log
              </span>
            </div>
            <button
              onClick={() => setQueryLogs([])}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-[11px] font-mono">
            {queryLogs.map((log, index) => (
              <div key={index} className="bg-slate-950 border border-slate-800 rounded p-2.5">
                <div className="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                  <span className="text-emerald-400 font-bold">{log.action}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-amber-300 font-medium break-all">
                  {log.query}
                </div>
                {Object.keys(log.params).length > 0 && (
                  <div className="text-slate-400 mt-1 text-[10px]">
                    Params: {JSON.stringify(log.params)}
                  </div>
                )}
                <div className="text-emerald-500/90 text-[10px] mt-1 border-t border-slate-800/80 pt-1">
                  &bull; {log.securityNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
