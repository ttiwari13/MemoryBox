import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate hook ko import kiya
import { UserCircle, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Supabase client ko import kiya

const Profile = ({ user }) => {
  const navigate = useNavigate(); 
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    specialization: 'Dementia Care Specialist',
    experience: '8 years',
    license: 'MD-2018-456789',
    department: 'Memory Care Unit'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.user_metadata?.full_name || user.email.split('@')[0] || 'User',
        email: user.email,
        phone: user.phone || '+1 (555) 123-4567',
        address: '123 Healthcare Ave, Medical City, MC 12345',
        joinDate: user.created_at || '2022-03-15',
        specialization: 'Dementia Care Specialist',
        experience: '8 years',
        license: 'MD-2018-456789',
        department: 'Memory Care Unit'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    
    setIsEditing(false);
    console.log("Profile data saved:", profileData);
  };

  const handleCancel = () => {

    if (user) {
      setProfileData({
        name: user.user_metadata?.full_name || user.email.split('@')[0] || 'User',
        email: user.email,
        phone: user.phone || '+1 (555) 123-4567',
        address: '123 Healthcare Ave, Medical City, MC 12345',
        joinDate: user.created_at || '2022-03-15',
        specialization: 'Dementia Care Specialist',
        experience: '8 years',
        license: 'MD-2018-456789',
        department: 'Memory Care Unit'
      });
    }
    setIsEditing(false);
    console.log("Edit cancelled.");
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      } else {
        console.log("Signed out successfully.");
       
        navigate('/');
      }
    } catch (error) {
      console.error("An unexpected error occurred during sign out:", error);
    }
  };

  const ProfileField = ({ icon, label, value, isEditing, onInputChange, inputType = 'text', readOnly = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing && !readOnly ? (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      ) : (
        <div className="flex items-center space-x-2 text-gray-900">
          {icon}
          <span>{value}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 overflow-y-auto bg-gray-50 min-h-full">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Profile Header */}
        <div className="relative overflow-hidden p-8 rounded-t-xl bg-gradient-to-br from-primary to-secondary">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)' , backgroundSize: '16px 16px' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 text-white">
            <div className="relative">
              <div className="w-28 h-28 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                <UserCircle size={64} className="text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 bg-primary p-2 rounded-full hover:bg-secondary transition-colors">
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">{profileData.name}</h2>
              <p className="text-indigo-100 mt-1">{profileData.specialization}</p>
              <p className="text-indigo-200 text-sm">{profileData.department}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="p-8">
          <div className="flex justify-end space-x-2 mb-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </>
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            <ProfileField
              label="Full Name"
              value={profileData.name}
              isEditing={isEditing}
              onInputChange={(val) => handleInputChange('name', val)}
              icon={<UserCircle size={16} className="text-gray-500" />}
            />
            <ProfileField
              label="Email"
              value={profileData.email}
              isEditing={isEditing}
              onInputChange={(val) => handleInputChange('email', val)}
              icon={<Mail size={16} className="text-gray-500" />}
            />
            <ProfileField
              label="Phone"
              value={profileData.phone}
              isEditing={isEditing}
              onInputChange={(val) => handleInputChange('phone', val)}
              icon={<Phone size={16} className="text-gray-500" />}
            />
            <ProfileField
              label="Address"
              value={profileData.address}
              isEditing={isEditing}
              onInputChange={(val) => handleInputChange('address', val)}
              icon={<MapPin size={16} className="text-gray-500" />}
              inputType="textarea"
            />
            <ProfileField
              label="Join Date"
              value={new Date(profileData.joinDate).toLocaleDateString()}
              isEditing={false} 
              icon={<Calendar size={16} className="text-gray-500" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
