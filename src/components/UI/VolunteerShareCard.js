// src/components/UI/VolunteerShareCard.js - Final Polished Version
import React, { useRef, useState } from 'react';
import { X, Download, Heart, Users, Star, Award } from 'lucide-react';
import Modal from './Modal';

const VolunteerShareCard = ({ volunteer, onClose }) => {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  const downloadCard = async () => {
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      const link = document.createElement('a');
      link.download = `sahayaa-volunteer-${volunteer.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Error generating card. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">🌟 Volunteer Card</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Final Polished WhatsApp Status Card */}
        <div 
          ref={cardRef}
          className="w-full aspect-square relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"
          style={{ width: '420px', height: '420px', margin: '0 auto' }}
        >
          {/* Subtle Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 bg-white/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-12 w-16 h-16 bg-white/8 rounded-full blur-xl"></div>

          {/* Main Content Container */}
          <div className="relative z-10 h-full flex flex-col p-8 text-white">
            
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <img
                    src="/logo.jpg"
                    alt="Sahayaa Trust"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-wide">SAHAYAA</h3>
                  <p className="text-sm opacity-90 font-semibold -mt-1">TRUST</p>
                </div>
              </div>
              <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-black flex items-center space-x-1 shadow-lg">
                <Star className="w-4 h-4" />
                <span>VOLUNTEER</span>
              </div>
            </div>

            {/* Volunteer Section - Centered */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              
              {/* Profile Photo with Enhanced Badge */}
              <div className="relative mb-6">
                {volunteer.profile_image ? (
                  <img
                    src={volunteer.profile_image}
                    alt={volunteer.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/40 shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/40 shadow-2xl flex items-center justify-center">
                    <Users className="w-14 h-14 text-white/80" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-2 shadow-xl border-2 border-white/30">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Name */}
              <h1 className="text-2xl font-black mb-3 tracking-wide leading-tight px-2">{volunteer.name}</h1>
              
              {/* Role Badge */}
              <div className="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
                <p className="text-sm font-bold">Community Volunteer</p>
              </div>

              {/* Stats Display */}
              <div className="flex justify-center items-center space-x-10 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-black leading-none">{volunteer.events_participated || 0}</div>
                  <div className="text-xs font-bold opacity-90 mt-1 tracking-wider">EVENTS</div>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-black leading-none">{volunteer.total_hours || 0}H</div>
                  <div className="text-xs font-bold opacity-90 mt-1 tracking-wider">SERVICE</div>
                </div>
              </div>

              {/* Impact Message */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                <p className="text-base font-bold mb-1">Making a Difference</p>
                <p className="text-sm font-semibold opacity-90">Building Tomorrow Together</p>
              </div>
            </div>

            {/* Footer Tagline */}
            <div className="text-center mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 border border-white/20">
                <Heart className="w-3 h-3 text-red-300" />
                <span className="text-xs font-semibold tracking-wide">"The one who stands with you"</span>
                <Heart className="w-3 h-3 text-red-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="space-y-3 mt-4">
          <button
            onClick={downloadCard}
            disabled={generating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 font-bold text-lg shadow-lg"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download</span>
              </>
            )}
          </button>

          {/* Tips */}
         
        </div>
      </div>
    </Modal>
  );
};

export default VolunteerShareCard;