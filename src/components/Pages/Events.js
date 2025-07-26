// src/components/Pages/Events.js - Fixed with proper gallery state management
import React, { useState } from 'react';
import { 
  Calendar, Plus, Edit3, Trash2, Clock, MapPin, Users, Mail, Download, 
  Image as ImageIcon, Eye, Upload, Star, Filter
} from 'lucide-react';
import EventForm from '../Forms/EventForm';
import EventCardGenerator from '../UI/EventCardGenerator';
import EventGallery from '../UI/EventGallery';

const Events = ({ 
  events = [], 
  setEvents, 
  user,
  onEventCreate,
  onEventUpdate,
  onEventDelete
}) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [selectedEventForCard, setSelectedEventForCard] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedEventForGallery, setSelectedEventForGallery] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      if (onEventDelete) {
        const result = await onEventDelete(id);
        if (!result.success) {
          alert('Failed to delete event: ' + result.error);
        }
      } else {
        // Fallback to local state
        setEvents(events.filter(event => event.id !== id));
      }
    }
  };

  const startEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const generateInvitationCard = (event) => {
    setSelectedEventForCard(event);
    setShowCardGenerator(true);
  };

  const openEventGallery = (event) => {
    setSelectedEventForGallery(event);
    setShowGallery(true);
  };

  const handleEventGalleryUpdate = (eventId, updatedGalleryImages) => {
    // Update the event in the local events state
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, gallery_images: updatedGalleryImages }
        : event
    ));
    
    // Also update the selected event for gallery if it's the same event
    if (selectedEventForGallery && selectedEventForGallery.id === eventId) {
      setSelectedEventForGallery({
        ...selectedEventForGallery,
        gallery_images: updatedGalleryImages
      });
    }
  };

  // Filter events based on status and category
  const filteredEvents = events.filter(event => {
    const statusMatch = filterStatus === 'all' || event.event_status === filterStatus;
    const categoryMatch = filterCategory === 'all' || event.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Group events by status
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today && event.event_status !== 'cancelled';
  });

  const completedEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today || event.event_status === 'completed';
  });

  const featuredEvents = filteredEvents.filter(event => event.is_featured);

  return (
    <div className="space-y-12">
      <PageHeader />
      
      {user && <AdminSection setShowEventForm={setShowEventForm} />}
      
      {/* Event Filters */}
      <EventFilters 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        events={events}
      />

      {/* Event Statistics */}
      <EventStats 
        totalEvents={events.length}
        upcomingCount={upcomingEvents.length}
        completedCount={completedEvents.length}
        featuredCount={featuredEvents.length}
      />

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <EventSection 
          title="Featured Events"
          icon={Star}
          events={featuredEvents}
          user={user}
          onEdit={startEditEvent}
          onDelete={handleDeleteEvent}
          onGenerateCard={generateInvitationCard}
          onOpenGallery={openEventGallery}
          isFeatured={true}
        />
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <EventSection 
          title="Upcoming Events"
          icon={Calendar}
          events={upcomingEvents}
          user={user}
          onEdit={startEditEvent}
          onDelete={handleDeleteEvent}
          onGenerateCard={generateInvitationCard}
          onOpenGallery={openEventGallery}
        />
      )}

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <EventSection 
          title="Past Events"
          icon={ImageIcon}
          events={completedEvents}
          user={user}
          onEdit={startEditEvent}
          onDelete={handleDeleteEvent}
          onGenerateCard={generateInvitationCard}
          onOpenGallery={openEventGallery}
          showGalleryOption={true}
        />
      )}

      {/* No Events State */}
      {filteredEvents.length === 0 && <EmptyState />}

      {/* Modals */}
      <EventForm
        show={showEventForm}
        setShow={setShowEventForm}
        events={events}
        setEvents={setEvents}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        onEventCreate={onEventCreate}
        onEventUpdate={onEventUpdate}
      />

      {showCardGenerator && selectedEventForCard && (
        <EventCardGenerator
          event={selectedEventForCard}
          onClose={() => setShowCardGenerator(false)}
        />
      )}

      {showGallery && selectedEventForGallery && (
        <EventGallery
          event={selectedEventForGallery}
          onClose={() => setShowGallery(false)}
          onGalleryUpdate={handleEventGalleryUpdate}
          user={user}
        />
      )}
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Our Events</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      From educational workshops to health camps, every event is an opportunity to make a difference. 
      Join us in our mission to create positive change in the community.
    </p>
  </div>
);

