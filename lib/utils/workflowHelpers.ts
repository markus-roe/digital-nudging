import { WorkflowStep } from '../data/workflowSteps';

// Development mode flag - set to true to make all tasks accessible
export const DEV_MODE = true;

type TaskProgress = {
  validation: boolean;
  assignment: boolean;
  scheduling: boolean;
};

export const isStepDisabled = (
  step: WorkflowStep,
  currentTask: "validation" | "assignment" | "scheduling" | null,
  taskProgress: TaskProgress
): boolean => {
  // In development mode, no steps are disabled
  if (DEV_MODE) return false;
  
  if (step.id === 'validation') {
    return currentTask !== 'validation' && !taskProgress.validation;
  } else if (step.id === 'assignment') {
    return !taskProgress.validation || (currentTask !== 'assignment' && !taskProgress.assignment);
  } else {
    return !taskProgress.assignment || (currentTask !== 'scheduling' && !taskProgress.scheduling);
  }
};

export const canChangeToStep = (
  step: WorkflowStep,
  currentTask: "validation" | "assignment" | "scheduling" | null,
  taskProgress: TaskProgress
): boolean => {
  // In development mode, can always change to any step
  if (DEV_MODE) return true;
  
  if (step.id === 'validation') {
    return currentTask === 'validation' || taskProgress.validation;
  } else if (step.id === 'assignment') {
    return taskProgress.validation && (currentTask === 'assignment' || taskProgress.assignment);
  } else {
    return taskProgress.assignment && (currentTask === 'scheduling' || taskProgress.scheduling);
  }
}; 