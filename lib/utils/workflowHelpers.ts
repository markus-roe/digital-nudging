import { WorkflowStep } from '../data/workflowSteps';

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
  if (step.id === 'validation') {
    return currentTask === 'validation' || taskProgress.validation;
  } else if (step.id === 'assignment') {
    return taskProgress.validation && (currentTask === 'assignment' || taskProgress.assignment);
  } else {
    return taskProgress.assignment && (currentTask === 'scheduling' || taskProgress.scheduling);
  }
}; 