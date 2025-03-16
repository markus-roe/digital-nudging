import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import ExampleSteps, { Step } from '@/app/components/experiment/shared/ExampleSteps';
import OrderAssignmentExample from '@/app/components/experiment/tasks/order-assignment/OrderAssignmentExample';

interface TaskInstructionsProps {
  version: 'a' | 'b';
  onStartTask: () => void;
}

export default function TaskInstructions({ version, onStartTask }: TaskInstructionsProps) {
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [currentPage, setCurrentPage] = useState<'instructions' | 'example'>('instructions');
  
  // Define the steps for the example
  const orderAssignmentSteps: Step[] = [
    { description: "Step 1: Start by selecting a high priority order" },
    { description: "Step 2: Order #1 is now selected (high priority, North zone)" },
    { description: "Step 3: Click on Driver A (matching North zone)" },
    { description: "Step 4: Order #1 is now assigned to Driver A successfully" }
  ];
  
  // Instructions page
  const InstructionsPage = () => (
    <>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Task Instructions</h2>
      
      {/* Context */}
      <p className="mb-5 text-gray-700">You are a logistics manager responsible for assigning delivery drivers to customer orders.</p>
      
      {/* Steps section - improved structure */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">How to complete the task:</h3>
        </div>
        <div className="p-4">
          <ol className="space-y-3">
            <li className="flex">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">1</div>
              <div>
                <p className="font-medium">Select an order</p>
                <p className="text-sm text-gray-600">Click on a pending order from the table</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">2</div>
              <div>
                <p className="font-medium">Assign a driver</p>
                <p className="text-sm text-gray-600">Click on a driver to assign them to the selected order</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">3</div>
              <div>
                <p className="font-medium">Reset if needed</p>
                <p className="text-sm text-gray-600">Use the reset button (↺) to unassign orders</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Rules section - improved structure */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Key Rules:</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-4">
            <li>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">1</div>
                <p className="font-medium mr-3">Process orders by priority:</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>
                <span className="mx-1">→</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
                <span className="mx-1">→</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Low</span>
              </div>
              <div className="ml-9 flex items-center">
                <p className="text-sm text-gray-600">Assign drivers to orders in the same zone when possible</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">2</div>
              <div>
                <p className="font-medium">Match drivers to their geographical zones</p>
                <p className="text-sm text-gray-600">Assign drivers to orders in the same zone when possible</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3 font-medium">⏱️</div>
              <div>
                <p className="font-medium">Time limit: 3 minutes</p>
                <p className="text-sm text-gray-600">Process all orders within the time limit</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Goal - simplified */}
      <div className="p-3 bg-green-50 rounded-lg mb-6">
        <p className="font-medium text-green-800">
          <span className="mr-2">🎯</span>
          Goal: Assign all orders to drivers following the priority order before time runs out!
        </p>
      </div>
      
      {/* Confirmation checkbox */}
      <div className="flex items-center justify-center mb-5">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            checked={hasReadInstructions}
            onChange={(e) => setHasReadInstructions(e.target.checked)}
          />
          <span className="ml-2 text-gray-700">I have read and understood the instructions</span>
        </label>
      </div>
      
      <div className="text-center">
        <Button 
          className={`px-10 py-3 text-lg rounded-xl font-medium transform duration-200 flex items-center gap-2 mx-auto ${
            hasReadInstructions 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => {
            if (hasReadInstructions) {
              setCurrentPage('example');
            }
          }}
          disabled={!hasReadInstructions}
        >
          <span>See Example</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </Button>
      </div>
    </>
  );
  
  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
      {currentPage === 'instructions' ? (
        <InstructionsPage />
      ) : (
        <ExampleSteps 
          onBack={() => setCurrentPage('instructions')}
          onComplete={onStartTask}
          title="Example: How to Assign Orders"
          steps={orderAssignmentSteps}
          customContent={({ animationStep, totalSteps }) => (
            <OrderAssignmentExample version={version} animationStep={animationStep} totalSteps={totalSteps} />
          )}
        />
      )}
    </div>
  );
} 