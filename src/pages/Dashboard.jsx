import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, HelpCircle, Pill, CheckSquare } from 'lucide-react';
import Quizzes from './Quizzes';
import ContactContent from './ContactContent';
import MedicineContent from './MedicineContent';
import TaskContent from './TaskContent';
import img8 from '../assets/img8.png';
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

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
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
      case null:
      default:
        // Main Dashboard Content
        return (
          <div className="p-6 overflow-y-auto bg-gray-50 min-h-full">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Caregiver!</h1>
                <p className="text-gray-600 max-w-2xl">
                  Keep track of your patients daily progress and overview of their routines. Let's not forget 
                  to fight for those who can't remember!
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-48 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <img src={img8} alt="img" className="" />
                    <p className="text-sm font-medium">Caregiver Portal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Patients Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Your Patients</h2>
                <div className="flex space-x-3">
                  <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Add Patient
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Edit Patient
                  </button>
                </div>
              </div>

              {/* Patients Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Patient ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Patient Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Age</th>
                      <th className="px-4 py-3 text-left font-semibold">Gender</th>
                      <th className="px-4 py-3 text-left font-semibold">Address</th>
                      <th className="px-4 py-3 text-left font-semibold">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold">Email</th>
                      <th className="px-4 py-3 text-left font-semibold">Blood</th>
                      <th className="px-4 py-3 text-left font-semibold">Weight</th>
                      <th className="px-4 py-3 text-left font-semibold">Height</th>
                      <th className="px-4 py-3 text-left font-semibold">Stage</th>
                      <th className="px-4 py-3 text-left font-semibold">History</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">112233</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">Stella</td>
                      <td className="px-4 py-3 text-gray-900">56</td>
                      <td className="px-4 py-3 text-gray-900">F</td>
                      <td className="px-4 py-3 text-gray-900 text-sm">14, XYZ street, XYZ colony, XYZ</td>
                      <td className="px-4 py-3 text-gray-900">9876543210</td>
                      <td className="px-4 py-3 text-gray-900 text-sm">stella@gmail.com</td>
                      <td className="px-4 py-3 text-gray-900">B+ve</td>
                      <td className="px-4 py-3 text-gray-900">60</td>
                      <td className="px-4 py-3 text-gray-900">175</td>
                      <td className="px-4 py-3 text-gray-900">2</td>
                      <td className="px-4 py-3 text-gray-900 text-sm max-w-xs">
                        Currently under stage 2 medication with a 65% recurring memory.
                      </td>
                    </tr>
                    {/* Add more sample rows if needed */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">112234</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">John</td>
                      <td className="px-4 py-3 text-gray-900">68</td>
                      <td className="px-4 py-3 text-gray-900">M</td>
                      <td className="px-4 py-3 text-gray-900 text-sm">25, ABC road, ABC city</td>
                      <td className="px-4 py-3 text-gray-900">9876543211</td>
                      <td className="px-4 py-3 text-gray-900 text-sm">john@gmail.com</td>
                      <td className="px-4 py-3 text-gray-900">A+ve</td>
                      <td className="px-4 py-3 text-gray-900">75</td>
                      <td className="px-4 py-3 text-gray-900">180</td>
                      <td className="px-4 py-3 text-gray-900">1</td>
                      <td className="px-4 py-3 text-gray-900 text-sm max-w-xs">
                        Early stage dementia, good response to treatment.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="">
                 <button className="">Download Report</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid h-screen grid-cols-3 lg:grid-cols-5 bg-gray-100">
      {/* Sidebar - This stays fixed */}
      <div className="bg-indigo-600 col-span-1 flex flex-col">
        <div className="pt-8 px-6 pb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">Memory Box</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => handleTabClick('quizzes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'quizzes' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <HelpCircle size={20} />
            <span className="font-medium">Quizzes</span>
          </button>
          
          <button
            onClick={() => handleTabClick('contact')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'contact' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <User size={20} />
            <span className="font-medium">Contact</span>
          </button>
          
          <button
            onClick={() => handleTabClick('medicines')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'medicines' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <Pill size={20} />
            <span className="font-medium">Medicines</span>
          </button>
          
          <button
            onClick={() => handleTabClick('tasks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'tasks' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tasks</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area - This changes based on active tab */}
      <div className="bg-white col-span-2 lg:col-span-4 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;