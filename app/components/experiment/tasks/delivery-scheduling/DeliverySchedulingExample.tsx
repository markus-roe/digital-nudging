import React from 'react';
import BaseAnimatedExample from '@/app/components/experiment/shared/BaseAnimatedExample';
import { useExperiment } from '@/lib/context/ExperimentContext';


export default function DeliverySchedulingExample() {
  const { version } = useExperiment();
  // Define steps for the animation
  const steps = [
    "Step 1: Select an order from the list to schedule",
    "Step 2: Review the available time slots and their workloads",
    "Step 3: Check the order's preferred delivery window (08:00 - 12:00)",
    "Step 4: Click on the time slot with the lowest workload",
    "Step 5: The order is now scheduled for delivery"
  ];

  // Render the content for the specific example
  const renderContent = ({ animationStep }: { animationStep: number }) => {
    return (
      <div className="h-72">
        {/* Left side - Orders to schedule */}
        <div className="absolute left-0 top-0 w-2/6 h-full border-r border-gray-200 p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders Pending Scheduling</div>
          
          {/* Order #1 */}
          <div className={`p-3 border rounded mb-2 ${
            animationStep === 4
              ? 'bg-green-50 border-green-200 opacity-60'
              : animationStep >= 1
                ? 'bg-blue-100 border-blue-300'
                : 'border-gray-200'
          } transition-colors duration-300`}>
            <div className="font-medium">Order #1</div>
            <div className="text-sm text-gray-600">Acme Corp</div>
            {animationStep < 4 && (
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border bg-blue-50 border-blue-200 text-blue-800 ${
                  animationStep === 1 && 'ring-2 ring-blue-400' ||
                  animationStep === 2 && 'bg-blue-100 text-blue-800 '
                }`}>
                08:00 - 12:00
              </span>
              </div>
            )}
            {animationStep === 4 && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded border border-green-200">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
                  Scheduled
                </span>
              </div>
            )}
          </div>
          
          {/* Order #2 */}
          <div className="p-3 border border-gray-200 rounded mb-2">
            <div className="font-medium">Order #2</div>
            <div className="text-sm text-gray-600">Widget Inc</div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border bg-blue-50 text-blue-800 border-blue-200">
                10:00 - 12:00
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side - Time slots */}
        <div className="absolute right-0 top-0 w-4/6 h-full p-3">
          
          {animationStep === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-gray-500">Select an order to schedule</p>
            </div>
          ) : (
            <div className="p-3 border border-gray-200 rounded">
              <div className="mb-2 text-xs text-gray-700 font-medium">Time Slots:</div>
              
              <div className="grid grid-cols-3 gap-2">
                {/* 08:00 - 10:00 Slot */}
                <div className={`p-2 border border-gray-200 ${
                  animationStep === 2 ? 'ring-2 ring-blue-400' : 'border-gray-200'
                } rounded`}>
                  <div className="text-sm font-medium">08:00 - 10:00</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {version === 'a' ? (
                      <div>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <span className="font-medium text-gray-600">20% utilized</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 10:00 - 12:00 Slot */}
                <div className={`p-2 border border-gray-200 ${
                  animationStep === 2 && 'ring-2 ring-blue-400'
                } rounded ${animationStep === 3 ? 'ring-2 ring-blue-400' : ''}`}>
                  <div className="text-sm font-medium">10:00 - 12:00</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {version === 'a' ? (
                    <div className={`${animationStep === 3 && 'animate-pulse'}`}>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <span className="font-medium text-gray-600">{animationStep === 4 ? '20%' : '10%'} utilized</span>
                    </div>
                    ) : (
                      <div className={`${animationStep === 3 && 'animate-pulse'}`}>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-1 mb-3">
                          <div className="h-2 rounded-full bg-blue-500" style={ { width: animationStep === 4 ? '20%' : '10%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Show scheduled order in time slot after step 4 */}
                  {animationStep === 4 && (
                    <div className="mt-2 text-xs px-2 py-1 rounded bg-blue-100 border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span>Order #1</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 12:00 - 14:00 Slot */}
                <div className="p-2 border border-gray-200 rounded">
                  <div className="text-sm font-medium">12:00 - 14:00</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {version === 'a' ? (
                      <div>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <span className="font-medium text-gray-600">40% utilized</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-medium text-gray-600">Workload:</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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