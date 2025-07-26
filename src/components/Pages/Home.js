// src/components/Pages/Home.js - Fixed Version
import React from 'react';
import { 
  Target, Activity, Users, Heart, Globe, CheckCircle, TrendingUp, Star, User,
  Calendar, Clock, MapPin, ArrowRight, Image as ImageIcon, Eye
} from 'lucide-react';
import { SAHAYAA_VALUES, CORE_VALUES, DEFAULT_STATS } from '../../utils/constants';

const Home = ({ 
  setActiveSection, 
  setShowContactForm, 
  stats = DEFAULT_STATS, 
  testimonials = [],
  events = []
}) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection setActiveSection={setActiveSection} setShowContactForm={setShowContactForm} stats={stats} />
      
      {/* Upcoming Events Section */}
      <UpcomingEventsSection events={events} setActiveSection={setActiveSection} />
      
      {/* Event Highlights Section */}
      <EventHighlightsSection events={events} setActiveSection={setActiveSection} />
      
      {/* Vision & Mission */}
      <VisionMission />
      
      {/* SAHAYAA Values */}
      <SahayaaValues />
      
      {/* Our Ideology */}
      <OurIdeology />
      
      {/* Core Values */}
      <CoreValues />
      
      {/* Testimonials */}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
    </div>
  );
};

const UpcomingEventsSection = ({ events, setActiveSection }) => {
  // Filter upcoming events with more flexible criteria
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      
      // More flexible filtering: show if date is today or future, and not explicitly cancelled
      const isUpcoming = eventDate >= today;
      const isNotCancelled = (event.event_status || '').toLowerCase() !== 'cancelled';
      
      return isUpcoming && isNotCancelled;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-green-600 mr-3" />
          <h2 className="text-4xl font-bold text-green-800">Upcoming Events</h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join us in our upcoming activities and be part of the positive change in our community.
        </p>
      </div>
      
      {upcomingEvents.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setActiveSection('events')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
          <p className="text-gray-500">
            We're planning exciting events. Check back soon or contact us to learn about upcoming activities!
          </p>
          <button
            onClick={() => setActiveSection('events')}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View All Events
          </button>
        </div>
      )}
    </div>
  );
};

