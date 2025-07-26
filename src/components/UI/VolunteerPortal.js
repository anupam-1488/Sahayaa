// src/components/UI/VolunteerPortal.js
import React, { useState } from 'react';
import { 
  X, Mail, Search, Award, Calendar, Clock, MapPin, 
  Download, User, Phone, Briefcase, Star 
} from 'lucide-react';
import Modal from './Modal';
import CertificateGenerator from './CertificateGenerator';

const VolunteerPortal = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState(null);

  const handleLookup = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real implementation, this would call your Supabase function
      // For now, we'll simulate with sample data
      const mockData = await getMockVolunteerData(email);
      
      if (mockData) {
        setVolunteerData(mockData);
      } else {
        setError('No volunteer record found with this email address. Please check your email or contact the administrator.');
      }
    } catch (err) {
      setError('Error looking up volunteer information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = (participation) => {
    setSelectedParticipation(participation);
    setShowCertificate(true);
  };

  const handleClose = () => {
    setEmail('');
    setVolunteerData(null);
    setError('');
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <Modal onClose={handleClose}>
        <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-green-800">Volunteer Portal</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!volunteerData ? (
            <EmailLookup 
              email={email}
              setEmail={setEmail}
              onLookup={handleLookup}
              loading={loading}
              error={error}
            />
          ) : (
            <VolunteerDashboard 
              data={volunteerData}
              onGenerateCertificate={generateCertificate}
              onBack={() => {
                setVolunteerData(null);
                setEmail('');
              }}
            />
          )}
        </div>
      </Modal>

      {showCertificate && selectedParticipation && (
        <CertificateGenerator
          volunteer={volunteerData.volunteer_info}
          participation={selectedParticipation}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
};

const EmailLookup = ({ email, setEmail, onLookup, loading, error }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-10 h-10 text-green-600" />
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">Access Your Volunteer Profile</h4>
      <p className="text-gray-600 max-w-md mx-auto">
        Enter the email address you used when registering as a volunteer to view your 
        participation history and download certificates.
      </p>
    </div>

    <div className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onLookup()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="your.email@example.com"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={onLookup}
        disabled={loading || !email.trim()}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Looking up...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Access Portal</span>
          </>
        )}
      </button>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
      <h5 className="font-medium text-blue-800 mb-2">Need Help?</h5>
      <p className="text-sm text-blue-700">
        If you can't find your volunteer record, please contact us at{' '}
        <a href="mailto:volunteers@sahayaa.org" className="underline">
          volunteers@sahayaa.org
        </a>
      </p>
    </div>
  </div>
);

const VolunteerDashboard = ({ data, onGenerateCertificate, onBack }) => (
  <div className="space-y-8">
    <VolunteerHeader volunteer={data.volunteer_info} onBack={onBack} />
    <VolunteerOverview 
      volunteer={data.volunteer_info}
      totalEvents={data.total_events}
      totalHours={data.total_hours}
    />
    <ParticipationHistory 
      participations={data.participations}
      onGenerateCertificate={onGenerateCertificate}
    />
  </div>
);

const VolunteerHeader = ({ volunteer, onBack }) => (
  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          {volunteer.profile_image ? (
            <img 
              src={volunteer.profile_image} 
              alt={volunteer.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{volunteer.name}</h3>
          <p className="text-green-100">ID: {volunteer.volunteer_id}</p>
          <p className="text-green-100">Member since: {formatDate(volunteer.joining_date)}</p>
        </div>
      </div>
      <button
        onClick={onBack}
        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
      >
        ← Back
      </button>
    </div>
  </div>
);

const VolunteerOverview = ({ volunteer, totalEvents, totalHours }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    <OverviewCard
      icon={Award}
      value={totalEvents}
      label="Events Participated"
      color="blue"
    />
    <OverviewCard
      icon={Clock}
      value={`${totalHours}h`}
      label="Total Hours"
      color="green"
    />
    <OverviewCard
      icon={Calendar}
      value={formatDate(volunteer.joining_date)}
      label="Joined"
      color="purple"
    />
    <OverviewCard
      icon={Star}
      value={volunteer.status}
      label="Status"
      color="orange"
    />
  </div>
);

const OverviewCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

const ParticipationHistory = ({ participations, onGenerateCertificate }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="p-6 border-b border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800">Participation History</h4>
      <p className="text-gray-600 text-sm">Your volunteer activities and contributions</p>
    </div>
    
    <div className="p-6">
      {participations && participations.length > 0 ? (
        <div className="space-y-4">
          {participations.map((participation, index) => (
            <ParticipationCard
              key={index}
              participation={participation}
              onGenerateCertificate={onGenerateCertificate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No participation history found.</p>
          <p className="text-gray-400 text-sm">Your future volunteer activities will appear here.</p>
        </div>
      )}
    </div>
  </div>
);

const ParticipationCard = ({ participation, onGenerateCertificate }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h5 className="font-semibold text-gray-800">{participation.event_title}</h5>
        <div className="space-y-1 text-sm text-gray-600 mt-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(participation.event_date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{participation.event_location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{participation.hours_contributed} hours contributed</span>
          </div>
          {participation.role && (
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Role: {participation.role}</span>
            </div>
          )}
        </div>
        
        {participation.feedback && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Your feedback:</strong> {participation.feedback}
            </p>
          </div>
        )}
      </div>
      
      <div className="ml-4">
        <button
          onClick={() => onGenerateCertificate(participation)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Certificate</span>
        </button>
        
        {participation.certificate_download_count > 0 && (
          <p className="text-xs text-gray-500 mt-1 text-center">
            Downloaded {participation.certificate_download_count} times
          </p>
        )}
      </div>
    </div>
  </div>
);

// Mock function to simulate database lookup
const getMockVolunteerData = async (email) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
  const mockVolunteers = {
    'arjun.patel@email.com': {
      volunteer_info: {
        id: 1,
        name: 'Arjun Patel',
        email: 'arjun.patel@email.com',
        volunteer_id: 'VOL000001',
        joining_date: '2024-01-15',
        status: 'active',
        profile_image: null,
        occupation: 'Software Engineer'
      },
      participations: [
        {
          id: 1,
          event_title: 'Community Health Camp',
          event_date: '2024-07-15',
          event_location: 'Community Center, Sector 12',
          participation_date: '2024-07-15',
          hours_contributed: 8,
          role: 'Event Coordinator',
          feedback: 'Great experience organizing the health camp. Learned a lot about community outreach.',
          certificate_generated: true,
          certificate_download_count: 2
        },
        {
          id: 2,
          event_title: 'Digital Literacy Workshop',
          event_date: '2024-06-20',
          event_location: 'Sahayaa Trust Training Center',
          participation_date: '2024-06-20',
          hours_contributed: 6,
          role: 'Instructor',
          feedback: 'Enjoyed teaching computer skills to senior citizens.',
          certificate_generated: true,
          certificate_download_count: 1
        }
      ],
      total_events: 2,
      total_hours: 14
    }
  };
  
  return mockVolunteers[email.toLowerCase()] || null;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default VolunteerPortal;