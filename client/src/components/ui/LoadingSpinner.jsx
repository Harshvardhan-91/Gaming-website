import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ className = '', ...props }) => {
  return (
    <Loader2 
      className={`animate-spin ${className}`}
      {...props}
    />
  );
};

export default LoadingSpinner;