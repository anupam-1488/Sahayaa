// src/components/SahayaaApp.js
import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../config/supabase';
import { DEFAULT_STATS } from '../utils/constants';

// Layout Components
import Header from './Layout/Header';
import Footer from './Layout/Footer';

// Page Components
import Home from './Pages/Home';
import Team from './Pages/Team';
import Events from './Pages/Events';
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
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  // Loading states
  const [dataLoading, setDataLoading] = useState(true);

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);

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
      const [membersResult, eventsResult, testimonialsResult, statsResult] = await Promise.all([
        db.getMembers(),
        db.getEvents(),
        db.getTestimonials(),
        db.getStats()
      ]);

      // Set data with error handling
      setMembers(membersResult.data || []);
      setEvents(eventsResult.data || []);
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
      if (membersResult.error) console.error('Error loading members:', membersResult.error);
      if (eventsResult.error) console.error('Error loading events:', eventsResult.error);
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
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle member operations
  const handleMemberCreate = async (memberData) => {
    try {
      const { data, error } = await db.createMember(memberData);
      if (error) throw error;
      
      if (data && data[0]) {
        setMembers([data[0], ...members]);
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleMemberUpdate = async (id, updates) => {
    try {
      const { data, error } = await db.updateMember(id, updates);
      if (error) throw error;
      
      if (data && data[0]) {
        setMembers(members.map(member => 
          member.id === id ? data[0] : member
        ));
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating member:', error);
      return { success: false, error: error.message };
    }
  };

  const handleMemberDelete = async (id) => {
    try {
      const { error } = await db.deleteMember(id);
      if (error) throw error;
      
      setMembers(members.filter(member => member.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting member:', error);
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
        setActiveSection={setActiveSection}
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
                setActiveSection={setActiveSection}
                setShowContactForm={setShowContactForm}
                stats={stats}
                testimonials={testimonials}
              />
            )}
            {activeSection === 'about' && (
              <Team
                members={members}
                setMembers={setMembers}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                user={user}
                onMemberCreate={handleMemberCreate}
                onMemberUpdate={handleMemberUpdate}
                onMemberDelete={handleMemberDelete}
                onTestimonialCreate={handleTestimonialCreate}
                onTestimonialUpdate={handleTestimonialUpdate}
                onTestimonialDelete={handleTestimonialDelete}
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
            {activeSection === 'contact' && (
              <Contact />
            )}
          </>
        )}
      </main>

      <Footer setActiveSection={setActiveSection} />

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