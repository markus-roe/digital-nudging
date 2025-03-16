import React from 'react';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';
import { ExperimentVersion } from '@/lib/types/experiment';

interface VersionTaskHeaderProps {
  assignedOrdersCount: number;
  totalOrders: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  version: ExperimentVersion;
}

export default function VersionTaskHeader({ 
  assignedOrdersCount, 
  totalOrders, 
  timeRemaining, 
  formatTime,
  version
}: VersionTaskHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-6 justify-between items-center">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700">Task Instructions:</p>
          <ul className="text-sm list-disc pl-5 mt-1 space-y-1 text-gray-600">
            <li>Match drivers to their zones</li>
            <li>
              Process by priority: 
              <span className="inline-flex gap-1 ml-1 items-center">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVersionPriorityBadgeClass('High', version)} min-w-[50px] text-center`}>
                  High
                </span>
                <span className="text-gray-500">→</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVersionPriorityBadgeClass('Medium', version)} min-w-[50px] text-center`}>
                  Medium
                </span>
                <span className="text-gray-500">→</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVersionPriorityBadgeClass('Low', version)} min-w-[50px] text-center`}>
                  Low
                </span>
              </span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-6 flex-wrap">
          <div className="text-md bg-blue-50 px-3 py-1 rounded-lg">
            <span className="font-semibold text-blue-700">{assignedOrdersCount}/{totalOrders}</span> 
            <span className="text-gray-600"> assigned</span>
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