const AdminSection = ({ setShowEventForm }) => (
  <div className="flex justify-center">
    <button
      onClick={() => setShowEventForm(true)}
      className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-3 shadow-lg text-lg"
    >
      <Plus className="w-6 h-6" />
      <span>Create New Event</span>
    </button>
  </div>
);

const EventFilters = ({ 
  filterStatus, setFilterStatus, filterCategory, setFilterCategory, events 
}) => {
  const categories = [...new Set(events.map(event => event.category))];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filter Events</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const EventStats = ({ totalEvents, upcomingCount, completedCount, featuredCount }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard 
      icon={Calendar}
      value={totalEvents}
      label="Total Events"
      color="blue"
    />
    <StatCard 
      icon={Clock}
      value={upcomingCount}
      label="Upcoming"
      color="green"
    />
    <StatCard 
      icon={ImageIcon}
      value={completedCount}
      label="Completed"
      color="purple"
    />
    <StatCard 
      icon={Star}
      value={featuredCount}
      label="Featured"
      color="yellow"
    />
  </div>
);

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const EventSection = ({ 
  title, icon: Icon, events, user, onEdit, onDelete, onGenerateCard, 
  onOpenGallery, isFeatured, showGalleryOption 
}) => (
  <div className="space-y-6">
    <div className="flex items-center">
      <Icon className="w-8 h-8 text-green-600 mr-3" />
      <h2 className="text-3xl font-bold text-green-800">{title}</h2>
      <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        {events.length}
      </span>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onGenerateCard={onGenerateCard}
          onOpenGallery={onOpenGallery}
          isFeatured={isFeatured}
          showGalleryOption={showGalleryOption}
        />
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
    <Calendar className="w-20 h-20 text-green-300 mx-auto mb-6" />
    <h3 className="text-2xl font-semibold text-green-800 mb-4">No Events Found</h3>
    <p className="text-green-600 max-w-md mx-auto leading-relaxed">
      No events match your current filters. Try adjusting the filters or check back soon for new events!
    </p>
  </div>
);

const EventCard = ({ 
  event, user, onEdit, onDelete, onGenerateCard, onOpenGallery, 
  isFeatured, showGalleryOption 
}) => (
  <div className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
    isFeatured ? 'ring-2 ring-yellow-400' : ''
  }`}>
    <EventImage event={event} isFeatured={isFeatured} />
    <EventContent 
      event={event} 
      user={user} 
      onEdit={onEdit} 
      onDelete={onDelete} 
      onGenerateCard={onGenerateCard}
      onOpenGallery={onOpenGallery}
      showGalleryOption={showGalleryOption}
    />
  </div>
);

const EventImage = ({ event, isFeatured }) => (
  <div className="h-48 overflow-hidden relative">
    {event.image ? (
      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
        <Calendar className="w-16 h-16 text-white/60" />
      </div>
    )}
    
    {/* Status badge */}
    <div className="absolute top-4 left-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        event.event_status === 'upcoming' 
          ? 'bg-blue-100 text-blue-800'
          : event.event_status === 'completed'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {event.event_status}
      </span>
    </div>

    {/* Featured badge */}
    {isFeatured && (
      <div className="absolute top-4 right-4">
        <Star className="w-6 h-6 text-yellow-400 fill-current" />
      </div>
    )}

    {/* Gallery indicator - Updated to show current count */}
    {event.gallery_images && event.gallery_images.length > 0 && (
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
        <ImageIcon className="w-4 h-4 inline mr-1" />
        {event.gallery_images.length}
      </div>
    )}
  </div>
);

const EventContent = ({ 
  event, user, onEdit, onDelete, onGenerateCard, onOpenGallery, showGalleryOption 
}) => (
  <div className="p-8">
    <EventHeader event={event} user={user} onEdit={onEdit} onDelete={onDelete} />
    <EventTitle event={event} />
    <EventDetails event={event} />
    <EventDescription event={event} />
    <EventFooter event={event} />
    <EventActions 
      event={event} 
      user={user} 
      onGenerateCard={onGenerateCard}
      onOpenGallery={onOpenGallery}
      showGalleryOption={showGalleryOption}
    />
  </div>
);

const EventHeader = ({ event, user, onEdit, onDelete }) => (
  <div className="flex items-center justify-between mb-4">
    <CategoryBadge category={event.category} />
    {user && <EventAdminActions event={event} onEdit={onEdit} onDelete={onDelete} />}
  </div>
);

const CategoryBadge = ({ category }) => (
  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
    {category}
  </span>
);

const EventAdminActions = ({ event, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <ActionButton
      onClick={() => onEdit(event)}
      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      icon={Edit3}
      title="Edit Event"
    />
    <ActionButton
      onClick={() => onDelete(event.id)}
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      icon={Trash2}
      title="Delete Event"
    />
  </div>
);

const ActionButton = ({ onClick, className, icon: Icon, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${className}`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const EventTitle = ({ event }) => (
  <h3 className="text-2xl font-bold text-green-800 mb-4">{event.title}</h3>
);

const EventDetails = ({ event }) => (
  <div className="space-y-3 text-sm text-gray-600 mb-6">
    <DetailItem icon={Calendar} text={formatDate(event.date)} />
    <DetailItem icon={Clock} text={event.time} />
    <DetailItem icon={MapPin} text={event.location} />
    {event.capacity && (
      <DetailItem icon={Users} text={`Capacity: ${event.capacity} people`} />
    )}
  </div>
);

const DetailItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 text-green-600" />
    <span className="font-medium">{text}</span>
  </div>
);

