import React from 'react';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';
import BaseAnimatedExample from '@/app/components/experiment/shared/BaseAnimatedExample';

interface OrderAssignmentExampleProps {
  version: 'a' | 'b';
}

export default function OrderAssignmentExample({ version }: OrderAssignmentExampleProps) {
  // Define steps for the animation
  const steps = [
    "Step 1: Select an order from the list",
    "Step 2: Identify the matching zone between order and driver",
    "Step 3: Click on the driver to assign the order",
    "Step 4: The order is now assigned to the driver"
  ];
  
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
  
  // Render the content for the specific example
  const renderContent = ({ animationStep, totalSteps, version }: { 
    animationStep: number, 
    totalSteps: number, 
    version: 'a' | 'b' 
  }) => {
    return (
      <div className="h-64">
        {/* Left side - Orders table */}
        <div className="absolute left-0 top-0 w-2/3 h-full border-r border-gray-200 p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders</div>
          <div className={`flex items-center p-2 mb-2 rounded ${animationStep >= 1 && animationStep < 3 ? 'bg-blue-100' : ''} ${animationStep >= 3 ? 'opacity-60' : ''} transition-all duration-300 border-b border-gray-200`}>
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
      </div>
    );
  };

  return (
    <BaseAnimatedExample
      version={version}
      steps={steps}
      renderContent={renderContent}
    />
  );
} 