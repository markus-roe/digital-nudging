import React, { useState, useContext, useEffect } from 'react';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';
import { ExampleCompletionContext } from '@/app/components/experiment/shared/TaskTemplate';

interface OrderAssignmentExampleProps {
  version: 'a' | 'b';
}

export default function OrderAssignmentExample({ version }: OrderAssignmentExampleProps) {
  const [animationStep, setAnimationStep] = useState<number>(0);
  const totalSteps = 4;
  
  // Get the context to notify when example is completed
  const { setExampleCompleted } = useContext(ExampleCompletionContext);
  
  // Update example completion status when animation step changes
  useEffect(() => {
    // Example is completed only when we're at the last step
    setExampleCompleted(animationStep === totalSteps - 1);
  }, [animationStep, totalSteps, setExampleCompleted]);
  
  // Handle animation navigation
  const nextAnimationStep = () => {
    if (animationStep < totalSteps - 1) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };
  
  // Get step description based on current animation step
  const getStepDescription = () => {
    switch(animationStep) {
      case 0: return "Step 1: Select an order from the list";
      case 1: return "Step 2: Identify the matching zone between order and driver";
      case 2: return "Step 3: Click on the driver to assign the order";
      case 3: return "Step 4: The order is now assigned to the driver";
      default: return "";
    }
  };
  
  // Get priority dot color based on priority and version
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
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl h-64 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-md select-none">
        {/* Left side - Orders table */}
        <div className="absolute left-0 top-0 w-2/3 h-full border-r border-gray-200 p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders</div>
          <div className={`flex items-center p-2 mb-2 rounded ${animationStep >= 1 && animationStep < 3 ? 'bg-blue-100' : ''} ${animationStep >= 3 ? 'opacity-60' : ''} transition-all duration-300`}>
            <div className="w-5 h-5 mr-3">
              <input 
                type="checkbox" 
                className={`h-4 w-4 ${animationStep >= 3 ? 'opacity-0' : ''} transition-opacity duration-300`} 
                checked={animationStep >= 1 && animationStep < 3} 
                readOnly 
              />
            </div>
            <div className="flex-1 font-medium">Order #1</div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass('High', version)}`}>
                <span className={`w-1.5 h-1.5 mr-1 rounded-full ${getPriorityDotColor('High', version)}`}></span>
                High
              </span>
            </div>
            <div className="ml-3">
              <div className="relative">
                <div className="flex items-center p-1 border border-transparent rounded z-10 relative">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                  <span className="text-sm">North</span>
                </div>
                <div className={`absolute inset-0 bg-green-100 border border-green-300 rounded pointer-events-none z-0 transition-all duration-300 ${animationStep === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
            </div>
          </div>
          <div className="flex items-center p-2 rounded">
            <div className="w-5 h-5 mr-3">
              <input type="checkbox" className="h-4 w-4" checked={false} readOnly />
            </div>
            <div className="flex-1 font-medium">Order #2</div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getVersionPriorityBadgeClass('Medium', version)}`}>
                <span className={`w-1.5 h-1.5 mr-1 rounded-full ${getPriorityDotColor('Medium', version)}`}></span>
                Medium
              </span>
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
            className={`p-3 border rounded mb-3 ${animationStep === 2 ? 'bg-blue-50 border-blue-300' : 'border-gray-200'} ${animationStep === 2 ? 'cursor-pointer' : ''} transition-colors duration-300`}
          >
            <div className="font-medium">Driver A</div>
            <div className="flex items-center mt-2">
              <div className="relative">
                <div className="flex items-center p-1 border border-transparent rounded z-10 relative">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                  <span className="text-sm">North</span>
                </div>
                <div className={`absolute inset-0 bg-green-100 border border-green-300 rounded pointer-events-none z-0 transition-all duration-300 ${animationStep === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
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
            style={{ width: `${(animationStep / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step description */}
      <p className="mt-4 text-sm text-gray-600 text-center font-medium">
        {getStepDescription()}
      </p>
      
      {/* Navigation buttons */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button 
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            animationStep > 0 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer' 
              : 'bg-gray-100 text-gray-400'
          }`}
          onClick={prevAnimationStep}
          disabled={animationStep === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Previous
        </button>
        
        <button 
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            animationStep < totalSteps - 1 
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
              : 'bg-gray-100 text-gray-400'
          }`}
          onClick={nextAnimationStep}
          disabled={animationStep === totalSteps - 1}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
} 