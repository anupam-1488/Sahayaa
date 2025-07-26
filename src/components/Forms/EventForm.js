// src/components/Forms/EventForm.js - Updated with missing fields
import React, { useState, useEffect } from 'react';
import { X, Save, Download, Star } from 'lucide-react';
import Modal from '../UI/Modal';
import ImageUpload from '../UI/ImageUpload';
import EventCardGenerator from '../UI/EventCardGenerator';
import { EVENT_CATEGORIES } from '../../utils/constants';

const EventForm = ({ 
  show, 
  setShow, 
  events, 
  setEvents, 
  editingEvent, 
  setEditingEvent,
  onEventCreate,
  onEventUpdate 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Education',
    image: '',
    capacity: '',
    registration_required: false,
    contact_email: '',
    is_featured: false,
    event_status: 'upcoming',
    gallery_images: []
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [eventForCard, setEventForCard] = useState(null);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        registration_required: editingEvent.registration_required || false,
        is_featured: editingEvent.is_featured || false,
        event_status: editingEvent.event_status || 'upcoming',
        gallery_images: editingEvent.gallery_images || []
      });
    } else {
      resetForm();
    }
  }, [editingEvent]);

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'Education',
      image: '',
      capacity: '',
      registration_required: false,
      contact_email: '',
      is_featured: false,
      event_status: 'upcoming',
      gallery_images: []
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (formData.contact_email && !isValidEmail(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    if (formData.capacity && (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    // Check if date is in the past for new events
    if (formData.date && !editingEvent) {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Automatically determine event status based on date
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const eventDataWithStatus = {
        ...formData,
        event_status: eventDate >= today ? 'upcoming' : 'completed'
      };

      let savedEvent;
      let result;
      
      if (editingEvent) {
        // Update existing event
        if (onEventUpdate) {
          result = await onEventUpdate(editingEvent.id, eventDataWithStatus);
          savedEvent = { ...eventDataWithStatus, id: editingEvent.id };
        } else {
          // Fallback to local state if no database function
          const updatedEvents = events.map(event => 
            event.id === editingEvent.id ? { ...eventDataWithStatus, id: editingEvent.id } : event
          );
          setEvents(updatedEvents);
          savedEvent = { ...eventDataWithStatus, id: editingEvent.id };
          result = { success: true };
        }
        setEditingEvent(null);
      } else {
        // Create new event
        if (onEventCreate) {
          result = await onEventCreate(eventDataWithStatus);
          if (result && result.success) {
            // For new events, we might not have the ID immediately, so we'll use a temporary one
            savedEvent = { ...eventDataWithStatus, id: Date.now() };
          }
        } else {
          // Fallback to local state if no database function
          const newEvent = { ...eventDataWithStatus, id: Date.now() };
          setEvents([...events, newEvent]);
          savedEvent = newEvent;
          result = { success: true };
        }
      }
      
      if (result && result.success) {
        // Show success message and option to generate invitation card
        const generateCard = window.confirm(
          `Event ${editingEvent ? 'updated' : 'created'} successfully! Would you like to generate an invitation card for social media?`
        );
        
        if (generateCard && savedEvent) {
          setEventForCard(savedEvent);
          setShowCardGenerator(true);
        }
        
        handleClose();
      } else {
        setErrors({ submit: result?.error || 'Failed to save event' });
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ submit: 'Failed to save event: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingEvent(null);
    resetForm();
  };

  const handleImageChange = (base64Image) => {
    setFormData({ ...formData, image: base64Image });
  };

  const generateInvitationCard = () => {
    if (validateForm()) {
      setEventForCard(formData);
      setShowCardGenerator(true);
    }
  };

  if (!show) return null;

  return (
    <>
      <Modal onClose={handleClose}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <FormHeader 
            isEditing={!!editingEvent} 
            onClose={handleClose} 
          />
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Event Title */}
            <FormField
              label="Event Title"
              type="text"
              value={formData.title}
              onChange={(value) => setFormData({...formData, title: value})}
              placeholder="Enter event title"
              error={errors.title}
              required
            />
            
            {/* Date, Time, Category */}
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(value) => setFormData({...formData, date: value})}
                error={errors.date}
                required
              />
              <FormField
                label="Time"
                type="time"
                value={formData.time}
                onChange={(value) => setFormData({...formData, time: value})}
                error={errors.time}
                required
              />
              <CategorySelect 
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
              />
            </div>

            {/* Location */}
            <FormField
              label="Location"
              type="text"
              value={formData.location}
              onChange={(value) => setFormData({...formData, location: value})}
              placeholder="Event venue or address"
              error={errors.location}
              required
            />
            
            {/* Capacity and Contact Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(value) => setFormData({...formData, capacity: value})}
                placeholder="Maximum attendees"
                error={errors.capacity}
              />
              <FormField
                label="Contact Email"
                type="email"
                value={formData.contact_email}
                onChange={(value) => setFormData({...formData, contact_email: value})}
                placeholder="contact@sahayaa.org"
                error={errors.contact_email}
              />
            </div>
            
            {/* Event Image Upload */}
            <div>
              <ImageUpload
                label="Event Image"
                value={formData.image}
                onChange={handleImageChange}
                acceptedTypes="image/*"
                maxSize={5 * 1024 * 1024} // 5MB limit for event images
                preview={true}
              />
            </div>
            
            {/* Description */}
            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="Detailed description of the event, its purpose, and what attendees can expect..."
              error={errors.description}
              required
            />
            
            {/* Event Settings */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-800">Event Settings</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Registration Required */}
                <CheckboxField
                  label="Registration Required"
                  checked={formData.registration_required}
                  onChange={(checked) => setFormData({...formData, registration_required: checked})}
                />
                
                {/* Featured Event */}
                <CheckboxField
                  label="Featured Event"
                  checked={formData.is_featured}
                  onChange={(checked) => setFormData({...formData, is_featured: checked})}
                  helpText="Featured events are highlighted on the home page"
                />
              </div>
              
              {/* Event Status - Only show for editing existing events */}
              {editingEvent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Status</label>
                  <select
                    value={formData.event_status}
                    onChange={(e) => setFormData({...formData, event_status: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <SubmitButton 
                onClick={handleSubmit}
                isEditing={!!editingEvent}
                loading={saving}
              />
              
              {/* Generate Card Button */}
              <button
                type="button"
                onClick={generateInvitationCard}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Preview Invitation Card</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Event Card Generator Modal */}
      {showCardGenerator && eventForCard && (
        <EventCardGenerator
          event={eventForCard}
          onClose={() => setShowCardGenerator(false)}
        />
      )}
    </>
  );
};

const FormHeader = ({ isEditing, onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl font-bold text-green-800">
      {isEditing ? 'Edit Event' : 'Create New Event'}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);

const FormField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required,
  helpText 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        min={type === 'number' ? '1' : undefined}
      />
    )}
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
    {helpText && (
      <p className="text-gray-500 text-xs mt-1">{helpText}</p>
    )}
  </div>
);

const CategorySelect = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      {EVENT_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, checked, onChange, helpText }) => (
  <div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id={label.replace(/\s+/g, '')}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label htmlFor={label.replace(/\s+/g, '')} className="text-sm font-medium text-gray-700 flex items-center">
        {label}
        {label.includes('Featured') && <Star className="w-4 h-4 ml-1 text-yellow-500" />}
      </label>
    </div>
    {helpText && (
      <p className="text-gray-500 text-xs mt-1 ml-7">{helpText}</p>
    )}
  </div>
);

const SubmitButton = ({ onClick, isEditing, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Saving...</span>
      </>
    ) : (
      <>
        <Save className="w-5 h-5" />
        <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
      </>
    )}
  </button>
);

export default EventForm;