const EventHighlightsSection = ({ events, setActiveSection }) => {
  // Filter for highlight events with more flexible criteria
  const highlightEvents = events
    .filter(event => {
      // Show if featured OR has gallery images OR is a significant past event
      const isFeatured = event.is_featured === true;
      const hasGallery = event.gallery_images && event.gallery_images.length > 0;
      const isCompleted = (event.event_status || '').toLowerCase() === 'completed';
      
      return isFeatured || (isCompleted && hasGallery) || hasGallery;
    })
    .sort((a, b) => {
      // Sort by featured first, then by date (newest first)
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-10 rounded-3xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-yellow-300 mr-3" />
          <h2 className="text-4xl font-bold">Event Highlights</h2>
        </div>
        <p className="text-xl text-green-100 max-w-3xl mx-auto">
          Celebrating the impact we've made together through our recent events and activities.
        </p>
      </div>
      
      {highlightEvents.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {highlightEvents.map((event) => (
              <HighlightEventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setActiveSection('events')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto font-semibold"
            >
              <Eye className="w-5 h-5" />
              <span>See All Event Galleries</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-white/10 rounded-2xl">
          <Star className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">More Highlights Coming Soon</h3>
          <p className="text-green-100">
            We'll showcase our amazing events and photo galleries here as we continue our mission!
          </p>
        </div>
      )}
    </div>
  );
};

const UpcomingEventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
      {/* Days until event badge and category */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {event.category}
        </span>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
        </span>
      </div>
      
      {/* Featured badge */}
      {event.is_featured && (
        <div className="mb-3">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit">
            <Star className="w-3 h-3" />
            <span>Featured</span>
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-green-800 mb-3">{event.title}</h3>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-green-600" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-green-600" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
        {event.description}
      </p>
      
      {event.registration_required && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <p className="text-yellow-800 text-xs font-medium">Registration Required</p>
        </div>
      )}
    </div>
  );
};

const HighlightEventCard = ({ event }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300">
    {/* Event image or placeholder */}
    <div className="h-40 bg-white/20 rounded-lg mb-4 overflow-hidden">
      {event.gallery_images && event.gallery_images.length > 0 ? (
        <img 
          src={event.gallery_images[0]} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      ) : event.image ? (
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-white/60" />
        </div>
      )}
    </div>
    
    <div className="flex justify-between items-start mb-3">
      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {event.category}
      </span>
      {event.is_featured && (
        <Star className="w-5 h-5 text-yellow-300 fill-current" />
      )}
    </div>
    
    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
    
    <div className="space-y-1 text-sm text-green-100 mb-3">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(event.date)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4" />
        <span className="truncate">{event.location}</span>
      </div>
    </div>
    
    {event.gallery_images && event.gallery_images.length > 1 && (
      <div className="flex items-center space-x-2 text-sm text-green-100">
        <ImageIcon className="w-4 h-4" />
        <span>{event.gallery_images.length} photos available</span>
      </div>
    )}
  </div>
);

const HeroSection = ({ setActiveSection, setShowContactForm, stats }) => (
  <div className="relative text-center py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
    <div className="relative z-10 flex flex-col items-center">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <img
            src="/logo.jpg"
            alt="Sahayaa Trust Logo"
            className="w-15 h-15 rounded-full object-cover"
          />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-green-800">
          Sahayaa Trust
        </h1>
      </div>
      <p className="text-xl sm:text-2xl text-green-700 max-w-3xl mx-auto mb-8 leading-relaxed text-center">
        "Sahayaa" means <em>"the one who stands with you"</em><br />
        Building a compassionate society where everyone lives with dignity, health, knowledge, and joy.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <ActionButton onClick={() => setActiveSection('about')} primary>
          Meet Our Team
        </ActionButton>
        <ActionButton onClick={() => setActiveSection('events')}>
          Upcoming Events
        </ActionButton>
        <ActionButton onClick={() => setShowContactForm(true)} variant="emerald">
          Get Involved
        </ActionButton>
      </div>
      <StatsGrid stats={stats} />
    </div>
  </div>
);

const ActionButton = ({ children, onClick, primary, variant = 'green' }) => {
  const baseClasses = "px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg";
  const variants = {
    green: primary 
      ? "bg-green-600 text-white hover:bg-green-700" 
      : "border-2 border-green-600 text-green-600 hover:bg-green-50",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
    <StatCard value={`${stats.peopleHelped.toLocaleString()}+`} label="People Helped" />
    <StatCard value={`${stats.eventsCompleted}+`} label="Events Completed" />
    <StatCard value={`${stats.volunteers}+`} label="Active Volunteers" />
    <StatCard value={stats.yearsOfService} label="Years of Service" />
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
    <div className="text-3xl font-bold text-green-800">{value}</div>
    <div className="text-green-600">{label}</div>
  </div>
);

const VisionMission = () => (
  <div className="grid lg:grid-cols-2 gap-12">
    <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-10 rounded-3xl">
      <div className="flex items-center mb-6">
        <Target className="w-8 h-8 mr-3" />
        <h2 className="text-3xl font-bold">Our Vision</h2>
      </div>
      <p className="text-lg leading-relaxed mb-6">
        To build a compassionate and empowered society where everyone—especially children and women—has the opportunity to live with dignity, health, knowledge, and joy.
      </p>
      <p className="text-green-100">
        We believe that care, when extended with sincerity and respect, can change the course of lives and communities.
      </p>
    </div>
    
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-green-100">
      <div className="flex items-center mb-6">
        <Activity className="w-8 h-8 mr-3 text-green-600" />
        <h2 className="text-3xl font-bold text-green-800">Our Mission</h2>
      </div>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        Sahayaa Trust supports individuals and families in need, with a special focus on the well-being of children and women.
      </p>
      <p className="text-gray-600">
        We work across key areas that ensure a strong foundation for life, creating lasting positive impact in communities.
      </p>
    </div>
  </div>
);

const SahayaaValues = () => (
  <div className="bg-white p-10 rounded-3xl shadow-xl">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-green-800 mb-4">What SAHAYAA Stands For</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Each letter in our name represents a core pillar of our work and commitment to the community.
      </p>
    </div>
    
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {SAHAYAA_VALUES.map((value, index) => {
        const IconComponent = value.icon;
        return (
          <ValueCard key={index} value={value} IconComponent={IconComponent} />
        );
      })}
    </div>
  </div>
);

const ValueCard = ({ value, IconComponent }) => (
  <div className="group cursor-pointer">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 h-full">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mr-4 group-hover:bg-green-700 transition-colors">
          {value.letter}
        </div>
        <IconComponent className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-2">{value.word}</h3>
      <p className="text-green-600 font-medium mb-3">{value.meaning}</p>
      <p className="text-gray-600 text-sm mb-4">{value.description}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{value.details}</p>
    </div>
  </div>
);

const OurIdeology = () => (
  <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-10 rounded-3xl">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-4">Our Ideology</h2>
      <p className="text-xl text-green-100 max-w-3xl mx-auto">
        We believe in <strong>seva</strong>, not as charity, but as a shared journey.
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 text-center">
      <IdeologyCard 
        icon={Users}
        title="Everyone Has Potential"
        description="With the right support, anyone can rise and achieve their dreams."
      />
      <IdeologyCard 
        icon={Heart}
        title="Standing Together"
        description="Sahayaa stands with people—not above them—through life's challenges."
      />
      <IdeologyCard 
        icon={Globe}
        title="Shared Journey"
        description="Together we walk towards a more compassionate and just society."
      />
    </div>
  </div>
);

const IdeologyCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
    <Icon className="w-12 h-12 mx-auto mb-4 text-green-200" />
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-green-100 text-sm">{description}</p>
  </div>
);

const CoreValues = () => {
  const iconMap = {
    Heart,
    Users,
    Target,
    Globe,
    CheckCircle,
    TrendingUp
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Core Values</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CORE_VALUES.map((value, index) => {
          const IconComponent = typeof value.icon === 'string' ? iconMap[value.icon] : value.icon;
          return (
            <CoreValueCard key={index} value={value} IconComponent={IconComponent} />
          );
        })}
      </div>
    </div>
  );
};

const CoreValueCard = ({ value, IconComponent }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl hover:shadow-md transition-shadow">
    <IconComponent className="w-8 h-8 text-green-600 mb-3" />
    <h3 className="font-bold text-green-800 mb-2">{value.title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
  </div>
);

const TestimonialsSection = ({ testimonials }) => (
  <div className="bg-gray-50 p-10 rounded-3xl">
    <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">What People Say</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.slice(0, 3).map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{testimonial.message}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
        {testimonial.image ? (
          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <User className="w-6 h-6 text-green-600" />
        )}
      </div>
      <div>
        <div className="font-semibold text-green-800">{testimonial.name}</div>
        <div className="text-sm text-gray-600">{testimonial.role}</div>
      </div>
    </div>
  </div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default Home;