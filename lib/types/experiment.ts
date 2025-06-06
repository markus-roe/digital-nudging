// Experiment version types
export type ExperimentVersion = 'a' | 'b';

// Experiment task types
export type ExperimentTask = 'order-validation' | 'order-assignment' | 'delivery-scheduling';

// Experiment configuration interface
export interface ExperimentConfig {
  version: ExperimentVersion;
  task: ExperimentTask;
}

// Task-specific props interfaces
export interface OrderValidationProps {
  version: ExperimentVersion;
}

export interface OrderAssignmentProps {
  version: ExperimentVersion;
}

export interface DeliverySchedulingProps {
  version: ExperimentVersion;
} 