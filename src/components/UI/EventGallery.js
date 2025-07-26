// src/components/UI/EventGallery.js - Fixed with proper state propagation
import React, { useState } from 'react';
import { 
  X, Upload, Eye, Trash2, Download, Plus, Image as ImageIcon,
  Calendar, MapPin, Users, Share2
} from 'lucide-react';
import Modal from './Modal';
import MultiImageUpload from './MultiImageUpload';
import { db } from '../../config/supabase';

const EventGallery = ({ event, onClose, onGalleryUpdate, user }) => {
  const [galleryImages, setGalleryImages] = useState(event.gallery_images || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (newImages) => {
    if (!user) return;

    setUploading(true);
    try {
      // Add new images to the gallery
      const updatedImages = [...galleryImages, ...newImages];
      setGalleryImages(updatedImages);
      
      // Update the event in the database
      const { data, error } = await db.updateEventGallery(event.id, updatedImages);
      
      if (error) {
        throw new Error(error);
      }
      
      // Notify parent component about the update
      if (onGalleryUpdate) {
        onGalleryUpdate(event.id, updatedImages);
      }
      
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images: ' + error.message);
      // Revert the local state if database update failed
      setGalleryImages(event.gallery_images || []);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageIndex) => {
    if (!user) return;

    if (window.confirm('Are you sure you want to delete this image?')) {
      const originalImages = [...galleryImages];
      const updatedImages = galleryImages.filter((_, index) => index !== imageIndex);
      setGalleryImages(updatedImages);
      
      try {
        // Update the event in the database
        const { data, error } = await db.updateEventGallery(event.id, updatedImages);
        
        if (error) {
          throw new Error(error);
        }
        
        // Notify parent component about the update
        if (onGalleryUpdate) {
          onGalleryUpdate(event.id, updatedImages);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image: ' + error.message);
        // Revert the local state if database update failed
        setGalleryImages(originalImages);
      }
    }
  };

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${event.title.replace(/\s+/g, '-')}-photo-${index + 1}.jpg`;
    link.click();
  };

  const shareGallery = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} - Photo Gallery`,
          text: `Check out photos from ${event.title} organized by Sahayaa Trust`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <>
      <Modal onClose={onClose}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          <GalleryHeader 
            event={event} 
            onClose={onClose} 
            user={user}
            onUpload={() => setShowUploadModal(true)}
            onShare={shareGallery}
            imageCount={galleryImages.length}
          />
          
          <EventInfo event={event} />
          
          {galleryImages.length > 0 ? (
            <ImageGrid 
              images={galleryImages}
              onImageClick={setSelectedImage}
              onDeleteImage={user ? handleDeleteImage : null}
              onDownloadImage={downloadImage}
            />
          ) : (
            <EmptyGallery user={user} onUpload={() => setShowUploadModal(true)} />
          )}
        </div>
      </Modal>

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal 
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Upload Modal with MultiImageUpload */}
      {showUploadModal && user && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImageUpload}
          uploading={uploading}
        />
      )}
    </>
  );
};

const GalleryHeader = ({ event, onClose, user, onUpload, onShare, imageCount }) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-2xl font-bold text-green-800 mb-2">Event Gallery</h3>
      <h4 className="text-xl text-gray-700">{event.title}</h4>
      <p className="text-gray-500 text-sm">
        {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
      </p>
    </div>
    
    <div className="flex items-center space-x-3">
      {user && (
        <button
          onClick={onUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Photos</span>
        </button>
      )}
      
      {imageCount > 0 && (
        <button
          onClick={onShare}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      )}
      
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  </div>
);

const EventInfo = ({ event }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-6">
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-green-600" />
        <span>{formatDate(event.date)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-green-600" />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-green-600" />
        <span>{event.category}</span>
      </div>
    </div>
  </div>
);

const ImageGrid = ({ images, onImageClick, onDeleteImage, onDownloadImage }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {images.map((image, index) => (
      <ImageCard
        key={index}
        image={image}
        index={index}
        onClick={() => onImageClick(image)}
        onDelete={onDeleteImage ? () => onDeleteImage(index) : null}
        onDownload={() => onDownloadImage(image, index)}
      />
    ))}
  </div>
);

const ImageCard = ({ image, index, onClick, onDelete, onDownload }) => (
  <div className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
    <img
      src={image}
      alt={`Event photo ${index + 1}`}
      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    />
    
    {/* Overlay with actions */}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        title="View full size"
      >
        <Eye className="w-5 h-5" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        title="Download"
      >
        <Download className="w-5 h-5" />
      </button>
      
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
    
    {/* Image number */}
    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
      {index + 1}
    </div>
  </div>
);

const EmptyGallery = ({ user, onUpload }) => (
  <div className="text-center py-20 bg-gray-50 rounded-2xl">
    <ImageIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
    <h3 className="text-xl font-semibold text-gray-700 mb-4">No Photos Yet</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      {user 
        ? "Start building this event's photo gallery by uploading the first images."
        : "Photos from this event will appear here once they're uploaded."
      }
    </p>
    
    {user && (
      <button
        onClick={onUpload}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
      >
        <Upload className="w-5 h-5" />
        <span>Upload Photos</span>
      </button>
    )}
  </div>
);

const ImagePreviewModal = ({ image, onClose }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
    <div className="relative max-w-7xl max-h-full">
      <img
        src={image}
        alt="Event photo"
        className="max-w-full max-h-full object-contain"
      />
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Navigation hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
        Click outside image or × to close
      </div>
    </div>
  </div>
);

// Upload Modal using MultiImageUpload
const UploadModal = ({ onClose, onUpload, uploading }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleUpload = () => {
    if (selectedImages.length > 0) {
      onUpload(selectedImages);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-800">Upload Event Photos</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Multi-Image Upload Component */}
          <MultiImageUpload
            label="Select Multiple Event Photos"
            values={selectedImages}
            onChange={setSelectedImages}
            acceptedTypes="image/*"
            maxSize={10 * 1024 * 1024} // 10MB per file
            maxFiles={20} // Up to 20 images at once
            preview={true}
          />

          {/* Upload Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">📸 Upload Guidelines:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select multiple photos: Hold <kbd className="bg-blue-200 px-1 rounded">Ctrl</kbd> (Windows) or <kbd className="bg-blue-200 px-1 rounded">Cmd</kbd> (Mac) while clicking</li>
              <li>• Drag & drop: Drop multiple files directly onto the upload area</li>
              <li>• File size: Up to 10MB per image</li>
              <li>• Formats: JPG, PNG, GIF, WebP supported</li>
              <li>• Quality: High-resolution images work best for galleries</li>
              <li>• Limit: Maximum 20 images per upload session</li>
              <li>• Permission: Ensure you have rights to share these photos</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            
            <button
              onClick={handleUpload}
              disabled={selectedImages.length === 0 || uploading}
              className="flex-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading {selectedImages.length} photos...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>
                    Upload {selectedImages.length} {selectedImages.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Upload Progress Info */}
          {uploading && selectedImages.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-green-700 font-medium">
                  Processing {selectedImages.length} images... Please wait.
                </span>
              </div>
              <p className="text-green-600 text-sm mt-2">
                ✨ Your photos will appear in the gallery immediately after upload!
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default EventGallery;