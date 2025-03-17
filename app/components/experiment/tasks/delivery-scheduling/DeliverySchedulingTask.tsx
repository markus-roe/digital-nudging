import React from "react";
import { ExperimentVersion } from "@/lib/types/experiment";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";

interface DeliverySchedulingProps {
  version: ExperimentVersion;
  onComplete?: () => void;
}

export default function DeliverySchedulingTask({ 
  version, 
  onComplete 
}: DeliverySchedulingProps) {
  // Task guidelines
  const guidelines = [
    "Schedule delivery time slots for assigned orders",
    "Balance operational efficiency and customer preferences",
    "Complete all scheduling decisions to finish the task"
  ];
  
  return (
    <TaskTemplate
      version={version}
      taskType="scheduling"
      title="Delivery Scheduling Task"
      description="In this task, you'll schedule delivery time slots for orders that have already been assigned to drivers."
      guidelines={guidelines}
      progressCount={0}
      totalCount={10}
      isTaskCompleted={true} // For placeholder, set to true to enable completion
      onComplete={onComplete}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center w-full">
          <div className="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">Delivery Scheduling Task</h3>
            <p className="mt-1 text-sm text-gray-500">
              This is a placeholder for the Delivery Scheduling task.
              You'll implement the full functionality later.
            </p>
          </div>
        </div>
      </div>
    </TaskTemplate>
  );
} 