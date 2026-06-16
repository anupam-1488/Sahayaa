// src/components/Forms/MemberForm.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Save, ArrowUp, ArrowDown, Users } from 'lucide-react';
import Modal from '../UI/Modal';
import ImageUpload from '../UI/ImageUpload';

const initialFormData = {
  name: '',
  role: '',
  position: 1,
  bio: '',
  image: '',
  email: '',
  phone: '',
  expertise: [],
};

// Always extract a plain string from any error shape Supabase returns
const extractErrorMessage = (error) => {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    return error.message || error.details || error.hint || JSON.stringify(error);
  }
  return String(error);
};

const MemberForm = ({
  show,
  setShow,
  members = [],
  setMembers,
  editingMember,
  setEditingMember,
  onMemberCreate,
  onMemberUpdate,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [positionPreview, setPositionPreview] = useState([]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setPositionPreview([]);
  }, []);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        ...initialFormData,
        ...editingMember,
        position: editingMember.position || 1,
        expertise: editingMember.expertise || [],
      });
    } else {
      resetForm();
    }
  }, [editingMember, resetForm]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updatePositionPreview = useCallback(() => {
    if (!formData.name.trim()) {
      setPositionPreview([]);
      return;
    }

    const newPosition = Math.max(1, parseInt(formData.position, 10) || 1);
    const isEditing = Boolean(editingMember);
    const currentMemberId = editingMember?.id;

    let previewMembers = [...members];

    if (isEditing) {
      previewMembers = previewMembers.filter((member) => member.id !== currentMemberId);
    }

    const previewMember = {
      ...formData,
      id: currentMemberId || 'preview',
      position: newPosition,
    };

    const shiftedMembers = previewMembers.map((member) => {
      const memberPosition = member.position || 999;
      if (memberPosition >= newPosition) {
        return { ...member, position: memberPosition + 1 };
      }
      return member;
    });

    const finalPreview = [...shiftedMembers, previewMember].sort(
      (a, b) => (a.position || 999) - (b.position || 999)
    );

    setPositionPreview(finalPreview.slice(0, 5));
  }, [formData, members, editingMember]);

  useEffect(() => {
    updatePositionPreview();
  }, [updatePositionPreview]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    const position = parseInt(formData.position, 10);
    if (!position || position < 1) {
      newErrors.position = 'Position must be a positive number starting from 1';
    }
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const adjustPositionsForCreate = (currentMembers, newMember) => {
    const newPosition = Math.max(1, newMember.position || 1);
    const adjustedMembers = currentMembers.map((member) => {
      const memberPosition = member.position || 999;
      if (memberPosition >= newPosition) {
        return { ...member, position: memberPosition + 1 };
      }
      return member;
    });
    const memberWithId = { ...newMember, id: Date.now(), position: newPosition };
    return [...adjustedMembers, memberWithId].sort(
      (a, b) => (a.position || 999) - (b.position || 999)
    );
  };

  const adjustPositionsForUpdate = (currentMembers, memberId, updatedMember) => {
    const oldMember = currentMembers.find((member) => member.id === memberId);
    if (!oldMember) return currentMembers;
    const oldPosition = oldMember.position || 999;
    const newPosition = Math.max(1, updatedMember.position || 1);
    if (oldPosition === newPosition) {
      return currentMembers.map((member) =>
        member.id === memberId
          ? { ...updatedMember, id: memberId, position: newPosition }
          : member
      );
    }
    const updatedMembers = currentMembers.map((member) => {
      if (member.id === memberId) {
        return { ...updatedMember, id: memberId, position: newPosition };
      }
      const memberPosition = member.position || 999;
      if (newPosition < oldPosition) {
        if (memberPosition >= newPosition && memberPosition < oldPosition) {
          return { ...member, position: memberPosition + 1 };
        }
      } else {
        if (memberPosition > oldPosition && memberPosition <= newPosition) {
          return { ...member, position: memberPosition - 1 };
        }
      }
      return member;
    });
    return updatedMembers.sort((a, b) => (a.position || 999) - (b.position || 999));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const processedData = {
        ...formData,
        position: Math.max(1, parseInt(formData.position, 10) || 1),
      };

      let result;

      if (editingMember) {
        if (onMemberUpdate) {
          result = await onMemberUpdate(editingMember.id, processedData);
        } else {
          const updatedMembers = adjustPositionsForUpdate(members, editingMember.id, processedData);
          setMembers(updatedMembers);
          result = { success: true };
        }
        setEditingMember(null);
      } else {
        if (onMemberCreate) {
          result = await onMemberCreate(processedData);
        } else {
          const updatedMembers = adjustPositionsForCreate(members, processedData);
          setMembers(updatedMembers);
          result = { success: true };
        }
      }

      if (result?.success) {
        handleClose();
      } else {
        // extractErrorMessage ensures we never render a raw object as JSX
        setErrors({
          submit: extractErrorMessage(result?.error) || 'Failed to save member',
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      setErrors({
        submit: extractErrorMessage(error) || 'Failed to save member',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingMember(null);
    resetForm();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpertiseChange = (value) => {
    const expertiseArray = value
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    handleChange('expertise', expertiseArray);
  };

  const handleImageChange = (base64Image) => {
    handleChange('image', base64Image);
  };

  const handlePositionChange = (value) => {
    const position = Math.max(1, parseInt(value, 10) || 1);
    handleChange('position', position);
  };

  const quickPositionChange = (direction) => {
    const currentPos = parseInt(formData.position, 10) || 1;
    if (direction === 'up' && currentPos > 1) handlePositionChange(currentPos - 1);
    if (direction === 'down') handlePositionChange(currentPos + 1);
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => (a.position || 999) - (b.position || 999));
  }, [members]);

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <FormHeader isEditing={!!editingMember} onClose={handleClose} />

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                placeholder="Enter full name"
                error={errors.name}
                required
              />
              <FormField
                label="Role/Position"
                type="text"
                value={formData.role}
                onChange={(value) => handleChange('role', value)}
                placeholder="e.g., Program Director"
                error={errors.role}
                required
              />
            </div>

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

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange('email', value)}
                placeholder="email@example.com"
                error={errors.email}
              />
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleChange('phone', value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <ImageUpload
                label="Profile Image"
                value={formData.image}
                onChange={handleImageChange}
                acceptedTypes="image/*"
                maxSize={2 * 1024 * 1024}
                preview
              />
            </div>

            <FormField
              label="Bio/Description"
              type="textarea"
              value={formData.bio}
              onChange={(value) => handleChange('bio', value)}
              placeholder="Brief description about the member, their background, and contributions..."
              error={errors.bio}
              required
            />

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

            <SubmitButton onClick={handleSubmit} isEditing={!!editingMember} loading={saving} />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Position Preview</h4>

            {positionPreview.length > 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  How positions will look:
                </h5>
                <div className="space-y-2">
                  {positionPreview.map((member, index) => {
                    const isPreviewMember =
                      member.id === 'preview' || member.id === editingMember?.id;
                    return (
                      <div
                        key={member.id || index}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          isPreviewMember
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPreviewMember
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {member.position}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isPreviewMember ? 'text-green-800' : 'text-gray-700'
                            }`}
                          >
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{member.role}</p>
                        </div>
                        {isPreviewMember && (
                          <div className="text-green-600 text-xs font-medium">
                            {editingMember ? 'Updated' : 'New'}
                          </div>
                        )}
                      </div>
                    );
                  })}
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h6 className="font-medium text-yellow-800 mb-2">
                How Position Management Works:
              </h6>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>Position 1 = Displayed first</li>
                <li>When you set position 1, others shift to 2, 3, 4...</li>
                <li>No position conflicts - automatic adjustment</li>
                <li>Lower numbers = higher priority</li>
              </ul>
            </div>

            {sortedMembers.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h6 className="font-medium text-gray-700 mb-2">Current Members:</h6>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {sortedMembers.map((member) => (
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
      type="button"
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);

const FormField = ({ label, type, value, onChange, placeholder, error, required, helpText, min }) => (
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
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    {helpText && <p className="text-gray-500 text-xs mt-1">{helpText}</p>}
  </div>
);

const SubmitButton = ({ onClick, isEditing, loading }) => (
  <button
    type="button"
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