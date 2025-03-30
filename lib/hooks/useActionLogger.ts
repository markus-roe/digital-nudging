import { ActionType, TaskType } from '@/lib/types/logging';
import { useExperiment } from "@/lib/context/ExperimentContext";

const TASK_TYPE_MAP: Record<string, TaskType> = {
  validation: TaskType.ORDER_VALIDATION,
  assignment: TaskType.ORDER_ASSIGNMENT,
  scheduling: TaskType.DELIVERY_SCHEDULING
} as const;

export function useActionLogger() {
  const { participantId, currentTask } = useExperiment();

  const logAction = async (action: ActionType, orderId?: string) => {
    // Skip logging if participantId is null
    if (!participantId) {
      console.warn('Skipping action log - no valid participantId');
      return;
    }

    // Get task type from mapping
    const taskType = currentTask ? TASK_TYPE_MAP[currentTask] : TaskType.ORDER_VALIDATION;

    try {
      await fetch('/api/tracking/action-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          action,
          task: taskType,
          orderId,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  // Specific action logging methods
  const logTaskStart = () => {
    return logAction(ActionType.TASK_START);
  };

  const logTaskEnd = () => {
    return logAction(ActionType.TASK_END);
  };

  const logCaseStart = (orderId: string) => {
    return logAction(ActionType.CASE_START, orderId);
  };

  const logCaseSubmit = (orderId: string) => {
    return logAction(ActionType.CASE_SUBMIT, orderId);
  };

  const logOrderSelect = (orderId: string) => {
    return logAction(ActionType.ORDER_SELECT, orderId);
  };

  return {
    logTaskStart,
    logTaskEnd,
    logCaseStart,
    logCaseSubmit,
    logOrderSelect
  };
}

export default useActionLogger;