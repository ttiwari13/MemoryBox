import React, { useState, useEffect, useCallback } from "react";
import { supabase } from '../supabaseClient'; 
import { Calendar, DollarSign, UserCheck, Trash2, CheckCircle, XCircle, RefreshCw, MessageSquare, Info, User, Edit3, Save, X, LogOut, Clock, Send } from 'lucide-react';
const TherapistDashboard = ({ user }) => {
  const [profile, setProfile] = useState({
    name: "",
    degree: "",
    rate: 0,
    phone: "",
    specialization: "",
    email: "", 
  });
  const [availability, setAvailability] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", mode: "online" });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState({ isOpen: false, saving: false });
  const [editedProfile, setEditedProfile] = useState({});
  const [requestModal, setRequestModal] = useState({ isOpen: false, data: null, patientDetails: null, loadingDetails: false });
  const [therapistMessageModal, setTherapistMessageModal] = useState({ isOpen: false, patientId: null, saving: false });
  const [therapistMessage, setTherapistMessage] = useState("");
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editedSlot, setEditedSlot] = useState(null);
  
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const formatTime = (time) => time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  
  const fetchProfile = useCallback(async (therapistId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, degree, rate, photo_url, specialization')
        .eq('id', therapistId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; 
      
      const initialProfile = {
          name: user?.user_metadata?.full_name || "Therapist Name",
          degree: "Add your degree",
          rate: 0,
          photo_url: PHOTO_PLACEHOLDER,
          phone: "",
          email: user?.email || "",
          specialization: ""
      };
      
      if (data) {
        setProfile({
          ...initialProfile,
          name: data.name || initialProfile.name,
          degree: data.degree || initialProfile.degree,
          rate: parseFloat(data.rate) || initialProfile.rate, 
          photo_url: data.photo_url || initialProfile.photo_url,
          phone: data.phone || initialProfile.phone,
          specialization: data.specialization || initialProfile.specialization,
          email: data.email || initialProfile.email,
        });
      } else {
        setProfile(initialProfile);
        notify("Profile not found. Please update your details.", 'info');
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setProfile({ 
        name: user?.user_metadata?.full_name || "Therapist Name", degree: "Add your degree", rate: 0, 
        photo_url: PHOTO_PLACEHOLDER, phone: "", email: user?.email || "", specialization: ""
      });
      notify("Failed to load profile.", 'error');
    }
  }, [user]);

  const fetchAvailability = useCallback(async (therapistId) => {
    try {
      const { data, error } = await supabase
        .from("therapist_availability")
        .select("id, date, time, mode, is_booked, booked_by_patient_id") 
        .eq("therapist_id", therapistId)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;
      setAvailability(data || []);
    } catch (err) {
      console.error("Error fetching availability:", err.message);
      notify("Failed to load schedule. (DB Check: therapist_availability table)", 'error');
    }
  }, []);
  
  const fetchRequests = useCallback(async (therapistId) => {
    try {
      const { data, error } = await supabase
        .from("change_requests")
        .select("id, patient_id, message, created_at, requested_time, status")
        .eq("therapist_id", therapistId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data || []).filter(r => r.status === 'pending'));
    } catch (err) {
      console.error("Error fetching requests:", err.message);
      notify("Failed to load patient requests. (DB Check: change_requests table)", 'error');
    }
  }, []);
  
  const openEditProfileModal = () => {
    setEditedProfile({ ...profile });
    setEditProfileModal({ isOpen: true, saving: false });
  };
  
  const saveProfile = async () => {
    setEditProfileModal(prev => ({ ...prev, saving: true }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: editedProfile.name,
          email: editedProfile.email,
          phone: editedProfile.phone,
          degree: editedProfile.degree,
          rate: parseFloat(editedProfile.rate) || 0,
          photo_url: editedProfile.photo_url,
          specialization: editedProfile.specialization,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setProfile({ ...editedProfile, rate: parseFloat(editedProfile.rate) || 0 });
      setEditProfileModal({ isOpen: false, saving: false });
      notify("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.message);
      notify("Failed to update profile: " + err.message, 'error');
      setEditProfileModal(prev => ({ ...prev, saving: false }));
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      notify("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error.message);
      notify("Sign out failed.", 'error');
    }
  };
  
  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    
    const setOnlineStatus = async () => {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: true,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); 
    };
    
    const setOfflineStatus = async () => {
      await supabase
        .from('user_presence')
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    };

    setOnlineStatus();
    const heartbeat = setInterval(() => {
      setOnlineStatus();
    }, 30000);

    fetchProfile(user.id);
    fetchAvailability(user.id);
    fetchRequests(user.id);
    const availChannel = supabase
      .channel("avail_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "therapist_availability", filter: `therapist_id=eq.${user.id}` },
        () => fetchAvailability(user.id)
      )
      .subscribe();
      
    const reqChannel = supabase
      .channel("request_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "change_requests", filter: `therapist_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType !== 'DELETE') {
              fetchRequests(user.id);
              if (payload.eventType === 'INSERT' && payload.new?.status === 'pending') {
                  notify("New schedule change request received!", 'info');
              }
          }
        }
      )
      .subscribe();
    
    setLoading(false);
    
    return () => {
      clearInterval(heartbeat);
      setOfflineStatus();
      supabase.removeChannel(availChannel);
      supabase.removeChannel(reqChannel);
    };
  }, [user, fetchProfile, fetchAvailability, fetchRequests]);
  
 const addAvailability = async (e) => {
    e.preventDefault();
    if (!newSlot.date || !newSlot.time) return notify("Please enter both date and time.", 'error');
    const selectedDate = new Date(newSlot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return notify("Cannot add slots for past dates.", 'error');
    }

    try {
      const { error } = await supabase.from("therapist_availability").insert([
        {
          therapist_id: user.id,
          date: newSlot.date,
          time: newSlot.time,
          mode: newSlot.mode,
          is_booked: false, 
        },
      ]);
      if (error) throw error;
      setNewSlot({ date: "", time: "", mode: "online" });
      notify("Slot added successfully!");
      fetchAvailability(user.id); 
    } catch (err) {
      console.error("Error adding slot:", err.message);
      notify("Failed to add slot. (DB Check: is_booked column)", 'error');
    }
  };
  const deleteAvailability = async (id) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      const { error } = await supabase
        .from("therapist_availability")
        .delete()
        .eq("id", id);
      if (error) throw error;
      notify("Slot deleted!");
      fetchAvailability(user.id);
    } catch (err) {
      console.error("Error deleting slot:", err.message);
      notify("Failed to delete slot.", 'error');
    }
  };
  
  const handleEditStart = (slot) => {
    setEditingSlotId(slot.id);
    setEditedSlot({ ...slot });
  };
  
  const handleSlotChange = (field, value) => {
    setEditedSlot(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSlot = async () => {
    if (!editedSlot || !editedSlot.date || !editedSlot.time) return notify("Date and time are required.", 'error');

    try {
      const { error } = await supabase
        .from("therapist_availability")
        .update({ 
            date: editedSlot.date, 
            time: editedSlot.time, 
            mode: editedSlot.mode 
        })
        .eq("id", editedSlot.id);
      
      if (error) throw error;
      
      setEditingSlotId(null);
      setEditedSlot(null);
      notify("Slot updated successfully!");
    } catch (err) {
      console.error("Error updating slot:", err.message);
      notify("Failed to update slot. " + err.message, 'error');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingSlotId(null);
    setEditedSlot(null);
  };
  
  const fetchPatientDetails = async (patientId) => {
      setRequestModal(prev => ({ ...prev, loadingDetails: true }));
      try {
          console.log("🔍 Fetching caregiver details for ID:", patientId);
          const { data, error } = await supabase
              .from('caregivers')
              .select('id, email, name, phone')
              .eq('id', patientId)
              .maybeSingle();
          
          console.log("Response data:", data);
          console.log("Response error:", error);
              
          if (error) {
              console.error("Supabase error details:", {
                  message: error.message,
                  details: error.details,
                  hint: error.hint,
                  code: error.code
              });
              throw error;
          }
        
          if (!data) {
              console.warn("No caregiver profile found in database");
              
              setRequestModal(prev => ({ 
                  ...prev, 
                  patientDetails: {
                      name: "Caregiver profile not found",
                      email: "Not available",
                      phone: "Not available",
                      id: patientId
                  },
                  loadingDetails: false 
              }));
              return;
          }
          
          console.log("Successfully fetched caregiver data:", data);
          
          setRequestModal(prev => ({ 
              ...prev, 
              patientDetails: data,
              loadingDetails: false 
          }));
      } catch (error) {
          console.error("Error fetching caregiver details:", error);
          setRequestModal(prev => ({ 
              ...prev, 
              patientDetails: { 
                  name: "Unable to fetch", 
                  email: error.message || "Check console", 
                  phone: "N/A" 
              },
              loadingDetails: false 
          }));
          notify("Failed to fetch caregiver details: " + (error.message || "Unknown error"), 'error');
      }
  };

  const openRequestModal = (request) => {
      setRequestModal({ isOpen: true, data: request, patientDetails: null, loadingDetails: false });
      fetchPatientDetails(request.patient_id);
  };
  
  const handleRequestAction = async (newStatus) => {
      const requestId = requestModal.data.id;
      setRequestModal(prev => ({ ...prev, loadingDetails: true }));

      try {
          const { error } = await supabase
              .from('change_requests')
              .update({ status: newStatus })
              .eq('id', requestId);
              
          if (error) throw error;
          
          const msg = newStatus === 'accepted' ? "Request accepted! Patient notified." : "Request declined.";
          notify(msg);
          setRequestModal({ isOpen: false, data: null, patientDetails: null, loadingDetails: false });
          fetchRequests(user.id);
      } catch (error) {
          console.error(`Error ${newStatus}ing request:`, error);
          notify(`Failed to ${newStatus} request.`, 'error');
      }
  };
  
  const openTherapistMessageModal = (patientId) => {
    setTherapistMessage("");
    setTherapistMessageModal({ isOpen: true, patientId: patientId, saving: false });
  };

  const handleTherapistMessageSend = async (e) => {
    e.preventDefault();
    if (!therapistMessage.trim()) return;

    setTherapistMessageModal(prev => ({ ...prev, saving: true }));

    try {
        const { error } = await supabase
            .from('change_requests')
            .insert([
              { 
                therapist_id: user.id, 
                patient_id: therapistMessageModal.patientId, 
                message: `THERAPIST MESSAGE: ${therapistMessage.trim()}`,
                status: 'therapist_initiated', 
              },
            ]);

        if (error) throw error;

        notify("Notification sent to patient successfully!", 'success');
        setTherapistMessageModal({ isOpen: false, patientId: null, saving: false });

    } catch (error) {
        console.error("Error sending therapist message:", error.message);
        notify("Failed to send message to patient.", 'error');
        setTherapistMessageModal(prev => ({ ...prev, saving: false }));
    }
  };
  
  const getPatientIdForSlot = (slot) => {
    return slot.booked_by_patient_id || null;
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-red-50 p-6">
        <XCircle className="w-6 h-6 text-red-500 mr-2" />
        <p className="text-red-700 font-semibold">Please sign in to access the Therapist Dashboard</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-100 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6 flex items-center">
            <UserCheck className="w-8 h-8 mr-3" /> Therapist Portal
        </h1>
        {notification && (
            <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-2xl z-50 text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-500'}`}>
                {notification.message}
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 border border-purple-200 relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={openEditProfileModal}
                      className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                </div>
                
                <img src={profile.photo_url} alt={profile.name} className="w-24 h-24 rounded-full object-cover shadow-lg" 
                    onError={(e) => e.target.src = PHOTO_PLACEHOLDER} />
                <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-purple-600 font-medium mb-1">{profile.degree}</p>
                    {profile.specialization && (
                      <p className="text-sm text-gray-600 mb-2"> {profile.specialization}</p>
                    )}
                    <div className="flex items-center justify-center sm:justify-start text-lg text-gray-700 mb-2">
                        <DollarSign className="w-5 h-5 mr-1 text-green-600" /> 
                        <span className="font-semibold">{profile.rate.toFixed(2)}</span> / hr
                    </div>
                    {profile.phone && (
                      <p className="text-sm text-gray-600">{profile.phone}</p>
                    )}
                    <p className="text-sm text-gray-600">✉️ {profile.email}</p>
                </div>
            </div>
            <div className="bg-purple-600 text-white shadow-xl rounded-2xl p-6 flex items-center justify-between transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={requests.length > 0 ? () => openRequestModal(requests[0]) : null}>
                <div className="flex items-center gap-4">
                    <MessageSquare className="w-8 h-8" />
                    <div>
                        <p className="text-xl font-bold">{requests.length}</p>
                        <p className="text-sm opacity-80">Pending Requests</p>
                    </div>
                </div>
                {requests.length > 0 && (
                    <span className="bg-white text-purple-600 px-3 py-1 rounded-full font-bold animate-pulse text-sm">
                        NEW
                    </span>
                )}
            </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2" /> Manage Availability
            </h2>
            <form
              onSubmit={addAvailability}
              className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="col-span-2 md:col-span-1 border rounded-lg px-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <input
                type="time"
                value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                className="col-span-2 md:col-span-1 border rounded-lg px-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <select
                value={newSlot.mode}
                onChange={(e) => setNewSlot({ ...newSlot, mode: e.target.value })}
                className="col-span-2 md:col-span-1 border rounded-lg px-3 py-2 w-full focus:ring-purple-500 focus:border-purple-500 capitalize"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <button
                type="submit"
                className="col-span-2 md:col-span-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Add Slot
              </button>
            </form>
            {loading ? (
              <p className="text-center text-gray-500">Loading schedule...</p>
            ) : availability.length === 0 ? (
              <p className="text-center text-gray-500">No availability added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse rounded-xl">
                  <thead>
                    <tr className="bg-purple-100 border-b">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Time</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Mode</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availability.map((slot, index) => {
                      const isEditing = editingSlotId === slot.id;
                      const currentSlot = isEditing ? editedSlot : slot;
                      const isBooked = currentSlot.is_booked;

                      return (
                      <tr
                        key={slot.id}
                        className={`border-b hover:bg-purple-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isEditing ? 'bg-purple-100/50' : ''}`}
                      >
                        {/* Date */}
                        <td className="px-4 py-3 text-sm text-gray-800">
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={currentSlot.date}
                                    onChange={(e) => handleSlotChange('date', e.target.value)}
                                    className="w-full border rounded-md px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                                />
                            ) : (
                                formatDate(currentSlot.date)
                            )}
                        </td>
                        
                        {/* Time */}
                        <td className="px-4 py-3 text-sm text-gray-800">
                            {isEditing ? (
                                <input
                                    type="time"
                                    value={currentSlot.time}
                                    onChange={(e) => handleSlotChange('time', e.target.value)}
                                    className="w-full border rounded-md px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                                />
                            ) : (
                                formatTime(currentSlot.time)
                            )}
                        </td>
                        
                        {/* Mode */}
                        <td className="px-4 py-3 text-sm text-gray-800 capitalize">
                            {isEditing ? (
                                <select
                                    value={currentSlot.mode}
                                    onChange={(e) => handleSlotChange('mode', e.target.value)}
                                    className="w-full border rounded-md px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            ) : (
                                currentSlot.mode
                            )}
                        </td>
                        
                        {/* Status */}
                        <td className="px-4 py-3 text-center text-sm">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold ${
                                isBooked 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                            }`}>
                                {isBooked ? 'Booked' : 'Available'}
                            </span>
                        </td>
                        
                        {/* Action */}
                        <td className="px-4 py-3 text-center">
                            {isEditing ? (
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={handleSaveSlot}
                                        className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                                        title="Save Changes"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center"
                                        title="Cancel Edit"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-center space-x-3">
                                    {!isBooked ? (
                                        <button
                                            onClick={() => handleEditStart(slot)}
                                            className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center"
                                            title="Edit Slot"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openTherapistMessageModal(getPatientIdForSlot(slot))}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                            title="Contact Patient"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteAvailability(slot.id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center"
                                        title="Delete Slot"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </td>
                      </tr>
                      );
                        })}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      {editProfileModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => !editProfileModal.saving && setEditProfileModal({ isOpen: false, saving: false })}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditProfileModal({ isOpen: false, saving: false })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              disabled={editProfileModal.saving}
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-2" /> Edit Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedProfile.name || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Dr. John Doe"
                  disabled={editProfileModal.saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Qualification</label>
                <input
                  type="text"
                  value={editedProfile.degree || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, degree: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ph.D., Clinical Psychology"
                  disabled={editProfileModal.saving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editedProfile.specialization || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, specialization: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Cognitive Behavioral Therapy, Family Therapy"
                  disabled={editProfileModal.saving}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedProfile.rate || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, rate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="150.00"
                    disabled={editProfileModal.saving}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editedProfile.phone || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+1 234 567 8900"
                    disabled={editProfileModal.saving}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editedProfile.email || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
                  disabled
                  title="Email cannot be changed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
              <button
                onClick={() => setEditProfileModal({ isOpen: false, saving: false })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                disabled={editProfileModal.saving}
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-400"
                disabled={editProfileModal.saving}
              >
                {editProfileModal.saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {requestModal.isOpen && requestModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setRequestModal({ isOpen: false, data: null, patientDetails: null })}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all">
            <button
              onClick={() => setRequestModal({ isOpen: false, data: null, patientDetails: null })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-purple-700 mb-6 border-b pb-2">Patient Schedule Change Request</h3>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center text-yellow-800 font-semibold mb-2">
                      <Info className="w-5 h-5 mr-2" /> Requested Change:
                  </div>
                  <p className="text-gray-700">{requestModal.data.message}</p>
                  {requestModal.data.requested_time && (
                      <p className="mt-2 text-sm text-gray-600">
                          <strong>Target Time:</strong> <span className="font-bold text-purple-700">{requestModal.data.requested_time}</span>
                      </p>
                  )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" /> Caregiver Contact Info
                  </h4>
                  {requestModal.loadingDetails ? (
                      <div className="flex items-center text-gray-500">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading details...
                      </div>
                  ) : requestModal.patientDetails ? (
                      <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Name:</strong> {requestModal.patientDetails.name || 'N/A'}</p>
                          <p><strong>Email:</strong> {requestModal.patientDetails.email || 'N/A'}</p>
                          <p><strong>Phone:</strong> {requestModal.patientDetails.phone || 'N/A'}</p>
                          <p><strong>Caregiver ID:</strong> {requestModal.data.patient_id.substring(0, 8)}...</p>
                      </div>
                  ) : (
                      <p className="text-red-500 text-sm">Could not retrieve caregiver details.</p>
                  )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                <button
                    onClick={() => handleRequestAction('declined')}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                    disabled={requestModal.loadingDetails}
                >
                    <XCircle className="w-4 h-4 mr-2" /> Decline
                </button>
                <button
                    onClick={() => handleRequestAction('accepted')}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                    disabled={requestModal.loadingDetails}
                >
                    <CheckCircle className="w-4 h-4 mr-2" /> Accept
                </button>
            </div>
          </div>
        </div>
      )}
      
      {therapistMessageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => !therapistMessageModal.saving && setTherapistMessageModal({ isOpen: false, patientId: null, saving: false })}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
            <button
              onClick={() => setTherapistMessageModal({ isOpen: false, patientId: null, saving: false })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              disabled={therapistMessageModal.saving}
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
              <Send className="w-6 h-6 mr-2" /> Notify Patient of Change
            </h3>
            
            <p className="text-gray-600 mb-6">
              Send a notification to the patient (ID: {therapistMessageModal.patientId ? therapistMessageModal.patientId.substring(0, 8) + '...' : 'N/A'}) regarding a cancellation or proposed time change.
            </p>
            
            <form onSubmit={handleTherapistMessageSend} className="space-y-4">
                <textarea
                    value={therapistMessage}
                    onChange={(e) => setTherapistMessage(e.target.value)}
                    placeholder="e.g., I need to shift your 10 AM session to 11 AM due to an emergency. Please confirm."
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                ></textarea>
                <button
                    type="submit"
                    disabled={!therapistMessage.trim() || therapistMessageModal.saving}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
                        therapistMessageModal.saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {therapistMessageModal.saving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Sending...
                        </>
                    ) : (
                        'Send Notification'
                    )}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;