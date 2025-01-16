import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ProfileCompletion = ({ user }) => {
  const requiredFields = [
    { key: 'avatar', label: 'Profile Picture' },
    { key: 'bio', label: 'Bio' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'location.country', label: 'Location' },
    { key: 'socialLinks.discord', label: 'Discord ID' },
    { key: 'socialLinks.steam', label: 'Steam Profile' }
  ];

  const getFieldValue = (field) => {
    return field.key.split('.').reduce((obj, key) => obj?.[key], user);
  };

  const completedFields = requiredFields.filter(field => {
    const value = getFieldValue(field);
    return value && String(value).trim() !== '';
  });

  const completionPercentage = Math.round(
    (completedFields.length / requiredFields.length) * 100
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Profile Completion</h3>
        <span className="text-sm font-medium text-blue-600">
          {completionPercentage}% Complete
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredFields.map((field) => {
          const isCompleted = getFieldValue(field);
          return (
            <div
              key={field.key}
              className="flex items-center gap-2 text-sm"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className={isCompleted ? 'text-gray-700' : 'text-gray-500'}>
                {field.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCompletion;