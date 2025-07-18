// src/components/Pages/Contact.js
import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube, 
  Heart, Users, FileText, Send 
} from 'lucide-react';
import { CONTACT_INFO } from '../../utils/constants';

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all required fields (Name, Email, and Message)');
      return;
    }
    
    try {
      // Here you would typically save to database or send email
      alert('Thank you for your message! We will get back to you soon.');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    }
  };

  return (
    <div className="space-y-12">
      <PageHeader />
      
      <div className="grid lg:grid-cols-2 gap-12">
        <ContactInfo />
        <ContactForm 
          contactForm={contactForm}
          setContactForm={setContactForm}
          onSubmit={handleContactSubmit}
        />
      </div>
    </div>
  );
};

const PageHeader = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold text-green-800 mb-6">Contact Us</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      We'd love to hear from you. Reach out to us for any questions, collaboration opportunities, 
      or to learn more about how you can get involved with Sahayaa Trust.
    </p>
  </div>
);

const ContactInfo = () => (
  <div className="space-y-8">
    <ContactCard />
    <QuickActions />
  </div>
);

const ContactCard = () => (
  <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-3xl">
    <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
    
    <div className="space-y-6">
      <ContactItem 
        icon={MapPin}
        title="Address"
        content={[
          CONTACT_INFO.address.line1,
          CONTACT_INFO.address.line2,
          CONTACT_INFO.address.line3
        ]}
      />
      
      <ContactItem 
        icon={Mail}
        title="Email"
        content={CONTACT_INFO.emails}
      />
      
      <ContactItem 
        icon={Phone}
        title="Phone"
        content={CONTACT_INFO.phones}
      />
    </div>
    
    <SocialMedia />
  </div>
);

const ContactItem = ({ icon: Icon, title, content }) => (
  <div className="flex items-start space-x-4">
    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <p key={index} className="text-green-100">{item}</p>
        ))
      ) : (
        <p className="text-green-100">{content}</p>
      )}
    </div>
  </div>
);

const SocialMedia = () => (
  <div className="mt-8 pt-8 border-t border-white/20">
    <h3 className="font-semibold mb-4">Follow Us</h3>
    <div className="flex space-x-4">
      <SocialLink href={CONTACT_INFO.socialMedia.facebook} icon={Facebook} />
      <SocialLink href={CONTACT_INFO.socialMedia.twitter} icon={Twitter} />
      <SocialLink href={CONTACT_INFO.socialMedia.instagram} icon={Instagram} />
      <SocialLink href={CONTACT_INFO.socialMedia.youtube} icon={Youtube} />
    </div>
  </div>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="w-5 h-5" />
  </a>
);

const QuickActions = () => (
  <div className="bg-white p-8 rounded-3xl shadow-xl">
    <h3 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h3>
    <div className="space-y-3">
      <ActionButton icon={Heart} text="Become a Volunteer" />
      <ActionButton icon={Users} text="Partner with Us" />
      <ActionButton icon={FileText} text="Download Brochure" />
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, text }) => (
  <button className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-green-600" />
      <span className="font-medium text-green-800">{text}</span>
    </div>
  </button>
);

const ContactForm = ({ contactForm, setContactForm, onSubmit }) => (
  <div className="bg-white p-8 rounded-3xl shadow-xl">
    <h2 className="text-2xl font-bold text-green-800 mb-6">Send us a Message</h2>
    
    <div className="space-y-4">
      <FormRow>
        <FormField
          label="Name"
          type="text"
          value={contactForm.name}
          onChange={(value) => setContactForm({...contactForm, name: value})}
          placeholder="Your full name"
          required
        />
        <FormField
          label="Email"
          type="email"
          value={contactForm.email}
          onChange={(value) => setContactForm({...contactForm, email: value})}
          placeholder="your.email@example.com"
          required
        />
      </FormRow>
      
      <FormRow>
        <FormField
          label="Phone"
          type="tel"
          value={contactForm.phone}
          onChange={(value) => setContactForm({...contactForm, phone: value})}
          placeholder="+91 98765 43210"
        />
        <FormField
          label="Subject"
          type="text"
          value={contactForm.subject}
          onChange={(value) => setContactForm({...contactForm, subject: value})}
          placeholder="Message subject"
        />
      </FormRow>
      
      <FormField
        label="Message"
        type="textarea"
        value={contactForm.message}
        onChange={(value) => setContactForm({...contactForm, message: value})}
        placeholder="Tell us how we can help you or how you'd like to get involved..."
        required
      />
      
      <SubmitButton onClick={onSubmit} />
    </div>
  </div>
);

const FormRow = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {children}
  </div>
);

const FormField = ({ label, type, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder={placeholder}
      />
    )}
  </div>
);

const SubmitButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
  >
    <Send className="w-5 h-5" />
    <span>Send Message</span>
  </button>
);

export default Contact;