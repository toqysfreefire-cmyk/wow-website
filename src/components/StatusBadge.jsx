import React from 'react';
import { formatStatus } from '../utils/formatters';

export const StatusBadge = ({ status, className = '' }) => {
  const { label, bg, text, border } = formatStatus(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${bg} ${text} ${border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {label}
    </span>
  );
};
