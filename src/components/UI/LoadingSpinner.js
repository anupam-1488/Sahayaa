// src/components/UI/LoadingSpinner.js - Reusable Loading Component
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
    <p className="text-lg text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;