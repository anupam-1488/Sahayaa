// src/components/Forms/TestimonialForm.js
import React, { useState, useEffect } from 'react';
import { X, Save, Star } from 'lucide-react';
import Modal from '../UI/Modal';
import ImageUpload from '../UI/ImageUpload';

const TestimonialForm = ({ 
  show, 
  setShow, 
  testimonials, 
  setTestimonials, 
  editingTestimonial, 
  setEditingTestimonial 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    image: '',
    rating: 5
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTestimonial) {
      setFormData(editingTestimonial);
    } else {
      resetForm();
    }
  }, [editingTestimonial]);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      message: '',
      image: '',
      rating: 5
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Testimonial message is required';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5 stars';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingTestimonial) {
        // Update existing testimonial
        const updatedTestimonials = testimonials.map(testimonial => 
          testimonial.id === editingTestimonial.id ? { ...formData, id: editingTestimonial.id } : testimonial
        );
        setTestimonials(updatedTestimonials);
        setEditingTestimonial(null);
      } else {
        // Add new testimonial
        const newTestimonial = { ...formData, id: Date.now() };
        setTestimonials([...testimonials, newTestimonial]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial: ' + error.message);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingTestimonial(null);
    resetForm();
  };

  const handleImageChange = (base64Image) => {
    setFormData({ ...formData, image: base64Image });
  };

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <FormHeader 
          isEditing={!!editingTestimonial} 
          onClose={handleClose} 
        />
        
        <div className="space-y-4">
          {/* Name */}
          <FormField
            label="Name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({...formData, name: value})}
            placeholder="Full name"
            error={errors.name}
            required
          />
          
          {/* Role/Title */}
          <FormField
            label="Role/Title"
            type="text"
            value={formData.role}
            onChange={(value) => setFormData({...formData, role: value})}
            placeholder="e.g., Volunteer, Beneficiary, Community Member"
          />
          
          {/* Profile Image Upload */}
          <div>
            <ImageUpload
              label="Profile Image (Optional)"
              value={formData.image}
              onChange={handleImageChange}
              acceptedTypes="image/*"
              maxSize={1 * 1024 * 1024} // 1MB limit for profile images
              preview={true}
            />
          </div>
          
          {/* Testimonial Message */}
          <FormField
            label="Testimonial Message"
            type="textarea"
            value={formData.message}
            onChange={(value) => setFormData({...formData, message: value})}
            placeholder="Share your experience with Sahayaa Trust..."
            error={errors.message}
            required
          />
          
          {/* Rating */}
          <RatingField
            label="Rating"
            value={formData.rating}
            onChange={(value) => setFormData({...formData, rating: value})}
            error={errors.rating}
          />
          
          {/* Submit Button */}
          <SubmitButton 
            onClick={handleSubmit}
            isEditing={!!editingTestimonial}
          />
        </div>
      </div>
    </Modal>
  );
};

const FormHeader = ({ isEditing, onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xl font-bold text-green-800">
      {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700"
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
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none ${
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
      />
    )}
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const RatingField = ({ label, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`w-8 h-8 transition-colors ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-1">
      {value} star{value !== 1 ? 's' : ''} selected
    </p>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const SubmitButton = ({ onClick, isEditing }) => (
  <button
    onClick={onClick}
    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
  >
    <Save className="w-5 h-5" />
    <span>{isEditing ? 'Update Testimonial' : 'Add Testimonial'}</span>
  </button>
);

export default TestimonialForm;