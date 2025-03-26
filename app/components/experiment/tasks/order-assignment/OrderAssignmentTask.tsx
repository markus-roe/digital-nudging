import React from "react";
import { initialOrders, initialDrivers } from '@/lib/data/orderAssignmentData';
import VersionOrdersTable from '@/app/components/experiment/tasks/order-assignment/VersionOrdersTable';
import DriversPanel from '@/app/components/experiment/tasks/order-assignment/DriversPanel';
import { useOrderAssignment } from '@/lib/hooks/useOrderAssignment';
import { useHesitationTracker } from '@/lib/hooks/useHesitationTracker';
import TaskTemplate from '@/app/components/experiment/shared/TaskTemplate';
import OrderAssignmentExample from './OrderAssignmentExample';
import { useExperiment } from '@/lib/context/ExperimentContext';

interface ExtendedOrderAssignmentProps {
  onComplete?: () => void;
}

export default function OrderAssignmentTask({ onComplete }: ExtendedOrderAssignmentProps) {
  const { participantId } = useExperiment();
  
  // Core functionality hooks
  const { 
    orders, 
    drivers, 
    assignments,
    selectedOrder,
    sequenceErrors,
    zoneMatchErrors,
    assignedOrdersCount,
    handleOrderSelect,
    assignOrderToDriver,
    unassignOrder
  } = useOrderAssignment(initialOrders, initialDrivers);
  
  // Hesitation tracking hook with task and participant IDs
  const {
    startHesitationTracking,
    recordHesitationTime
  } = useHesitationTracker('order-assignment', participantId);
  
  // Task guidelines
  const guidelines = [
    "Match drivers to their zones",
    "Process by priority",
    "Complete all assignments to finish the task"
  ];
  
  // Track hesitation time when an order is selected
  React.useEffect(() => {
    if (selectedOrder) {
      startHesitationTracking();
    }
  }, [selectedOrder, startHesitationTracking]);
  
  // Check if task is completed
  const taskCompleted = Object.keys(assignments).length === orders.length;
  
  // Handle driver selection and assignment
  const handleDriverSelect = (driverId: string) => {
    if (selectedOrder) {
      assignOrderToDriver(selectedOrder, driverId);
      recordHesitationTime(selectedOrder);
    }
  };
  
  return (
    <TaskTemplate
      taskType="assignment"
      title="Driver Assignment Task"
      description="In this task, you'll assign orders to drivers based on matching delivery zone."
      guidelines={guidelines}
      progressCount={assignedOrdersCount}
      totalCount={orders.length}
      isTaskCompleted={taskCompleted}
      onComplete={onComplete}
      example={<OrderAssignmentExample />}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <VersionOrdersTable 
          orders={orders}
          selectedOrder={selectedOrder}
          assignments={assignments}
          onOrderSelect={handleOrderSelect}
          onUnassignOrder={unassignOrder}
        />
        
        <DriversPanel 
          drivers={drivers}
          selectedOrder={selectedOrder}
          assignments={assignments}
          onDriverSelect={handleDriverSelect}
        />
      </div>
    </TaskTemplate>
  );
}