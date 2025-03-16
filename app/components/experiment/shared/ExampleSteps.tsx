import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

export interface Step {
  description: string;
  content?: ReactNode;
}

interface ExampleStepsProps {
  onBack: () => void;
  onComplete: () => void;
  title: string;
  steps: Step[];
  customContent?: ReactNode | ((props: { animationStep: number, totalSteps: number }) => ReactNode);
  startButtonText?: string;
  headerText?: string;
  waitingText?: string;
}

export default function ExampleSteps({ 
  onBack, 
  onComplete, 
  title, 
  steps,
  customContent,
  startButtonText = "Start Task",
  headerText = "Follow the example step by step:",
  waitingText = "Complete all steps to continue"
}: ExampleStepsProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const totalSteps = steps.length;
  
  // Function to handle step navigation
  const goToNextStep = () => {
    if (animationStep < totalSteps - 1) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  // Render the custom content based on whether it's a function or a ReactNode
  const renderCustomContent = () => {
    if (typeof customContent === 'function') {
      return customContent({ animationStep, totalSteps });
    }
    return customContent;
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
   
        <div className="p-32 bg-gray-50 select-none">
          <div className="flex flex-col items-center">
            {/* Example content area */}
            {renderCustomContent()}
            
            {/* Step description */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-center w-full max-w-2xl">
              <p className="text-gray-700 font-medium">
                {steps[animationStep]?.description}
              </p>
              {steps[animationStep]?.content && (
                <div className="mt-2">
                  {steps[animationStep].content}
                </div>
              )}
            </div>
            
            {/* Step navigation controls */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button 
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  animationStep > 0 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer' 
                    : 'bg-gray-100 text-gray-400'
                }`}
                onClick={goToPrevStep}
                disabled={animationStep === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Previous
              </button>
              
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Step {animationStep + 1} of {totalSteps}</span>
              </div>
              
              <button 
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  animationStep < totalSteps - 1 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                    : 'bg-gray-100 text-gray-400'
                }`}
                onClick={goToNextStep}
                disabled={animationStep === totalSteps - 1}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            
            {/* Button container with fixed height to prevent layout shift */}
            <div className="mt-6 h-14 flex justify-center">
              {animationStep === totalSteps - 1 ? (
                <Button 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 text-lg rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                  onClick={onComplete}
                >
                  <span>{startButtonText}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Button>
              ) : (
                <div className="text-sm text-gray-500 italic flex items-center">
                  {waitingText}
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
} 