import React, { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useTaskTimer } from "@/lib/hooks/useTaskTimer";
import TaskHeader from "./TaskHeader";
import TaskIntroModal from "./TaskIntroModal";
import { useActionLogger } from "@/lib/hooks/useActionLogger";
import { ActionType } from "@/lib/types/logging";

interface TaskTemplateProps {
  taskType: 'validation' | 'assignment' | 'scheduling';
  title: string;
  description: string;
  guidelines: string[];
  progressCount: number;
  totalCount: number;
  isTaskCompleted: boolean;
  onComplete?: () => void;
  children: ReactNode;
  example?: ReactNode;
}

// Create a context to share example completion state
export const ExampleCompletionContext = React.createContext({
  isExampleCompleted: false,
  setExampleCompleted: (completed: boolean) => {}
});

export default function TaskTemplate({
  taskType,
  title,
  description,
  guidelines,
  progressCount,
  totalCount,
  isTaskCompleted,
  onComplete,
  children,
  example
}: TaskTemplateProps) {
  // Task state
  const { logTaskStart } = useActionLogger();
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);
  const [taskStarted, setTaskStarted] = useState<boolean>(false);
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const [isExampleCompleted, setExampleCompleted] = useState<boolean>(false);
  const TIME_LIMIT = 180; // 3 minute time limit
  
  // Timer hook
  const {
    startTime,
    timeRemaining,
    formatTime,
    startTimer,
    stopTimer
  } = useTaskTimer(TIME_LIMIT);
  
  // Start the task and timer when user dismisses the intro modal
  useEffect(() => {
    if (taskStarted && !startTime) {
      startTimer();
    }
  }, [taskStarted, startTime, startTimer]);
  
  // Handle starting the task after viewing the intro
  const handleStartTask = () => {
    logTaskStart();
    setShowIntroModal(false);
    setTaskStarted(true);
  };
  
  // Automatically stop timer when task is completed
  useEffect(() => {
    if (isTaskCompleted && timeRemaining > 0 && !taskFinished) {
      stopTimer();
      setTaskFinished(true);
    }
  }, [isTaskCompleted, timeRemaining, taskFinished, stopTimer]);
  
  // Handle task completion
  const handleTaskComplete = () => {
    if (!taskFinished) {
      stopTimer();
      setTaskFinished(true);
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // Get task-specific button text
  const getCompleteButtonText = () => {
    switch (taskType) {
      case 'validation':
        return 'Complete Validation Task';
      case 'assignment':
        return 'Complete Assignment Task';
      case 'scheduling':
        return 'Complete Scheduling Task';
    }
  };
  
  // Provide context value
  const contextValue = {
    isExampleCompleted,
    setExampleCompleted
  };
  
  return (
    <ExampleCompletionContext.Provider value={contextValue}>
      <div className="relative min-h-[400px]">
        <TaskHeader
          taskType={taskType}
          progressCount={progressCount}
          totalCount={totalCount}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          guidelines={guidelines}
          initialTime={TIME_LIMIT}
        />

        {children}
        
        {isTaskCompleted && !showIntroModal && (
          <div className="mt-6 text-center">
            <Button 
              variant="primary" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              onClick={handleTaskComplete}
            >
              {getCompleteButtonText()}
            </Button>
          </div>
        )}

        <TaskIntroModal
          title={title}
          isOpen={showIntroModal}
          onClose={handleStartTask}
          description={description}
          guidelines={guidelines}
          example={example}
          isExampleCompleted={isExampleCompleted}
        />
      </div>
    </ExampleCompletionContext.Provider>
  );
} 