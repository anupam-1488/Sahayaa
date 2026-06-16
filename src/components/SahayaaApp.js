// src/components/SahayaaApp.js
import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../config/supabase';
import { DEFAULT_STATS } from '../utils/constants';
import { Loader2, Sparkles } from 'lucide-react';

// Layout Components
import Header from './Layout/Header';
import Footer from './Layout/Footer';

// Page Components
import Home from './Pages/Home';
import Team from './Pages/Team';
import Members from './Pages/Members';
import Events from './Pages/Events';
import Volunteers from './Pages/Volunteers';
import Donate from './Pages/Donate';
import Contact from './Pages/Contact';

// Policy Pages (Required for Razorpay Approval)
import TermsAndConditions from './Pages/TermsAndConditions';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import RefundPolicy from './Pages/RefundPolicy';

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
  const [loading, setLoading] = useState({
    home: true,
    about: false,
    members: false,
    events: false,
    volunteers: false,
    donate: false,
  });

  const loadingRef = React.useRef(new Set());

  // --- NAVIGATION & ROUTING ---
  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const routes = {
      home: '/',
      about: '/team',
      members: '/members',
      events: '/events',
      volunteers: '/volunteers',
      donate: '/donate',
      contact: '/contact',
      terms: '/terms-and-conditions',
      privacy: '/privacy-policy',
      refund: '/refund-policy',
      donations: '/donate',
    };

    if (routes[section]) {
      window.history.pushState({}, '', routes[section]);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const reverseRoutes = {
        '/': 'home',
        '/team': 'about',
        '/members': 'members',
        '/events': 'events',
        '/volunteers': 'volunteers',
        '/donate': 'donate',
        '/contact': 'contact',
      };
      setActiveSection(reverseRoutes[path] || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- AUTH ---
  const checkAuthState = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await auth.getSession();

      if (error) throw error;

      setUser(session?.user || null);

      const {
        data: { subscription },
      } = auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    }
  }, []);

  // --- DATA ---
  const loadStats = useCallback(async () => {
    const [e, v, o] = await Promise.all([
      db.getEventStats(),
      db.getVolunteerStats(),
      db.getOrganizationMemberStats(),
    ]);
    setStats({
      ...DEFAULT_STATS,
      eventsCompleted: e.data?.completedEvents || 150,
      volunteers: v.data?.totalVolunteers || 250,
      members: o.data?.totalOrgMembers || 50,
    });
  }, []);

  const loadHomePageData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, home: true }));
    try {
      const [evts, testims] = await Promise.all([
        db.getUpcomingEvents(),
        db.getTestimonials(),
      ]);
      if (evts.data) setEvents(evts.data);
      if (testims.data) setTestimonials(testims.data);
      loadStats();
    } finally {
      setLoading((prev) => ({ ...prev, home: false }));
    }
  }, [loadStats]);

  // --- DATA INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      await checkAuthState();
      setAuthLoading(false);
      loadHomePageData();
    };
    init();
  }, [checkAuthState, loadHomePageData]);

  // --- LAZY LOADING WRAPPERS ---
  const loadDataForSection = useCallback(
    async (section) => {
      if (loadingRef.current.has(section)) return;
      loadingRef.current.add(section);

      setLoading((prev) => ({ ...prev, [section]: true }));

      try {
        if (section === 'about' && teamMembers.length === 0) {
          const res = await db.getTeamMembers();
          if (res.success) setTeamMembers(res.data);
        }
        if (section === 'members' && organizationMembers.length === 0) {
          const res = await db.getOrganizationMembers();
          if (res.success) setOrganizationMembers(res.data);
        }
        if (section === 'volunteers' && volunteers.length === 0) {
          const res = await db.getVolunteers();
          if (res.success) setVolunteers(res.data);
        }
        if (section === 'events') {
          const res = await db.getEvents();
          if (res.success) setEvents(res.data);
        }
      } finally {
        setLoading((prev) => ({ ...prev, [section]: false }));
        loadingRef.current.delete(section);
      }
    },
    [teamMembers, organizationMembers, volunteers]
  );

  useEffect(() => {
    if (['about', 'members', 'volunteers', 'events'].includes(activeSection)) {
      loadDataForSection(activeSection);
    }
  }, [activeSection, loadDataForSection]);

  // --- RENDER ---
  if (authLoading) return <LoadingScreen />;

  const isCurrentSectionLoading = loading[activeSection];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        user={user}
        setShowLogin={setShowLogin}
        handleLogout={() => auth.signOut().then(() => setUser(null))}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-[70vh]">
        {isCurrentSectionLoading ? (
          <SectionLoader sectionName={activeSection} />
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeSection === 'home' && (
              <Home
                setActiveSection={handleSectionChange}
                stats={stats}
                events={events}
                testimonials={testimonials}
              />
            )}

            {activeSection === 'about' && (
  <Team
    members={teamMembers}
    setMembers={setTeamMembers}
    user={user}
    onMemberCreate={async (data) => {
      const res = await db.createTeamMember(data);
      if (res.success) setTeamMembers(prev => [...prev, res.data[0]]);
      return res;
    }}
    onMemberUpdate={async (id, data) => {
      const res = await db.updateTeamMember(id, data);
      if (res.success) setTeamMembers(prev => prev.map(m => m.id === id ? res.data[0] : m));
      return res;
    }}
    onMemberDelete={async (id) => {
      const res = await db.deleteTeamMember(id);
      if (res.success) setTeamMembers(prev => prev.filter(m => m.id !== id));
      return res;
    }}
  />
)}

{activeSection === 'members' && (
  <Members
    members={organizationMembers}
    setMembers={setOrganizationMembers}
    user={user}
    onMemberCreate={async (data) => {
      const res = await db.createOrganizationMember(data);
      if (res.success) setOrganizationMembers(prev => [...prev, res.data[0]]);
      return res;
    }}
    onMemberUpdate={async (id, data) => {
      const res = await db.updateOrganizationMember(id, data);
      if (res.success) setOrganizationMembers(prev => prev.map(m => m.id === id ? res.data[0] : m));
      return res;
    }}
    onMemberDelete={async (id) => {
      const res = await db.deleteOrganizationMember(id);
      if (res.success) setOrganizationMembers(prev => prev.filter(m => m.id !== id));
      return res;
    }}
  />
)}

{activeSection === 'volunteers' && (
  <Volunteers
    volunteers={volunteers}
    setVolunteers={setVolunteers}
    user={user}
    onVolunteerCreate={async (data) => {
      const res = await db.createVolunteer(data);
      if (res.success) setVolunteers(prev => [...prev, res.data[0]]);
      return res;
    }}
    onVolunteerUpdate={async (id, data) => {
      const res = await db.updateVolunteer(id, data);
      if (res.success) setVolunteers(prev => prev.map(v => v.id === id ? res.data[0] : v));
      return res;
    }}
    onVolunteerDelete={async (id) => {
      const res = await db.deleteVolunteer(id);
      if (res.success) setVolunteers(prev => prev.filter(v => v.id !== id));
      return res;
    }}
  />
)}

            {activeSection === 'events' && (
              <Events
                events={events}
                setEvents={setEvents}
                user={user}
                onEventCreate={async (eventData) => {
                  const res = await db.createEvent(eventData);
                  if (res.success) setEvents((prev) => [res.data[0], ...prev]);
                  return res;
                }}
                onEventUpdate={async (id, updates) => {
                  const res = await db.updateEvent(id, updates);
                  if (res.success)
                    setEvents((prev) =>
                      prev.map((e) => (e.id === id ? res.data[0] : e))
                    );
                  return res;
                }}
                onEventDelete={async (id) => {
                  if (!window.confirm('Delete this event?')) return;
                  const res = await db.deleteEvent(id);
                  if (res.success)
                    setEvents((prev) => prev.filter((e) => e.id !== id));
                  return res;
                }}
              />
            )}

            {/* {activeSection === 'volunteers' && (
              <Volunteers volunteers={volunteers} user={user} />
            )} */}

            {activeSection === 'donate' && <Donate />}
            {activeSection === 'donations' && <Donate />}
            {activeSection === 'contact' && <Contact />}

            {activeSection === 'terms' && <TermsAndConditions />}
            {activeSection === 'privacy' && <PrivacyPolicy />}
            {activeSection === 'refund' && <RefundPolicy />}
          </div>
        )}
      </main>

      <Footer setActiveSection={handleSectionChange} />

      <Login showLogin={showLogin} setShowLogin={setShowLogin} setUser={setUser} />
    </div>
  );
};

// --- SUBSIDIARY COMPONENTS ---

const SectionLoader = ({ sectionName }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="relative">
      <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
      <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
    </div>
    <h3 className="mt-6 text-xl font-bold text-green-800 capitalize">
      Loading {sectionName === 'about' ? 'Our Team' : sectionName}...
    </h3>
    <p className="text-gray-500 mt-2">
      Connecting you with Sahayaa Trust initiatives
    </p>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-green-800 tracking-tight">
        SAHAYAA TRUST
      </h2>
      <p className="text-green-600 font-medium mt-2">Empowering Communities</p>
    </div>
  </div>
);

export default SahayaaApp;