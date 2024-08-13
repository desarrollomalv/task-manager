import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npmeznwsdenruazxcptw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWV6bndzZGVucnVhenhjcHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMzNDMzNDIsImV4cCI6MjAzODkxOTM0Mn0.gvFwXCRGiIUhpi1u_dfkGoS19dH2KsjH4-7_fFs7GyY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const subscribeAuthChanges = (setSession) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
    }
  );

  return () => {
    subscription?.unsubscribe();
  };
};
