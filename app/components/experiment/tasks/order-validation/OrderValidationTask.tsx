import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExperimentVersion } from "@/lib/types/experiment";

interface OrderValidationProps {
  version: ExperimentVersion;
  embedded?: boolean;
  onComplete?: () => void;
}

export default function OrderValidationTask({ 
  version, 
  embedded = false,
  onComplete 
}: OrderValidationProps) {
  const [taskStarted, setTaskStarted] = useState(embedded);
  
  const handleStartTask = () => {
    setTaskStarted(true);
  };
  
  const handleComplete = () => {
    if (onComplete) onComplete();
  };
  
  if (!taskStarted) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Order Validation Task</h2>
        <p className="mb-4">
          In this task, you will review and validate delivery details before orders are processed.
        </p>
        <Button onClick={handleStartTask}>Start Task</Button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Validation Task</h2>
      <p className="mb-4">
        This is a placeholder for the Order Validation task. 
        You'll implement the full functionality later.
      </p>
      <div className="mt-6 text-center">
        <Button 
          variant="primary" 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          onClick={handleComplete}
        >
          Complete Validation Task
        </Button>
      </div>
    </div>
  );
} 