import React from 'react';

interface StepperNavItemProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onClick: () => void;
  showRightBorder?: boolean;
}

export default function StepperNavItem({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  isDisabled,
  onClick,
  showRightBorder = true
}: StepperNavItemProps) {
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
          {isCompleted ? '✓' : stepNumber}
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