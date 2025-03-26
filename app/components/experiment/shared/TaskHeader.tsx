import React from 'react';
import { ExperimentVersion } from '@/lib/types/experiment';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';

interface TaskHeaderProps {
  taskType: 'validation' | 'assignment' | 'scheduling';
  progressCount: number;
  totalCount: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  version: ExperimentVersion;
  initialTime?: number;
  guidelines?: string[];
}

export default function TaskHeader({
  taskType,
  progressCount,
  totalCount,
  timeRemaining,
  formatTime,
  version,
  initialTime = 300, // Default 5 minutes (300 seconds)
  guidelines
}: TaskHeaderProps) {
  // Task-specific instructions
  const getInstructions = () => {
    switch (taskType) {
      case 'assignment':
        return (
          <>
            {guidelines?.map((guideline, index) => {
              if (guideline.includes('Process by priority')) {
                return (
                  <li key={index}>
                    Process by priority: 
                    <span className="inline-flex gap-1 ml-1 items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass('High', version)}`}>
                        <span className={`w-1.5 h-1.5 mr-1 rounded-full ${version === 'a' ? 'bg-gray-500' : 'bg-red-500'}`}></span>
                        High
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass('Medium', version)}`}>
                        <span className={`w-1.5 h-1.5 mr-1 rounded-full ${version === 'a' ? 'bg-gray-500' : 'bg-amber-500'}`}></span>
                        Medium
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass('Low', version)}`}>
                        <span className={`w-1.5 h-1.5 mr-1 rounded-full bg-gray-500`}></span>
                        Low
                      </span>
                    </span>
                  </li>
                );
              }
              return <li key={index}>{guideline}</li>;
            })}
          </>
        );
      default:
        return (
          <>
            {guidelines?.map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </>
        );
    }
  };

  // Task-specific progress label
  const getProgressLabel = () => {
    switch (taskType) {
      case 'validation':
        return 'validated';
      case 'assignment':
        return 'assigned';
      case 'scheduling':
        return 'scheduled';
    }
  };
  
  // Get task title based on type
  const getTaskTitle = () => {
    switch (taskType) {
      case 'validation':
        return 'Order Validation';
      case 'assignment':
        return 'Driver Assignment';
      case 'scheduling':
        return 'Delivery Scheduling';
    }
  };

  // Calculate percentage of time remaining
  const timePercentage = Math.max(0, Math.min(100, (timeRemaining / initialTime) * 100));
  
  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining < 30) return 'bg-red-500';
    if (timeRemaining < 60) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="pl-3 pr-3 pb-3">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{getTaskTitle()}</h3>
    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap gap-6 justify-between items-center mb-5">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700">Task Instructions:</p>
          <ul className="text-sm list-disc pl-5 mt-1 space-y-1 text-gray-600">
            {getInstructions()}
          </ul>
        </div>
        
        <div className="flex-shrink-0">
          <div className="text-md bg-blue-50 px-3 py-1 rounded-lg">
            <span className="font-semibold text-blue-700">{progressCount}/{totalCount}</span> 
            <span className="text-gray-600"> {getProgressLabel()}</span>
          </div>
        </div>
      </div>
      
      {/* Timer display above progress bar */}
      <div className="absolute bottom-3 right-4">
        <span className={`font-mono font-semibold text-md ${timeRemaining < 30 ? 'text-red-600' : 'text-gray-700'}`}>
          ⏱️ {formatTime(timeRemaining)}
        </span>
      </div>
      
      {/* Full-width progress bar at bottom of container */}
      <div className="absolute bottom-0 left-0 right-0 h-2">
        <div 
          className={`h-full ${getTimerColor()} ${timeRemaining < 30 ? 'animate-pulse' : ''} transition-all duration-1000 ease-linear animate-pulse`} 
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>
    </div>
    </div>
  );
}