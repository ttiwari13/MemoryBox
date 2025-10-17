// TherapistList.jsx (Patient side)
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { usePresence } from '..usePresence';

function TherapistList() {
  const [therapists, setTherapists] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});
  const currentUserId = 'your-patient-id';
  usePresence(currentUserId);

  useEffect(() => {
    const fetchTherapists = async () => {
      const { data } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'therapist');
      
      setTherapists(data || []);
    };
    const fetchOnlineStatus = async () => {
      const { data } = await supabase
        .from('user_presence')
        .select('user_id, is_online');
      
      const statusMap = {};
      data?.forEach(item => {
        statusMap[item.user_id] = item.is_online;
      });
      setOnlineStatus(statusMap);
    };

    fetchTherapists();
    fetchOnlineStatus();
    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          console.log('Presence changed:', payload);
          setOnlineStatus(prev => ({
            ...prev,
            [payload.new.user_id]: payload.new.is_online
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2>Therapists</h2>
      {therapists.map(therapist => (
        <div key={therapist.id}>
          <span>{therapist.name}</span>
          <span className={onlineStatus[therapist.id] ? 'online' : 'offline'}>
            {onlineStatus[therapist.id] ? ' Online' : ' Offline'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TherapistList;