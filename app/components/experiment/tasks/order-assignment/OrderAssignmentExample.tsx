import React from 'react';
import { getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';

interface OrderAssignmentExampleProps {
  version: 'a' | 'b';
  animationStep: number;
  totalSteps: number;
}

export default function OrderAssignmentExample({ version, animationStep, totalSteps }: OrderAssignmentExampleProps) {
  return (
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionPriorityBadgeClass('High', version)}`}>High</span>
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionPriorityBadgeClass('Medium', version)}`}>Medium</span>
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
  );
} 