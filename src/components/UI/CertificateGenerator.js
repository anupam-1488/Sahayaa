// src/components/UI/CertificateGenerator.js - Simplified Version
import React, { useRef, useEffect, useState } from 'react';
import { Download, Award, Calendar, User, X } from 'lucide-react';

const CertificateGenerator = ({ volunteer, onClose }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(() => {
    loadLogo();
  }, []);

  useEffect(() => {
    if (volunteer) {
      generateCertificate();
    }
  }, [volunteer, logoImage]);

  const loadLogo = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setLogoImage(img);
      setLogoLoadError(false);
    };
    
    img.onerror = () => {
      setLogoLoadError(true);
      setLogoImage('fallback');
    };
    
    img.src = '/logo.jpg';
  };

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 1400;
    canvas.height = 990;

    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#fafafa');
      bgGradient.addColorStop(0.5, '#ffffff');
      bgGradient.addColorStop(1, '#fafafa');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Professional border
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4;
      ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
      
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Content area
      const contentY = 110;
      const contentHeight = canvas.height - 220;
      
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      roundRect(ctx, 70, contentY, canvas.width - 140, contentHeight, 15);
      ctx.fill();
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Logo watermark
      if (logoImage && logoImage !== 'fallback') {
        ctx.save();
        ctx.globalAlpha = 0.05;
        const logoSize = 400;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;
        
        ctx.beginPath();
        ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }

      // Header section
      const headerY = contentY + 50;
      
      if (logoImage && logoImage !== 'fallback') {
        const smallLogoSize = 85;
        const orgTextWidth = 320;
        const totalWidth = smallLogoSize + 20 + orgTextWidth;
        const startX = (canvas.width - totalWidth) / 2;
        const logoX = startX;
        const textX = startX + smallLogoSize + 20;
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.beginPath();
        ctx.arc(logoX + smallLogoSize/2, headerY + smallLogoSize/2, smallLogoSize/2 + 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(logoX + smallLogoSize/2, headerY + smallLogoSize/2, smallLogoSize/2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(logoImage, logoX, headerY, smallLogoSize, smallLogoSize);
        ctx.restore();
        
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 46px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('SAHAYAA TRUST', textX, headerY + smallLogoSize/2);
      } else {
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 50px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SAHAYAA TRUST', canvas.width / 2, headerY + 40);
      }

      ctx.textBaseline = 'alphabetic';

      // Tagline
      ctx.fillStyle = '#059669';
      ctx.font = 'italic 26px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('"The one who stands with you"', canvas.width / 2, headerY + 110);

      // Separator line
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, headerY + 130);
      ctx.lineTo(canvas.width / 2 + 120, headerY + 130);
      ctx.stroke();

      // Certificate header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF APPRECIATION', canvas.width / 2, headerY + 170);

      // Decorative underline
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 180, headerY + 185);
      ctx.lineTo(canvas.width / 2 + 180, headerY + 185);
      ctx.stroke();

      // Main content
      ctx.fillStyle = '#374151';
      ctx.font = '26px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('This is to certify that', canvas.width / 2, headerY + 230);

      // Volunteer name
      const nameY = headerY + 280;
      ctx.font = 'bold 38px "Times New Roman", serif';
      const nameText = volunteer.name.toUpperCase();
      const nameMetrics = ctx.measureText(nameText);
      const nameWidth = nameMetrics.width;
      
      ctx.fillStyle = '#f0fdf4';
      roundRect(ctx, (canvas.width - nameWidth - 50) / 2, nameY - 30, nameWidth + 50, 60, 8);
      ctx.fill();
      
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.fillText(nameText, canvas.width / 2, nameY);

      // Volunteer ID
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px "Arial", sans-serif';
      ctx.fillText(`Volunteer ID: ${volunteer.volunteer_id}`, canvas.width / 2, nameY + 30);

      // Recognition text - SIMPLIFIED
      ctx.fillStyle = '#374151';
      ctx.font = '22px "Times New Roman", serif';
      ctx.fillText('has been a dedicated volunteer with Sahayaa Trust', canvas.width / 2, headerY + 360);
      ctx.fillText('contributing to our mission of building a compassionate society', canvas.width / 2, headerY + 390);
      
      // Service details - SIMPLE
      ctx.font = 'bold 24px "Times New Roman", serif';
      ctx.fillStyle = '#16a34a';
      
      const eventsText = volunteer.events_participated > 0 
        ? `${volunteer.events_participated} ${volunteer.events_participated === 1 ? 'Event' : 'Events'}`
        : 'Community Service';
      
      const hoursText = volunteer.total_hours > 0 
        ? `${volunteer.total_hours} ${volunteer.total_hours === 1 ? 'Hour' : 'Hours'}`
        : 'Volunteer Service';

      if (volunteer.events_participated > 0 && volunteer.total_hours > 0) {
        ctx.fillText(`Service Record: ${eventsText} • ${hoursText}`, canvas.width / 2, headerY + 430);
      } else if (volunteer.events_participated > 0) {
        ctx.fillText(`Service Record: ${eventsText}`, canvas.width / 2, headerY + 430);
      } else if (volunteer.total_hours > 0) {
        ctx.fillText(`Service Record: ${hoursText}`, canvas.width / 2, headerY + 430);
      } else {
        ctx.fillText('Dedicated Community Service', canvas.width / 2, headerY + 430);
      }

      // Appreciation message
      const appreciationY = headerY + 480;
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      roundRect(ctx, 160, appreciationY, canvas.width - 320, 70, 10);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#059669';
      ctx.font = 'italic 20px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('We sincerely appreciate your selfless service and dedication', canvas.width / 2, appreciationY + 25);
      ctx.fillText('to making a positive difference in our community', canvas.width / 2, appreciationY + 50);

      // Signature section
      const signatureY = contentY + contentHeight - 120;
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      ctx.fillStyle = '#374151';
      ctx.font = '15px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Date of Issue: ${currentDate}`, 110, signatureY - 15);

      ctx.fillStyle = '#fafafa';
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      roundRect(ctx, 90, signatureY, canvas.width - 180, 90, 8);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      const signatureSpacing = (canvas.width - 180) / 2;
      const leftSigX = 90 + signatureSpacing / 2;
      const rightSigX = 90 + signatureSpacing + (signatureSpacing / 2);
      const sigLineY = signatureY + 45;
      const lineLength = 120;
      
      ctx.beginPath();
      ctx.moveTo(leftSigX - lineLength/2, sigLineY);
      ctx.lineTo(leftSigX + lineLength/2, sigLineY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(rightSigX - lineLength/2, sigLineY);
      ctx.lineTo(rightSigX + lineLength/2, sigLineY);
      ctx.stroke();
      
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px "Arial", sans-serif';
      ctx.fillStyle = '#374151';
      
      ctx.fillText('Program Director', leftSigX, sigLineY + 18);
      ctx.fillText('Sahayaa Trust', leftSigX, sigLineY + 32);

      ctx.fillText('Founder & CEO', rightSigX, sigLineY + 18);
      ctx.fillText('Sahayaa Trust', rightSigX, sigLineY + 32);

      // Certificate verification
      const certNumber = `SAHAYAA-${volunteer.volunteer_id}-${Date.now().toString().slice(-6)}`;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Certificate No: ${certNumber}`, canvas.width - 100, canvas.height - 30);
      ctx.fillText(`Issued: ${new Date().toISOString().split('T')[0]}`, canvas.width - 100, canvas.height - 18);

      drawProfessionalCorners(ctx, canvas);

      setCertificateGenerated(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawProfessionalCorners = (ctx, canvas) => {
    const cornerSize = 25;
    const offset = 70;
    
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(offset, offset + cornerSize);
    ctx.lineTo(offset, offset);
    ctx.lineTo(offset + cornerSize, offset);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(canvas.width - offset - cornerSize, offset);
    ctx.lineTo(canvas.width - offset, offset);
    ctx.lineTo(canvas.width - offset, offset + cornerSize);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(offset, canvas.height - offset - cornerSize);
    ctx.lineTo(offset, canvas.height - offset);
    ctx.lineTo(offset + cornerSize, canvas.height - offset);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(canvas.width - offset - cornerSize, canvas.height - offset);
    ctx.lineTo(canvas.width - offset, canvas.height - offset);
    ctx.lineTo(canvas.width - offset, canvas.height - offset - cornerSize);
    ctx.stroke();
    
    ctx.lineCap = 'butt';
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `sahayaa-volunteer-certificate-${volunteer.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-800">Generate Volunteer Certificate</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Certificate Preview</h4>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full h-auto border rounded-lg shadow-lg bg-white"
                style={{ aspectRatio: '1400/990' }}
              />
            </div>
            
            {isGenerating && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Generating certificate...</span>
              </div>
            )}
            
            {logoLoadError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-700 text-sm">
                  ⚠️ Logo not found. Certificate generated without logo.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Certificate Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-medium">{volunteer.name}</span>
                    <p className="text-sm text-gray-600">ID: {volunteer.volunteer_id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm">
                      {volunteer.events_participated > 0 
                        ? `${volunteer.events_participated} events participated`
                        : 'Community service volunteer'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm">
                      {volunteer.total_hours > 0 
                        ? `${volunteer.total_hours} hours of service`
                        : 'Dedicated volunteer service'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {certificateGenerated && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-700">Download Certificate</h5>
                <button
                  onClick={downloadCertificate}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Certificate</span>
                </button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h6 className="font-medium text-blue-800 mb-2">✨ Certificate Features:</h6>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• High-resolution PNG format</li>
                    <li>• Professional Sahayaa Trust branding</li>
                    <li>• Events and hours clearly displayed</li>
                    <li>• Perfect for sharing and printing</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={generateCertificate}
                disabled={isGenerating}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Regenerate Certificate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

export default CertificateGenerator;