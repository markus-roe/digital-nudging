import React, { useState, useEffect } from "react";
import ERPDashboard from "@/app/components/experiment/layout/ERPDashboard";
import OrderValidationTask from "@/app/components/experiment/tasks/order-validation/OrderValidationTask";
import OrderAssignmentTask from "@/app/components/experiment/tasks/order-assignment/OrderAssignmentTask";
import DeliverySchedulingTask from "@/app/components/experiment/tasks/delivery-scheduling/DeliverySchedulingTask";
import { ExperimentVersion } from "@/lib/types/experiment";
import { ExperimentProvider, useExperiment } from "@/lib/context/ExperimentContext";
import ExperimentCompletion from "./shared/ExperimentCompletion";

interface ERPExperimentProps {
  version: ExperimentVersion;
}

function ExperimentContent() {
  const [introCompleted, setIntroCompleted] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const { currentTask, setCurrentTask, taskProgress, setTaskProgress } = useExperiment();
  
  
  // Task completion handlers
  const handleValidationComplete = () => {
    setTaskProgress({ ...taskProgress, validation: true });
    setCurrentTask("assignment");
  };
  
  const handleAssignmentComplete = () => {
    setTaskProgress({ ...taskProgress, assignment: true });
    setCurrentTask("scheduling");
  };
  
  const handleSchedulingComplete = () => {
    setTaskProgress({ ...taskProgress, scheduling: true });
    setAllTasksCompleted(true);
  };
  
  // Initialize first task after intro
  useEffect(() => {
    if (introCompleted && !currentTask) {
      setCurrentTask("validation");
    }
  }, [introCompleted, currentTask, setCurrentTask]);

  if (allTasksCompleted) {
    return <ExperimentCompletion onComplete={() => {}} />;
  }
  
  return (
    <ERPDashboard
      introCompleted={introCompleted}
      onIntroComplete={() => setIntroCompleted(true)}
      currentTask={currentTask}
      onTaskChange={setCurrentTask}
      taskProgress={taskProgress}
    >
      {currentTask === "validation" && (
        <OrderValidationTask 
          onComplete={handleValidationComplete}
        />
      )}
      
      {currentTask === "assignment" && (
        <OrderAssignmentTask 
          onComplete={handleAssignmentComplete}
        />
      )}
      
      {currentTask === "scheduling" && (
        <DeliverySchedulingTask 
          onComplete={handleSchedulingComplete}
        />
      )}
    </ERPDashboard>
  );
}

export default function ERPExperiment({ version }: ERPExperimentProps) {
  return (
    <ExperimentProvider version={version}>
        <ExperimentContent />
    </ExperimentProvider>
  );
} 