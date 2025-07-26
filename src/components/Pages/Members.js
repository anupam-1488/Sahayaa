// src/components/Pages/Members.js - Updated with Privacy Protection
import React, { useState } from 'react';
import { 
  Users, Plus, Edit3, Trash2, User, Mail, Phone, Crown, 
  Calendar, Award, Building, UserCheck, Shield, Eye
} from 'lucide-react';
import MemberForm from '../Forms/MemberForm';

const Members = ({ 
  members = [], 
  setMembers, 
  user,
  onMemberCreate,
  onMemberUpdate,
  onMemberDelete
}) => {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [filterRole, setFilterRole] = useState('');

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization member?')) {
      if (onMemberDelete) {
        const result = await onMemberDelete(id);
        if (!result.success) {
          alert('Failed to delete member: ' + result.error);
        }
      } else {
        setMembers(members.filter(member => member.id !== id));
      }
    }
  };

  const startEditMember = (member) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  // Sort members by position (ascending order)
  const sortedMembers = [...members].sort((a, b) => {
    const positionA = a.position || 999;
    const positionB = b.position || 999;
    return positionA - positionB;
  });

  // Filter members by role if selected
  const filteredMembers = filterRole 
    ? sortedMembers.filter(member => 
        member.role.toLowerCase().includes(filterRole.toLowerCase())
      )
    : sortedMembers;

  // Get unique roles for filtering
  const uniqueRoles = [...new Set(members.map(member => member.role))].filter(Boolean);

  return (
    <div className="space-y-12">
      <PageHeader />
      
      {/* Privacy Notice for non-admin users */}
      {/* {!user && <PrivacyNotice />} */}
      
      {user && <AdminSection setShowMemberForm={setShowMemberForm} />}
      
      {/* Member Statistics */}
      <MemberStats members={members} />
      
      {/* Filter Section */}
      {uniqueRoles.length > 0 && (
        <FilterSection 
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          uniqueRoles={uniqueRoles}
          user={user}
        />
      )}
      
      <OrganizationMembers 
        members={filteredMembers}
        user={user}
        onEdit={startEditMember}
        onDelete={handleDeleteMember}
      />

      {/* Member Form - Only for Admin */}
      {user && (
        <MemberForm
          show={showMemberForm}
          setShow={setShowMemberForm}
          members={members}
          setMembers={setMembers}
          editingMember={editingMember}
          setEditingMember={setEditingMember}
          onMemberCreate={onMemberCreate}
          onMemberUpdate={onMemberUpdate}
        />
      )}
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Organization Members</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Meet the dedicated members of Sahayaa Trust who work tirelessly to fulfill our mission 
      of building a compassionate society. Each member plays a vital role in our organization's success.
    </p>
  </div>
);

// const PrivacyNotice = () => (
//   <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
//     <div className="flex items-start space-x-3">
//       <Shield className="w-6 h-6 text-blue-600 mt-1" />
//       <div>
//         <h3 className="text-lg font-semibold text-blue-800 mb-2">Privacy Protected</h3>
//         <p className="text-blue-700 text-sm leading-relaxed">
//           To protect our organization members' privacy, personal contact information is not publicly displayed. 
//           For official communication or inquiries about our organization structure, please use our official 
//           contact details available in the Contact section.
//         </p>
//       </div>
//     </div>
//   </div>
// );

const AdminSection = ({ setShowMemberForm }) => (
  <div className="flex justify-center">
    <button
      onClick={() => setShowMemberForm(true)}
      className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-3 shadow-lg text-lg"
    >
      <Plus className="w-6 h-6" />
      <span>Add Organization Member</span>
    </button>
  </div>
);

