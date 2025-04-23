import React from 'react';
import BaseAnimatedExample from '@/app/components/experiment/shared/BaseAnimatedExample';
import { useExperiment } from '@/lib/context/ExperimentContext';


export default function OrderValidationExample() {
  const { version } = useExperiment();
  // Define steps for the animation
  const steps = [
    "Step 1: Select an order from the list to validate",
    "Step 2: Review the order details and identify errors",
    "Step 3: Correct the information in the form",
    "Step 4: Click Save to validate the order"
  ];

  // Render the content for the specific example
  const renderContent = ({ animationStep, totalSteps }: { 
    animationStep: number, 
    totalSteps: number
  }) => {
    
    return (
      <div className="h-72">
        {/* Left side - Orders list */}
        <div className="absolute left-0 top-0 w-3/8 h-full border-r border-gray-200 p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders Pending Validation</div>
          <div className={`p-3 border rounded mb-2 ${
            animationStep >= 1 
              ? animationStep === totalSteps - 1
                ? 'bg-gray-50 opacity-60 border-gray-200'
                : 'bg-blue-100 border-blue-300' 
              : 'border-gray-200'
          } transition-colors duration-300`}>
            <div className="font-medium">Order #101</div>
            <div className="text-sm text-gray-600">Acme Corp</div>
            <div className="mt-1">
              {animationStep === totalSteps - 1 ? (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-md border border-transparent whitespace-nowrap">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
                  Validated
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-amber-500"></span>
                  Pending
                </span>
              )}
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded mb-2">
            <div className="font-medium">Order #102</div>
            <div className="text-sm text-gray-600">Widget Inc</div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200 whitespace-nowrap">
                <span className="w-1.5 h-1.5 mr-1 rounded-full bg-amber-500"></span>
                Pending
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side - Validation Form */}
        <div className="absolute right-0 top-0 w-5/8 h-full p-3 overflow-hidden">
          {animationStep === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-gray-500">Select an order to validate</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 p-2 text-sm font-medium mb-2 rounded flex justify-between">
                <span>Validate Order #101 - Acme Corp</span>
              </div>
              
              {/* Validation Rules - displayed above form */}
              {(animationStep >= 1 && animationStep < totalSteps - 1) && (
                <div className="mb-2 bg-blue-50 p-2 border border-blue-200 rounded text-xs">
                  <div className="font-medium text-blue-700 mb-1">Fields requiring correction:</div>
                  <ul className="list-disc pl-4 text-blue-600 space-y-0.5">
                    <li>Email must contain @ and domain</li>
                  </ul>
                </div>
              )}
              
              {/* Show success message in the last step */}
              {animationStep === totalSteps - 1 && (
                <div className="mb-2 bg-green-50 p-2 border border-green-200 rounded text-xs animate-fadeIn">
                  <div className="font-medium text-green-700 mb-1">Order validation complete:</div>
                  <ul className="list-disc pl-4 text-green-600 space-y-0.5">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Order successfully validated</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {/* Contact Email Field - shows error states */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Contact Email
                  </label>
                  {version == "b" && animationStep == 1 && (
                    <span className="text-xs text-red-600">Invalid email format</span>
                  )}
                </div>
                <div className="relative">
                  <div className={`w-full text-xs px-2 py-1 border rounded-md flex items-center ${
                    animationStep === 1 && version === 'b'
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}>
                    <span>contact@acmecorp</span>
                    {(animationStep >= 2) && (
                      <span className={`${animationStep === 2 ? 'bg-blue-100 text-blue-800 animate-pulse' : ''} font-medium pr-1 rounded`}>
                        .com
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Contact Phone Field */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Contact Phone
                  </label>
                </div>
                <input
                  type="text"
                  value="+43 654 123 4523"
                  readOnly
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-0 select-none pointer-events-none"
                />
              </div>
              
              {/* Buttons */}
              {(animationStep >= 2) && (
                <div className="flex justify-start space-x-3 mt-3">
                  <button
                    className={`px-2 py-1 text-xs bg-blue-600 text-white rounded ${animationStep === 3 ? 'animate-pulse' : ''}`}
                  >
                    Save
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <BaseAnimatedExample
      steps={steps}
      renderContent={renderContent}
    />
  );
}