import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface TaskInstructionsProps {
  onStartTask: () => void;
}

export default function TaskInstructions({ onStartTask }: TaskInstructionsProps) {
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [currentPage, setCurrentPage] = useState<'instructions' | 'example'>('instructions');
  
  // Function to handle step navigation
  const goToNextStep = () => {
    if (animationStep < 3) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };
  
  // Instructions page
  const InstructionsPage = () => (
    <>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Task Instructions</h2>
      
      {/* Context */}
      <p className="mb-5 text-gray-700">You are a logistics manager responsible for assigning delivery drivers to customer orders.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Steps section - improved structure */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
      
      <div className="flex justify-center">
        <Button 
          className={`px-10 py-3 text-lg rounded-xl font-medium transform duration-200 flex items-center gap-2 ${
            hasReadInstructions 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => {
            if (hasReadInstructions) {
              setCurrentPage('example');
              setAnimationStep(0);
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
  
  // Example page
  const ExamplePage = () => (
    <>
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setCurrentPage('instructions')}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800">Example: How to Assign Orders</h2>
      </div>
      
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Follow the example step by step:</h3>
        </div>
        <div className="p-6 bg-gray-50 select-none">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl h-64 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-md">
              {/* Left side - Orders table */}
              <div className="absolute left-0 top-0 w-2/3 h-full border-r border-gray-200 p-3">
                <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders</div>
                <div className={`flex items-center p-2 mb-2 rounded ${animationStep === 1 ? 'bg-blue-100' : ''} transition-colors duration-300`}>
                  <div className="w-5 h-5 mr-3">
                    <input type="checkbox" className="h-4 w-4" checked={animationStep >= 1} readOnly />
                  </div>
                  <div className="flex-1 font-medium">Order #1</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>
                  </div>
                  <div className="ml-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-sm">North</span>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded opacity-60">
                  <div className="w-5 h-5 mr-3">
                    <input type="checkbox" className="h-4 w-4" disabled />
                  </div>
                  <div className="flex-1 font-medium">Order #2</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
                  </div>
                  <div className="ml-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-sm">South</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - Drivers */}
              <div className="absolute right-0 top-0 w-1/3 h-full p-3">
                <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Drivers</div>
                <div 
                  className={`p-3 border rounded mb-3 ${animationStep === 2 ? 'bg-blue-50 border-blue-300' : 'border-gray-200'} transition-colors duration-300`}
                >
                  <div className="font-medium">Driver A</div>
                  <div className="flex items-center mt-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-sm">North</span>
                  </div>
                  {animationStep >= 3 && (
                    <div className="mt-2 text-sm">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">Order #1</span>
                    </div>
                  )}
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <div className="font-medium">Driver B</div>
                  <div className="flex items-center mt-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-sm">South</span>
                  </div>
                </div>
              </div>
              
              {/* Step indicator */}
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gray-100">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${(animationStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-center w-full max-w-2xl">
              <p className="text-gray-700 font-medium">
                {animationStep === 0 && "Step 1: Start by selecting a high priority order"}
                {animationStep === 1 && "Step 2: Order #1 is now selected (high priority, North zone)"}
                {animationStep === 2 && "Step 3: Click on Driver A (matching North zone)"}
                {animationStep === 3 && "Step 4: Order #1 is now assigned to Driver A successfully"}
              </p>
            </div>
            
            {/* Step navigation controls */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button 
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  animationStep > 0 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={goToPrevStep}
                disabled={animationStep === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Previous
              </button>
              
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Step {animationStep + 1} of 4</span>
              </div>
              
              <button 
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  animationStep < 3 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={goToNextStep}
                disabled={animationStep === 3}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            
            {/* Button container with fixed height to prevent layout shift */}
            <div className="mt-6 h-14 flex justify-center">
              {animationStep === 3 ? (
                <Button 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 text-lg rounded-xl font-mediumtransition-all duration-200 flex items-center gap-2"
                  onClick={onStartTask}
                >
                  <span>Start Task</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Button>
              ) : (
                <div className="text-sm text-gray-500 italic flex items-center">
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800 flex items-center">
          <span className="mr-2">💡</span>
          <span>Remember: Process high priority orders first, then medium, then low. Match drivers to their zones when possible.</span>
        </p>
      </div>
    </>
  );
  
  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
      {currentPage === 'instructions' ? <InstructionsPage /> : <ExamplePage />}
    </div>
  );
} 