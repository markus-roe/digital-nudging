import React from 'react';

export interface NavItemProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onClick: () => void;
  variant: 'sidebar' | 'stepper';
  showRightBorder?: boolean;
}

export default function NavItem({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  isDisabled,
  onClick,
  variant,
  showRightBorder = true
}: NavItemProps) {
  // Shared rendering logic for the step number or checkmark
  const renderStepIndicator = () => {
    if (isCompleted) {
      return variant === 'sidebar' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : '✓';
    }
    return <span>{stepNumber}</span>;
  };

  // Sidebar variant rendering
  if (variant === 'sidebar') {
    return (
      <li>
        <button 
          className={`w-full text-left px-4 py-3 flex items-center ${
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
            {renderStepIndicator()}
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </button>
      </li>
    );
  }

  // Stepper variant rendering
  return (
    <button 
      className={`flex-1 px-6 py-4 text-left ${
        showRightBorder ? 'border-r border-gray-200' : ''
      } ${
        isActive 
          ? 'bg-white border-b-2 border-b-blue-600' 
          : isCompleted 
            ? 'bg-gray-50 text-green-600' 
            : 'text-gray-400'
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted 
            ? 'bg-green-100' 
            : isActive 
              ? 'bg-blue-100' 
              : 'bg-gray-100'
        }`}>
          {renderStepIndicator()}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <p className="text-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
} 