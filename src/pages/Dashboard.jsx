import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, HelpCircle, Pill, CheckSquare, UserCircle, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import Quizzes from './Quizzes';
import ContactContent from './ContactContent';
import MedicineContent from './MedicineContent';
import TaskContent from './TaskContent';
import Profile from './Profile';
import img8 from '../assets/img8.png';
import img from '/img.png';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return null; // Main dashboard
    const tabName = path.split('/dashboard/')[1];
    return tabName || null;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [patients, setPatients] = useState([]);

  // Load patients from memory on component mount
  useEffect(() => {
    loadPatientsFromStorage();
  }, []);

  // Save patients to memory whenever patients array changes
  useEffect(() => {
    if (patients.length > 0) {
      savePatientsToStorage(patients);
    }
  }, [patients]);

  // Storage functions (using in-memory storage)
  const savePatientsToStorage = (patientsData) => {
    // Store in window object to persist during session
    if (!window.memoryBoxStorage) {
      window.memoryBoxStorage = {};
    }
    window.memoryBoxStorage.patients = JSON.stringify(patientsData);
  };

  const loadPatientsFromStorage = () => {
    try {
      if (window.memoryBoxStorage && window.memoryBoxStorage.patients) {
        const storedPatients = JSON.parse(window.memoryBoxStorage.patients);
        setPatients(storedPatients);
      }
    } catch (error) {
      console.error('Error loading patients from storage:', error);
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Age validation function
  const isValidAge = (age) => {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
  };

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  // Check if we should show add patient button (only if no patients or in multi-patient mode)
  const shouldShowAddButton = patients.length === 0 || patients.length > 1;

  const handleAddPatient = () => {
    const newPatient = {
      id: `temp-${Date.now()}`,
      name: '',
      age: '',
      gender: 'M',
      address: '',
      phone: '',
      email: '',
      blood: 'A+ve',
      weight: '',
      height: '',
      stage: 1,
      history: ''
    };
    
    setPatients(prevPatients => [newPatient, ...prevPatients]);
    setIsAddingPatient(true);
  };

  const handleEditPatient = (patientId) => {
    setEditingPatientId(patientId);
  };

  const handleSavePatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    
    // Enhanced validation
    const validationErrors = [];
    
    if (!patient.name.trim()) {
      validationErrors.push('Name is required');
    }
    
    if (!patient.age || !isValidAge(patient.age)) {
      validationErrors.push('Age must be a valid number between 1 and 120');
    }
    
    if (!patient.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!isValidEmail(patient.email.trim())) {
      validationErrors.push('Please enter a valid email address');
    }

    // Check for duplicate email (excluding current patient)
    const duplicateEmail = patients.find(p => 
      p.id !== patientId && 
      p.email.trim().toLowerCase() === patient.email.trim().toLowerCase()
    );
    
    if (duplicateEmail) {
      validationErrors.push('This email address is already registered for another patient');
    }

    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + validationErrors.join('\n• '));
      return;
    }

    // If it's a new patient (temp ID), give it a proper ID
    if (patientId.startsWith('temp-')) {
      const properPatient = {
        ...patient,
        id: `1122${Date.now().toString().slice(-4)}`, // Better ID generation
        name: patient.name.trim(),
        email: patient.email.trim().toLowerCase(),
        age: parseInt(patient.age) || 0,
        weight: parseFloat(patient.weight) || 0,
        height: parseFloat(patient.height) || 0,
        phone: patient.phone.trim(),
        address: patient.address.trim(),
        history: patient.history.trim()
      };
      
      setPatients(prevPatients => 
        prevPatients.map(p => p.id === patientId ? properPatient : p)
      );
    } else {
      // Update existing patient
      setPatients(prevPatients => 
        prevPatients.map(p => p.id === patientId ? {
          ...p,
          name: p.name.trim(),
          email: p.email.trim().toLowerCase(),
          age: parseInt(p.age) || 0,
          weight: parseFloat(p.weight) || 0,
          height: parseFloat(p.height) || 0,
          phone: p.phone.trim(),
          address: p.address.trim(),
          history: p.history.trim()
        } : p)
      );
    }

    setIsAddingPatient(false);
    setEditingPatientId(null);
    
    // Show success message
    alert('Patient information saved successfully!');
  };

  const handleCancelEdit = (patientId) => {
    if (patientId.startsWith('temp-')) {
      // Remove the temporary patient
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      setIsAddingPatient(false);
    } else {
      // Reset to original values
      loadPatientsFromStorage();
      setEditingPatientId(null);
    }
  };

  const handleDeletePatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    const patientName = patient?.name || 'this patient';
    
    if (window.confirm(`Are you sure you want to delete ${patientName}? This action cannot be undone.`)) {
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
      
      // Update storage after deletion
      const updatedPatients = patients.filter(patient => patient.id !== patientId);
      if (updatedPatients.length === 0) {
        // Clear storage if no patients left
        if (window.memoryBoxStorage) {
          delete window.memoryBoxStorage.patients;
        }
      }
      
      alert('Patient deleted successfully.');
    }
  };

  const handleInputChange = (patientId, field, value) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...patient, [field]: value }
          : patient
      )
    );
  };

  const isEditing = (patientId) => {
    return editingPatientId === patientId || (isAddingPatient && patientId.startsWith('temp-'));
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'quizzes':
        return <Quizzes />;
      case 'contact':
        return <ContactContent />;
      case 'medicines':
        return <MedicineContent />;
      case 'tasks':
        return <TaskContent />;
      case 'profile':
        return <Profile user={user} />;
      case null:
      default:
        // Main Dashboard Content
        return (
          <div className="p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full translate-y-12 -translate-x-12 opacity-20"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-primary mb-3">
                    Welcome Back, Caregiver! 👋
                  </h1>
                  <p className="text-secondary text-lg max-w-2xl leading-relaxed">
                    Monitor your patients' daily progress and manage their care routines. 
                    <span className="font-semibold text-primary"> Together, we remember what matters most.</span>
                  </p>
                  <div className="flex items-center mt-4 space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-secondary">{patients.length} Active Patients</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-secondary">All Systems Online</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-56 h-40 bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="text-white text-center">
                      <img src={img8} alt="Caregiver Portal" className="mb-2 opacity-90" />
                      <p className="text-sm font-semibold">Caregiver Portal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Patients Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Patient Management</h2>
                    <p className="text-white/80">Manage and track your patients' information</p>
                  </div>
                  {shouldShowAddButton && (
                    <button 
                      onClick={handleAddPatient}
                      disabled={isAddingPatient}
                      className="bg-white text-primary hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus size={20} />
                      <span>Add New Patient</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Patients Cards Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {patients.map((patient) => (
                    <div key={patient.id} className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${isEditing(patient.id) ? 'border-primary shadow-primary/20' : 'border-gray-200'}`}>
                      {/* Patient Header */}
                      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            {isEditing(patient.id) ? (
                              <input
                                type="text"
                                value={patient.name}
                                onChange={(e) => handleInputChange(patient.id, 'name', e.target.value)}
                                className="bg-white text-gray-800 px-3 py-1 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter patient name"
                              />
                            ) : (
                              <h3 className="text-white font-semibold text-lg">
                                {patient.name || 'New Patient'}
                              </h3>
                            )}
                            <p className="text-gray-300 text-sm mt-1">
                              ID: {patient.id.startsWith('temp-') ? 'Pending' : patient.id}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(patient.stage)}`}>
                            Stage {patient.stage}
                          </div>
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age *</label>
                            {isEditing(patient.id) ? (
                              <input
                                type="number"
                                min="1"
                                max="120"
                                value={patient.age}
                                onChange={(e) => handleInputChange(patient.id, 'age', e.target.value)}
                                className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                  patient.age && !isValidAge(patient.age) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Age (1-120)"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium">{patient.age} years</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
                            {isEditing(patient.id) ? (
                              <select
                                value={patient.gender}
                                onChange={(e) => handleInputChange(patient.id, 'gender', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                              </select>
                            ) : (
                              <p className="text-gray-800 font-medium">{patient.gender === 'M' ? 'Male' : 'Female'}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email *</label>
                          {isEditing(patient.id) ? (
                            <input
                              type="email"
                              value={patient.email}
                              onChange={(e) => handleInputChange(patient.id, 'email', e.target.value)}
                              className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                patient.email && !isValidEmail(patient.email) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              placeholder="patient@email.com"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium truncate">{patient.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                          {isEditing(patient.id) ? (
                            <input
                              type="tel"
                              value={patient.phone}
                              onChange={(e) => handleInputChange(patient.id, 'phone', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Phone number"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium">{patient.phone}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blood</label>
                            {isEditing(patient.id) ? (
                              <select
                                value={patient.blood}
                                onChange={(e) => handleInputChange(patient.id, 'blood', e.target.value)}
                                className="w-full mt-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              >
                                <option value="A+ve">A+</option>
                                <option value="A-ve">A-</option>
                                <option value="B+ve">B+</option>
                                <option value="B-ve">B-</option>
                                <option value="AB+ve">AB+</option>
                                <option value="AB-ve">AB-</option>
                                <option value="O+ve">O+</option>
                                <option value="O-ve">O-</option>
                              </select>
                            ) : (
                              <p className="text-gray-800 font-medium">{patient.blood}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</label>
                            {isEditing(patient.id) ? (
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={patient.weight}
                                onChange={(e) => handleInputChange(patient.id, 'weight', e.target.value)}
                                className="w-full mt-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                placeholder="kg"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium">{patient.weight} kg</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Height</label>
                            {isEditing(patient.id) ? (
                              <input
                                type="number"
                                min="0"
                                value={patient.height}
                                onChange={(e) => handleInputChange(patient.id, 'height', e.target.value)}
                                className="w-full mt-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                placeholder="cm"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium">{patient.height} cm</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                          {isEditing(patient.id) ? (
                            <textarea
                              value={patient.address}
                              onChange={(e) => handleInputChange(patient.id, 'address', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              rows="2"
                              placeholder="Patient address"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium text-sm">{patient.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medical History</label>
                          {isEditing(patient.id) ? (
                            <textarea
                              value={patient.history}
                              onChange={(e) => handleInputChange(patient.id, 'history', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              rows="2"
                              placeholder="Medical history and notes"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium text-sm">{patient.history}</p>
                          )}
                        </div>

                        {isEditing(patient.id) && (
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage</label>
                            <select
                              value={patient.stage}
                              onChange={(e) => handleInputChange(patient.id, 'stage', parseInt(e.target.value))}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value={1}>Stage 1 - Mild</option>
                              <option value={2}>Stage 2 - Moderate</option>
                              <option value={3}>Stage 3 - Severe</option>
                              <option value={4}>Stage 4 - Critical</option>
                            </select>
                          </div>
                        )}

                        {isEditing(patient.id) && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                            <p className="font-semibold mb-1">Required fields are marked with *</p>
                            <p>• Name, Age, and Email are mandatory</p>
                            <p>• Email must be in valid format (e.g., user@domain.com)</p>
                            <p>• Age must be between 1 and 120 years</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-gray-50 p-4 flex space-x-2">
                        {isEditing(patient.id) ? (
                          <>
                            <button
                              onClick={() => handleSavePatient(patient.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                              <Save size={16} />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => handleCancelEdit(patient.id)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditPatient(patient.id)}
                              className="flex-1 bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                              <Edit3 size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {patients.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <User size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Patients Yet</h3>
                    <p className="text-gray-500">Click "Add New Patient" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid h-screen grid-cols-3 lg:grid-cols-5 bg-gray-100">
      {/* Sidebar - Enhanced Design */}
      <div className="bg-gradient-to-b from-white via-primary to-secondary col-span-1 flex flex-col shadow-2xl">
        <div className="pt-8 px-6 pb-8">
         <h1 className="text-white font-bold text-2xl lg:text-3xl flex items-center">
  <img src={img} alt="Memory Box Logo" className="h-8 w-8 mr-2" />
  <span>Memory Box</span>
</h1>
          <p className="text-white/70 text-sm ml-10 mt-2">Caring for memories</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => handleTabClick('quizzes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              activeTab === 'quizzes' ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Quizzes</span>
          </button>
          
          <button
            onClick={() => handleTabClick('contact')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              activeTab === 'contact' ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Contact</span>
          </button>
          
          <button
            onClick={() => handleTabClick('medicines')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              activeTab === 'medicines' ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Pill size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Medicines</span>
          </button>
          
          <button
            onClick={() => handleTabClick('tasks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              activeTab === 'tasks' ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <CheckSquare size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Tasks</span>
          </button>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="px-4 pb-6">
          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              activeTab === 'profile' ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <UserCircle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white col-span-2 lg:col-span-4 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;