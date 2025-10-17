import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 
import { Clock, DollarSign, MessageSquare, Circle, UserCheck, RefreshCw, XCircle, CheckCircle, Info, X } from 'lucide-react';

const TherapistCard = ({ therapist, schedules, onlineStatus, onSendChangeRequest }) => {
  const isOnline = onlineStatus[therapist.id] || false;
  const therapistSchedules = schedules.filter(s => s.therapist_id === therapist.id);
  const nextAvailableSlot = therapistSchedules
    .sort((a, b) => new Date(a.time_slot).getTime() - new Date(b.time_slot).getTime())
    .find(s => !s.is_booked && new Date(s.time_slot) > new Date()); 
  
  const formattedTime = nextAvailableSlot 
    ? new Date(nextAvailableSlot.time_slot).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'N/A (Fully Booked)';

  const statusColor = isOnline ? 'text-green-600 bg-green-100' : 'text-gray-500 bg-gray-100';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transition-all hover:shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{therapist.name}</h3>
        <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${statusColor}`}>
          {isOnline ? <Circle className="w-2.5 h-2.5 fill-current mr-1 animate-pulse" /> : <Circle className="w-2.5 h-2.5 fill-current mr-1" />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">{therapist.degree}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-700">
          <DollarSign className="w-5 h-5 text-indigo-500 mr-2" />
          <span className="font-semibold text-lg">${(therapist.rate || 0).toFixed(2)}</span> / hr
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="w-5 h-5 text-teal-500 mr-2" />
          Next Slot: 
          <span className="ml-2 font-medium">{formattedTime}</span>
        </div>
      </div>

      <button
        onClick={() => onSendChangeRequest(therapist.id)}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
      >
        <MessageSquare className="w-4 h-4" />
        Send Change Request
      </button>
    </div>
  );
};

const PatientTherapistBoard = () => {
  const [therapists, setTherapists] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState({ isOpen: false, therapistId: null, status: null });
  const [currentMessage, setCurrentMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [therapistNotifications, setTherapistNotifications] = useState([]);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTherapists = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, degree, rate, email');

    if (error) {
      console.error('Error fetching therapists:', error);
    } else {
      setTherapists(data || []);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    const { data, error } = await supabase
      .from('therapist_availability')
      .select('id, therapist_id, date, time, is_booked, booked_by_patient_id');

    if (error) {
      console.error('Error fetching schedules:', error);
    } else {
      setSchedules((data || []).map(s => ({
        ...s,
        time_slot: `${s.date}T${s.time}:00`,
        is_booked: s.is_booked || false,
        booked_by_patient_id: s.booked_by_patient_id || null,
      })));
    }
  }, []);

  const fetchOnlineStatus = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_presence')
      .select('user_id, is_online');
    
    if (error) {
      console.error('Error fetching online status:', error);
      return;
    }

    const statusMap = {};
    data?.forEach(item => {
      statusMap[item.user_id] = item.is_online;
    });
    setOnlineStatus(statusMap);
  }, []);

  const fetchTherapistNotifications = useCallback(async (patientId) => {
    if (!patientId) return;
    try {
      const { data, error } = await supabase
        .from('change_requests')
        .select(`
          id, message, created_at, status, 
          therapist_id, 
          therapists:therapist_id(name)
        `)
        .eq('patient_id', patientId)
        .eq('status', 'therapist_initiated') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTherapistNotifications(data || []);
    } catch (error) {
      console.error("Error fetching therapist notifications:", error);
    }
  }, []);

  useEffect(() => {
    const setupInitialData = async () => {
      setLoading(true);
      
      const authUser = await supabase.auth.getUser();
      const currentUserId = authUser.data.user?.id;
      
      if (currentUserId) {
        setUserId(currentUserId);
        await fetchTherapists();
        await fetchSchedules();
        await fetchOnlineStatus();
        await fetchTherapistNotifications(currentUserId);
      }
      
      setLoading(false);
    };

    setupInitialData();
  }, [fetchTherapists, fetchSchedules, fetchOnlineStatus, fetchTherapistNotifications]);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to schedule changes
    const scheduleChannel = supabase
      .channel('patient-view-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'therapist_availability' },
        () => fetchSchedules()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'change_requests', filter: `patient_id=eq.${userId}` },
        (payload) => {
          if (payload.new?.status === 'therapist_initiated') {
            fetchTherapistNotifications(userId);
            notify("New message from your therapist!", 'info');
          }
        }
      )
      .subscribe();

    // Subscribe to real-time presence changes
    const presenceChannel = supabase
      .channel('presence-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          console.log('Presence changed:', payload);
          if (payload.new) {
            setOnlineStatus(prev => ({
              ...prev,
              [payload.new.user_id]: payload.new.is_online
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(scheduleChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [userId, fetchSchedules, fetchTherapistNotifications]);

  const openMessageModal = (therapistId) => {
    if (!userId) {
      console.error("Authentication Error: User must be signed in to send a message.");
      return;
    }
    setMessageModal({ isOpen: true, therapistId: therapistId, status: null });
  };
  
  const closeMessageModal = () => {
    setMessageModal({ isOpen: false, therapistId: null, status: null });
    setCurrentMessage("");
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    setMessageModal(prev => ({ ...prev, status: 'sending' }));

    const { error } = await supabase
      .from('change_requests')
      .insert([
        { 
          therapist_id: messageModal.therapistId, 
          patient_id: userId, 
          message: currentMessage.trim(),
          status: 'pending' 
        },
      ]);

    if (error) {
      console.error('Message send error:', error);
      setMessageModal({ ...messageModal, status: 'error' });
    } else {
      setMessageModal({ ...messageModal, status: 'success' });
      setTimeout(closeMessageModal, 2000);
    }
  };

  const handleNotificationAction = async (requestId, action) => {
    try {
      const { error } = await supabase
        .from('change_requests')
        .update({ status: action === 'confirm' ? 'acknowledged' : 'ignored' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      notify(action === 'confirm' ? "Change acknowledged." : "Notification ignored.", 'success');
      fetchTherapistNotifications(userId); 
    } catch (error) {
      console.error("Error processing notification action:", error);
      notify("Failed to update notification status.", 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 p-8 rounded-xl shadow-inner">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mr-3" />
        <p className="text-gray-600 font-medium">Loading Therapists and Realtime Status...</p>
      </div>
    );
  }
  
  if (!userId) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-red-50 p-8 rounded-xl shadow-inner">
        <XCircle className="w-8 h-8 text-red-600 mr-3" />
        <p className="text-red-700 font-medium">Please sign in to view the therapist directory.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
        <UserCheck className="w-8 h-8 text-purple-600" /> Therapist Directory
      </h1>
      <p className="text-lg text-gray-600 mb-8">View availability and real-time status of professional therapists.</p>
      
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-2xl z-50 text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      {therapistNotifications.length > 0 && (
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" /> Unread Schedule Notifications ({therapistNotifications.length})
          </h2>
          {therapistNotifications.map(notification => (
            <div key={notification.id} className="bg-white p-4 rounded-lg mb-3 border border-gray-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                Message from Dr. {notification.therapists?.name || 'Therapist'}:
              </p>
              <p className="text-gray-600 mb-3 ml-1 border-l-2 pl-3 italic">{notification.message.replace('THERAPIST MESSAGE: ', '')}</p>
              <div className="flex space-x-3 justify-end">
                <button 
                  onClick={() => handleNotificationAction(notification.id, 'ignore')}
                  className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-xs font-medium"
                >
                  <X className="w-3 h-3 mr-1" /> Ignore
                </button>
                <button 
                  onClick={() => handleNotificationAction(notification.id, 'confirm')}
                  className="flex items-center text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-xs font-medium"
                >
                  <CheckCircle className="w-3 h-3 mr-1" /> Acknowledge Change
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map(therapist => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            schedules={schedules}
            onlineStatus={onlineStatus}
            onSendChangeRequest={openMessageModal}
          />
        ))}
      </div>
      
      {therapists.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No therapists found in the directory.</p>
        </div>
      )}

      {messageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={closeMessageModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
            <button
              onClick={closeMessageModal}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600"
              disabled={messageModal.status === 'sending'}
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              {messageModal.status === 'success' ? (
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800">Request Sent!</h2>
                  <p className="text-gray-500 mt-2">The therapist has been notified in real-time.</p>
                </div>
              ) : messageModal.status === 'error' ? (
                <div className="text-center">
                  <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800">Send Failed</h2>
                  <p className="text-gray-500 mt-2">Could not send your request. Please try again.</p>
                </div>
              ) : (
                <>
                  <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Message {therapists.find(t => t.id === messageModal.therapistId)?.name || 'Therapist'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Send a brief, real-time message about your desire to change your schedule.
                  </p>
                  
                  <form onSubmit={handleSubmitMessage} className="space-y-4">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="e.g., I need to reschedule my 11 AM appointment to 2 PM today."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      disabled={!currentMessage.trim() || messageModal.status === 'sending'}
                      className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
                        messageModal.status === 'sending' ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {messageModal.status === 'sending' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Sending...
                        </>
                      ) : (
                        'Send Request'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTherapistBoard;