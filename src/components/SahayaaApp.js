// src/components/SahayaaApp.js - Fixed Position Management
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { auth, db } from '../config/supabase';
import { DEFAULT_STATS } from '../utils/constants';

// Layout Components
import Header from './Layout/Header';
import Footer from './Layout/Footer';

// Page Components
import Home from './Pages/Home';
import Team from './Pages/Team';
import Members from './Pages/Members';
import Events from './Pages/Events';
import Volunteers from './Pages/Volunteers';
import Contact from './Pages/Contact';

// Auth Components
import Login from './Auth/Login';

const SahayaaApp = () => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation state
  const [activeSection, setActiveSection] = useState('home');

  // Data state
  const [teamMembers, setTeamMembers] = useState([]);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  // Loading states - optimized with individual loading states
  const [dataLoading, setDataLoading] = useState({
    initial: true,
    teamMembers: false,
    organizationMembers: false,
    events: false,
    volunteers: false,
    testimonials: false,
    stats: false
  });

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);

  // Data cache to prevent unnecessary re-fetching
  const [dataCache, setDataCache] = useState({
    teamMembers: { loaded: false, timestamp: null },
    organizationMembers: { loaded: false, timestamp: null },
    events: { loaded: false, timestamp: null },
    volunteers: { loaded: false, timestamp: null },
    testimonials: { loaded: false, timestamp: null },
    stats: { loaded: false, timestamp: null }
  });

  // Cache timeout (5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000;

  // Initialize the application
  useEffect(() => {
    initializeApp();
  }, []);

  // Load data when section changes (lazy loading)
  useEffect(() => {
    loadSectionData(activeSection);
  }, [activeSection, user]);

  const initializeApp = async () => {
    await checkAuthState();
    await loadEssentialData();
    setAuthLoading(false);
  };

  const checkAuthState = useCallback(async () => {
    try {
      const { session } = await auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }

      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }, []);

  const loadEssentialData = async () => {
    setDataLoading(prev => ({ ...prev, initial: true }));
    
    try {
      const [statsResult, recentEventsResult] = await Promise.all([
        loadStatsIfNeeded(),
        loadRecentEvents()
      ]);

      if (statsResult) setStats(statsResult);
      if (recentEventsResult) setEvents(recentEventsResult);

    } catch (error) {
      console.error('Error loading essential data:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, initial: false }));
    }
  };

  const loadSectionData = async (section) => {
    switch (section) {
      case 'about':
        await Promise.all([
          loadTeamMembersIfNeeded(),
          loadTestimonialsIfNeeded()
        ]);
        break;
      case 'members':
        await loadOrganizationMembersIfNeeded();
        break;
      case 'events':
        await loadAllEventsIfNeeded();
        break;
      case 'volunteers':
        await loadVolunteersIfNeeded();
        break;
      default:
        break;
    }
  };

  const shouldLoadData = (dataType) => {
    const cache = dataCache[dataType];
    if (!cache.loaded) return true;
    if (!cache.timestamp) return true;
    
    const now = Date.now();
    return (now - cache.timestamp) > CACHE_TIMEOUT;
  };

  const loadTeamMembersIfNeeded = async () => {
    if (!shouldLoadData('teamMembers')) return;
    
    setDataLoading(prev => ({ ...prev, teamMembers: true }));
    try {
      const result = await db.getTeamMembers();
      if (result.data) {
        setTeamMembers(result.data);
        setDataCache(prev => ({
          ...prev,
          teamMembers: { loaded: true, timestamp: Date.now() }
        }));
      }
      if (result.error) console.error('Error loading team members:', result.error);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, teamMembers: false }));
    }
  };

  const loadOrganizationMembersIfNeeded = async () => {
    if (!shouldLoadData('organizationMembers')) return;
    
    setDataLoading(prev => ({ ...prev, organizationMembers: true }));
    try {
      const result = await db.getOrganizationMembers();
      if (result.data) {
        setOrganizationMembers(result.data);
        setDataCache(prev => ({
          ...prev,
          organizationMembers: { loaded: true, timestamp: Date.now() }
        }));
      }
      if (result.error) console.error('Error loading organization members:', result.error);
    } catch (error) {
      console.error('Error loading organization members:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, organizationMembers: false }));
    }
  };

  const loadAllEventsIfNeeded = async () => {
    if (!shouldLoadData('events')) return;
    
    setDataLoading(prev => ({ ...prev, events: true }));
    try {
      const result = await db.getEvents();
      if (result.data) {
        setEvents(result.data);
        setDataCache(prev => ({
          ...prev,
          events: { loaded: true, timestamp: Date.now() }
        }));
      }
      if (result.error) console.error('Error loading events:', result.error);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, events: false }));
    }
  };

  const loadRecentEvents = async () => {
    try {
      const result = await db.getEvents();
      if (result.data) {
        return result.data.slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error('Error loading recent events:', error);
      return [];
    }
  };

  const loadVolunteersIfNeeded = async () => {
    if (!shouldLoadData('volunteers')) return;
    
    setDataLoading(prev => ({ ...prev, volunteers: true }));
    try {
      const result = await db.getVolunteers();
      if (result.data) {
        setVolunteers(result.data);
        setDataCache(prev => ({
          ...prev,
          volunteers: { loaded: true, timestamp: Date.now() }
        }));
      }
      if (result.error) console.error('Error loading volunteers:', result.error);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, volunteers: false }));
    }
  };

  const loadTestimonialsIfNeeded = async () => {
    if (!shouldLoadData('testimonials')) return;
    
    setDataLoading(prev => ({ ...prev, testimonials: true }));
    try {
      const result = await db.getTestimonials();
      if (result.data) {
        setTestimonials(result.data);
        setDataCache(prev => ({
          ...prev,
          testimonials: { loaded: true, timestamp: Date.now() }
        }));
      }
      if (result.error) console.error('Error loading testimonials:', result.error);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setDataLoading(prev => ({ ...prev, testimonials: false }));
    }
  };

  const loadStatsIfNeeded = async () => {
    if (!shouldLoadData('stats')) return stats;
    
    setDataLoading(prev => ({ ...prev, stats: true }));
    try {
      const result = await db.getStats();
      let newStats = DEFAULT_STATS;
      
      if (result.data) {
        newStats = {
          peopleHelped: result.data.people_helped || DEFAULT_STATS.peopleHelped,
          eventsCompleted: result.data.events_completed || DEFAULT_STATS.eventsCompleted,
          volunteers: result.data.active_volunteers || DEFAULT_STATS.volunteers,
          yearsOfService: result.data.years_of_service || DEFAULT_STATS.yearsOfService
        };
        
        setDataCache(prev => ({
          ...prev,
          stats: { loaded: true, timestamp: Date.now() }
        }));
      }
      
      if (result.error) console.error('Error loading stats:', result.error);
      return newStats;
    } catch (error) {
      console.error('Error loading stats:', error);
      return stats;
    } finally {
      setDataLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        setUser(null);
        setDataCache({
          teamMembers: { loaded: false, timestamp: null },
          organizationMembers: { loaded: false, timestamp: null },
          events: { loaded: false, timestamp: null },
          volunteers: { loaded: false, timestamp: null },
          testimonials: { loaded: false, timestamp: null },
          stats: { loaded: false, timestamp: null }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const invalidateCache = (dataType) => {
    setDataCache(prev => ({
      ...prev,
      [dataType]: { loaded: false, timestamp: null }
    }));
  };

  // FIXED: Refresh data after position updates
  const refreshTeamMembers = async () => {
    try {
      const result = await db.getTeamMembers();
      if (result.data) {
        setTeamMembers(result.data);
      }
    } catch (error) {
      console.error('Error refreshing team members:', error);
    }
  };

  const refreshOrganizationMembers = async () => {
    try {
      const result = await db.getOrganizationMembers();
      if (result.data) {
        setOrganizationMembers(result.data);
      }
    } catch (error) {
      console.error('Error refreshing organization members:', error);
    }
  };

  // FIXED: Team member operations with immediate position update
  const handleTeamMemberCreate = async (memberData) => {
    try {
      const { data, error } = await db.createTeamMember(memberData);
      if (error) throw error;
      
      if (data && data[0]) {
        // Immediately refresh all team members to get updated positions
        await refreshTeamMembers();
        invalidateCache('teamMembers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating team member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleTeamMemberUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateTeamMember(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        // FIXED: Immediately refresh all team members to get updated positions
        await refreshTeamMembers();
        invalidateCache('teamMembers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleTeamMemberDelete = async (id) => {
    try {
      const { error } = await db.deleteTeamMember(id);
      if (error) throw error;
      
      // FIXED: Immediately refresh all team members to get updated positions
      await refreshTeamMembers();
      invalidateCache('teamMembers');
      return { success: true };
    } catch (error) {
      console.error('Error deleting team member:', error);
      return { success: false, error: error.message };
    }
  };

  // FIXED: Organization member operations with immediate position update
  const handleOrgMemberCreate = async (memberData) => {
    try {
      const { data, error } = await db.createOrganizationMember(memberData);
      if (error) throw error;
      
      if (data && data[0]) {
        // Immediately refresh all organization members to get updated positions
        await refreshOrganizationMembers();
        invalidateCache('organizationMembers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating organization member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleOrgMemberUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateOrganizationMember(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        // FIXED: Immediately refresh all organization members to get updated positions
        await refreshOrganizationMembers();
        invalidateCache('organizationMembers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating organization member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleOrgMemberDelete = async (id) => {
    try {
      const { error } = await db.deleteOrganizationMember(id);
      if (error) throw error;
      
      // FIXED: Immediately refresh all organization members to get updated positions
      await refreshOrganizationMembers();
      invalidateCache('organizationMembers');
      return { success: true };
    } catch (error) {
      console.error('Error deleting organization member:', error);
      return { success: false, error: error.message };
    }
  };

  // Other CRUD operations (unchanged)
  const handleEventCreate = async (eventData) => {
    try {
      const { data, error } = await db.createEvent(eventData);
      if (error) throw error;
      
      if (data && data[0]) {
        setEvents([data[0], ...events]);
        invalidateCache('events');
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  };

  const handleEventUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateEvent(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        setEvents(events.map(event => 
          event.id === id ? data[0] : event
        ));
        invalidateCache('events');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  };

  const handleEventDelete = async (id) => {
    try {
      const { error } = await db.deleteEvent(id);
      if (error) throw error;
      
      setEvents(events.filter(event => event.id !== id));
      invalidateCache('events');
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  };

  const handleVolunteerCreate = async (volunteerData) => {
    try {
      const { data, error } = await db.createVolunteer(volunteerData);
      if (error) throw error;
      
      if (data && data[0]) {
        setVolunteers([data[0], ...volunteers]);
        invalidateCache('volunteers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating volunteer:', error);
      return { success: false, error: error.message };
    }
  };

  const handleVolunteerUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateVolunteer(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        setVolunteers(volunteers.map(volunteer => 
          volunteer.id === id ? data[0] : volunteer
        ));
        invalidateCache('volunteers');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating volunteer:', error);
      return { success: false, error: error.message };
    }
  };

  const handleVolunteerDelete = async (id) => {
    try {
      const { error } = await db.deleteVolunteer(id);
      if (error) throw error;
      
      setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
      invalidateCache('volunteers');
      return { success: true };
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return { success: false, error: error.message };
    }
  };

  const handleTestimonialCreate = async (testimonialData) => {
    try {
      const { data, error } = await db.createTestimonial(testimonialData);
      if (error) throw error;
      
      if (data && data[0]) {
        setTestimonials([data[0], ...testimonials]);
        invalidateCache('testimonials');
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return { success: false, error: error.message };
    }
  };

  const handleTestimonialUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateTestimonial(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        setTestimonials(testimonials.map(testimonial => 
          testimonial.id === id ? data[0] : testimonial
        ));
        invalidateCache('testimonials');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error: error.message };
    }
  };

  const handleTestimonialDelete = async (id) => {
    try {
      const { error } = await db.deleteTestimonial(id);
      if (error) throw error;
      
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      invalidateCache('testimonials');
      return { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, error: error.message };
    }
  };

  const isLoading = useMemo(() => {
    return dataLoading.initial || Object.values(dataLoading).some(loading => loading);
  }, [dataLoading]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        setShowLogin={setShowLogin}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && activeSection !== 'home' ? (
          <DataLoadingState />
        ) : (
          <>
            {activeSection === 'home' && (
              <Home
                setActiveSection={setActiveSection}
                setShowContactForm={setShowContactForm}
                stats={stats}
                testimonials={testimonials}
                events={events}
              />
            )}
            
            {activeSection === 'about' && (
              <Team
                members={teamMembers}
                setMembers={setTeamMembers}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                user={user}
                onMemberCreate={handleTeamMemberCreate}
                onMemberUpdate={handleTeamMemberUpdate}
                onMemberDelete={handleTeamMemberDelete}
                onTestimonialCreate={handleTestimonialCreate}
                onTestimonialUpdate={handleTestimonialUpdate}
                onTestimonialDelete={handleTestimonialDelete}
              />
            )}
            
            {activeSection === 'members' && (
              <Members
                members={organizationMembers}
                setMembers={setOrganizationMembers}
                user={user}
                onMemberCreate={handleOrgMemberCreate}
                onMemberUpdate={handleOrgMemberUpdate}
                onMemberDelete={handleOrgMemberDelete}
              />
            )}
            
            {activeSection === 'events' && (
              <Events
                events={events}
                setEvents={setEvents}
                user={user}
                onEventCreate={handleEventCreate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
              />
            )}
            
            {activeSection === 'volunteers' && (
              <Volunteers
                volunteers={volunteers}
                setVolunteers={setVolunteers}
                user={user}
                onVolunteerCreate={handleVolunteerCreate}
                onVolunteerUpdate={handleVolunteerUpdate}
                onVolunteerDelete={handleVolunteerDelete}
              />
            )}
            
            {activeSection === 'contact' && (
              <Contact />
            )}
          </>
        )}
      </main>

      <Footer setActiveSection={setActiveSection} />

      <Login
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setUser={setUser}
      />

      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-green-800">Quick Contact</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please visit our Contact page for detailed contact information and to send us a message.
            </p>
            <button
              onClick={() => {
                setShowContactForm(false);
                setActiveSection('contact');
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Contact Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <div className="w-8 h-8 bg-white rounded-full"></div>
      </div>
      <h2 className="text-2xl font-bold text-green-800 mb-2">Sahayaa Trust</h2>
      <p className="text-green-600">Loading...</p>
    </div>
  </div>
);

const DataLoadingState = () => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SahayaaApp;