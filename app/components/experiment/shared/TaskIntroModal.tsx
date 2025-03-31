import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import PriorityBadge from './PriorityBadge';

interface TaskIntroModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  description: string;
  guidelines: string[];
  example?: ReactNode;
  isExampleCompleted?: boolean;
}

export default function TaskIntroModal({ 
  title, 
  isOpen, 
  onClose,
  description,
  guidelines,
  example,
  isExampleCompleted = false
}: TaskIntroModalProps) {
  if (!isOpen) return null;
  
  const showStartButton = isExampleCompleted || !example;
  
  // Render guidelines with priority badges if needed
  const renderGuidelines = () => {
    return guidelines.map((guideline, index) => {
      if (guideline.includes('Process by priority')) {
        return (
          <li key={index}>
            Process by priority: 
            <span className="inline-flex gap-1 ml-1 items-center">
              <PriorityBadge priority="High" showArrow />
              <PriorityBadge priority="Medium" showArrow />
              <PriorityBadge priority="Low" />
            </span>
          </li>
        );
      }
      return <li key={index}>{guideline}</li>;
    });
  };
  
  return (
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="mb-6">
          <p className="mb-4">
            {description}
          </p>
          
          {guidelines.length > 0 && (
            <>
              <p className="mb-4">
                <strong>Follow these guidelines:</strong>
              </p>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {renderGuidelines()}
              </ul>
            </>
          )}
          
          {example && (
            <div className="mt-6 mb-4">
              <h3 className="text-lg font-medium mb-3">Watch how it works:</h3>
              {example}
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-6 h-14">
          {showStartButton ? (
            <Button 
              variant="primary" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              Start Task
            </Button>
          ) : (
            <div className="text-sm text-gray-500 italic flex items-center">
              Complete all steps to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 