// src/utils/constants.js
import { BookOpen, Stethoscope, Heart, Utensils, Shield, Smile, Home } from 'lucide-react';

export const SAHAYAA_VALUES = [
  { 
    letter: 'S', 
    word: 'Shiksha', 
    meaning: 'Education (శిక్షణ)', 
    description: 'Access to meaningful education and life skills', 
    icon: BookOpen,
    details: 'We provide educational support, scholarships, tutoring, and skill development programs for children and adults.'
  },
  { 
    letter: 'A', 
    word: 'Aarogyam', 
    meaning: 'Health and well-being (ఆరోగ్యం)', 
    description: 'Physical and emotional health through awareness and care', 
    icon: Stethoscope,
    details: 'Health camps, medical assistance, mental health support, and wellness programs for communities.'
  },
  { 
    letter: 'H', 
    word: 'Hitam', 
    meaning: 'Welfare / What is good (హితం)', 
    description: 'Uplifting people through welfare and social support', 
    icon: Heart,
    details: 'Social welfare programs, community development initiatives, and support for vulnerable populations.'
  },
  { 
    letter: 'A', 
    word: 'Aaharam', 
    meaning: 'Food / Nutrition (ఆహారం)', 
    description: 'Ensuring food security and nutritional support', 
    icon: Utensils,
    details: 'Nutrition programs, food distribution, cooking training, and addressing malnutrition in communities.'
  },
  { 
    letter: 'Y', 
    word: 'Yogakshemam', 
    meaning: 'Holistic welfare / Prosperity (యోగక్షేమం)', 
    description: 'Enabling safety, stability, and long-term well-being', 
    icon: Shield,
    details: 'Financial literacy, livelihood programs, safety initiatives, and long-term community prosperity.'
  },
  { 
    letter: 'A', 
    word: 'Aanandam', 
    meaning: 'Joy / Happiness (ఆనందం)', 
    description: 'Fostering environments of happiness, creativity, and hope', 
    icon: Smile,
    details: 'Cultural programs, recreational activities, arts and crafts, and creating joyful community spaces.'
  },
  { 
    letter: 'A', 
    word: 'Āśrayam', 
    meaning: 'Shelter / Support (ఆశ్రయం)', 
    description: 'Providing shelter and emotional anchoring in times of distress', 
    icon: Home,
    details: 'Emergency shelter, rehabilitation support, counseling services, and crisis intervention.'
  }
];

export const CORE_VALUES = [
  { 
    title: 'Compassion', 
    desc: 'We listen, we care, and we act with kindness in every interaction.',
    icon: Heart
  },
  { 
    title: 'Dignity for All', 
    desc: 'Every person, regardless of age, gender, or background, deserves respect and equality.',
    icon: 'Users'
  },
  { 
    title: 'Simplicity with Depth', 
    desc: 'We choose simple, meaningful solutions that bring lasting change.',
    icon: 'Target'
  },
  { 
    title: 'Community First', 
    desc: 'Our efforts are rooted in local voice, culture, and wisdom.',
    icon: 'Globe'
  },
  { 
    title: 'Integrity', 
    desc: 'We stay accountable and transparent in all our work and relationships.',
    icon: 'CheckCircle'
  },
  { 
    title: 'Sustainability', 
    desc: 'We plant seeds for long-term impact, not just short-term relief.',
    icon: 'TrendingUp'
  }
];

export const EVENT_CATEGORIES = [
  'Education',
  'Health',
  'Welfare',
  'Nutrition',
  'Community',
  'Support',
  'Workshop',
  'Fundraiser'
];

export const CONTACT_INFO = {
  address: {
    line1: 'Sahayaa Trust',
    line2: 'Hyderabad, Telangana',
    line3: 'India'
  },
  emails: ['contact@sahayaa.org', 'info@sahayaa.org'],
  phones: ['+91 98765 43210', '+91 87654 32109'],
  socialMedia: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    youtube: '#'
  }
};

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'events', label: 'Events' },
  { id: 'contact', label: 'Contact' }
];

export const DEFAULT_STATS = {
  peopleHelped: 2500,
  eventsCompleted: 150,
  volunteers: 45,
  yearsOfService: 5
};