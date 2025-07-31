// src/components/Pages/Volunteers.js - Complete Updated File with Simple Share Card
import React, { useState } from 'react';
import { 
  Users, Plus, Edit3, Trash2, User, Mail, Phone, Calendar, 
  Award, Clock, Download, Search, Filter, MapPin, Briefcase,
  Shield, Eye, EyeOff, Share2
} from 'lucide-react';
import VolunteerForm from '../Forms/VolunteerForm';
import VolunteerPortal from '../UI/VolunteerPortal';
import CertificateGenerator from '../UI/CertificateGenerator';
import VolunteerShareCard from '../UI/VolunteerShareCard';

const Volunteers = ({ 
  volunteers = [], 
  setVolunteers, 
  user,
  onVolunteerCreate,
  onVolunteerUpdate,
  onVolunteerDelete
}) => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [showVolunteerPortal, setShowVolunteerPortal] = useState(false);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedVolunteerForShare, setSelectedVolunteerForShare] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  const handleDeleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      if (onVolunteerDelete) {
        const result = await onVolunteerDelete(id);
        if (!result.success) {
          alert('Failed to delete volunteer: ' + result.error);
        }
      } else {
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
      }
    }
  };

  const startEditVolunteer = (volunteer) => {
    setEditingVolunteer(volunteer);
    setShowVolunteerForm(true);
  };

  const generateCertificate = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowCertificateGenerator(true);
  };

  const generateShareCard = (volunteer) => {
    setSelectedVolunteerForShare(volunteer);
    setShowShareCard(true);
  };

  const openVolunteerPortal = () => {
    setShowVolunteerPortal(true);
  };

  // Get unique skills for filter - only visible to admin
  const allSkills = user ? [...new Set(volunteers.flatMap(v => v.skills || []))] : [];

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter(volunteer => {
    if (!user) {
      return true;
    }
    
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.occupation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !filterSkill || (volunteer.skills && volunteer.skills.includes(filterSkill));
    const matchesAvailability = !filterAvailability || volunteer.availability === filterAvailability;
    
    return matchesSearch && matchesSkill && matchesAvailability;
  });

  return (
    <div className="space-y-12">
      <PageHeader />
      
      {user && <AdminSection setShowVolunteerForm={setShowVolunteerForm} />}
      
      {/* Search and Filters - Only for Admin */}
      {user && (
        <SearchAndFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterSkill={filterSkill}
          setFilterSkill={setFilterSkill}
          filterAvailability={filterAvailability}
          setFilterAvailability={setFilterAvailability}
          allSkills={allSkills}
        />
      )}
      
      {/* Volunteer Statistics */}
      <VolunteerOverviewStats volunteers={volunteers} />
      
      <VolunteerList 
        volunteers={filteredVolunteers}
        user={user}
        onEdit={startEditVolunteer}
        onDelete={handleDeleteVolunteer}
        onGenerateCertificate={generateCertificate}
        onGenerateShareCard={generateShareCard}
      />

      {/* Forms and Modals */}
      {user && (
        <VolunteerForm
          show={showVolunteerForm}
          setShow={setShowVolunteerForm}
          volunteers={volunteers}
          setVolunteers={setVolunteers}
          editingVolunteer={editingVolunteer}
          setEditingVolunteer={setEditingVolunteer}
          onVolunteerCreate={onVolunteerCreate}
          onVolunteerUpdate={onVolunteerUpdate}
        />
      )}

      <VolunteerPortal
        show={showVolunteerPortal}
        onClose={() => setShowVolunteerPortal(false)}
      />

      {showCertificateGenerator && selectedVolunteer && user && (
        <CertificateGenerator
          volunteer={selectedVolunteer}
          onClose={() => setShowCertificateGenerator(false)}
        />
      )}

      {showShareCard && selectedVolunteerForShare && (
        <VolunteerShareCard
          volunteer={selectedVolunteerForShare}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Our Volunteers</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Meet the incredible individuals who dedicate their time and skills to make a positive impact 
      in our community. Our volunteers are the heart of Sahayaa Trust's mission.
    </p>
  </div>
);

const AdminSection = ({ setShowVolunteerForm }) => (
  <div className="flex justify-center">
    <button
      onClick={() => setShowVolunteerForm(true)}
      className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-3 shadow-lg text-lg"
    >
      <Plus className="w-6 h-6" />
      <span>Add New Volunteer</span>
    </button>
  </div>
);

const SearchAndFilters = ({ 
  searchTerm, setSearchTerm, filterSkill, setFilterSkill, 
  filterAvailability, setFilterAvailability, allSkills 
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <div className="flex items-center mb-4">
      <Shield className="w-5 h-5 text-blue-600 mr-2" />
      <h3 className="text-lg font-semibold text-gray-800">Admin Search & Filters</h3>
    </div>
    
    <div className="grid md:grid-cols-4 gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search volunteers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Skill Filter */}
      <div className="relative">
        <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Skills</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div className="relative">
        <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Availability</option>
          <option value="weekends">Weekends</option>
          <option value="weekdays">Weekdays</option>
          <option value="flexible">Flexible</option>
          <option value="evenings">Evenings</option>
          <option value="mornings">Mornings</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSearchTerm('');
          setFilterSkill('');
          setFilterAvailability('');
        }}
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

const VolunteerOverviewStats = ({ volunteers }) => {
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const totalHours = volunteers.reduce((sum, v) => sum + (v.total_hours || 0), 0);
  const totalEvents = volunteers.reduce((sum, v) => sum + (v.events_participated || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard 
        icon={Users}
        value={totalVolunteers}
        label="Total Volunteers"
        color="blue"
      />
      <StatCard 
        icon={Award}
        value={activeVolunteers}
        label="Active Volunteers"
        color="green"
      />
      <StatCard 
        icon={Clock}
        value={`${totalHours}h`}
        label="Total Hours"
        color="purple"
      />
      <StatCard 
        icon={Calendar}
        value={totalEvents}
        label="Events Participated"
        color="orange"
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const VolunteerList = ({ volunteers, user, onEdit, onDelete, onGenerateCertificate, onGenerateShareCard }) => {
  if (volunteers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">
          {user ? 'All Volunteers' : 'Our Volunteer Community'}
        </h2>
        {user && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Admin View - Full Access</span>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            volunteer={volunteer}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onGenerateCertificate={onGenerateCertificate}
            onGenerateShareCard={onGenerateShareCard}
          />
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
    <Users className="w-20 h-20 text-green-300 mx-auto mb-6" />
    <h3 className="text-2xl font-semibold text-green-800 mb-4">No Volunteers Found</h3>
    <p className="text-green-600 max-w-md mx-auto">
      We're building our amazing volunteer community. 
      Volunteer profiles will be featured here soon.
    </p>
  </div>
);

const VolunteerCard = ({ volunteer, user, onEdit, onDelete, onGenerateCertificate, onGenerateShareCard }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <VolunteerImage volunteer={volunteer} user={user} />
    <VolunteerContent 
      volunteer={volunteer} 
      user={user} 
      onEdit={onEdit} 
      onDelete={onDelete}
      onGenerateCertificate={onGenerateCertificate}
      onGenerateShareCard={onGenerateShareCard}
    />
  </div>
);

const VolunteerImage = ({ volunteer, user }) => (
  <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 relative overflow-hidden">
    {volunteer.profile_image ? (
      <img src={volunteer.profile_image} alt={volunteer.name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>
    )}
    
    <div className="absolute top-4 right-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        volunteer.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {volunteer.status}
      </span>
    </div>
    
    {/* Privacy overlay for non-admin users */}
    {!user && (
      <div className="absolute top-4 left-4">
        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Privacy Protected</span>
        </div>
      </div>
    )}
  </div>
);

const VolunteerContent = ({ volunteer, user, onEdit, onDelete, onGenerateCertificate, onGenerateShareCard }) => (
  <div className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-green-800">{volunteer.name}</h3>
        {user && <p className="text-green-600 font-medium">{volunteer.volunteer_id}</p>}
      </div>
      {user && <VolunteerAdminActions volunteer={volunteer} onEdit={onEdit} onDelete={onDelete} />}
    </div>
    
    <VolunteerInfo volunteer={volunteer} user={user} />
    <VolunteerCardStats volunteer={volunteer} />
    <SkillsList skills={volunteer.skills} />
    
    {user ? (
      <AdminVolunteerActions volunteer={volunteer} onGenerateCertificate={onGenerateCertificate} onGenerateShareCard={onGenerateShareCard} />
    ) : (
      <PublicVolunteerActions volunteer={volunteer} onGenerateShareCard={onGenerateShareCard} />
    )}
  </div>
);

const VolunteerAdminActions = ({ volunteer, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <ActionButton
      onClick={() => onEdit(volunteer)}
      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      icon={Edit3}
      title="Edit Volunteer"
    />
    <ActionButton
      onClick={() => onDelete(volunteer.id)}
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      icon={Trash2}
      title="Delete Volunteer"
    />
  </div>
);

const ActionButton = ({ onClick, className, icon: Icon, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${className}`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const VolunteerInfo = ({ volunteer, user }) => (
  <div className="space-y-2 text-sm text-gray-600 mb-4">
    {user && volunteer.occupation && (
      <div className="flex items-center space-x-2">
        <Briefcase className="w-4 h-4" />
        <span>{volunteer.occupation}</span>
      </div>
    )}
    
    {volunteer.availability && (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4" />
        <span>Available: {volunteer.availability}</span>
      </div>
    )}
    
    {user ? (
      <>
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span className="truncate">{volunteer.email}</span>
        </div>
        {volunteer.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{volunteer.phone}</span>
          </div>
        )}
      </>
    ) : (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 text-sm">Contact details protected for privacy</span>
        </div>
      </div>
    )}
  </div>
);

const VolunteerCardStats = ({ volunteer }) => (
  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="text-lg font-bold text-green-600">{volunteer.events_participated || 0}</div>
      <div className="text-xs text-gray-600">Events</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-blue-600">{volunteer.total_hours || 0}h</div>
      <div className="text-xs text-gray-600">Hours</div>
    </div>
  </div>
);

const SkillsList = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {skills.slice(0, 3).map((skill, index) => (
        <span 
          key={index} 
          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
        >
          {skill}
        </span>
      ))}
      {skills.length > 3 && (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
          +{skills.length - 3} more
        </span>
      )}
    </div>
  );
};

const AdminVolunteerActions = ({ volunteer, onGenerateCertificate, onGenerateShareCard }) => (
  <div className="space-y-2">
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onGenerateCertificate(volunteer)}
        className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
      >
        <Download className="w-3 h-3" />
        <span>Certificate</span>
      </button>
      
      <button
        onClick={() => onGenerateShareCard(volunteer)}
        className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1 text-sm"
      >
        <Share2 className="w-3 h-3" />
        <span>Share Card</span>
      </button>
    </div>
    
    {volunteer.bio && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 line-clamp-2">
          {volunteer.bio}
        </p>
      </div>
    )}
  </div>
);

const PublicVolunteerActions = ({ volunteer, onGenerateShareCard }) => (
  <div className="space-y-2">
    {/* Share Card Button - Available to everyone */}
    <button
      onClick={() => onGenerateShareCard(volunteer)}
      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 text-sm"
    >
      <Share2 className="w-4 h-4" />
      <span>Share Volunteer Card</span>
    </button>
    
    {/* Show full bio to ALL users */}
    {volunteer.bio && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">About</h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          {volunteer.bio}
        </p>
      </div>
    )}
  </div>
);

export default Volunteers;