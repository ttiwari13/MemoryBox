import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { Clock, DollarSign, MessageSquare, Circle, UserCheck, RefreshCw, XCircle, CheckCircle, Info, X, Calendar } from 'lucide-react';
const TherapistCard = ({ therapist, schedules, onlineStatus, onSendChangeRequest, onBookSlot }) => {
  const isOnline = onlineStatus[therapist.id] || false; 
  
  const therapistSchedules = schedules
    .filter(s => s.therapist_id === therapist.id && !s.is_booked)
    .map(s => ({ 
      ...s, 
      dateTime: new Date(`${s.date}T${s.time}`)
    }))
    .filter(s => s.dateTime > new Date()) 
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const statusColor = isOnline ? 'text-green-600 bg-green-100' : 'text-gray-500 bg-gray-100';

  const formatSlotTime = (date, time) => {
    const dt = new Date(`${date}T${time}`);
    const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transition-all hover:shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{therapist.name || 'Therapist'}</h3>
        <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${statusColor}`}>
          {isOnline ? <Circle className="w-2.5 h-2.5 fill-current mr-1 animate-pulse" /> : <Circle className="w-2.5 h-2.5 fill-current mr-1" />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">{therapist.degree || 'Professional Therapist'}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-700">
          <span className="text-indigo-500 mr-2 text-xl font-bold">₹</span>
          <span className="font-semibold text-lg">{(therapist.rate || 0).toFixed(2)}</span> / hr
        </div>
      </div>
      <div className="mb-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
          Available Slots ({therapistSchedules.length})
        </h4>
        
        {therapistSchedules.length === 0 ? (
          <p className="text-sm text-red-500 italic">No slots available</p>
        ) : (
          <div className="space-y-2">
            {therapistSchedules.map((slot) => {
              const { dateStr, timeStr } = formatSlotTime(slot.date, slot.time);
              return (
                <div key={slot.id} className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">{dateStr}</span>
                      <span className="text-purple-700 font-semibold text-xs">{timeStr}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      slot.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {slot.mode}
                    </span>
                    <button
                      onClick={() => onBookSlot(slot, therapist)}
                      className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [therapistNotifications, setTherapistNotifications] = useState([]);
  const [notification, setNotification] = useState(null);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, slot: null, therapist: null });

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTherapists = async () => {
    console.log('Fetching all therapists from profiles...');
    
    try {
      const { data: allProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, degree, rate, photo_url, specialization, phone');

      console.log('All profiles:', allProfiles);
      console.log('Profile error:', profileError);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }
      console.log('Total therapists found:', allProfiles?.length || 0);
      setTherapists(allProfiles || []);
      
    } catch (error) {
      console.error('Error fetching therapists:', error.message || error);
      console.error('Full error object:', error);
      setTherapists([]);
    }
  };

  const fetchSchedules = async () => {
    console.log('Fetching schedules...');
    try {
      const { data, error } = await supabase
        .from('therapist_availability')
        .select('*'); 

      console.log('Raw schedule response:', { data, error });
      console.log('Total rows fetched:', data?.length || 0);

      if (error) {
        console.error('Error in fetchSchedules:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('First slot sample:', data[0]);
      }
      
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    }
  };

  const fetchOnlineStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('user_id, is_online');
      
      if (error) throw error;

      const statusMap = {};
      data?.forEach(item => {
        statusMap[item.user_id] = item.is_online;
      });
      setOnlineStatus(statusMap);
    } catch (error) {
      console.error('Error fetching online status:', error);
      setOnlineStatus({});
    }
  };

  const fetchTherapistNotifications = async (patientId) => {
    if (!patientId) return;
    
    try {
      const { data, error } = await supabase
        .from('change_requests')
        .select('id, message, created_at, status, therapist_id')
        .eq('patient_id', patientId)
        .eq('status', 'therapist_initiated') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const therapistIds = [...new Set(data.map(r => r.therapist_id))];
        const { data: therapistData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', therapistIds);
        
        const therapistMap = {};
        therapistData?.forEach(t => {
          therapistMap[t.id] = t.name;
        });
        
        const enrichedData = data.map(notification => ({
          ...notification,
          profiles: { name: therapistMap[notification.therapist_id] || 'Unknown' }
        }));
        
        setTherapistNotifications(enrichedData);
      } else {
        setTherapistNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setTherapistNotifications([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const authUser = await supabase.auth.getUser();
      const currentUserId = authUser.data.user?.id;
      const currentUserEmail = authUser.data.user?.email;
      
      if (currentUserId) {
        setUserId(currentUserId);
        setUserEmail(currentUserEmail);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', currentUserId)
          .single();
        
        if (profileData) {
          setUserName(profileData.name);
        }
        
        await fetchSchedules(); 
        await fetchTherapists(); 
        await fetchOnlineStatus();
        await fetchTherapistNotifications(currentUserId);
      }
      
      setLoading(false);
    };

    loadData();
    const availChannel = supabase
      .channel('availability_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'therapist_availability' },
        () => {
          fetchSchedules();
          fetchTherapists();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(availChannel);
    };
  }, []);

  const openMessageModal = (therapistId) => {
    if (!userId) { 
      notify("Please sign in to send a message.", 'error');
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

    const { error } = await supabase.from('change_requests').insert([
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
      console.error("Error processing notification:", error);
      notify("Failed to update notification.", 'error');
    }
  };

  const handleBookSlot = (slot, therapist) => {
    setBookingModal({ isOpen: true, slot, therapist });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, slot: null, therapist: null });
  };

const confirmBooking = async () => {
    const { slot, therapist } = bookingModal;
    
    try {
      const { error: updateError } = await supabase
        .from('therapist_availability')
        .update({ 
          is_booked: true,
          booked_by_patient_id: userId 
        })
        .eq('id', slot.id);
      
      if (updateError) throw updateError;
      const bookingMessage = ` NEW BOOKING: ${userName || userEmail} has booked your slot on ${new Date(slot.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })} at ${slot.time} (${slot.mode} session).`;
      
      const { error: notifyError } = await supabase
        .from('change_requests')
        .insert([{
          therapist_id: therapist.id,
          patient_id: userId,
          message: bookingMessage,
          status: 'patient_booking'
        }]);
      
      if (notifyError) throw notifyError;n
      await sendBookingEmail(slot, therapist);

      notify('Booking confirmed! Check your email for details.', 'success');
      closeBookingModal();
      fetchSchedules(); 
      
    } catch (error) {
      console.error('Booking error:', error);
      notify('Failed to book slot. Please try again.', 'error');
    }
  };

  const sendBookingEmail = async (slot, therapist) => {
    try {
      const appointmentDateTime = new Date(`${slot.date}T${slot.time}`);
      const reminderTime = new Date(appointmentDateTime.getTime() - 30 * 60 * 1000);
      
      console.log('Email would be sent to:', userEmail);
      console.log(' Appointment Details:', {
        therapist: therapist.name,
        date: slot.date,
        time: slot.time,
        mode: slot.mode,
        reminderTime: reminderTime.toLocaleString()
      });
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 p-8 rounded-xl shadow-inner">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mr-3" />
        <p className="text-gray-600 font-medium">Loading Therapists...</p>
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
      <p className="text-lg text-gray-600 mb-8">View availability and status of professional therapists.</p>
      
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
                Message from Dr. {notification.profiles?.name || 'Therapist'}:
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
            onBookSlot={handleBookSlot}
          />
        ))}
      </div>
      
      {therapists.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No therapists with available slots found.</p>
          <p className="text-gray-500 text-sm mt-2">Therapists need to add their availability first.</p>
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
                  <p className="text-gray-500 mt-2">The therapist has been notified.</p>
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
                    Send a message about your schedule change request.
                  </p>
                  
                  <div className="space-y-4">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="e.g., I need to reschedule my 11 AM appointment to 2 PM today."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                      required
                    ></textarea>
                    <button
                      onClick={handleSubmitMessage}
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {bookingModal.isOpen && bookingModal.slot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={closeBookingModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
            <button
              onClick={closeBookingModal}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking</h2>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Therapist:</strong> {bookingModal.therapist?.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong> {new Date(bookingModal.slot.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Time:</strong> {bookingModal.slot.time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Mode:</strong> {bookingModal.slot.mode}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Rate:</strong> ₹{bookingModal.therapist?.rate}/hr
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                 You will receive an email confirmation and reminder before your appointment.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={closeBookingModal}
                  className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTherapistBoard;