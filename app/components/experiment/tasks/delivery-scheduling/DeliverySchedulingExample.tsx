import React from 'react';
import BaseAnimatedExample from '@/app/components/experiment/shared/BaseAnimatedExample';

interface DeliverySchedulingExampleProps {
  version: 'a' | 'b';
}

export default function DeliverySchedulingExample({ version }: DeliverySchedulingExampleProps) {
  // Define steps for the animation
  const steps = [
    "Step 1: Select an order from the list to schedule",
    "Step 2: Review the available time slots",
    "Step 3: Click on a suitable time slot to schedule the order",
    "Step 4: The order is now scheduled for delivery"
  ];

  // Render the content for the specific example
  const renderContent = ({ animationStep, totalSteps, version }: { 
    animationStep: number, 
    totalSteps: number, 
    version: 'a' | 'b' 
  }) => {
    return (
      <div className="h-72">
        {/* Left side - Orders to schedule */}
        <div className="absolute left-0 top-0 w-1/2 h-full border-r border-gray-200 p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Orders to Schedule</div>
          <div className={`p-3 border rounded mb-2 ${
            animationStep >= 1 
              ? animationStep === totalSteps - 1
                ? 'bg-gray-50 opacity-60 border-gray-200'
                : 'bg-blue-100 border-blue-300' 
              : 'border-gray-200'
          } transition-colors duration-300`}>
            <div className="font-medium">Order #103</div>
            <div className="text-sm text-gray-600">Electronics Plus</div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <span className="w-1.5 h-1.5 mr-1 rounded-full bg-blue-500"></span>
                North Zone
              </span>
            </div>
            {animationStep === totalSteps - 1 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
                  Scheduled: 1PM-3PM
                </span>
              </div>
            )}
          </div>
          <div className="p-3 border border-gray-200 rounded mb-2">
            <div className="font-medium">Order #104</div>
            <div className="text-sm text-gray-600">Office Depot</div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                <span className="w-1.5 h-1.5 mr-1 rounded-full bg-amber-500"></span>
                South Zone
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side - Time slots */}
        <div className="absolute right-0 top-0 w-1/2 h-full p-3">
          <div className="bg-gray-100 p-2 text-sm font-medium mb-3 rounded">Available Time Slots</div>
          
          {animationStep === 0 ? (
            <div className="flex flex-col items-center justify-center h-5/6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Select an order to see available slots</p>
            </div>
          ) : (
            <>
              <div 
                className={`p-2 border rounded mb-3 ${
                  animationStep === 2 
                    ? 'bg-blue-50 border-blue-300 cursor-pointer' 
                    : animationStep === 3 
                      ? 'bg-green-50 border-green-200' 
                      : 'border-gray-200'
                } transition-colors duration-300`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">9AM - 11AM</span>
                  {version === 'a' ? (
                    <span className="text-xs text-gray-500">2/5 slots available</span>
                  ) : (
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                className={`p-2 border rounded mb-3 ${
                  animationStep === 2 
                    ? 'bg-blue-50 border-blue-300 cursor-pointer' 
                    : animationStep >= 3 
                      ? 'bg-green-50 border-green-200' 
                      : 'border-gray-200'
                } transition-colors duration-300`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">1PM - 3PM</span>
                  {version === 'a' ? (
                    <span className="text-xs text-gray-500">4/5 slots available</span>
                  ) : (
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '80%' }}></div>
                    </div>
                  )}
                </div>
                {animationStep === totalSteps - 1 && (
                  <div className="mt-2 text-xs">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">Order #103</span>
                  </div>
                )}
              </div>
              
              <div className="p-2 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">4PM - 6PM</span>
                  {version === 'a' ? (
                    <span className="text-xs text-gray-500">1/5 slots available</span>
                  ) : (
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '20%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
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