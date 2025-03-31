import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { ExampleCompletionContext } from '@/app/components/experiment/shared/TaskTemplate';

export interface AnimatedExampleProps {
  steps: string[];
  renderContent: (props: {
    animationStep: number;
    totalSteps: number;
  }) => ReactNode;
  onComplete?: () => void;
}

export default function BaseAnimatedExample({ 
  steps, 
  renderContent,
  onComplete 
}: AnimatedExampleProps) {
  const [animationStep, setAnimationStep] = useState<number>(0);
  const totalSteps = steps.length;
  
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
    return steps[animationStep] || "";
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl border border-gray-200 rounded-lg bg-white overflow-hidden shadow-md select-none">
        {/* Content area - rendered by the specific example implementation */}
        {renderContent({ animationStep, totalSteps })}
        
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