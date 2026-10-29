import React, { useState } from 'react';
import { 
  Database, 
  KeyRound, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Play, 
  Server, 
  RefreshCw,
  FolderOpen,
  Layers,
  ArrowRight
} from 'lucide-react';

export const WorkbenchGuide: React.FC = () => {
  const [rootPassword, setRootPassword] = useState('');
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [portNumber, setPortNumber] = useState('3306');

  const generatedConfigCode = `<?php
/**
 * Database Configuration File
 * Location: student-portal/config/database.php
 */

$db_host = 'localhost';
$db_name = 'student_portal';
$db_user = 'root';
$db_pass = '${rootPassword}'; // Your configured MySQL root password
$db_port = ${portNumber};

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    die("Database Connection Error: " . htmlspecialchars($e->getMessage()));
}
?>`;

  const copyConfigSnippet = async () => {
    try {
      await navigator.clipboard.writeText(generatedConfigCode);
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              MySQL Workbench 8.0 CE &amp; XAMPP Setup Wizard
            </h2>
            <p className="text-xs text-slate-500">
              Step-by-step instructions to connect your MySQL server, execute database.sql, and configure root credentials.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 leading-relaxed">
          <strong>Regarding your MySQL root password:</strong> In a standard local XAMPP setup, the default MySQL <code>root</code> user has <strong>no password</strong> (empty string <code>''</code>). However, if you set a custom root password in MySQL Workbench 8.0 CE during installation, enter it below to generate the exact connection code for your project!
        </div>
      </div>

      {/* Interactive Root Password & Config Generator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Root Password &amp; Connection Configurator
            </h3>
          </div>
          <span className="text-xs text-slate-500">Updates code in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your MySQL root Password
            </label>
            <input
              type="text"
              value={rootPassword}
              onChange={(e) => setRootPassword(e.target.value)}
              placeholder="Leave empty if default XAMPP, or type root password"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-500">Quick presets:</span>
              <button
                type="button"
                onClick={() => setRootPassword('')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Empty (Default XAMPP)
              </button>
              <button
                type="button"
                onClick={() => setRootPassword('root')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                'root'
              </button>
              <button
                type="button"
                onClick={() => setRootPassword('Admin@123')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                'Admin@123'
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              MySQL Port (Default 3306)
            </label>
            <input
              type="text"
              value={portNumber}
              onChange={(e) => setPortNumber(e.target.value)}
              placeholder="3306"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Standard XAMPP port is 3306. Change to 3307 only if 3306 is occupied.
            </span>
          </div>
        </div>

        {/* Live Generated config/database.php */}
        <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-950 mt-4">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-300">student-portal/config/database.php (Customized)</span>
            <button
              onClick={copyConfigSnippet}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              {copiedConfig ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <pre>
              <code>{generatedConfigCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 5-Step Visual Walkthrough */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          5-Step Deployment Walkthrough
        </h3>

        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Place Folder in XAMPP htdocs &amp; Start Services
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extract or copy the <code>student-portal</code> directory directly into your XAMPP web root:
            </p>
            <div className="bg-slate-100 px-3 py-2 rounded-lg font-mono text-xs text-slate-800">
              C:\xampp\htdocs\student-portal\
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open the <strong>XAMPP Control Panel</strong> and click <strong>Start</strong> for both <strong>Apache</strong> and <strong>MySQL</strong>. Ensure both turn green.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Open MySQL Workbench 8.0 CE &amp; Connect
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Launch <strong>MySQL Workbench 8.0 CE</strong> on your computer. Under <strong>MySQL Connections</strong>, click your connection (usually <code>Local instance 3306</code> or <code>root@localhost</code>).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the password dialog appears:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li>If you configured a root password, enter it and click <strong>OK</strong>.</li>
              <li>If your local MySQL has no password, press <strong>OK</strong> with a blank field.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
            3
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Execute database.sql Script (Lightning Bolt ⚡)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once connected in MySQL Workbench:
            </p>
            <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
              <li>Click <strong>File</strong> &rarr; <strong>Open SQL Script...</strong> (or press <code>Ctrl + Shift + O</code>).</li>
              <li>Select <code>database.sql</code> from <code>C:\xampp\htdocs\student-portal\database.sql</code>.</li>
              <li>Click the <strong>Execute</strong> icon (the yellow lightning bolt ⚡ on the SQL Editor toolbar).</li>
            </ol>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
              <strong>Expected Output in Action Output panel:</strong><br />
              <code>CREATE DATABASE IF NOT EXISTS student_portal &rarr; 1 row(s) affected</code><br />
              <code>CREATE TABLE users &rarr; 0 row(s) affected</code><br />
              <code>INSERT INTO users ... &rarr; 4 row(s) affected (Admin + 3 Students)</code>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
            4
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Verify Database in MySQL Workbench Schemas Panel
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In MySQL Workbench's left sidebar, click the <strong>Schemas</strong> tab. Right-click any schema and choose <strong>Refresh All</strong>.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Expand <code>student_portal</code> &rarr; <code>Tables</code> &rarr; right click <code>users</code> &rarr; click <strong>Select Rows - Limit 1000</strong>. You will see all 4 seeded student and admin records with their BCRYPT hashes!
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
            5
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Launch in Web Browser
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open your browser and navigate to:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs font-mono text-blue-900 font-bold">
              http://localhost/student-portal/
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are ready! Test student signup, duplicate prevention, student login, dashboard, and the admin panel!
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Troubleshooting &amp; Common Errors</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="font-bold text-rose-700 mb-1">
              Error: "Access denied for user 'root'@'localhost' (using password: YES/NO)"
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Cause:</strong> The password specified in <code>config/database.php</code> does not match the actual root password in MySQL Workbench.
              <br />
              <strong>Fix:</strong> Open <code>config/database.php</code> and update <code>$db_pass = 'YOUR_PASSWORD';</code>. If using default XAMPP, set it to empty quotes: <code>$db_pass = '';</code>.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <div className="font-bold text-rose-700 mb-1">
              Error: "Table 'student_portal.users' doesn't exist"
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Cause:</strong> You created the database, but <code>database.sql</code> was not executed completely.
              <br />
              <strong>Fix:</strong> Open MySQL Workbench 8.0 CE, execute <code>student-portal/database.sql</code> using the lightning bolt ⚡ icon, and verify the table appears in the Schemas navigator.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <div className="font-bold text-rose-700 mb-1">
              Error: "Port 3306 in use by another program" in XAMPP
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Cause:</strong> A standalone MySQL service installed by MySQL Workbench is already listening on port 3306.
              <br />
              <strong>Fix:</strong> Either stop the standalone MySQL service via Windows Services (<code>services.msc</code>), or connect XAMPP PHP directly to that instance by setting the port in <code>config/database.php</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
