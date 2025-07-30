import React from 'react';

interface StatusMessageProps {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  const baseClasses = "p-4 rounded-lg mb-4";
  const typeClasses = {
    error: "bg-red-50 border border-red-200 text-red-700",
    success: "bg-green-50 border border-green-200 text-green-700",
    info: "bg-blue-50 border border-blue-200 text-blue-700",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-700"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <p>{message}</p>
    </div>
  );
};
