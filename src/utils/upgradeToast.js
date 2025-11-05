import React from 'react';
import { toast } from 'react-hot-toast';
import UpgradeToast from '../components/ui/UpgradeToast.jsx';

export const showUpgradeToast = (limit, onUpgradeClick, duration = 8000, message, variant = 'warning') => {
  return toast.custom(
    (t) => React.createElement(UpgradeToast, {
      limit,
      message,
      variant,
      onUpgradeClick: () => { onUpgradeClick?.(); toast.dismiss(t.id); },
      onClose: () => toast.dismiss(t.id),
    }),
    { duration }
  );
};