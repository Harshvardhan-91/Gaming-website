import React from 'react';
import { cn } from '../../utils/helpers';

const Alert = ({ children, className, variant = 'default', ...props }) => {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        {
          'bg-red-50 border-red-200 text-red-700': variant === 'destructive',
          'bg-yellow-50 border-yellow-200 text-yellow-700': variant === 'warning',
          'bg-blue-50 border-blue-200 text-blue-700': variant === 'info',
          'bg-green-50 border-green-200 text-green-700': variant === 'success',
          'bg-gray-50 border-gray-200 text-gray-700': variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className, ...props }) => {
  return (
    <h5
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };