import React, { useState, useMemo } from 'react';
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
  // --- UI States ---
  const [activeModal, setActiveModal] = useState(null); // 'form', 'card', 'gallery', or null
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // --- Filter States ---
  const [filters, setFilters] = useState({ status: 'all', category: 'all' });

  // 1. CRITICAL: Memoize filtered events to prevent re-calculating on every UI flicker
  const processedData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = events.filter(event => {
      const statusMatch = filters.status === 'all' || event.event_status === filters.status;
      const categoryMatch = filters.category === 'all' || event.category === filters.category;
      return statusMatch && categoryMatch;
    });

    return {
      upcoming: filtered.filter(e => new Date(e.date) >= today && e.event_status !== 'cancelled'),
      completed: filtered.filter(e => new Date(e.date) < today || e.event_status === 'completed'),
      featured: filtered.filter(e => e.is_featured),
      totalFiltered: filtered.length,
      categories: [...new Set(events.map(e => e.category))]
    };
  }, [events, filters]);

  // --- Handlers ---
  const handleGalleryUpdate = (eventId, updatedImages) => {
    // Update local state immediately so UI reflects new images
    setEvents(prev => prev.map(ev => 
      ev.id === eventId ? { ...ev, gallery_images: updatedImages } : ev
    ));
    
    // Sync the selected event if the gallery is currently open
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => ({ ...prev, gallery_images: updatedImages }));
    }
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedEvent(null);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-12">
      {/* Header & Admin Action */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-green-800">Our Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Every event is an opportunity to make a difference.
        </p>
        {user && (
          <button
            onClick={() => setActiveModal('form')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-3 shadow-lg mx-auto"
          >
            <Plus size={24} /> <span>Create New Event</span>
          </button>
        )}
      </div>

      {/* Filters & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Filter Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Filter Category</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {processedData.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatMini label="Upcoming" count={processedData.upcoming.length} color="text-blue-600" />
          <StatMini label="Past" count={processedData.completed.length} color="text-purple-600" />
        </div>
      </div>

      {/* Sections */}
      {processedData.featured.length > 0 && (
        <EventSection 
          title="Featured" events={processedData.featured} isFeatured user={user}
          onEdit={(e) => { setEditingEvent(e); setActiveModal('form'); }}
          onDelete={onEventDelete}
          onOpenCard={(e) => { setSelectedEvent(e); setActiveModal('card'); }}
          onOpenGallery={(e) => { setSelectedEvent(e); setActiveModal('gallery'); }}
        />
      )}

      <EventSection 
        title="Upcoming" events={processedData.upcoming} user={user}
        onEdit={(e) => { setEditingEvent(e); setActiveModal('form'); }}
        onDelete={onEventDelete}
        onOpenCard={(e) => { setSelectedEvent(e); setActiveModal('card'); }}
        onOpenGallery={(e) => { setSelectedEvent(e); setActiveModal('gallery'); }}
      />

      <EventSection 
        title="Past Events" events={processedData.completed} user={user} showGalleryOption
        onEdit={(e) => { setEditingEvent(e); setActiveModal('form'); }}
        onDelete={onEventDelete}
        onOpenCard={(e) => { setSelectedEvent(e); setActiveModal('card'); }}
        onOpenGallery={(e) => { setSelectedEvent(e); setActiveModal('gallery'); }}
      />

      {processedData.totalFiltered === 0 && <EmptyState />}

      {/* --- MODALS --- */}
      {activeModal === 'form' && (
        <EventForm 
          show={true} setShow={closeModals} 
          editingEvent={editingEvent} setEditingEvent={setEditingEvent}
          onEventCreate={onEventCreate} onEventUpdate={onEventUpdate}
        />
      )}

      {activeModal === 'card' && selectedEvent && (
        <EventCardGenerator event={selectedEvent} onClose={closeModals} />
      )}

      {activeModal === 'gallery' && selectedEvent && (
        <EventGallery 
          event={selectedEvent} user={user} 
          onClose={closeModals} onGalleryUpdate={handleGalleryUpdate} 
        />
      )}
    </div>
  );
};

// --- Sub-Components for Cleanliness ---

const StatMini = ({ label, count, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center justify-center">
    <span className={`text-2xl font-bold ${color}`}>{count}</span>
    <span className="text-xs text-gray-500 font-medium uppercase">{label}</span>
  </div>
);

const EventSection = ({ title, events, user, onEdit, onDelete, onOpenCard, onOpenGallery, isFeatured, showGalleryOption }) => {
  if (events.length === 0) return null;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        {title === 'Featured' ? <Star className="text-yellow-500 fill-yellow-500" /> : <Calendar className="text-green-600" />}
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <EventCard 
            key={event.id} event={event} user={user} isFeatured={isFeatured}
            onEdit={onEdit} onDelete={onDelete} onOpenCard={onOpenCard} onOpenGallery={onOpenGallery}
            showGalleryOption={showGalleryOption}
          />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event, user, isFeatured, onEdit, onDelete, onOpenCard, onOpenGallery, showGalleryOption }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${isFeatured ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="h-48 bg-gray-200 relative">
        <img src={event.image || '/api/placeholder/400/320'} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
          {event.category}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{event.title}</h3>
          {user && (
            <div className="flex gap-1">
              <button onClick={() => onEdit(event)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit3 size={16} /></button>
              <button onClick={() => onDelete(event.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(event.date).toDateString()}</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> {event.location}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            onClick={() => onOpenCard(event)}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <Download size={14} /> Invitation
          </button>
          <button 
            onClick={() => onOpenGallery(event)}
            className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors"
          >
            <ImageIcon size={14} /> Gallery ({event.gallery_images?.length || 0})
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
    <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
    <p className="text-gray-500 font-medium">No events found matching your selection.</p>
  </div>
);

export default Events;