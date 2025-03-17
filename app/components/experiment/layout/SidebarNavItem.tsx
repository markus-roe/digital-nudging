import React from 'react';

interface SidebarNavItemProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function SidebarNavItem({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  isDisabled,
  onClick
}: SidebarNavItemProps) {
  return (
    <li>
      <button 
        className={` w-full text-left px-4 py-3 flex items-center ${
          isActive ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700 cursor-pointer' : 'text-gray-700 opacity-60'
        }`}
        onClick={onClick}
        disabled={isDisabled}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
          isCompleted 
            ? 'bg-green-100 text-green-700' 
            : isActive 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-200 text-gray-500'
        }`}>
          {isCompleted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </button>
    </li>
  );
} 