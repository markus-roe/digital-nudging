import { ErrorType, TaskType } from '@/lib/types/logging';
import { useExperiment } from "@/lib/context/ExperimentContext";

const TASK_TYPE_MAP: Record<string, TaskType> = {
  validation: TaskType.ORDER_VALIDATION,
  assignment: TaskType.ORDER_ASSIGNMENT,
  scheduling: TaskType.DELIVERY_SCHEDULING
} as const;

export function useErrorLogger() {
  const { participantId, currentTask } = useExperiment();

  const logError = async (errorType: ErrorType, orderId: string) => {
    // Skip logging if participantId is null
    if (!participantId) {
      console.warn('Skipping error log - no valid participantId');
      return;
    }

    // Get task type from mapping
    const taskType = currentTask ? TASK_TYPE_MAP[currentTask] : TaskType.ORDER_VALIDATION;

    try {
      await fetch('/api/tracking/error-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          errorType,
          task: taskType,
          orderId,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.error('Failed to log error:', error);
    }
  };

  // Specific error logging methods
  const logSequenceError = (orderId: string) => {
    return logError(ErrorType.SEQUENCE_ERROR, orderId);
  };

  const logZoneMatchError = (orderId: string) => {
    return logError(ErrorType.ZONE_MATCH_ERROR, orderId);
  };

  const logValidationError = (orderId: string) => {
    return logError(ErrorType.VALIDATION_ERROR, orderId);
  };

  const logSchedulingError = (orderId: string) => {
    return logError(ErrorType.SCHEDULING_ERROR, orderId);
  };

  return {
    logSequenceError,
    logZoneMatchError,
    logValidationError,
    logSchedulingError
  };
}

export default useErrorLogger; 