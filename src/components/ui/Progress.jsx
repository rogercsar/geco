import React from 'react';
import { clsx } from 'clsx';

const Progress = ({ 
  value = 0, 
  max = 100, 
  className, 
  showLabel = false,
  size = 'md',
  color = 'primary',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-secondary-600 mb-1">
          <span>Progresso</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div
        className={clsx(
          'w-full bg-secondary-200 rounded-full overflow-hidden',
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={clsx(
            'h-full transition-all duration-500 ease-out rounded-full',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;

