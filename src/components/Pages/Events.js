// src/components/Pages/Events.js
import React, { useState } from 'react';
import { Calendar, Plus, Edit3, Trash2, Clock, MapPin, Users, Mail, Download } from 'lucide-react';
import EventForm from '../Forms/EventForm';
import EventCardGenerator from '../UI/EventCardGenerator';

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

  return (
    <div className="space-y-12">
      <PageHeader />
      
      {user && <AdminSection setShowEventForm={setShowEventForm} />}
      
      <EventList 
        events={events}
        user={user}
        onEdit={startEditEvent}
        onDelete={handleDeleteEvent}
        onGenerateCard={generateInvitationCard}
      />

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
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Our Events</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Join us in our mission to create positive change in the community. 
      From educational workshops to health camps, every event is an opportunity to make a difference.
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

const EventList = ({ events, user, onEdit, onDelete, onGenerateCard }) => {
  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onGenerateCard={onGenerateCard}
        />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
    <Calendar className="w-20 h-20 text-green-300 mx-auto mb-6" />
    <h3 className="text-2xl font-semibold text-green-800 mb-4">No Events Scheduled</h3>
    <p className="text-green-600 max-w-md mx-auto leading-relaxed">
      We're planning exciting events and activities. 
      Check back soon for upcoming opportunities to get involved!
    </p>
  </div>
);

const EventCard = ({ event, user, onEdit, onDelete, onGenerateCard }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    {event.image && <EventImage event={event} />}
    <EventContent event={event} user={user} onEdit={onEdit} onDelete={onDelete} onGenerateCard={onGenerateCard} />
  </div>
);

const EventImage = ({ event }) => (
  <div className="h-48 overflow-hidden">
    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
  </div>
);

const EventContent = ({ event, user, onEdit, onDelete, onGenerateCard }) => (
  <div className="p-8">
    <EventHeader event={event} user={user} onEdit={onEdit} onDelete={onDelete} />
    <EventTitle event={event} />
    <EventDetails event={event} />
    <EventDescription event={event} />
    <EventFooter event={event} />
    <EventActions event={event} user={user} onGenerateCard={onGenerateCard} />
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
    />
    <ActionButton
      onClick={() => onDelete(event.id)}
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      icon={Trash2}
    />
  </div>
);

const ActionButton = ({ onClick, className, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${className}`}
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
  <p className="text-gray-700 text-sm leading-relaxed mb-6">{event.description}</p>
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

const EventActions = ({ event, user, onGenerateCard }) => (
  <div className="space-y-2">
    {/* Generate Invitation Card Button - Available to everyone */}
    <button
      onClick={() => onGenerateCard(event)}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
    >
      <Download className="w-4 h-4" />
      <span>Generate Invitation Card</span>
    </button>
    
    {/* Share Information */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p className="text-xs text-blue-700 text-center">
        Create and download invitation cards perfect for social media sharing!
      </p>
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