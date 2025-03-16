import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExperimentVersion } from "@/lib/types/experiment";

interface DeliverySchedulingProps {
  version: ExperimentVersion;
  embedded?: boolean;
  onComplete?: () => void;
}

export default function DeliverySchedulingTask({ 
  version, 
  embedded = false,
  onComplete 
}: DeliverySchedulingProps) {
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
        <h2 className="text-xl font-bold mb-4">Delivery Scheduling Task</h2>
        <p className="mb-4">
          In this task, you will schedule delivery time slots for orders that have already been assigned to drivers.
        </p>
        <Button onClick={handleStartTask}>Start Task</Button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delivery Scheduling Task</h2>
      <p className="mb-4">
        This is a placeholder for the Delivery Scheduling task. 
        You'll implement the full functionality later.
      </p>
      <div className="mt-6 text-center">
        <Button 
          variant="primary" 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          onClick={handleComplete}
        >
          Complete Scheduling Task
        </Button>
      </div>
    </div>
  );
} 