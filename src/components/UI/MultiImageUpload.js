// src/components/UI/MultiImageUpload.js
import React, { useState, useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';

const MultiImageUpload = ({ 
  values = [], 
  onChange, 
  label = "Upload Images", 
  acceptedTypes = "image/*",
  maxSize = 5 * 1024 * 1024, 
  maxFiles = 10, 
  preview = true,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name}: Please select a valid image file`);
    }

    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`${file.name}: File size must be less than ${sizeMB}MB`);
    }

    return true;
  };

  const handleFilesSelect = async (files) => {
    setError('');
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      
      if (values.length + fileArray.length > maxFiles) {
        throw new Error(`You can only upload a maximum of ${maxFiles} images. You currently have ${values.length} images.`);
      }

      fileArray.forEach(file => validateFile(file));

      const base64Promises = fileArray.map(file => convertToBase64(file));
      const base64Results = await Promise.all(base64Promises);

      const updatedImages = [...values, ...base64Results];
      onChange(updatedImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = (index) => {
    const updatedImages = values.filter((_, i) => i !== index);
    onChange(updatedImages);
    setError('');
  };

  const removeAllImages = () => {
    onChange([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = values.length < maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {label} ({values.length}/{maxFiles})
          </label>
          {values.length > 0 && (
            <button
              type="button"
              onClick={removeAllImages}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove All
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading || !canAddMore}
      />

      {values.length > 0 && preview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {values.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
          
          {canAddMore && (
            <div
              onClick={openFileDialog}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Add More</p>
              </div>
            </div>
          )}
        </div>
      )}

      {(values.length === 0 || canAddMore) && (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${dragActive 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
            ${!canAddMore ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {values.length === 0 
                    ? 'Click to upload or drag and drop multiple images'
                    : `Add more images (${maxFiles - values.length} remaining)`
                  }
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to {(maxSize / (1024 * 1024)).toFixed(1)}MB each
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <X className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• You can select multiple images at once (Ctrl/Cmd + click)</p>
        <p>• Drag and drop multiple files supported</p>
        <p>• Maximum {maxFiles} images, {(maxSize / (1024 * 1024)).toFixed(1)}MB each</p>
        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
      </div>
    </div>
  );
};

export default MultiImageUpload;