// src/components/Forms/EventForm.js
import React, { useState, useEffect } from 'react';
import { X, Save, Download } from 'lucide-react';
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
    contact_email: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [eventForCard, setEventForCard] = useState(null);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        registration_required: editingEvent.registration_required || false
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
      contact_email: ''
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

    // Check if date is in the past
    if (formData.date) {
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
      let savedEvent;
      let result;
      
      if (editingEvent) {
        // Update existing event
        if (onEventUpdate) {
          result = await onEventUpdate(editingEvent.id, formData);
          savedEvent = { ...formData, id: editingEvent.id };
        } else {
          // Fallback to local state if no database function
          const updatedEvents = events.map(event => 
            event.id === editingEvent.id ? { ...formData, id: editingEvent.id } : event
          );
          setEvents(updatedEvents);
          savedEvent = { ...formData, id: editingEvent.id };
          result = { success: true };
        }
        setEditingEvent(null);
      } else {
        // Create new event
        if (onEventCreate) {
          result = await onEventCreate(formData);
          if (result && result.success) {
            // For new events, we might not have the ID immediately, so we'll use a temporary one
            savedEvent = { ...formData, id: Date.now() };
          }
        } else {
          // Fallback to local state if no database function
          const newEvent = { ...formData, id: Date.now() };
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
            
            {/* Registration Required */}
            <CheckboxField
              label="Registration Required"
              checked={formData.registration_required}
              onChange={(checked) => setFormData({...formData, registration_required: checked})}
            />
            
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
  required 
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

const CheckboxField = ({ label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id="registrationRequired"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
    />
    <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
      {label}
    </label>
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