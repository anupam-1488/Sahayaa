// src/config/supabase.js

// Your Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if credentials are properly set
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

let supabase;
let auth;
let db;

if (hasValidCredentials) {
  // Use real Supabase client
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Real authentication functions
    auth = {
      signIn: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          return { user: data.user, error: null };
        } catch (error) {
          console.error('Login error:', error);
          return { user: null, error: error.message };
        }
      },

      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { error: null };
        } catch (error) {
          console.error('Logout error:', error);
          return { error: error.message };
        }
      },

      getSession: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          return { session, error: null };
        } catch (error) {
          console.error('Session error:', error);
          return { session: null, error: error.message };
        }
      },

      onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
      },

      getCurrentUser: async () => {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          return { user, error: null };
        } catch (error) {
          console.error('Get user error:', error);
          return { user: null, error: error.message };
        }
      }
    };

    // Real database functions
    db = {
      getMembers: async () => {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });
        return { data, error };
      },

      createMember: async (member) => {
        const { data, error } = await supabase
          .from('members')
          .insert([member])
          .select();
        return { data, error };
      },

      updateMember: async (id, updates) => {
        const { data, error } = await supabase
          .from('members')
          .update(updates)
          .eq('id', id)
          .select();
        return { data, error };
      },

      deleteMember: async (id) => {
        const { data, error } = await supabase
          .from('members')
          .delete()
          .eq('id', id);
        return { data, error };
      },

      getEvents: async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        return { data, error };
      },

      createEvent: async (event) => {
        const { data, error } = await supabase
          .from('events')
          .insert([event])
          .select();
        return { data, error };
      },

      updateEvent: async (id, updates) => {
        const { data, error } = await supabase
          .from('events')
          .update(updates)
          .eq('id', id)
          .select();
        return { data, error };
      },

      deleteEvent: async (id) => {
        const { data, error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        return { data, error };
      },

      getTestimonials: async () => {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });
        return { data, error };
      },

      createTestimonial: async (testimonial) => {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([testimonial])
          .select();
        return { data, error };
      },

      updateTestimonial: async (id, updates) => {
        const { data, error } = await supabase
          .from('testimonials')
          .update(updates)
          .eq('id', id)
          .select();
        return { data, error };
      },

      deleteTestimonial: async (id) => {
        const { data, error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
        return { data, error };
      },

      createContactMessage: async (message) => {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([message])
          .select();
        return { data, error };
      },

      getContactMessages: async () => {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        return { data, error };
      },

      getStats: async () => {
        const { data, error } = await supabase
          .from('organization_stats')
          .select('*')
          .single();
        return { data, error };
      },

      updateStats: async (stats) => {
        const { data, error } = await supabase
          .from('organization_stats')
          .update(stats)
          .eq('id', 1)
          .select();
        return { data, error };
      }
    };

  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    hasValidCredentials = false;
  }
}

