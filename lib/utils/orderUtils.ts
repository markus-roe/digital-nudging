import { ExperimentVersion } from '@/lib/types/experiment';

export const getZoneColor = (zone: string) => {
  switch(zone) {
    case 'North Zone':
      return {
        dot: 'bg-blue-300',
        text: 'text-blue-600',
        bg: 'bg-blue-50'
      };
    case 'South Zone':
      return {
        dot: 'bg-purple-300',
        text: 'text-purple-600',
        bg: 'bg-purple-50'
      };
    case 'East Zone':
      return {
        dot: 'bg-amber-300',
        text: 'text-amber-600',
        bg: 'bg-amber-50'
      };
    case 'West Zone':
      return {
        dot: 'bg-emerald-300',
        text: 'text-emerald-600',
        bg: 'bg-emerald-50'
      };
    default:
      return {
        dot: 'bg-gray-300',
        text: 'text-gray-600',
        bg: 'bg-gray-50'
      };
  }
};

const grayBadgeClass = 'bg-gray-100 text-gray-700 border border-gray-200';
  
export const getPriorityBadgeClass = (priority: string) => {
  switch(priority) {
    case 'High':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return grayBadgeClass;
  }
};

export const getVersionPriorityBadgeClass = (priority: string, version: ExperimentVersion) => {
  // Version A: No color nudging - all priorities have the same styling
  if (version === 'a') {
    return grayBadgeClass;
  }
  
  // Version B: With color nudging - different colors for different priorities
  return getPriorityBadgeClass(priority);
}; 