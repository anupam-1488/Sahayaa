// src/config/supabase.js - Modern Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export auth for convenience
export const auth = supabase.auth;

// Database helper functions
export const db = {
  // Team Members (for Team page)
  getTeamMembers: async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('position', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  createTeamMember: async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([memberData])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateTeamMember: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteTeamMember: async (id) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Organization Members (for Members page)
  getOrganizationMembers: async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .order('position', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  createOrganizationMember: async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .insert([memberData])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateOrganizationMember: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteOrganizationMember: async (id) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Events
  getEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  createEvent: async (eventData) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  updateEventGallery: async (eventId, galleryImages) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ gallery_images: galleryImages })
        .eq('id', eventId)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Volunteers
  getVolunteers: async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('joining_date', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  createVolunteer: async (volunteerData) => {
    try {
      // Generate volunteer ID if not provided
      if (!volunteerData.volunteer_id) {
        volunteerData.volunteer_id = `VOL${String(Date.now()).slice(-6)}`;
      }
      
      // Set default values
      const volunteerWithDefaults = {
        ...volunteerData,
        joining_date: volunteerData.joining_date || new Date().toISOString().split('T')[0],
        total_hours: volunteerData.total_hours || 0,
        events_participated: volunteerData.events_participated || 0,
        status: volunteerData.status || 'active'
      };

      const { data, error } = await supabase
        .from('volunteers')
        .insert([volunteerWithDefaults])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateVolunteer: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteVolunteer: async (id) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Testimonials
  getTestimonials: async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  createTestimonial: async (testimonialData) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateTestimonial: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteTestimonial: async (id) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Stats
  getStats: async () => {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Auth helpers
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      return { session: null, error: error.message };
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;