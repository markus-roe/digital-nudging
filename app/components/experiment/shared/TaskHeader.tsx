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
}

export default function TaskHeader({
  taskType,
  progressCount,
  totalCount,
  timeRemaining,
  formatTime,
  version
}: TaskHeaderProps) {
  // Task-specific instructions
  const getInstructions = () => {
    switch (taskType) {
      case 'validation':
        return (
          <>
            <li>Review each order's delivery details</li>
            <li>Correct any errors in the form fields</li>
            <li>Validate orders to complete the task</li>
          </>
        );
      case 'assignment':
        return (
          <>
            <li>Match drivers to their zones</li>
            <li>
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
          </>
        );
      case 'scheduling':
        return (
          <>
            <li>Schedule delivery time slots for assigned orders</li>
            <li>Balance operational efficiency and customer preferences</li>
            <li>Complete all scheduling decisions to finish the task</li>
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

  return (
    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-6 justify-between items-center">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700">Task Instructions:</p>
          <ul className="text-sm list-disc pl-5 mt-1 space-y-1 text-gray-600">
            {getInstructions()}
          </ul>
        </div>
        
        <div className="flex gap-6 flex-wrap">
          <div className="text-md bg-blue-50 px-3 py-1 rounded-lg">
            <span className="font-semibold text-blue-700">{progressCount}/{totalCount}</span> 
            <span className="text-gray-600"> {getProgressLabel()}</span>
          </div>
          <div className="text-md bg-gray-100 px-3 py-1 rounded-lg">
            <span className={`font-mono font-semibold ${timeRemaining < 30 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              ⏱️ {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}