import { useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export const usePresence = (userId) => {
  useEffect(() => {
    if (!userId) return;
    const setOnline = async () => {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          is_online: true,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); 
    };
    const setOffline = async () => {
      await supabase
        .from('user_presence')
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    };
    setOnline();
    const heartbeat = setInterval(setOnline, 30000); 
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };
    const handleBeforeUnload = () => {
      setOffline(); 
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeat);
      setOffline();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId]);
};