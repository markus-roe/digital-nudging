import React from 'react';

interface TaskHeaderProps {
  assignedOrdersCount: number;
  totalOrders: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

export default function TaskHeader({ 
  assignedOrdersCount, 
  totalOrders, 
  timeRemaining, 
  formatTime 
}: TaskHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-6 justify-between items-center">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700">Task Instructions:</p>
          <ul className="text-sm list-disc pl-5 mt-1 space-y-1 text-gray-600">
            <li>
              Process by priority: 
              <span className="inline-flex gap-1 ml-1 items-center">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 min-w-[50px] text-center">High</span>
                <span className="text-gray-500">→</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 min-w-[50px] text-center">Medium</span>
                <span className="text-gray-500">→</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 min-w-[50px] text-center">Low</span>
              </span>
            </li>
            <li>Match drivers to their zones</li>
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