if (!hasValidCredentials) {
  // Fallback to mock/demo mode
  console.warn('⚠️ Supabase credentials not configured properly. Using demo mode.');
  console.warn('📝 Please update your .env file with valid Supabase credentials.');
  
  // Mock Supabase client for demo
  supabase = {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        if (email === 'admin@sahayaa.org' && password === 'admin123') {
          const user = { id: '1', email, role: 'admin' };
          localStorage.setItem('sahayaa_user', JSON.stringify(user));
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Invalid credentials' } };
      },
      signOut: async () => {
        localStorage.removeItem('sahayaa_user');
        return { error: null };
      },
      getSession: async () => {
        const userStr = localStorage.getItem('sahayaa_user');
        const user = userStr ? JSON.parse(userStr) : null;
        return { data: { session: user ? { user } : null }, error: null };
      },
      onAuthStateChange: (callback) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (callback) => callback({ data: [], error: null })
        }),
        order: (column, options) => Promise.resolve({ data: [], error: null }),
        then: (callback) => callback({ data: [], error: null })
      }),
      insert: (data) => Promise.resolve({ data: Array.isArray(data) ? data : [data], error: null }),
      update: (data) => ({
        eq: (column, value) => Promise.resolve({ data: [data], error: null })
      }),
      delete: () => ({
        eq: (column, value) => Promise.resolve({ data: null, error: null })
      })
    })
  };

  // Mock authentication
  auth = {
    signIn: async (email, password) => {
      if (email === 'admin@sahayaa.org' && password === 'admin123') {
        const user = { id: '1', email, role: 'admin' };
        localStorage.setItem('sahayaa_user', JSON.stringify(user));
        return { user, error: null };
      }
      return { user: null, error: 'Invalid credentials' };
    },

    signOut: async () => {
      localStorage.removeItem('sahayaa_user');
      return { error: null };
    },

    getSession: async () => {
      const userStr = localStorage.getItem('sahayaa_user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { session: user ? { user } : null, error: null };
    },

    onAuthStateChange: (callback) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };

  // Mock database
  db = {
    getMembers: async () => {
      const data = JSON.parse(localStorage.getItem('sahayaa_members') || '[]');
      return { data, error: null };
    },
    createMember: async (member) => {
      const members = JSON.parse(localStorage.getItem('sahayaa_members') || '[]');
      const newMember = { ...member, id: Date.now() };
      members.unshift(newMember);
      localStorage.setItem('sahayaa_members', JSON.stringify(members));
      return { data: [newMember], error: null };
    },
    updateMember: async (id, updates) => {
      const members = JSON.parse(localStorage.getItem('sahayaa_members') || '[]');
      const index = members.findIndex(m => m.id === id);
      if (index !== -1) {
        members[index] = { ...members[index], ...updates };
        localStorage.setItem('sahayaa_members', JSON.stringify(members));
        return { data: [members[index]], error: null };
      }
      return { data: null, error: 'Member not found' };
    },
    deleteMember: async (id) => {
      const members = JSON.parse(localStorage.getItem('sahayaa_members') || '[]');
      const filtered = members.filter(m => m.id !== id);
      localStorage.setItem('sahayaa_members', JSON.stringify(filtered));
      return { data: null, error: null };
    },
    getEvents: async () => {
      const data = JSON.parse(localStorage.getItem('sahayaa_events') || '[]');
      return { data, error: null };
    },
    createEvent: async (event) => {
      const events = JSON.parse(localStorage.getItem('sahayaa_events') || '[]');
      const newEvent = { ...event, id: Date.now() };
      events.push(newEvent);
      localStorage.setItem('sahayaa_events', JSON.stringify(events));
      return { data: [newEvent], error: null };
    },
    updateEvent: async (id, updates) => {
      const events = JSON.parse(localStorage.getItem('sahayaa_events') || '[]');
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = { ...events[index], ...updates };
        localStorage.setItem('sahayaa_events', JSON.stringify(events));
        return { data: [events[index]], error: null };
      }
      return { data: null, error: 'Event not found' };
    },
    deleteEvent: async (id) => {
      const events = JSON.parse(localStorage.getItem('sahayaa_events') || '[]');
      const filtered = events.filter(e => e.id !== id);
      localStorage.setItem('sahayaa_events', JSON.stringify(filtered));
      return { data: null, error: null };
    },
    getTestimonials: async () => {
      const data = JSON.parse(localStorage.getItem('sahayaa_testimonials') || '[]');
      return { data, error: null };
    },
    createTestimonial: async (testimonial) => {
      const testimonials = JSON.parse(localStorage.getItem('sahayaa_testimonials') || '[]');
      const newTestimonial = { ...testimonial, id: Date.now() };
      testimonials.unshift(newTestimonial);
      localStorage.setItem('sahayaa_testimonials', JSON.stringify(testimonials));
      return { data: [newTestimonial], error: null };
    },
    updateTestimonial: async (id, updates) => {
      const testimonials = JSON.parse(localStorage.getItem('sahayaa_testimonials') || '[]');
      const index = testimonials.findIndex(t => t.id === id);
      if (index !== -1) {
        testimonials[index] = { ...testimonials[index], ...updates };
        localStorage.setItem('sahayaa_testimonials', JSON.stringify(testimonials));
        return { data: [testimonials[index]], error: null };
      }
      return { data: null, error: 'Testimonial not found' };
    },
    deleteTestimonial: async (id) => {
      const testimonials = JSON.parse(localStorage.getItem('sahayaa_testimonials') || '[]');
      const filtered = testimonials.filter(t => t.id !== id);
      localStorage.setItem('sahayaa_testimonials', JSON.stringify(testimonials));
      return { data: null, error: null };
    },
    createContactMessage: async (message) => {
      console.log('Contact message:', message);
      return { data: [message], error: null };
    },
    getContactMessages: async () => {
      return { data: [], error: null };
    },
    getStats: async () => {
      return { 
        data: {
          people_helped: 2500,
          events_completed: 150,
          active_volunteers: 45,
          years_of_service: 5
        }, 
        error: null 
      };
    },
    updateStats: async (stats) => {
      return { data: [stats], error: null };
    }
  };
}

export { supabase, auth, db };
export default supabase;