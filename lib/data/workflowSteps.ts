export type WorkflowStep = {
  id: 'validation' | 'assignment' | 'scheduling';
  number: number;
  title: string;
  description: string;
};

export const workflowSteps: WorkflowStep[] = [
  {
    id: 'validation',
    number: 1,
    title: 'Order Validation',
    description: 'Verify order details before processing'
  },
  {
    id: 'assignment',
    number: 2,
    title: 'Driver Assignment',
    description: 'Assign orders to appropriate drivers'
  },
  {
    id: 'scheduling',
    number: 3,
    title: 'Delivery Scheduling',
    description: 'Schedule delivery times for orders'
  }
]; 