// src/components/SahayaaApp.js - Updated with Policy Pages
import React, { useState, useEffect, useCallback } from 'react';
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
import Donations from './Pages/Donations';
import Contact from './Pages/Contact';

// Policy Pages
import TermsAndConditions from './Pages/TermsAndConditions';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import RefundPolicy from './Pages/RefundPolicy';

// Admin Components
import DonorManagement from './Admin/DonorManagement';

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

  // Loading states
  const [dataLoading, setDataLoading] = useState(true);

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);

  // URL routing effect
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/terms-and-conditions') {
      setActiveSection('terms');
    } else if (path === '/privacy-policy') {
      setActiveSection('privacy');
    } else if (path === '/refund-policy') {
      setActiveSection('refund');
    }
  }, []);

  // Update URL when section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    // Update URL without page reload
    const routes = {
      'terms': '/terms-and-conditions',
      'privacy': '/privacy-policy', 
      'refund': '/refund-policy',
      'home': '/',
      'about': '/team',
      'members': '/members',
      'events': '/events',
      'volunteers': '/volunteers',
      'donations': '/donations',
      'contact': '/contact'
    };
    
    if (routes[section]) {
      window.history.pushState({}, '', routes[section]);
    }
  };

  // Initialize the application
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await Promise.all([
      checkAuthState(),
      loadData()
    ]);
    setAuthLoading(false);
  };

  const checkAuthState = useCallback(async () => {
    try {
      const { session } = await auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }

      // Listen for auth changes
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      // Load all data from Supabase
      const [
        teamMembersResult, 
        orgMembersResult, 
        eventsResult, 
        volunteersResult, 
        testimonialsResult, 
        statsResult
      ] = await Promise.all([
        db.getTeamMembers(),
        db.getOrganizationMembers(),
        db.getEvents(),
        db.getVolunteers(),
        db.getTestimonials(),
        db.getStats()
      ]);

      // Set data with error handling
      setTeamMembers(teamMembersResult.data || []);
      setOrganizationMembers(orgMembersResult.data || []);
      setEvents(eventsResult.data || []);
      setVolunteers(volunteersResult.data || []);
      setTestimonials(testimonialsResult.data || []);
      
      // Set stats from database or use defaults
      if (statsResult.data) {
        setStats({
          peopleHelped: statsResult.data.people_helped || DEFAULT_STATS.peopleHelped,
          eventsCompleted: statsResult.data.events_completed || DEFAULT_STATS.eventsCompleted,
          volunteers: statsResult.data.active_volunteers || DEFAULT_STATS.volunteers,
          yearsOfService: statsResult.data.years_of_service || DEFAULT_STATS.yearsOfService
        });
      } else {
        setStats(DEFAULT_STATS);
      }

      // Log any errors
      if (teamMembersResult.error) console.error('Error loading team members:', teamMembersResult.error);
      if (orgMembersResult.error) console.error('Error loading org members:', orgMembersResult.error);
      if (eventsResult.error) console.error('Error loading events:', eventsResult.error);
      if (volunteersResult.error) console.error('Error loading volunteers:', volunteersResult.error);
      if (testimonialsResult.error) console.error('Error loading testimonials:', testimonialsResult.error);
      if (statsResult.error) console.error('Error loading stats:', statsResult.error);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        setUser(null);
        // Redirect to home if user was on admin page
        if (activeSection === 'admin-donors') {
          handleSectionChange('home');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle team member operations
  const handleTeamMemberCreate = async (memberData) => {
    try {
      const { data, error } = await db.createTeamMember(memberData);
      if (error) throw error;
      
      if (data && data[0]) {
        setTeamMembers([data[0], ...teamMembers]);
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
        setTeamMembers(teamMembers.map(member => 
          member.id === id ? data[0] : member
        ));
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
      
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting team member:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle organization member operations
  const handleOrgMemberCreate = async (memberData) => {
    try {
      const { data, error } = await db.createOrganizationMember(memberData);
      if (error) throw error;
      
      if (data && data[0]) {
        setOrganizationMembers([data[0], ...organizationMembers]);
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
        setOrganizationMembers(organizationMembers.map(member => 
          member.id === id ? data[0] : member
        ));
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
      
      setOrganizationMembers(organizationMembers.filter(member => member.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting organization member:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle event operations
  const handleEventCreate = async (eventData) => {
    try {
      const { data, error } = await db.createEvent(eventData);
      if (error) throw error;
      
      if (data && data[0]) {
        setEvents([...events, data[0]]);
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
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle volunteer operations
  const handleVolunteerCreate = async (volunteerData) => {
    try {
      const { data, error } = await db.createVolunteer(volunteerData);
      if (error) throw error;
      
      if (data && data[0]) {
        setVolunteers([data[0], ...volunteers]);
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
      return { success: true };
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle testimonial operations
  const handleTestimonialCreate = async (testimonialData) => {
    try {
      const { data, error } = await db.createTestimonial(testimonialData);
      if (error) throw error;
      
      if (data && data[0]) {
        setTestimonials([data[0], ...testimonials]);
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
      return { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, error: error.message };
    }
  };

  // Render loading state
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        user={user}
        setShowLogin={setShowLogin}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataLoading ? (
          <DataLoadingState />
        ) : (
          <>
            {activeSection === 'home' && (
              <Home
                setActiveSection={handleSectionChange}
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
            
            {activeSection === 'donations' && (
              <Donations />
            )}
            
            {/* Policy Pages */}
            {activeSection === 'terms' && <TermsAndConditions />}
            {activeSection === 'privacy' && <PrivacyPolicy />}
            {activeSection === 'refund' && <RefundPolicy />}
            
            {/* Admin Donor Management - Only accessible by logged-in users */}
            {activeSection === 'admin-donors' && (
              <DonorManagement user={user} />
            )}
            
            {activeSection === 'contact' && (
              <Contact />
            )}
          </>
        )}
      </main>

      <Footer setActiveSection={handleSectionChange} />

      {/* Admin Panel Quick Access */}
      {user && (
        <AdminQuickAccess 
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
        />
      )}

      {/* Modals */}
      <Login
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setUser={setUser}
      />

      {/* Contact Form Modal */}
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
                handleSectionChange('contact');
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

const AdminQuickAccess = ({ activeSection, setActiveSection }) => (
  <div className="fixed bottom-6 right-6 z-40">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Admin Panel</h4>
      <div className="space-y-2">
        <AdminQuickButton
          active={activeSection === 'admin-donors'}
          onClick={() => setActiveSection('admin-donors')}
          icon="💰"
          label="Donor Management"
        />
        <AdminQuickButton
          active={activeSection === 'events'}
          onClick={() => setActiveSection('events')}
          icon="📅"
          label="Events"
        />
        <AdminQuickButton
          active={activeSection === 'volunteers'}
          onClick={() => setActiveSection('volunteers')}
          icon="🤝"
          label="Volunteers"
        />
      </div>
    </div>
  </div>
);

const AdminQuickButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
      active 
        ? 'bg-green-100 text-green-800 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

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