import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const PhoneInput = ({ value, onChange, className = '' }) => {
  const [isValid, setIsValid] = useState(true);
  
  const validatePhone = (phone) => {
    // Basic phone validation regex
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    const valid = newValue === '' || validatePhone(newValue);
    setIsValid(valid);
    onChange(newValue, valid);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className={`h-5 w-5 ${isValid ? 'text-gray-400' : 'text-red-400'}`} />
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(123) 456-7890"
          className={`pl-10 w-full px-4 py-2 bg-white border rounded-lg 
                   focus:ring-2 focus:ring-blue-100 ${
                     isValid 
                       ? 'border-gray-200 focus:border-blue-500' 
                       : 'border-red-300 focus:border-red-500'
                   } ${className}`}
        />
      </div>
      {!isValid && (
        <p className="text-xs text-red-500">
          Please enter a valid phone number
        </p>
      )}
    </div>
  );
};

export default PhoneInput;