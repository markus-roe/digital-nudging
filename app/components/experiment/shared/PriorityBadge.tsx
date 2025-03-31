import React from 'react';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';
import { useExperiment } from '@/lib/context/ExperimentContext';

interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low';
  showArrow?: boolean;
}

export default function PriorityBadge({ priority, showArrow = false }: PriorityBadgeProps) {
  const { version } = useExperiment();
  
  const getPriorityDotColor = (priority: string, version: 'a' | 'b') => {
    if (version === 'a') return 'bg-gray-500';
    
    switch(priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass(priority, version)}`}>
        <span className={`w-1.5 h-1.5 mr-1 rounded-full ${getPriorityDotColor(priority, version)}`}></span>
        {priority}
      </span>
      {showArrow && <span className="text-gray-500">→</span>}
    </>
  );
} 