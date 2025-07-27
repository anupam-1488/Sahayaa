// src/config/supabase.js - Updated with Donations Functions
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

  // Donations - New Functions
  getDonations: async (limit = null, offset = 0) => {
    try {
      let query = supabase
        .from('donations')
        .select('*')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getDonationStats: async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('amount, cause, created_at, donor_name')
        .eq('payment_status', 'completed');

      if (error) throw error;

      const stats = {
        totalDonations: data.length,
        totalAmount: data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0),
        averageDonation: data.length > 0 ? data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0) / data.length : 0,
        uniqueDonors: [...new Set(data.map(d => d.donor_name))].length,
        topCauses: getTopCauses(data),
        monthlyTrend: getMonthlyTrend(data),
        recentDonations: data.slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getPublicDonations: async (limit = 10) => {
    try {
      // Only get public donations (non-anonymous)
      const { data, error } = await supabase
        .from('donations')
        .select('donor_name, amount, cause, created_at, comments')
        .eq('payment_status', 'completed')
        .eq('is_anonymous', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  searchDonations: async (searchTerm, cause = null, dateFrom = null, dateTo = null) => {
    try {
      let query = supabase
        .from('donations')
        .select('*')
        .eq('payment_status', 'completed');

      if (searchTerm) {
        query = query.or(`donor_name.ilike.%${searchTerm}%,donor_email.ilike.%${searchTerm}%,donation_id.ilike.%${searchTerm}%`);
      }

      if (cause) {
        query = query.eq('cause', cause);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Newsletter/Mailing List
  addToMailingList: async (email, name = '', interests = []) => {
    try {
      const { data, error } = await supabase
        .from('mailing_list')
        .insert([{
          email,
          name,
          interests,
          subscribed_at: new Date().toISOString(),
          is_active: true
        }])
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
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

  updateStats: async (updates) => {
    try {
      const { data, error } = await supabase
        .from('stats')
        .update(updates)
        .eq('id', 1) // Assuming single stats record
        .select();
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

// Helper functions for donation statistics
function getTopCauses(donations) {
  const causeCounts = donations.reduce((acc, donation) => {
    acc[donation.cause] = (acc[donation.cause] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(causeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([cause, count]) => ({ cause, count }));
}

function getMonthlyTrend(donations) {
  const monthly = donations.reduce((acc, donation) => {
    const month = new Date(donation.created_at).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + parseFloat(donation.amount);
    return acc;
  }, {});

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, amount]) => ({ month, amount }));
}

export default supabase;