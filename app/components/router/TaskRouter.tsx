import { notFound } from 'next/navigation';
import OrderAssignmentTask from '../experiment/tasks/order-assignment/OrderAssignmentTask';
import Task2 from '../experiment/tasks/task-2/Task2';
import Task3 from '../experiment/tasks/task-3/Task3';
import { ExperimentTask } from '@/lib/types/experiment';

interface TaskRouterProps {
  taskId: string;
  version: string;
}

export default function TaskRouter({ taskId, version }: TaskRouterProps) {
  // Validate task ID
  const validTasks: ExperimentTask[] = ['order-assignment', 'task-2', 'task-3'];
  if (!validTasks.includes(taskId as ExperimentTask)) {
    return notFound();
  }
  
  // Validate version
  if (version !== 'a' && version !== 'b') {
    return notFound();
  }
  
  // Route to the appropriate task component
  switch (taskId) {
    case 'order-assignment':
      return <OrderAssignmentTask version={version as 'a' | 'b'} />;
    
    case 'task-2':
      return <Task2 version={version as 'a' | 'b'} />;
    
    case 'task-3':
      return <Task3 version={version as 'a' | 'b'} />;
    
    default:
      return notFound();
  }
} 