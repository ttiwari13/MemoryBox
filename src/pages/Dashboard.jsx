import React, { useState } from 'react';
import { User, HelpCircle, Pill, CheckSquare, Plus, Edit, Trash2, Download } from 'lucide-react';
import img8 from '../assets/img8.png';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const patientColumns = [
    'ID', 'Name', 'Age', 'Gender', 'Height', 'Weight', 
    'Alzheimer Stage', 'History', 'Blood Group', 'Address', 
    'Phone No', 'Email', 'Actions'
  ];

  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'John Smith',
      age: '72',
      gender: 'Male',
      height: '5\'8"',
      weight: '165 lbs',
      alzheimerStage: 'Stage 2',
      history: 'Diagnosed 2020',
      bloodGroup: 'A+',
      address: '123 Oak Street',
      phone: '555-0123',
      email: 'john.smith@email.com'
    },
    {
      id: 'P002',
      name: 'Mary Johnson',
      age: '68',
      gender: 'Female',
      height: '5\'4"',
      weight: '140 lbs',
      alzheimerStage: 'Stage 1',
      history: 'Diagnosed 2022',
      bloodGroup: 'B+',
      address: '456 Pine Avenue',
      phone: '555-0456',
      email: 'mary.johnson@email.com'
    }
  ]);

  const deletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients(patients.filter(patient => patient.id !== patientId));
    }
  };

  const downloadReport = () => {
    const headers = patientColumns.slice(0, -1).join(',');
    const csvContent = [
      headers,
      ...patients.map(patient => [
        patient.id,
        patient.name,
        patient.age,
        patient.gender,
        patient.height,
        patient.weight,
        patient.alzheimerStage,
        patient.history,
        patient.bloodGroup,
        patient.address,
        patient.phone,
        patient.email
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid h-screen grid-cols-3 lg:grid-cols-5 bg-gray-100">
      {/* Sidebar */}
      <div className="bg-primary col-span-1 flex flex-col">
        <div className="pt-8 px-6 pb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">Memory Box</h1>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'quizzes' ? 'bg-secondary text-white' : 'text-indigo-200 hover:bg-secondary hover:text-white'
            }`}
          >
            <HelpCircle size={20} />
            <span className="font-medium">Quizzes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'contact' ? 'bg-secondary text-white' : 'text-indigo-200 hover:bg-secondary hover:text-white'
            }`}
          >
            <User size={20} />
            <span className="font-medium">Contact</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'medicines' ? 'bg-secondary text-white' : 'text-indigo-200 hover:bg-secondary hover:text-white'
            }`}
          >
            <Pill size={20} />
            <span className="font-medium">Medicines</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'tasks' ? 'bg-secondary text-white' : 'text-indigo-200 hover:bg-secondary hover:text-white'
            }`}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tasks</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white col-span-2 lg:col-span-4 flex flex-col">
        {/* Header */}
        <div className="bg-indigo-100 mx-6 mt-6 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center shadow-lg">
              <img src={img8} alt="img" className="" />
            </div>


            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Caregiver!</h2>
              <p className="text-gray-600 text-lg">
                Dedicated to providing compassionate care and support for Alzheimer's patients. 
                Your commitment to improving lives makes all the difference.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons and Grid */}
        <div className="mx-6 mt-6 flex-1">
          <div className="flex justify-end space-x-2 mb-4">
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Plus size={16} />
              <span>Add</span>
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Edit size={16} />
              <span>Edit</span>
            </button>
          </div>

          {/* Patient Details Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800">
                  <tr>
                    {patientColumns.map((column, index) => (
                      <th key={index} className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.age}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.gender}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.height}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.weight}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.alzheimerStage === 'Stage 1' ? 'bg-yellow-100 text-yellow-800' :
                          patient.alzheimerStage === 'Stage 2' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {patient.alzheimerStage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.history}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.bloodGroup}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.address}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{patient.phone}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{patient.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete Patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Download Report Button - Below Table */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={downloadReport}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md"
                >
                  <Download size={20} />
                  <span className="font-medium">Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;