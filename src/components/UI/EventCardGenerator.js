// src/components/UI/EventCardGenerator.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Share2, Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventCardGenerator = ({ event, onClose }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    loadLogo();
  }, []);

  const generateCard = useCallback(async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1080;

    try {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#16a34a');
      gradient.addColorStop(0.6, '#059669');
      gradient.addColorStop(1, '#0d9488');

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

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.roundRect(60, contentY, canvas.width - 120, contentHeight, 20);
      ctx.fill();

      // Logo watermark in background
      if (logoImage && logoImage !== 'fallback') {
        ctx.save();
        ctx.globalAlpha = 0.1;
        const logoSize = 300;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }

      // Header section with logo
      const headerY = contentY + 40;

      if (logoImage && logoImage !== 'fallback') {
        const smallLogoSize = 60;
        const logoX = (canvas.width - smallLogoSize) / 2 - 100;

        ctx.save();
        ctx.beginPath();
        ctx.arc(
          logoX + smallLogoSize / 2,
          headerY + smallLogoSize / 2,
          smallLogoSize / 2,
          0,
          2 * Math.PI
        );
        ctx.clip();
        ctx.drawImage(logoImage, logoX, headerY, smallLogoSize, smallLogoSize);
        ctx.restore();

        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 42px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SAHAYAA TRUST', logoX + smallLogoSize + 20, headerY + 35);
      } else {
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('♥ SAHAYAA TRUST', canvas.width / 2, headerY + 40);
      }

      // Tagline
      ctx.fillStyle = '#059669';
      ctx.font = '28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('"The one who stands with you"', canvas.width / 2, headerY + 90);

      // Event title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.textAlign = 'center';

      const title = event.title;
      const maxWidth = canvas.width - 200;
      const words = title.split(' ');
      let line = '';
      let y = contentY + 220;

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

      // Event details section
      const detailsY = y + 80;
      ctx.font = '36px Arial, sans-serif';
      ctx.fillStyle = '#374151';

      ctx.fillText(`📅 ${formatDate(event.date)}`, canvas.width / 2, detailsY);
      ctx.fillText(`🕐 ${event.time}`, canvas.width / 2, detailsY + 50);

      ctx.font = '32px Arial, sans-serif';
      const location =
        event.location.length > 40
          ? event.location.substring(0, 40) + '...'
          : event.location;
      ctx.fillText(`📍 ${location}`, canvas.width / 2, detailsY + 100);

      // Category badge
      ctx.fillStyle = '#16a34a';
      ctx.roundRect(canvas.width / 2 - 100, detailsY + 140, 200, 50, 25);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText(event.category, canvas.width / 2, detailsY + 175);

      // Registration info
      if (event.registration_required) {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText('⚠️ Registration Required', canvas.width / 2, detailsY + 230);
      }

      // Contact info
      if (event.contact_email) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '28px Arial, sans-serif';
        ctx.fillText(`📧 ${event.contact_email}`, canvas.width / 2, detailsY + 280);
      }

      // Call to action
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(
        'Join us in making a difference!',
        canvas.width / 2,
        contentY + contentHeight - 80
      );

      // Social media handles and hashtags
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText(
        '@SahayaaTrust | #CommunitySupport | #MakeADifference',
        canvas.width / 2,
        contentY + contentHeight - 40
      );

      drawDecorative(ctx, canvas);

      setCardGenerated(true);
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [event, logoImage]);

  useEffect(() => {
    if (event && logoImage) {
      generateCard();
    }
  }, [event, logoImage, generateCard]);

  const loadLogo = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLogoImage(img);
    };
    img.onerror = () => {
      console.warn('Logo failed to load, generating card without logo');
      setLogoImage('fallback');
    };
    img.src = '/logo.jpg';
  };

  const drawDecorative = (ctx, canvas) => {
    const corners = [
      { x: 80, y: 140 },
      { x: canvas.width - 80, y: 140 },
      { x: 80, y: canvas.height - 140 },
      { x: canvas.width - 80, y: canvas.height - 140 },
    ];

    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 4;

    corners.forEach((corner) => {
      ctx.beginPath();
      ctx.moveTo(corner.x - 15, corner.y);
      ctx.lineTo(corner.x + 15, corner.y);
      ctx.moveTo(corner.x, corner.y - 15);
      ctx.lineTo(corner.x, corner.y + 15);
      ctx.stroke();
    });

    ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
    ctx.font = '40px Arial, sans-serif';
    ctx.textAlign = 'center';

    const hearts = [
      { x: 150, y: 200 },
      { x: canvas.width - 150, y: 250 },
      { x: 120, y: canvas.height - 200 },
      { x: canvas.width - 120, y: canvas.height - 180 },
    ];

    hearts.forEach((heart) => {
      ctx.fillText('♥', heart.x, heart.y);
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `sahayaa-${event.title.replace(/\s+/g, '-').toLowerCase()}-invitation.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const shareCard = async () => {
    const canvas = canvasRef.current;

    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `sahayaa-${event.title}-invitation.png`, {
          type: 'image/png',
        });

        try {
          await navigator.share({
            title: `${event.title} - Sahayaa Trust`,
            text: `Join us for ${event.title} on ${formatDate(event.date)}`,
            files: [file],
          });
        } catch (error) {
          console.error('Error sharing:', error);
          downloadCard();
        }
      });
    } else {
      downloadCard();
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
                    <li>• Community bulletin boards</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h6 className="font-medium text-green-800 mb-2">Card Features:</h6>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• High-resolution 1080x1080 format</li>
                <li>• Professional Sahayaa Trust branding</li>
                <li>• Logo watermark for authenticity</li>
                <li>• Social media optimized</li>
                <li>• Eye-catching gradient design</li>
              </ul>
            </div>

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
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
};

export default EventCardGenerator;