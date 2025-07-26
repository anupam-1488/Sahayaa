// src/components/Forms/MemberForm.js - Enhanced with Perfect Position Management
import React, { useState, useEffect } from 'react';
import { X, Save, ArrowUp, ArrowDown, Users } from 'lucide-react';
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
    position: 1,
    bio: '',
    image: '',
    email: '',
    phone: '',
    expertise: []
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [positionPreview, setPositionPreview] = useState([]);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        ...editingMember,
        position: editingMember.position || 1,
        expertise: editingMember.expertise || []
      });
    } else {
      resetForm();
    }
  }, [editingMember]);

  useEffect(() => {
    // Update position preview whenever position changes
    updatePositionPreview();
  }, [formData.position, members, editingMember]);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      position: 1,
      bio: '',
      image: '',
      email: '',
      phone: '',
      expertise: []
    });
    setErrors({});
    setPositionPreview([]);
  };

  const updatePositionPreview = () => {
    if (!formData.name.trim()) {
      setPositionPreview([]);
      return;
    }

    const newPosition = parseInt(formData.position) || 1;
    const isEditing = !!editingMember;
    const currentMemberId = editingMember?.id;

    // Create a preview of how positions will look after the change
    let preview = [...members];

    // Remove current member if editing
    if (isEditing) {
      preview = preview.filter(m => m.id !== currentMemberId);
    }

    // Add the new/edited member at the desired position
    const newMember = {
      ...formData,
      id: currentMemberId || 'preview',
      position: newPosition
    };

    // Adjust positions of existing members
    preview = preview.map(member => {
      if (member.position >= newPosition) {
        return { ...member, position: member.position + 1 };
      }
      return member;
    });

    // Insert the new member
    preview.push(newMember);

    // Sort by position and take top 5 for preview
    preview.sort((a, b) => (a.position || 999) - (b.position || 999));
    setPositionPreview(preview.slice(0, 5));
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

    const position = parseInt(formData.position);
    if (!position || position < 1) {
      newErrors.position = 'Position must be a positive number starting from 1';
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
      const processedData = {
        ...formData,
        position: parseInt(formData.position) || 1
      };

      let result;
      
      if (editingMember) {
        // Update existing member
        if (onMemberUpdate) {
          result = await onMemberUpdate(editingMember.id, processedData);
        } else {
          // Fallback: Update locally with position management
          const updatedMembers = adjustPositionsForUpdate(members, editingMember.id, processedData);
          setMembers(updatedMembers);
          result = { success: true };
        }
        setEditingMember(null);
      } else {
        // Create new member
        if (onMemberCreate) {
          result = await onMemberCreate(processedData);
        } else {
          // Fallback: Add locally with position management
          const updatedMembers = adjustPositionsForCreate(members, processedData);
          setMembers(updatedMembers);
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

  // Local position management functions for fallback
  const adjustPositionsForCreate = (currentMembers, newMember) => {
    const newPosition = newMember.position;
    
    // Shift existing members at or after the new position
    const adjustedMembers = currentMembers.map(member => {
      if ((member.position || 999) >= newPosition) {
        return { ...member, position: (member.position || 999) + 1 };
      }
      return member;
    });

    // Add the new member
    const memberWithId = { ...newMember, id: Date.now() };
    return [...adjustedMembers, memberWithId];
  };

  const adjustPositionsForUpdate = (currentMembers, memberId, updatedMember) => {
    const oldMember = currentMembers.find(m => m.id === memberId);
    const oldPosition = oldMember?.position || 999;
    const newPosition = updatedMember.position;

    if (oldPosition === newPosition) {
      // Position didn't change, just update the member
      return currentMembers.map(member => 
        member.id === memberId ? { ...updatedMember, id: memberId } : member
      );
    }

    // Position changed, need to adjust others
    return currentMembers.map(member => {
      if (member.id === memberId) {
        return { ...updatedMember, id: memberId };
      }

      const memberPosition = member.position || 999;

      if (newPosition < oldPosition) {
        // Moving up: shift members between newPosition and oldPosition down
        if (memberPosition >= newPosition && memberPosition < oldPosition) {
          return { ...member, position: memberPosition + 1 };
        }
      } else {
        // Moving down: shift members between oldPosition and newPosition up
        if (memberPosition > oldPosition && memberPosition <= newPosition) {
          return { ...member, position: memberPosition - 1 };
        }
      }

      return member;
    });
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

  const handlePositionChange = (newPosition) => {
    const position = Math.max(1, parseInt(newPosition) || 1);
    setFormData({ ...formData, position });
  };

  const quickPositionChange = (direction) => {
    const currentPos = parseInt(formData.position) || 1;
    if (direction === 'up' && currentPos > 1) {
      handlePositionChange(currentPos - 1);
    } else if (direction === 'down') {
      handlePositionChange(currentPos + 1);
    }
  };

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormHeader 
          isEditing={!!editingMember} 
          onClose={handleClose} 
        />
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Position Management */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Position Management
              </h4>
              
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <FormField
                  label="Display Position"
                  type="number"
                  value={formData.position}
                  onChange={handlePositionChange}
                  placeholder="1"
                  error={errors.position}
                  required
                  min="1"
                  helpText="1 = First position, 2 = Second, etc."
                />
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => quickPositionChange('up')}
                    disabled={formData.position <= 1}
                    className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Move up one position"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => quickPositionChange('down')}
                    className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    title="Move down one position"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Auto-Adjustment:</p>
                  <p className="text-xs">Others will shift automatically</p>
                </div>
              </div>
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
                maxSize={2 * 1024 * 1024}
                preview={true}
              />
            </div>
            
            {/* Bio */}
            <FormField
              label="Bio/Description"
              type="textarea"
              value={formData.bio}
              onChange={(value) => setFormData({...formData, bio: value})}
              placeholder="Brief description about the member, their background, and contributions..."
              error={errors.bio}
              required
            />
            
            {/* Skills/Expertise */}
            <div>
              <FormField
                label="Expertise/Skills"
                type="text"
                value={formData.expertise.join(', ')}
                onChange={handleExpertiseChange}
                placeholder="Community Development, Public Health, Education"
                helpText="Separate multiple skills with commas"
              />
              
              {formData.expertise.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">Skills Preview:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <SubmitButton 
              onClick={handleSubmit}
              isEditing={!!editingMember}
              loading={saving}
            />
          </div>

          {/* Position Preview - Right Side */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Position Preview</h4>
            
            {positionPreview.length > 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  How positions will look:
                </h5>
                <div className="space-y-2">
                  {positionPreview.map((member, index) => (
                    <div 
                      key={member.id || index}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        member.id === 'preview' || member.id === editingMember?.id
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        member.id === 'preview' || member.id === editingMember?.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {member.position}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          member.id === 'preview' || member.id === editingMember?.id
                            ? 'text-green-800'
                            : 'text-gray-700'
                        }`}>
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                      {(member.id === 'preview' || member.id === editingMember?.id) && (
                        <div className="text-green-600 text-xs font-medium">
                          {editingMember ? 'Updated' : 'New'}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {members.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-2">
                      ... and {members.length - 3} more members
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Enter member details to see position preview
                </p>
              </div>
            )}

            {/* Position Management Help */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h6 className="font-medium text-yellow-800 mb-2">💡 How Position Management Works:</h6>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Position 1 = Displayed first</li>
                <li>• When you set position 1, others shift to 2, 3, 4...</li>
                <li>• No position conflicts - automatic adjustment</li>
                <li>• Lower numbers = higher priority</li>
              </ul>
            </div>

            {/* Current Members Quick Reference */}
            {members.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h6 className="font-medium text-gray-700 mb-2">Current Members:</h6>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {members
                    .sort((a, b) => (a.position || 999) - (b.position || 999))
                    .map((member) => (
                      <div key={member.id} className="flex justify-between text-xs">
                        <span className="truncate">{member.name}</span>
                        <span className="text-gray-500">#{member.position || '?'}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const FormHeader = ({ isEditing, onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl font-bold text-green-800">
      {isEditing ? 'Edit Member' : 'Add New Member'}
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
  helpText,
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
        <span>{isEditing ? 'Update Member' : 'Add Member'}</span>
      </>
    )}
  </button>
);

export default MemberForm;