const EventDescription = ({ event }) => (
  <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3">{event.description}</p>
);

const EventFooter = ({ event }) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
    {event.registration_required && (
      <RegistrationBadge />
    )}
    {event.contact_email && (
      <ContactEmail email={event.contact_email} />
    )}
  </div>
);

const EventActions = ({ event, user, onGenerateCard, onOpenGallery, showGalleryOption }) => (
  <div className="space-y-2">
    <div className="grid grid-cols-1 gap-2">
      {/* Generate Invitation Card - Available to everyone */}
      <button
        onClick={() => onGenerateCard(event)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
      >
        <Download className="w-4 h-4" />
        <span>Generate Invitation</span>
      </button>
      
      {/* Gallery Button - For completed events with images or admin access */}
      {(showGalleryOption || user) && (
        <button
          onClick={() => onOpenGallery(event)}
          className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm ${
            event.gallery_images && event.gallery_images.length > 0
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : user
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!event.gallery_images?.length && !user}
        >
          {user ? <Upload className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>
            {user 
              ? 'Manage Gallery' 
              : event.gallery_images?.length 
              ? `View Gallery (${event.gallery_images.length})` 
              : 'No Photos'
            }
          </span>
        </button>
      )}
    </div>
  </div>
);

const RegistrationBadge = () => (
  <span className="text-green-600 text-sm font-medium">Registration Required</span>
);

const ContactEmail = ({ email }) => (
  <div className="flex items-center text-sm text-gray-600">
    <Mail className="w-4 h-4 mr-1" />
    <span className="truncate">{email}</span>
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

export default Events;  