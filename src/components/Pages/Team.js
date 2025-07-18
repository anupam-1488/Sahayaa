// src/components/Pages/Team.js
import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, User, Mail, Phone, MessageCircle } from 'lucide-react';
import MemberForm from '../Forms/MemberForm';
import TestimonialForm from '../Forms/TestimonialForm';

const Team = ({ 
  members = [], 
  setMembers, 
  testimonials = [], 
  setTestimonials,
  user,
  onMemberCreate,
  onMemberUpdate,
  onMemberDelete,
  onTestimonialCreate,
  onTestimonialUpdate,
  onTestimonialDelete
}) => {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      if (onMemberDelete) {
        const result = await onMemberDelete(id);
        if (!result.success) {
          alert('Failed to delete member: ' + result.error);
        }
      } else {
        // Fallback to local state
        setMembers(members.filter(member => member.id !== id));
      }
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      if (onTestimonialDelete) {
        const result = await onTestimonialDelete(id);
        if (!result.success) {
          alert('Failed to delete testimonial: ' + result.error);
        }
      } else {
        // Fallback to local state
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      }
    }
  };

  const startEditMember = (member) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  const startEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowTestimonialForm(true);
  };

  return (
    <div className="space-y-12">
      <PageHeader />
      
      {user && <AdminSection 
        setShowMemberForm={setShowMemberForm}
        setShowTestimonialForm={setShowTestimonialForm}
      />}
      
      <TeamMembers 
        members={members}
        user={user}
        onEdit={startEditMember}
        onDelete={handleDeleteMember}
      />

      {/* Forms */}
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

      <TestimonialForm
        show={showTestimonialForm}
        setShow={setShowTestimonialForm}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        editingTestimonial={editingTestimonial}
        setEditingTestimonial={setEditingTestimonial}
        onTestimonialCreate={onTestimonialCreate}
        onTestimonialUpdate={onTestimonialUpdate}
      />
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Our Team</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Meet the passionate individuals working together to create positive change in our community. 
      Each team member brings unique skills and dedication to our mission.
    </p>
  </div>
);

const AdminSection = ({ setShowMemberForm, setShowTestimonialForm }) => (
  <div className="flex justify-center space-x-4">
    <AdminButton 
      onClick={() => setShowMemberForm(true)}
      icon={Plus}
      className="bg-green-600 hover:bg-green-700"
    >
      Add Team Member
    </AdminButton>
    <AdminButton 
      onClick={() => setShowTestimonialForm(true)}
      icon={MessageCircle}
      className="bg-emerald-600 hover:bg-emerald-700"
    >
      Add Testimonial
    </AdminButton>
  </div>
);

const AdminButton = ({ onClick, icon: Icon, children, className }) => (
  <button
    onClick={onClick}
    className={`text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 shadow-lg ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </button>
);

const TeamMembers = ({ members, user, onEdit, onDelete }) => {
  if (members.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
    <Users className="w-20 h-20 text-green-300 mx-auto mb-6" />
    <h3 className="text-2xl font-semibold text-green-800 mb-4">Building Our Team</h3>
    <p className="text-green-600 max-w-md mx-auto">
      We're in the process of assembling our dedicated team. 
      Team member profiles will be featured here soon.
    </p>
  </div>
);

const MemberCard = ({ member, user, onEdit, onDelete }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <MemberImage member={member} />
    <MemberContent member={member} user={user} onEdit={onEdit} onDelete={onDelete} />
  </div>
);

const MemberImage = ({ member }) => (
  <div className="h-64 bg-gradient-to-br from-green-400 to-emerald-500 relative overflow-hidden">
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
    
    <ContactInfo member={member} />
    
    <p className="text-gray-700 text-sm leading-relaxed mb-4">{member.bio}</p>
    
    <ExpertiseList expertise={member.expertise} />
    
    {user && <MemberAdminActions member={member} onEdit={onEdit} onDelete={onDelete} />}
  </div>
);

const ContactInfo = ({ member }) => (
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
    />
    <ActionButton
      onClick={() => onDelete(member.id)}
      className="text-red-600 hover:text-red-800 hover:bg-red-50"
      icon={Trash2}
    />
  </div>
);

const ActionButton = ({ onClick, className, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${className}`}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default Team;