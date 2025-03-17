import React, { useState, useEffect } from "react";
import ERPDashboard from "@/app/components/experiment/layout/ERPDashboard";
import OrderValidationTask from "@/app/components/experiment/tasks/order-validation/OrderValidationTask";
import OrderAssignmentTask from "@/app/components/experiment/tasks/order-assignment/OrderAssignmentTask";
import DeliverySchedulingTask from "@/app/components/experiment/tasks/delivery-scheduling/DeliverySchedulingTask";
import { useRouter } from "next/navigation";
import { ExperimentVersion } from "@/lib/types/experiment";

interface ERPExperimentProps {
  version: ExperimentVersion;
  participantId: string;
}

export default function ERPExperiment({ version, participantId }: ERPExperimentProps) {
  // Dashboard state
  const [introCompleted, setIntroCompleted] = useState(false);
  const [currentTask, setCurrentTask] = useState<"validation" | "assignment" | "scheduling" | null>(null);
  const [taskProgress, setTaskProgress] = useState({
    validation: false,
    assignment: false,
    scheduling: false
  });
  
  // Task completion handlers
  const handleValidationComplete = () => {
    setTaskProgress(prev => ({ ...prev, validation: true }));
    setCurrentTask("assignment");
  };
  
  const handleAssignmentComplete = () => {
    setTaskProgress(prev => ({ ...prev, assignment: true }));
    setCurrentTask("scheduling");
  };
  
  const handleSchedulingComplete = () => {
    setTaskProgress(prev => ({ ...prev, scheduling: true }));
    // Navigate to completion page or show final results
  };
  
  // Initialize first task after intro
  useEffect(() => {
    if (introCompleted && !currentTask) {
      setCurrentTask("validation");
    }
  }, [introCompleted, currentTask]);
  
  // Handle task changes from tab navigation
  const handleTaskChange = (task: "validation" | "assignment" | "scheduling") => {
    setCurrentTask(task);
  };
  
  return (
    <ERPDashboard
      version={version}
      introCompleted={introCompleted}
      onIntroComplete={() => setIntroCompleted(true)}
      currentTask={currentTask}
      onTaskChange={handleTaskChange}
      taskProgress={taskProgress}
    >
      {currentTask === "validation" && (
        <OrderValidationTask 
          version={version} 
          onComplete={handleValidationComplete}
        />
      )}
      
      {currentTask === "assignment" && (
        <OrderAssignmentTask 
          version={version}
          onComplete={handleAssignmentComplete}
        />
      )}
      
      {currentTask === "scheduling" && (
        <DeliverySchedulingTask 
          version={version}
          onComplete={handleSchedulingComplete}
        />
      )}
    </ERPDashboard>
  );
} 