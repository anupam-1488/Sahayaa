// src/utils/constants.js - Updated with Correct SAHAYAA Full Form
import { 
  Heart, Users, Target, Globe, CheckCircle, TrendingUp,
  Activity, Award, Shield, Lightbulb, Link, Sparkles,
  Building, BookOpen, Home, Utensils, Smile
} from 'lucide-react';

// Navigation Items - Updated with Members
export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Team' },
  { id: 'members', label: 'Members' },
  { id: 'events', label: 'Events' },
  { id: 'volunteers', label: 'Volunteers' },
  { id: 'contact', label: 'Contact' }
];

// SAHAYAA Values - Updated with Correct Telugu/Sanskrit Meanings
export const SAHAYAA_VALUES = [
  {
    letter: 'S',
    word: 'Shiksha',
    meaning: 'Education (శిక్ష)',
    description: 'Access to meaningful education and life skills',
    details: 'We believe education is the foundation of empowerment. Through formal education support, skill development programs, and life skills training, we help individuals build knowledge that transforms lives and communities.',
    icon: BookOpen
  },
  {
    letter: 'A',
    word: 'Aarogyam',
    meaning: 'Health and well-being (ఆరోగ్యం)',
    description: 'Physical and emotional health through awareness and care',
    details: 'Comprehensive healthcare initiatives including medical camps, health awareness programs, mental health support, and preventive care ensure holistic well-being for all community members.',
    icon: Activity
  },
  {
    letter: 'H',
    word: 'Hitam',
    meaning: 'Welfare / What is good (హితం)',
    description: 'Uplifting people through welfare and social support',
    details: 'Focused on the greater good, our welfare programs address immediate needs while building long-term solutions for community development and social justice.',
    icon: Heart
  },
  {
    letter: 'A',
    word: 'Aaharam',
    meaning: 'Food / Nutrition (ఆహారం)',
    description: 'Ensuring food security and nutritional support',
    details: 'From emergency food relief to nutrition education and sustainable food programs, we work to eliminate hunger and malnutrition in our communities.',
    icon: Utensils
  },
  {
    letter: 'Y',
    word: 'Yogakshemam',
    meaning: 'Holistic welfare / Prosperity (యోగక్షేమం)',
    description: 'Enabling safety, stability, and long-term well-being',
    details: 'Comprehensive welfare that encompasses physical, mental, social, and economic prosperity, ensuring sustainable development and security for individuals and families.',
    icon: Shield
  },
  {
    letter: 'A',
    word: 'Aanandam',
    meaning: 'Joy / Happiness (ఆనందం)',
    description: 'Fostering environments of happiness, creativity, and hope',
    details: 'Creating spaces and opportunities for joy, celebration, and emotional well-being through cultural programs, recreational activities, and community bonding initiatives.',
    icon: Smile
  },
  {
    letter: 'A',
    word: 'Aśrayam',
    meaning: 'Shelter / Support (ఆశ్రయం)',
    description: 'Providing shelter and emotional anchoring in times of distress',
    details: 'Offering physical shelter, emotional support, and a safe haven for those in need, ensuring no one faces life\'s challenges alone.',
    icon: Home
  }
];

// Core Values
export const CORE_VALUES = [
  {
    title: 'Compassion',
    desc: 'We approach every situation with empathy and understanding, treating each person with dignity and respect.',
    icon: Heart
  },
  {
    title: 'Community First',
    desc: 'Our decisions are guided by what benefits the community as a whole, fostering unity and collective growth.',
    icon: Users
  },
  {
    title: 'Integrity',
    desc: 'We maintain transparency in all our operations and stay true to our mission and values.',
    icon: Shield
  },
  {
    title: 'Excellence',
    desc: 'We strive for quality in every program and initiative, continuously improving our impact.',
    icon: Target
  },
  {
    title: 'Sustainability',
    desc: 'We create long-term solutions that empower communities to become self-sufficient and resilient.',
    icon: Globe
  },
  {
    title: 'Innovation',
    desc: 'We embrace new ideas and approaches to address evolving community needs effectively.',
    icon: TrendingUp
  }
];

// Contact Information
export const CONTACT_INFO = {
  address: {
    line1: 'Sahayaa Trust Office',
    line2: 'Community Service Center',
    line3: 'Hyderabad, Telangana, India'
  },
  emails: [
    'info@sahayaa.org',
    'contact@sahayaa.org',
    'volunteers@sahayaa.org'
  ],
  phones: [
    '+91 98765 43210',
    '+91 87654 32109'
  ],
  socialMedia: {
    facebook: 'https://facebook.com/sahayaatrust',
    twitter: 'https://twitter.com/sahayaatrust',
    instagram: 'https://instagram.com/sahayaatrust',
    youtube: 'https://youtube.com/@sahayaatrust'
  }
};

// Default Statistics
export const DEFAULT_STATS = {
  peopleHelped: 5000,
  eventsCompleted: 150,
  volunteers: 250,
  yearsOfService: 5
};

// Event Categories
export const EVENT_CATEGORIES = [
  'Education',
  'Health & Wellness',
  'Community Development',
  'Environmental',
  'Youth Programs',
  'Women Empowerment',
  'Senior Care',
  'Emergency Relief',
  'Skill Development',
  'Cultural',
  'Sports & Recreation',
  'Awareness Campaign'
];

// Volunteer Availability Options
export const VOLUNTEER_AVAILABILITY = [
  'Weekends Only',
  'Weekdays Only', 
  'Flexible',
  'Evenings',
  'Mornings'
];

// Member/Team Roles (for consistency)
export const ORGANIZATION_ROLES = [
  'Founder & CEO',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Program Director',
  'Operations Manager',
  'Community Outreach Coordinator',
  'Volunteer Coordinator',
  'Finance Manager',
  'Marketing Manager',
  'Board Member',
  'Advisory Board Member',
  'Senior Program Officer',
  'Field Coordinator',
  'Administrative Assistant'
];

// Common Skills/Expertise Areas
export const COMMON_SKILLS = [
  'Community Development',
  'Public Health',
  'Education & Training',
  'Project Management',
  'Social Work',
  'Healthcare',
  'Teaching',
  'Event Management',
  'Digital Marketing',
  'Fundraising',
  'Grant Writing',
  'Financial Management',
  'Legal Advocacy',
  'Counseling',
  'Research & Analysis',
  'Technology',
  'Communications',
  'Leadership Development',
  'Volunteer Management',
  'Strategic Planning'
];

export default {
  NAVIGATION_ITEMS,
  SAHAYAA_VALUES,
  CORE_VALUES,
  CONTACT_INFO,
  DEFAULT_STATS,
  EVENT_CATEGORIES,
  VOLUNTEER_AVAILABILITY,
  ORGANIZATION_ROLES,
  COMMON_SKILLS
};