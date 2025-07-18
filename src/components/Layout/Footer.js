// src/components/Layout/Footer.js
import React from 'react';
import { Heart, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { CONTACT_INFO, NAVIGATION_ITEMS } from '../../utils/constants';

const Footer = ({ setActiveSection }) => {
  return (
    <footer className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
         <div className="lg:col-span-2">
  <div className="flex items-center space-x-4 mb-6">
    {/* Logo inside blurred circle */}
    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
      <img
        src="/logo.jpg"
        alt="Sahayaa Trust Logo"
        className="w-10 h-10 object-cover rounded-full"
      />
    </div>
    <div>
      <h2 className="text-3xl font-bold text-white">Sahayaa Trust</h2>
      <p className="text-green-200">"The one who stands with you"</p>
    </div>
  </div>

  <p className="text-green-100 mb-6 max-w-md leading-relaxed">
    Building a compassionate society where everyone lives with dignity, health, knowledge, and joy. 
    We walk beside people in their most vulnerable and hopeful moments.
  </p>

  <div className="flex space-x-4">
    <SocialLink href={CONTACT_INFO.socialMedia.facebook} icon={Facebook} />
    <SocialLink href={CONTACT_INFO.socialMedia.twitter} icon={Twitter} />
    <SocialLink href={CONTACT_INFO.socialMedia.instagram} icon={Instagram} />
    <SocialLink href={CONTACT_INFO.socialMedia.youtube} icon={Youtube} />
  </div>
</div>

          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => setActiveSection(item.id)}
                    className="text-green-200 hover:text-white transition-colors capitalize"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-green-200">
              <ContactItem 
                icon={MapPin} 
                content={`${CONTACT_INFO.address.line1}, ${CONTACT_INFO.address.line2}`} 
              />
              <ContactItem 
                icon={Mail} 
                content={CONTACT_INFO.emails[0]} 
              />
              <ContactItem 
                icon={Phone} 
                content={CONTACT_INFO.phones[0]} 
              />
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-green-200">
            © {new Date().getFullYear()} Sahayaa Trust. All rights reserved. Made with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

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

const ContactItem = ({ icon: Icon, content }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-4 h-4" />
    <span className="text-sm">{content}</span>
  </div>
);

export default Footer;