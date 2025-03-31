import React, { useState, useEffect } from "react";
import ERPDashboard from "@/app/components/experiment/layout/ERPDashboard";
import OrderValidationTask from "@/app/components/experiment/tasks/order-validation/OrderValidationTask";
import OrderAssignmentTask from "@/app/components/experiment/tasks/order-assignment/OrderAssignmentTask";
import DeliverySchedulingTask from "@/app/components/experiment/tasks/delivery-scheduling/DeliverySchedulingTask";
import { ExperimentVersion } from "@/lib/types/experiment";
import { ExperimentProvider, useExperiment } from "@/lib/context/ExperimentContext";

interface ERPExperimentProps {
  version: ExperimentVersion;
}

function ExperimentContent() {
  const [introCompleted, setIntroCompleted] = useState(false);
  const { currentTask, setCurrentTask, taskProgress, setTaskProgress, setParticipantId } = useExperiment();
  
  // // Initialize participant on component mount
  // useEffect(() => {
  //   const initializeParticipant = async () => {
  //     try {
  //       const response = await fetch('/api/register', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({})
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to initialize participant');
  //       }

  //       const data = await response.json();
  //       setParticipantId(data.participantId);
  //     } catch (error) {
  //       console.error('Failed to initialize participant:', error);
  //     }
  //   };

  //   initializeParticipant();
  // }, [setParticipantId]);
  
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
    // Navigate to completion page or show final results
  };
  
  // Initialize first task after intro
  useEffect(() => {
    if (introCompleted && !currentTask) {
      setCurrentTask("validation");
    }
  }, [introCompleted, currentTask, setCurrentTask]);
  
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