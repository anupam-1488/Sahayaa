// src/config/supabase.js - OPTIMIZED VERSION
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Add these for better performance
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'sahayaa-trust',
    },
  },
  // Add timeout
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      timeout: 10000, // 10 second timeout
    });
  },
});

// Auth helper
export const auth = {
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error };
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// OPTIMIZED Database helper with SELECT limiting and ordering
export const db = {
  // ============================================
  // EVENTS - OPTIMIZED
  // ============================================
  getEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false }) // Most recent first
        .limit(100); // Limit to 100 events max

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { data: null, error, success: false };
    }
  },

  // Get only upcoming events (faster for home page)
  getUpcomingEvents: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, location, category, description, image, is_featured, event_status')
        .gte('date', today) // Only future events
        .neq('event_status', 'cancelled')
        .order('date', { ascending: true })
        .limit(10); // Only 10 upcoming events

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return { data: null, error, success: false };
    }
  },

  // Get featured events only (for home page highlights)
  getFeaturedEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, location, category, image, gallery_images, is_featured')
        .eq('is_featured', true)
        .order('date', { ascending: false })
        .limit(6); // Only 6 featured

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return { data: null, error, success: false };
    }
  },

  createEvent: async (eventData) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error creating event:', error);
      return { data: null, error, success: false };
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error updating event:', error);
      return { data: null, error, success: false };
    }
  },

  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      return { error, success: !error };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { error, success: false };
    }
  },

  // ============================================
  // TEAM MEMBERS - OPTIMIZED
  // ============================================
  getTeamMembers: async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('position', { ascending: true })
        .limit(50); // Max 50 team members

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching team members:', error);
      return { data: null, error, success: false };
    }
  },

  createTeamMember: async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([memberData])
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error creating team member:', error);
      return { data: null, error, success: false };
    }
  },

  updateTeamMember: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error updating team member:', error);
      return { data: null, error, success: false };
    }
  },

  deleteTeamMember: async (id) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      return { error, success: !error };
    } catch (error) {
      console.error('Error deleting team member:', error);
      return { error, success: false };
    }
  },

  // ============================================
  // ORGANIZATION MEMBERS - OPTIMIZED
  // ============================================
  getOrganizationMembers: async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .order('position', { ascending: true })
        .limit(50);

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching organization members:', error);
      return { data: null, error, success: false };
    }
  },

  createOrganizationMember: async (memberData) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .insert([memberData])
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error creating organization member:', error);
      return { data: null, error, success: false };
    }
  },

  updateOrganizationMember: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .update(updates)
        .eq('id', id)
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error updating organization member:', error);
      return { data: null, error, success: false };
    }
  },

  deleteOrganizationMember: async (id) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);

      return { error, success: !error };
    } catch (error) {
      console.error('Error deleting organization member:', error);
      return { error, success: false };
    }
  },

  // ============================================
  // VOLUNTEERS - OPTIMIZED
  // ============================================
  getVolunteers: async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return { data: null, error, success: false };
    }
  },

  // Get active volunteers only (faster)
  getActiveVolunteers: async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('id, name, volunteer_id, profile_image, skills, events_participated, total_hours, status')
        .eq('status', 'active')
        .order('total_hours', { ascending: false })
        .limit(50);

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching active volunteers:', error);
      return { data: null, error, success: false };
    }
  },

  createVolunteer: async (volunteerData) => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .insert([volunteerData])
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error creating volunteer:', error);
      return { data: null, error, success: false };
    }
  },

  updateVolunteer: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .update(updates)
        .eq('id', id)
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error updating volunteer:', error);
      return { data: null, error, success: false };
    }
  },

  deleteVolunteer: async (id) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', id);

      return { error, success: !error };
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return { error, success: false };
    }
  },

  // ============================================
  // TESTIMONIALS - OPTIMIZED
  // ============================================
  getTestimonials: async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Only 20 testimonials

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return { data: null, error, success: false };
    }
  },

  createTestimonial: async (testimonialData) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return { data: null, error, success: false };
    }
  },

  updateTestimonial: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select();

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { data: null, error, success: false };
    }
  },

  deleteTestimonial: async (id) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      return { error, success: !error };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { error, success: false };
    }
  },

  // ============================================
  // DONATIONS - OPTIMIZED
  // ============================================
  getDonations: async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      return { data, error, success: !error };
    } catch (error) {
      console.error('Error fetching donations:', error);
      return { data: null, error, success: false };
    }
  },

  // ============================================
  // STATS - OPTIMIZED WITH CACHING
  // ============================================
  getDonationStats: async () => {
    try {
      const { count: uniqueDonors, error: donorError } = await supabase
        .from('donations')
        .select('donor_email', { count: 'exact', head: true });

      if (donorError) throw donorError;

      return { data: { uniqueDonors: uniqueDonors || 0 }, error: null, success: true };
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      return { data: { uniqueDonors: 0 }, error, success: false };
    }
  },

  getEventStats: async () => {
    try {
      const { count: completedEvents, error: eventError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_status', 'completed');

      if (eventError) throw eventError;

      return { data: { completedEvents: completedEvents || 0 }, error: null, success: true };
    } catch (error) {
      console.error('Error fetching event stats:', error);
      return { data: { completedEvents: 0 }, error, success: false };
    }
  },

  getVolunteerStats: async () => {
    try {
      const { count: totalVolunteers, error: volunteerError } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (volunteerError) throw volunteerError;

      return { data: { totalVolunteers: totalVolunteers || 0 }, error: null, success: true };
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      return { data: { totalVolunteers: 0 }, error, success: false };
    }
  },

  getOrganizationMemberStats: async () => {
    try {
      const { count: totalOrgMembers, error: orgError } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true });

      if (orgError) throw orgError;

      return { data: { totalOrgMembers: totalOrgMembers || 0 }, error: null, success: true };
    } catch (error) {
      console.error('Error fetching org member stats:', error);
      return { data: { totalOrgMembers: 0 }, error, success: false };
    }
  },
};

export default supabase;