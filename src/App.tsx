/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Stethoscope, 
  LogOut, 
  CheckCircle2, 
  MapPin, 
  Pill, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  Save, 
  UserCheck, 
  ChevronRight,
  HeartPulse,
  Plus
} from 'lucide-react';

type PageView = 'appointment' | 'patient_login' | 'patient_details' | 'doctor_login' | 'doctor_dashboard';

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  department: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: 'Confirmed' | 'Completed' | 'In Progress';
}

interface PatientDetails {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  allergies: string;
  address: string;
  insurancePolicy: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1042',
    patientName: 'Eleanor Vance',
    phone: '+1 (555) 234-8901',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Jenkins, MD',
    date: '2026-10-30',
    timeSlot: '10:00 AM',
    notes: 'Routine cardiovascular checkup',
    status: 'Confirmed'
  },
  {
    id: 'APT-1043',
    patientName: 'Robert Gomez',
    phone: '+1 (555) 491-0022',
    department: 'Neurology',
    doctorName: 'Dr. Marcus Vance, MD',
    date: '2026-10-31',
    timeSlot: '02:30 PM',
    notes: 'Follow-up consultation',
    status: 'Confirmed'
  }
];

const INITIAL_PATIENT: PatientDetails = {
  id: 'PT-89420',
  name: 'Eleanor Vance',
  email: 'patient@hospital.org',
  age: 36,
  gender: 'Female',
  bloodGroup: 'O+',
  phone: '+1 (555) 234-8901',
  emergencyContact: 'David Vance (+1 555-234-8902)',
  allergies: 'Penicillin, Seasonal Pollen',
  address: '742 Evergreen Terrace, Springfield',
  insurancePolicy: 'AegisShield Gold #AC-99214'
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('appointment');

  // Appointments List
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Book Appointment Form State
  const [aptDepartment, setAptDepartment] = useState('Cardiology');
  const [aptDoctor, setAptDoctor] = useState('Dr. Sarah Jenkins, MD');
  const [aptDate, setAptDate] = useState('2026-10-30');
  const [aptTimeSlot, setAptTimeSlot] = useState('10:00 AM');
  const [aptPatientName, setAptPatientName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptNotes, setAptNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState<Appointment | null>(null);

  // Patient Login & Details State
  const [patientEmail, setPatientEmail] = useState('patient@hospital.org');
  const [patientPassword, setPatientPassword] = useState('Patient@123');
  const [showPatientPassword, setShowPatientPassword] = useState(false);
  const [patientLoginError, setPatientLoginError] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>(INITIAL_PATIENT);
  const [detailsSavedNotice, setDetailsSavedNotice] = useState(false);

  // Doctor Login State
  const [doctorEmail, setDoctorEmail] = useState('dr.jenkins@hospital.org');
  const [doctorPassword, setDoctorPassword] = useState('Doctor@123');
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [doctorLoginError, setDoctorLoginError] = useState<string | null>(null);

  // Active Authenticated State
  const [loggedInRole, setLoggedInRole] = useState<'patient' | 'doctor' | null>(null);

  // Handle Book Appointment
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptPatientName.trim() || !aptPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: aptPatientName.trim(),
      phone: aptPhone.trim(),
      department: aptDepartment,
      doctorName: aptDoctor,
      date: aptDate,
      timeSlot: aptTimeSlot,
      notes: aptNotes.trim() || 'General consultation',
      status: 'Confirmed'
    };

    setAppointments(prev => [newApt, ...prev]);
    setBookingConfirmed(newApt);

    // Reset inputs
    setAptPatientName('');
    setAptPhone('');
    setAptNotes('');
  };

  // Handle Patient Login
  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientLoginError(null);

    const emailTrim = patientEmail.trim().toLowerCase();
    if (
      (emailTrim === 'patient@hospital.org' || emailTrim === 'pt-89420') &&
      patientPassword === 'Patient@123'
    ) {
      setLoggedInRole('patient');
      setCurrentPage('patient_details');
    } else {
      setPatientLoginError('Invalid patient ID or password. Use demo credentials below.');
    }
  };

  // Handle Patient Details Save
  const handleSavePatientDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsSavedNotice(true);
    setTimeout(() => setDetailsSavedNotice(false), 3000);
  };

  // Handle Doctor Login
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorLoginError(null);

    const emailTrim = doctorEmail.trim().toLowerCase();
    if (emailTrim === 'dr.jenkins@hospital.org' && doctorPassword === 'Doctor@123') {
      setLoggedInRole('doctor');
      setCurrentPage('doctor_dashboard');
    } else {
      setDoctorLoginError('Invalid doctor credentials. Use demo credentials below.');
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setLoggedInRole(null);
    setCurrentPage('appointment');
    setBookingConfirmed(null);
    setPatientLoginError(null);
    setDoctorLoginError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 24/7 Hospital Helpline Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              24/7 Emergency &amp; Trauma Center
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-cyan-400" />
              Call: +1 (800) 432-5800
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              742 Health Sciences Blvd, Metro Center
            </span>
          </div>
        </div>
      </div>

      {/* Main Hospital Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
          {/* Brand Wordmark with Hospital Cross Symbol */}
          <button 
            onClick={() => setCurrentPage('appointment')} 
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                Novo Care Hospital
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider block">
                MEDICAL CENTER &amp; SPECIALIST CLINICS
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setCurrentPage('appointment')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentPage === 'appointment'
                  ? 'bg-cyan-50 text-cyan-800 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Book Appointment
            </button>

            {loggedInRole === 'patient' ? (
              <button
                onClick={() => setCurrentPage('patient_details')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  currentPage === 'patient_details'
                    ? 'bg-cyan-50 text-cyan-800 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Patient Details
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('patient_login')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  currentPage === 'patient_login'
                    ? 'bg-cyan-50 text-cyan-800 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Patient Portal
              </button>
            )}

            {loggedInRole === 'doctor' ? (
              <button
                onClick={() => setCurrentPage('doctor_dashboard')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  currentPage === 'doctor_dashboard'
                    ? 'bg-cyan-50 text-cyan-800 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Doctor Dashboard
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('doctor_login')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  currentPage === 'doctor_login'
                    ? 'bg-cyan-50 text-cyan-800 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Doctor &amp; Staff Login
              </button>
            )}

            {loggedInRole && (
              <button
                onClick={handleSignOut}
                className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* ========================================================= */}
        {/* PAGE 1: BOOK DOCTOR APPOINTMENT (FIRST & PRIMARY PAGE)    */}
        {/* ========================================================= */}
        {currentPage === 'appointment' && (
          <div className="space-y-8">
            {/* Hospital Hero Card with Background Photo & Medical Cross */}
            <div 
              className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 min-h-[260px] flex items-center p-8 sm:p-12 text-white bg-slate-900"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.75) 60%, rgba(15, 23, 42, 0.45) 100%), url('/hospital_bg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="max-w-xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full backdrop-blur-xs">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>ONLINE APPOINTMENT REGISTRATION</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Book Your Consultation with Hospital Specialists
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Select your medical department, pick your doctor, and secure an appointment slot with immediate confirmation.
                </p>
              </div>

              {/* Decorative Medical Cross Motif */}
              <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none text-white hidden md:block">
                <Plus className="w-64 h-64 stroke-[4]" />
              </div>
            </div>

            {/* Confirmation Banner if just booked */}
            {bookingConfirmed && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-emerald-900 text-sm">
                      Appointment Confirmed! Reference ID: {bookingConfirmed.id}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Patient <strong>{bookingConfirmed.patientName}</strong> is scheduled with <strong>{bookingConfirmed.doctorName}</strong> ({bookingConfirmed.department}) on <strong>{bookingConfirmed.date} at {bookingConfirmed.timeSlot}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setBookingConfirmed(null)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Centered Clean Booking Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
              <div className="text-center mb-6 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Book Doctor Consultation
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the patient information to confirm an appointment schedule
                </p>
              </div>

              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Medical Department
                    </label>
                    <select
                      value={aptDepartment}
                      onChange={(e) => setAptDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      <option value="Cardiology">Cardiology &amp; Heart Care</option>
                      <option value="Neurology">Neurology &amp; Spine</option>
                      <option value="Pediatrics">Pediatrics &amp; Child Health</option>
                      <option value="Orthopedics">Orthopedics &amp; Sports Injury</option>
                      <option value="Oncology">Oncology &amp; Tumor Clinic</option>
                      <option value="General Medicine">General Internal Medicine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Assigned Doctor
                    </label>
                    <select
                      value={aptDoctor}
                      onChange={(e) => setAptDoctor(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      <option value="Dr. Sarah Jenkins, MD">Dr. Sarah Jenkins, MD (Cardiology)</option>
                      <option value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD (Neurology)</option>
                      <option value="Dr. Ananya Sen, MD">Dr. Ananya Sen, MD (Pediatrics)</option>
                      <option value="Dr. David Chen, MD">Dr. David Chen, MD (Orthopedics)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={aptTimeSlot}
                      onChange={(e) => setAptTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      <option value="09:30 AM">Morning: 09:30 AM</option>
                      <option value="11:00 AM">Morning: 11:00 AM</option>
                      <option value="02:30 PM">Afternoon: 02:30 PM</option>
                      <option value="04:00 PM">Evening: 04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    value={aptPatientName}
                    onChange={(e) => setAptPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={aptPhone}
                    onChange={(e) => setAptPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 000-0000"
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Brief Reason for Visit / Medical Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={aptNotes}
                    onChange={(e) => setAptNotes(e.target.value)}
                    placeholder="Describe any symptoms or reason for the consultation..."
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-xs font-extrabold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  Confirm Doctor Appointment
                </button>
              </form>

              {/* Quick links to portals */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <span>Already a registered patient?</span>
                <button
                  onClick={() => setCurrentPage('patient_login')}
                  className="font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  Sign In to Patient Portal &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: PATIENT LOGIN                                     */}
        {/* ========================================================= */}
        {currentPage === 'patient_login' && (
          <div className="max-w-md mx-auto py-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Patient Portal Login
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in to view and fill your medical records &amp; details
                </p>
              </div>

              {patientLoginError && (
                <div className="mb-4 p-3 rounded-xl text-xs flex items-start gap-2 bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">{patientLoginError}</div>
                </div>
              )}

              {/* Demo Credentials Helper */}
              <div className="mb-5 bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3 text-xs">
                <div className="flex justify-between items-center text-cyan-900 font-bold mb-1">
                  <span>Demo Patient Credentials:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientEmail('patient@hospital.org');
                      setPatientPassword('Patient@123');
                    }}
                    className="text-[11px] text-cyan-700 underline font-semibold cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Email / ID: <strong>patient@hospital.org</strong> (or PT-89420)<br />
                  Password: <strong>Patient@123</strong>
                </div>
              </div>

              <form onSubmit={handlePatientLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Patient Email or Health ID
                  </label>
                  <input
                    type="text"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@hospital.org or PT-89420"
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPatientPassword ? 'text' : 'password'}
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPatientPassword(!showPatientPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPatientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-extrabold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  Sign In to Patient Portal
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
                <span>Hospital Medical Staff? </span>
                <button
                  onClick={() => setCurrentPage('doctor_login')}
                  className="font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  Switch to Doctor Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 3: PATIENT MEDICAL DETAILS (AFTER PATIENT LOGIN)     */}
        {/* ========================================================= */}
        {currentPage === 'patient_details' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 font-extrabold text-lg flex items-center justify-center">
                    {patientDetails.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {patientDetails.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Patient Health ID: <strong className="text-cyan-700 font-mono">{patientDetails.id}</strong> &bull; Policy: {patientDetails.insurancePolicy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('appointment')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors cursor-pointer"
                  >
                    + Book New Appointment
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {detailsSavedNotice && (
                <div className="my-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Patient medical details successfully saved!</span>
                </div>
              )}

              {/* Form to Fill / Update Patient Details */}
              <form onSubmit={handleSavePatientDetails} className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-600" />
                    <span>Personal Health Profile &amp; Clinical Information</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Fill details below</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={patientDetails.name}
                      onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={patientDetails.age}
                      onChange={(e) => setPatientDetails({ ...patientDetails, age: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={patientDetails.bloodGroup}
                      onChange={(e) => setPatientDetails({ ...patientDetails, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-600 font-mono font-bold"
                    >
                      <option value="O+">O+ Positive</option>
                      <option value="A+">A+ Positive</option>
                      <option value="B+">B+ Positive</option>
                      <option value="AB+">AB+ Positive</option>
                      <option value="O-">O- Negative</option>
                      <option value="A-">A- Negative</option>
                      <option value="B-">B- Negative</option>
                      <option value="AB-">AB- Negative</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person &amp; Phone</label>
                    <input
                      type="text"
                      value={patientDetails.emergencyContact}
                      onChange={(e) => setPatientDetails({ ...patientDetails, emergencyContact: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies / Medical Conditions</label>
                  <input
                    type="text"
                    value={patientDetails.allergies}
                    onChange={(e) => setPatientDetails({ ...patientDetails, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Asthma, Diabetes..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={patientDetails.address}
                    onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Updated Medical Details</span>
                </button>
              </form>

              {/* Patient's Booked Appointments */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>My Scheduled Hospital Appointments</span>
                </h3>

                <div className="space-y-2">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{apt.doctorName}</div>
                        <div className="text-slate-500">{apt.department} &bull; Ref: <code className="font-mono text-cyan-700">{apt.id}</code></div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">{apt.date} at {apt.timeSlot}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 4: DOCTOR & STAFF LOGIN                              */}
        {/* ========================================================= */}
        {currentPage === 'doctor_login' && (
          <div className="max-w-md mx-auto py-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Doctor &amp; Staff Login
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access clinical appointments queue and patient lists
                </p>
              </div>

              {doctorLoginError && (
                <div className="mb-4 p-3 rounded-xl text-xs flex items-start gap-2 bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">{doctorLoginError}</div>
                </div>
              )}

              {/* Demo Credentials Helper */}
              <div className="mb-5 bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3 text-xs">
                <div className="flex justify-between items-center text-cyan-900 font-bold mb-1">
                  <span>Demo Doctor Credentials:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorEmail('dr.jenkins@hospital.org');
                      setDoctorPassword('Doctor@123');
                    }}
                    className="text-[11px] text-cyan-700 underline font-semibold cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Email: <strong>dr.jenkins@hospital.org</strong><br />
                  Password: <strong>Doctor@123</strong>
                </div>
              </div>

              <form onSubmit={handleDoctorLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hospital Staff Email or ID
                  </label>
                  <input
                    type="text"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="dr.jenkins@hospital.org"
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showDoctorPassword ? 'text' : 'password'}
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showDoctorPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  Sign In to Staff Console
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
                <span>Looking for patient portal? </span>
                <button
                  onClick={() => setCurrentPage('patient_login')}
                  className="font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  Switch to Patient Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 5: DOCTOR DASHBOARD (AFTER DOCTOR LOGIN)             */}
        {/* ========================================================= */}
        {currentPage === 'doctor_dashboard' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 font-extrabold text-lg flex items-center justify-center">
                    SJ
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Dr. Sarah Jenkins, MD
                    </h2>
                    <p className="text-xs text-slate-500">
                      Staff ID: <strong className="text-cyan-700 font-mono">DOC-102</strong> &bull; Chief of Cardiology &amp; Electrophysiology
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Consultation Queue */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <span>Patient Consultations Queue ({appointments.length} Total)</span>
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700">Active Shift</span>
                </div>

                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                          <span className="font-mono text-slate-400">({apt.id})</span>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Phone: <strong>{apt.phone}</strong> &bull; {apt.department} &bull; Reason: <em>{apt.notes}</em>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-800">{apt.date}</div>
                          <div className="text-slate-500">{apt.timeSlot}</div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Novo Care Hospital &amp; Medical Centers &bull; All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-5 text-slate-600 font-semibold">
            <button onClick={() => setCurrentPage('appointment')} className="hover:underline cursor-pointer">
              Book Appointment
            </button>
            <button onClick={() => setCurrentPage('patient_login')} className="hover:underline cursor-pointer">
              Patient Details Portal
            </button>
            <button onClick={() => setCurrentPage('doctor_login')} className="hover:underline cursor-pointer">
              Doctor &amp; Staff
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
