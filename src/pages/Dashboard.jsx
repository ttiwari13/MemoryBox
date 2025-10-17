import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, HelpCircle, Pill, CheckSquare, UserCircle, Edit3, Save, X, Plus, Trash2, Menu, UserCheck } from 'lucide-react';
import Quizzes from './Quizzes';
import ContactContent from './ContactContent';
import MedicineContent from './MedicineContent';
import TaskContent from './TaskContent';
import Profile from './Profile';
import PatientTherapistBoard from './PatientTherapistBoard'; 
const img = "/assets/img.png"; 
const img8 = "/assets/img8.png"; 
const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const getCurrentTab = () => {
    const path = location.pathname;
    const tabName = path.split('/dashboard/')[1];
    return tabName || null;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error("Failed to load patients from local storage", error);
    }
  }, []);
  useEffect(() => {
    try {
      if (patients.length > 0) {
        localStorage.setItem('patients', JSON.stringify(patients));
      } else {
        localStorage.removeItem('patients');
      }
    } catch (error) {
      console.error("Failed to save patients to local storage", error);
    }
  }, [patients]);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidAge = (age) => {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
  };
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); 
    if (tab === null) {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };
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
    const duplicateEmail = patients.find(p => 
      p.id !== patientId && 
      p.email.trim().toLowerCase() === patient.email.trim().toLowerCase()
    );
    
    if (duplicateEmail) {
      validationErrors.push('This email address is already registered for another patient');
    }

    if (validationErrors.length > 0) {
      console.error('Validation Errors:', validationErrors.join('\n• '));
      alert('Please fix the following errors:\n\n• ' + validationErrors.join('\n• '));
      return;
    }
    if (patientId.startsWith('temp-')) {
      const properPatient = {
        ...patient,
        id: `1122${Date.now().toString().slice(-4)}`,
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
          history: patient.history.trim()
        } : p)
      );
    }

    setIsAddingPatient(false);
    setEditingPatientId(null);
    console.log('Patient information saved successfully!');
  };

  const handleCancelEdit = (patientId) => {
    if (patientId.startsWith('temp-')) {
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      setIsAddingPatient(false);
    } else {
      setEditingPatientId(null);
    }
  };

  const handleDeletePatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    const patientName = patient?.name || 'this patient';
    console.warn(`CONFIRM: Are you sure you want to delete ${patientName}?`);
    setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
    
    console.log('Patient deleted successfully.');
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
      case 'therapist':
        return <PatientTherapistBoard user={user} />;
      case 'profile':
        return <Profile user={user} />;
      case null:
      default:
        return (
          <div className="p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-primary rounded-full -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 translate-x-8 sm:translate-x-12 lg:translate-x-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-primary rounded-full translate-y-6 sm:translate-y-9 lg:translate-y-12 -translate-x-6 sm:-translate-x-9 lg:-translate-x-12 opacity-20"></div>
              
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 lg:mb-3">
                    Welcome Back, Caregiver!
                  </h1>
                  <p className="text-secondary text-sm sm:text-base lg:text-lg leading-relaxed">
                    Monitor your patients' daily progress and manage their care routines. 
                    <span className="font-semibold text-primary block sm:inline"> Together, we remember what matters most.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 lg:mt-4 space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs sm:text-sm text-secondary">{patients.length} Active Patients</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs sm:text-sm text-secondary">All Systems Online</span>
                    </div>
                  </div>
                </div>
                <div className="hidden xl:block mt-4 lg:mt-0">
                  <div className="w-48 lg:w-56 h-32 lg:h-40 bg-gradient-to-br from-primary via-secondary to-primary rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl lg:shadow-2xl transform rotate-1 lg:rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="text-white text-center">
                      <img src={img8} size={30} alt="Caregiver Portal" className="mb-2 opacity-90 w-30 h-30 mx-auto" />
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Patient Management</h2>
                    <p className="text-white/80 text-sm sm:text-base">Manage and track your patients' information</p>
                  </div>
                  {shouldShowAddButton && (
                    <button 
                      onClick={handleAddPatient}
                      disabled={isAddingPatient}
                      className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus size={18} />
                      <span className="text-sm sm:text-base">Add New Patient</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Patients Cards Grid */}
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {patients.map((patient) => (
                    <div key={patient.id} className={`bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 overflow-hidden border ${isEditing(patient.id) ? 'border-primary shadow-primary/20' : 'border-gray-200'}`}>
                      {/* Patient Header */}
                      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {isEditing(patient.id) ? (
                              <input
                                type="text"
                                value={patient.name}
                                onChange={(e) => handleInputChange(patient.id, 'name', e.target.value)}
                                className="bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                placeholder="Enter patient name"
                              />
                            ) : (
                              <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                                {patient.name || 'New Patient'}
                              </h3>
                            )}
                            <p className="text-gray-300 text-xs sm:text-sm mt-1">
                              ID: {patient.id.startsWith('temp-') ? 'Pending' : patient.id}
                            </p>
                          </div>
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${getStageColor(patient.stage)}`}>
                            Stage {patient.stage}
                          </div>
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="p-3 sm:p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age *</label>
                            {isEditing(patient.id) ? (
                              <input
                                type="number"
                                min="1"
                                max="120"
                                value={patient.age}
                                onChange={(e) => handleInputChange(patient.id, 'age', e.target.value)}
                                className={`w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                                  patient.age && !isValidAge(patient.age) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Age"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium text-sm">{patient.age} years</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
                            {isEditing(patient.id) ? (
                              <select
                                value={patient.gender}
                                onChange={(e) => handleInputChange(patient.id, 'gender', e.target.value)}
                                className="w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                              </select>
                            ) : (
                              <p className="text-gray-800 font-medium text-sm">{patient.gender === 'M' ? 'Male' : 'Female'}</p>
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
                              className={`w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                                patient.email && !isValidEmail(patient.email) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              placeholder="patient@email.com"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium truncate text-sm">{patient.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                          {isEditing(patient.id) ? (
                            <input
                              type="tel"
                              value={patient.phone}
                              onChange={(e) => handleInputChange(patient.id, 'phone', e.target.value)}
                              className="w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              placeholder="Phone number"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium text-sm">{patient.phone}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blood</label>
                            {isEditing(patient.id) ? (
                              <select
                                value={patient.blood}
                                onChange={(e) => handleInputChange(patient.id, 'blood', e.target.value)}
                                className="w-full mt-1 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
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
                              <p className="text-gray-800 font-medium text-xs sm:text-sm">{patient.blood}</p>
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
                                className="w-full mt-1 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                                placeholder="kg"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium text-xs sm:text-sm">{patient.weight} kg</p>
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
                                className="w-full mt-1 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                                placeholder="cm"
                              />
                            ) : (
                              <p className="text-gray-800 font-medium text-xs sm:text-sm">{patient.height} cm</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                          {isEditing(patient.id) ? (
                            <textarea
                              value={patient.address}
                              onChange={(e) => handleInputChange(patient.id, 'address', e.target.value)}
                              className="w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                              className="w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                              className="w-full mt-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                            <p>• Email must be in valid format</p>
                            <p>• Age must be between 1 and 120 years</p>
                            <p>• Duplicate emails are not allowed</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-gray-50 p-3 sm:p-4 flex space-x-2">
                        {isEditing(patient.id) ? (
                          <>
                            <button
                              onClick={() => handleSavePatient(patient.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl text-sm"
                            >
                              <Save size={14} />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => handleCancelEdit(patient.id)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl text-sm"
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditPatient(patient.id)}
                              className="flex-1 bg-primary hover:bg-secondary text-white py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl text-sm"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {patients.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-400 mb-4">
                      <User size={36} className="mx-auto" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Patients Yet</h3>
                    <p className="text-gray-500 text-sm sm:text-base">Click "Add New Patient" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  const navItems = [
    { id: 'quizzes', icon: HelpCircle, label: 'Quizzes' },
    { id: 'contact', icon: User, label: 'Contact' },
    { id: 'medicines', icon: Pill, label: 'Medicines' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'therapist', icon: UserCheck, label: 'Therapists' }, 
    { id: 'profile', icon: UserCircle, label: 'Profile' }
  ];

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        <div className="flex items-center">
          <img src={img} alt="Memory Box Logo" className="h-6 w-6 mr-2" />
          <h1 className="text-primary font-bold text-lg">Memory Box</h1>
        </div>
        <div className="w-10"></div> 
      </div>
      <div className={`bg-gradient-to-b from-white via-primary to-secondary flex flex-col shadow-2xl transition-transform duration-300 ${
        sidebarOpen 
          ? 'fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0' 
          : 'fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 xl:w-72`}>
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="pt-4 lg:pt-8 px-4 lg:px-6 pb-6 lg:pb-8">
          <h1 className="text-white font-bold text-xl lg:text-2xl xl:text-3xl flex items-center">
            <img src={img} alt="Memory Box Logo" className="h-6 lg:h-8 w-6 lg:w-8 mr-2" />
            <span>Memory Box</span>
          </h1>
          <p className="text-white/70 text-xs sm:text-sm ml-8 lg:ml-10 mt-2">Caring for memories</p>
        </div>
        
        <nav className="flex-1 px-3 lg:px-4 space-y-1 lg:space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id || 'dashboard'}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent size={18} className="lg:w-5 lg:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col overflow-hidden mt-16 lg:mt-0">
        {renderContent()}
      </div>
      
    </div>
  );
};

export default Dashboard;