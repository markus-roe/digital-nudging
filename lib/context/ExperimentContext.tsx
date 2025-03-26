import React, { createContext, useContext } from 'react';
import { ExperimentVersion } from '@/lib/types/experiment';

interface ExperimentContextType {
  version: ExperimentVersion;
  participantId: string;
  currentTask: "validation" | "assignment" | "scheduling" | null;
  taskProgress: {
    validation: boolean;
    assignment: boolean;
    scheduling: boolean;
  };
  setCurrentTask: (task: "validation" | "assignment" | "scheduling") => void;
  setTaskProgress: (progress: { validation: boolean; assignment: boolean; scheduling: boolean }) => void;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export function ExperimentProvider({ 
  children, 
  version, 
  participantId 
}: { 
  children: React.ReactNode;
  version: ExperimentVersion;
  participantId: string;
}) {
  const [currentTask, setCurrentTask] = React.useState<"validation" | "assignment" | "scheduling" | null>(null);
  const [taskProgress, setTaskProgress] = React.useState({
    validation: false,
    assignment: false,
    scheduling: false
  });

  return (
    <ExperimentContext.Provider 
      value={{ 
        version, 
        participantId,
        currentTask,
        taskProgress,
        setCurrentTask,
        setTaskProgress
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
} 