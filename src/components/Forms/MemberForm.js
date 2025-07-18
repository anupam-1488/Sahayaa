// src/components/Forms/MemberForm.js
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Modal from '../UI/Modal';
import ImageUpload from '../UI/ImageUpload';

const MemberForm = ({ 
  show, 
  setShow, 
  members, 
  setMembers, 
  editingMember, 
  setEditingMember,
  onMemberCreate,
  onMemberUpdate 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    phone: '',
    expertise: []
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        ...editingMember,
        expertise: editingMember.expertise || []
      });
    } else {
      resetForm();
    }
  }, [editingMember]);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      email: '',
      phone: '',
      expertise: []
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      
      if (editingMember) {
        // Update existing member
        if (onMemberUpdate) {
          result = await onMemberUpdate(editingMember.id, formData);
        } else {
          // Fallback to local state if no database function
          const updatedMembers = members.map(member => 
            member.id === editingMember.id ? { ...formData, id: editingMember.id } : member
          );
          setMembers(updatedMembers);
          result = { success: true };
        }
        setEditingMember(null);
      } else {
        // Create new member
        if (onMemberCreate) {
          result = await onMemberCreate(formData);
        } else {
          // Fallback to local state if no database function
          const newMember = { ...formData, id: Date.now() };
          setMembers([newMember, ...members]);
          result = { success: true };
        }
      }
      
      if (result && result.success) {
        handleClose();
      } else {
        setErrors({ submit: result?.error || 'Failed to save member' });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      setErrors({ submit: 'Failed to save member: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingMember(null);
    resetForm();
  };

  const handleExpertiseChange = (value) => {
    const expertiseArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setFormData({ ...formData, expertise: expertiseArray });
  };

  const handleImageChange = (base64Image) => {
    setFormData({ ...formData, image: base64Image });
  };

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <FormHeader 
          isEditing={!!editingMember} 
          onClose={handleClose} 
        />
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Basic Information */}
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
              label="Role/Position"
              type="text"
              value={formData.role}
              onChange={(value) => setFormData({...formData, role: value})}
              placeholder="e.g., Program Director"
              error={errors.role}
              required
            />
          </div>
          
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({...formData, email: value})}
              placeholder="email@example.com"
              error={errors.email}
            />
            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({...formData, phone: value})}
              placeholder="+91 98765 43210"
            />
          </div>
          
          {/* Profile Image Upload */}
          <div>
            <ImageUpload
              label="Profile Image"
              value={formData.image}
              onChange={handleImageChange}
              acceptedTypes="image/*"
              maxSize={2 * 1024 * 1024} // 2MB limit
              preview={true}
            />
          </div>
          
          {/* Bio */}
          <FormField
            label="Bio/Description"
            type="textarea"
            value={formData.bio}
            onChange={(value) => setFormData({...formData, bio: value})}
            placeholder="Brief description about the team member, their background, and contributions..."
            error={errors.bio}
            required
          />
          
          {/* Skills/Expertise */}
          <FormField
            label="Expertise/Skills"
            type="text"
            value={formData.expertise.join(', ')}
            onChange={handleExpertiseChange}
            placeholder="e.g., Community Development, Public Health, Education"
            helpText="Separate multiple skills with commas"
          />
          
          {/* Submit Button */}
          <SubmitButton 
            onClick={handleSubmit}
            isEditing={!!editingMember}
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
      {isEditing ? 'Edit Team Member' : 'Add Team Member'}
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
    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mt-6 disabled:opacity-50"
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Saving...</span>
      </>
    ) : (
      <>
        <Save className="w-5 h-5" />
        <span>{isEditing ? 'Update Member' : 'Add Member'}</span>
      </>
    )}
  </button>
);

export default MemberForm;