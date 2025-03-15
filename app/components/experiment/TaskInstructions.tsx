import React from 'react';
import { Button } from '@/components/ui/Button';

interface TaskInstructionsProps {
  onStartTask: () => void;
}

export default function TaskInstructions({ onStartTask }: TaskInstructionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Task Instructions</h2>
      <p className="mb-4 text-gray-700">You are a logistics manager responsible for assigning delivery drivers to customer orders.</p>
      
      <div className="mb-5">
        <p className="font-medium mb-2 text-gray-800">How to complete the task:</p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>First, select a pending order from the table</li>
          <li>Then, click on a driver to assign them to the selected order</li>
          <li>Use the reset button (↺) to unassign orders if needed</li>
        </ol>
      </div>
      
      <div className="mb-5">
        <p className="font-medium mb-2 text-gray-800">Assignment rules:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-semibold">Priority order:</span> Process orders in sequence: 
            <span className="inline-flex gap-2 ml-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 min-w-[60px] text-center">High</span>
              <span className="text-gray-500">→</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 min-w-[60px] text-center">Medium</span>
              <span className="text-gray-500">→</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 min-w-[60px] text-center">Low</span>
            </span>
          </li>
          <li><span className="font-semibold">Zone matching:</span> Match orders to drivers in the same geographical zone</li>
        </ul>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4 mb-5">
        <p className="font-medium text-blue-800">Goal: Assign all orders to drivers following the priority order.</p>
      </div>
      
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
        <p className="font-medium text-yellow-800 flex items-center">
          <span className="inline-block mr-2 text-xl">⏱️</span>
          You will have 3 minutes to complete this task once you click the Start button.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-md transition-all duration-200"
          onClick={onStartTask}
        >
          I've Read the Instructions - Start Task
        </Button>
      </div>
    </div>
  );
} 