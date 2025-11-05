import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  error, 
  helperText, 
  icon, 
  iconPosition = 'left',
  multiline = false,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="label text-secondary-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-400">{icon}</span>
          </div>
        )}
        
        {multiline ? (
          <textarea
            className={clsx(
              'input resize-none',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            rows={rows}
            ref={ref}
            {...props}
          />
        ) : (
          <input
            type={type}
            className={clsx(
              'input',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-secondary-400">{icon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

