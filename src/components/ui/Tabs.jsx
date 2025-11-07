import React from 'react';

export const Tabs = ({ tabs = [], active, onChange, className = '' }) => {
  return (
    <div className={`border-b border-secondary-200 mb-6 flex space-x-2 overflow-x-auto ${className}`} role="tablist">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(t.key)}
            className={`px-4 py-2 rounded-t transition-colors ${
              isActive
                ? 'bg-white border border-secondary-200 border-b-0 text-secondary-900'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;