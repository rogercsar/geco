import React, { useState } from 'react';

export function AccordionItem({ title, icon, badges = [], children, defaultOpen = false, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border border-secondary-200 rounded-lg bg-white ${open ? 'ring-1 ring-secondary-200' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {icon ? <span>{icon}</span> : null}
          <span className="font-semibold text-secondary-900">{title}</span>
          {badges.map((b, i) => (
            <span key={i} className={`inline-flex items-center px-2 py-1 rounded text-xs ${i === 0 ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'}`}>
              {b}
            </span>
          ))}
        </div>
        <span className={`text-secondary-500 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} px-4 pb-4`}>
        {children}
      </div>
    </div>
  );
}

export default AccordionItem;