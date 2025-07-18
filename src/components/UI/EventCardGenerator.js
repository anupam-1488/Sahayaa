// src/components/UI/EventCardGenerator.js
import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventCardGenerator = ({ event, onClose }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);

  useEffect(() => {
    if (event) {
      generateCard();
    }
  }, [event]);

  const generateCard = async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size (Instagram post size: 1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    try {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#16a34a'); // Green-600
      gradient.addColorStop(0.6, '#059669'); // Emerald-600
      gradient.addColorStop(1, '#0d9488'); // Teal-600
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * 54, j * 54, 27, 27);
          }
        }
      }

      // Main content area
      const contentY = 120;
      const contentHeight = canvas.height - 240;
      
      // White content background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.roundRect(60, contentY, canvas.width - 120, contentHeight, 20);
      ctx.fill();

      // Sahayaa Trust Logo/Header
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♥ SAHAYAA TRUST', canvas.width / 2, contentY + 80);

      ctx.fillStyle = '#059669';
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText('"The one who stands with you"', canvas.width / 2, contentY + 120);

      // Event title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.textAlign = 'center';
      
      // Wrap long titles
      const title = event.title;
      const maxWidth = canvas.width - 200;
      const words = title.split(' ');
      let line = '';
      let y = contentY + 200;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 60;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Event details
      const detailsY = y + 100;
      ctx.font = '36px Arial, sans-serif';
      ctx.fillStyle = '#374151';

      // Date
      ctx.fillText(`📅 ${formatDate(event.date)}`, canvas.width / 2, detailsY);
      
      // Time
      ctx.fillText(`🕐 ${event.time}`, canvas.width / 2, detailsY + 50);
      
      // Location
      ctx.font = '32px Arial, sans-serif';
      const location = event.location.length > 40 ? event.location.substring(0, 40) + '...' : event.location;
      ctx.fillText(`📍 ${location}`, canvas.width / 2, detailsY + 100);

      // Category badge
      ctx.fillStyle = '#16a34a';
      ctx.roundRect(canvas.width / 2 - 100, detailsY + 140, 200, 50, 25);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText(event.category, canvas.width / 2, detailsY + 175);

      // Registration info
      if (event.registrationRequired) {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText('⚠️ Registration Required', canvas.width / 2, detailsY + 230);
      }

      // Contact info
      if (event.contactEmail) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '28px Arial, sans-serif';
        ctx.fillText(`📧 ${event.contactEmail}`, canvas.width / 2, detailsY + 280);
      }

      // Footer
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText('Join us in making a difference!', canvas.width / 2, contentY + contentHeight - 60);

      // Social media handle (placeholder)
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('@SahayaaTrust | #CommunitySupport | #MakeADifference', canvas.width / 2, contentY + contentHeight - 20);

      setCardGenerated(true);
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setIsGenerating(false);
    }
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

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `sahayaa-${event.title.replace(/\s+/g, '-').toLowerCase()}-invitation.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareCard = async () => {
    const canvas = canvasRef.current;
    
    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `sahayaa-${event.title}-invitation.png`, {
          type: 'image/png'
        });
        
        try {
          await navigator.share({
            title: `${event.title} - Sahayaa Trust`,
            text: `Join us for ${event.title} on ${formatDate(event.date)}`,
            files: [file]
          });
        } catch (error) {
          console.error('Error sharing:', error);
          downloadCard(); // Fallback to download
        }
      });
    } else {
      downloadCard(); // Fallback to download
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-800">Event Invitation Card</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Canvas Preview */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Preview</h4>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-w-md mx-auto border rounded-lg shadow-lg"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            
            {isGenerating && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Generating card...</span>
              </div>
            )}
          </div>

          {/* Event Details & Actions */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
                {event.capacity && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {cardGenerated && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-700">Share Your Event</h5>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={downloadCard}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                  </button>
                  
                  <button
                    onClick={shareCard}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h6 className="font-medium text-blue-800 mb-2">Perfect for:</h6>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Instagram & Facebook posts</li>
                    <li>• WhatsApp group sharing</li>
                    <li>• Print materials</li>
                    <li>• Email announcements</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Regenerate Option */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={generateCard}
                disabled={isGenerating}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Regenerate Card'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for rounded rectangles in canvas
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
};

export default EventCardGenerator;