const MemberStats = ({ members }) => {
  const totalMembers = members.length;
  const executiveMembers = members.filter(member => 
    member.role && (
      member.role.toLowerCase().includes('director') || 
      member.role.toLowerCase().includes('president') ||
      member.role.toLowerCase().includes('founder') ||
      member.role.toLowerCase().includes('ceo')
    )
  ).length;
  
  const boardMembers = members.filter(member => 
    member.role && member.role.toLowerCase().includes('board')
  ).length;
  
  const activeMembers = members.filter(member => 
    member.status === 'active' || !member.status
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard 
        icon={Users}
        value={totalMembers}
        label="Total Members"
        color="blue"
      />
      <StatCard 
        icon={Crown}
        value={executiveMembers}
        label="Executive Team"
        color="purple"
      />
      <StatCard 
        icon={Building}
        value={boardMembers}
        label="Board Members"
        color="green"
      />
      <StatCard 
        icon={UserCheck}
        value={activeMembers}
        label="Active Members"
        color="orange"
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const FilterSection = ({ filterRole, setFilterRole, uniqueRoles, user }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <div className="flex items-center space-x-4">
      <h3 className="text-lg font-semibold text-gray-800">Filter by Role:</h3>
      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="">All Roles</option>
        {uniqueRoles.map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      {filterRole && (
        <button
          onClick={() => setFilterRole('')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Clear Filter
        </button>
      )}
      {user && (
        <div className="flex items-center space-x-2 ml-auto">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Admin View - Full Access</span>
        </div>
      )}
    </div>
  </div>
);

const OrganizationMembers = ({ members, user, onEdit, onDelete }) => {
  if (members.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Admin Position Info */}
      {/* {user && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">🎯 Organization Hierarchy:</h4>
          <p className="text-sm text-green-700">
            Members are displayed based on their position number (1 = highest position). 
            Edit any member to change their hierarchy position within the organization.
          </p>
        </div>
      )} */}

      {/* Public View Info */}
      {/* {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Public View</h4>
          </div>
          <p className="text-sm text-blue-700">
            Personal contact information is protected for privacy. Organization structure and 
            member roles are displayed for transparency while maintaining individual privacy.
          </p>
        </div>
      )} */}

      {/* Executive Leadership Section */}
      <ExecutiveSection members={members} user={user} onEdit={onEdit} onDelete={onDelete} />
      
      {/* All Members Grid */}
      <AllMembersSection members={members} user={user} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

const ExecutiveSection = ({ members, user, onEdit, onDelete }) => {
  const executiveMembers = members.filter(member => 
    member.role && (
      member.role.toLowerCase().includes('founder') ||
      member.role.toLowerCase().includes('president') ||
      member.role.toLowerCase().includes('director') ||
      member.role.toLowerCase().includes('ceo')
    )
  ).slice(0, 3);

  if (executiveMembers.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Crown className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-green-800">Executive Leadership</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {executiveMembers.map((member, index) => (
          <ExecutiveMemberCard
            key={member.id}
            member={member}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

const AllMembersSection = ({ members, user, onEdit, onDelete }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Users className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-3xl font-bold text-green-800">All Organization Members</h2>
        <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {members.length}
        </span>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <MemberCard
          key={member.id}
          member={member}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          displayIndex={index + 1}
        />
      ))}
    </div>
  </div>
);

const ExecutiveMemberCard = ({ member, user, onEdit, onDelete, rank }) => (
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative border-2 border-purple-200">
    {/* Executive Rank Badge */}
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
        <Crown className="w-4 h-4" />
        <span>#{rank}</span>
      </div>
    </div>
    
    {/* Privacy indicator for non-admin */}
    {!user && (
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Privacy Protected</span>
        </div>
      </div>
    )}
    
    <MemberImage member={member} isExecutive={true} />
    <div className="p-8">
      <h3 className="text-2xl font-bold text-purple-800 mb-2">{member.name}</h3>
      <p className="text-purple-600 font-semibold mb-1">{member.role}</p>
      
      <ContactInfo member={member} user={user} />
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{member.bio}</p>
      
      <ExpertiseList expertise={member.expertise} />
      
      {user && <MemberAdminActions member={member} onEdit={onEdit} onDelete={onDelete} />}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
    <Building className="w-20 h-20 text-green-300 mx-auto mb-6" />
    <h3 className="text-2xl font-semibold text-green-800 mb-4">Building Our Organization</h3>
    <p className="text-green-600 max-w-md mx-auto">
      We're establishing our organizational structure. 
      Member profiles will be featured here as we grow.
    </p>
  </div>
);

const MemberCard = ({ member, user, onEdit, onDelete, displayIndex }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative">
    {/* Admin position indicator */}
    {user && (
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <span>#{displayIndex}</span>
          <span className="text-green-200">({member.position || 'No pos.'})</span>
        </div>
      </div>
    )}
    
    {/* Privacy indicator for non-admin */}
    {!user && (
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Privacy Protected</span>
        </div>
      </div>
    )}
    
    <MemberImage member={member} />
    <MemberContent member={member} user={user} onEdit={onEdit} onDelete={onDelete} />
  </div>
);

const MemberImage = ({ member, isExecutive = false }) => (
  <div className={`h-64 relative overflow-hidden ${
    isExecutive 
      ? 'bg-gradient-to-br from-purple-400 to-indigo-500' 
      : 'bg-gradient-to-br from-green-400 to-emerald-500'
  }`}>
    {member.image ? (
      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <User className="w-12 h-12 text-white" />
        </div>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
  </div>
);

const MemberContent = ({ member, user, onEdit, onDelete }) => (
  <div className="p-8">
    <h3 className="text-2xl font-bold text-green-800 mb-2">{member.name}</h3>
    <p className="text-green-600 font-semibold mb-1">{member.role}</p>
    
    <ContactInfo member={member} user={user} />
    
    <p className="text-gray-700 text-sm leading-relaxed mb-4">{member.bio}</p>
    
    <ExpertiseList expertise={member.expertise} />
    
    {user && <MemberAdminActions member={member} onEdit={onEdit} onDelete={onDelete} />}
  </div>
);

const ContactInfo = ({ member, user }) => {
  if (user) {
    // Admin view - show contact information
    return (
      <>
        {member.email && (
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Mail className="w-4 h-4 mr-2" />
            <span>{member.email}</span>
          </div>
        )}
        
        {member.phone && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Phone className="w-4 h-4 mr-2" />
            <span>{member.phone}</span>
          </div>
        )}
      </>
    );
  } else {
    // Public view - show privacy protection
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 text-sm">Contact details protected for privacy</span>
        </div>
        <p className="text-blue-600 text-xs mt-1">
          Use official organization contact for communication
        </p>
      </div>
    );
  }
};

const ExpertiseList = ({ expertise }) => {
  if (!expertise || expertise.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {expertise.map((skill, index) => (
        <span 
          key={index} 
          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

const MemberAdminActions = ({ member, onEdit, onDelete }) => (
  <div className="flex space-x-2 pt-4 border-t border-gray-100">
    <ActionButton
      onClick={() => onEdit(member)}
      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      icon={Edit3}
      title="Edit Member"
    />
    <ActionButton
      onClick={() => onDelete(member.id)}
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      icon={Trash2}
      title="Delete Member"
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

export default Members;