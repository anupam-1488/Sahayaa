// src/components/Forms/VolunteerForm.js - Simplified Version
import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Calendar, MapPin, Clock, Award } from 'lucide-react';
import Modal from '../UI/Modal';
import ImageUpload from '../UI/ImageUpload';

const VolunteerForm = ({ 
  show, 
  setShow, 
  volunteers, 
  setVolunteers, 
  editingVolunteer, 
  setEditingVolunteer,
  onVolunteerCreate,
  onVolunteerUpdate 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    occupation: '',
    skills: [],
    availability: 'flexible',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    profile_image: '',
    bio: '',
    events_participated: 0,
    total_hours: 0
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const availabilityOptions = [
    { value: 'weekends', label: 'Weekends Only' },
    { value: 'weekdays', label: 'Weekdays Only' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'mornings', label: 'Mornings' }
  ];

  useEffect(() => {
    if (editingVolunteer) {
      setFormData({
        ...editingVolunteer,
        skills: editingVolunteer.skills || [],
        date_of_birth: editingVolunteer.date_of_birth || '',
        events_participated: editingVolunteer.events_participated || 0,
        total_hours: editingVolunteer.total_hours || 0
      });
    } else {
      resetForm();
    }
  }, [editingVolunteer]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      occupation: '',
      skills: [],
      availability: 'flexible',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      profile_image: '',
      bio: '',
      events_participated: 0,
      total_hours: 0
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 16) {
        newErrors.date_of_birth = 'Volunteer must be at least 16 years old';
      }
    }

    if (formData.events_participated < 0) {
      newErrors.events_participated = 'Events participated cannot be negative';
    }

    if (formData.total_hours < 0) {
      newErrors.total_hours = 'Total hours cannot be negative';
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
      let result;
      
      if (editingVolunteer) {
        if (onVolunteerUpdate) {
          result = await onVolunteerUpdate(editingVolunteer.id, formData);
        } else {
          const updatedVolunteers = volunteers.map(volunteer => 
            volunteer.id === editingVolunteer.id ? { ...formData, id: editingVolunteer.id } : volunteer
          );
          setVolunteers(updatedVolunteers);
          result = { success: true };
        }
        setEditingVolunteer(null);
      } else {
        if (onVolunteerCreate) {
          result = await onVolunteerCreate(formData);
        } else {
          const newVolunteer = { 
            ...formData, 
            id: Date.now(),
            volunteer_id: `VOL${String(Date.now()).slice(-6)}`,
            joining_date: new Date().toISOString().split('T')[0],
            status: 'active'
          };
          setVolunteers([newVolunteer, ...volunteers]);
          result = { success: true };
        }
      }
      
      if (result && result.success) {
        handleClose();
      } else {
        setErrors({ submit: result?.error || 'Failed to save volunteer' });
      }
    } catch (error) {
      console.error('Error saving volunteer:', error);
      setErrors({ submit: 'Failed to save volunteer: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingVolunteer(null);
    resetForm();
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value
      .split(/,\s*|\s*,\s*/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleImageChange = (base64Image) => {
    setFormData({ ...formData, profile_image: base64Image });
  };

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormHeader 
          isEditing={!!editingVolunteer} 
          onClose={handleClose} 
        />
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Personal Information */}
          <Section title="Personal Information" icon={User}>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                placeholder="Enter full name"
                error={errors.name}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({...formData, email: value})}
                placeholder="volunteer@example.com"
                error={errors.email}
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({...formData, phone: value})}
                placeholder="+91 98765 43210"
                error={errors.phone}
                required
              />
              <FormField
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(value) => setFormData({...formData, date_of_birth: value})}
                error={errors.date_of_birth}
              />
            </div>

            <FormField
              label="Address"
              type="textarea"
              value={formData.address}
              onChange={(value) => setFormData({...formData, address: value})}
              placeholder="Complete address"
              rows={2}
            />
          </Section>

          {/* Professional Information */}
          <Section title="Professional Information" icon={Mail}>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Occupation"
                type="text"
                value={formData.occupation}
                onChange={(value) => setFormData({...formData, occupation: value})}
                placeholder="e.g., Software Engineer, Teacher, Student"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FormField
                label="Skills & Expertise"
                type="text"
                value={formData.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="Teaching, Healthcare, Event Management, Social Media"
                helpText="Separate skills with commas"
              />
              
              {formData.skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Skills Preview:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Volunteer Activity - SIMPLIFIED */}
          <Section title="Volunteer Activity" icon={Award}>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Events Participated"
                type="number"
                value={formData.events_participated}
                onChange={(value) => setFormData({...formData, events_participated: parseInt(value) || 0})}
                placeholder="0"
                error={errors.events_participated}
                min="0"
                helpText="Number of events you have participated in"
              />
              
              <FormField
                label="Total Hours"
                type="number"
                value={formData.total_hours}
                onChange={(value) => setFormData({...formData, total_hours: parseInt(value) || 0})}
                placeholder="0"
                error={errors.total_hours}
                min="0"
                helpText="Total hours of volunteer service"
              />
            </div>

            {/* Summary Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h6 className="font-medium text-green-800 mb-2">📊 Volunteer Summary:</h6>
              <div className="text-sm text-green-700 space-y-1">
                <p>• <strong>Events:</strong> {formData.events_participated} events participated</p>
                <p>• <strong>Service Time:</strong> {formData.total_hours} hours of volunteer service</p>
                <p>• <strong>Certificate:</strong> Will show these details for recognition</p>
              </div>
            </div>
          </Section>

          {/* Emergency Contact */}
          <Section title="Emergency Contact" icon={Phone}>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Emergency Contact Name"
                type="text"
                value={formData.emergency_contact_name}
                onChange={(value) => setFormData({...formData, emergency_contact_name: value})}
                placeholder="Contact person name"
              />
              <FormField
                label="Emergency Contact Phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(value) => setFormData({...formData, emergency_contact_phone: value})}
                placeholder="+91 98765 43210"
              />
            </div>
          </Section>

          {/* Profile Image */}
          <Section title="Profile Photo" icon={User}>
            <ImageUpload
              label="Profile Image (Optional)"
              value={formData.profile_image}
              onChange={handleImageChange}
              acceptedTypes="image/*"
              maxSize={2 * 1024 * 1024}
              preview={true}
            />
          </Section>

          {/* Bio */}
          <Section title="About" icon={User}>
            <FormField
              label="Bio/Motivation"
              type="textarea"
              value={formData.bio}
              onChange={(value) => setFormData({...formData, bio: value})}
              placeholder="Tell us about yourself, your motivation to volunteer, and what you hope to achieve..."
              error={errors.bio}
              required
              rows={4}
            />
          </Section>
          
          {/* Submit Button */}
          <SubmitButton 
            onClick={handleSubmit}
            isEditing={!!editingVolunteer}
            loading={saving}
          />
        </div>
      </div>
    </Modal>
  );
};

const FormHeader = ({ isEditing, onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl font-bold text-green-800">
      {isEditing ? 'Edit Volunteer' : 'Add New Volunteer'}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 p-6 rounded-xl">
    <div className="flex items-center mb-4">
      <Icon className="w-5 h-5 text-green-600 mr-2" />
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="space-y-4">
      {children}
    </div>
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
  helpText,
  rows = 3,
  min
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        rows={rows}
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
        min={min}
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
        <span>{isEditing ? 'Update Volunteer' : 'Add Volunteer'}</span>
      </>
    )}
  </button>
);

export default VolunteerForm;