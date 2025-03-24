import React from "react";
import { initialOrders, initialDrivers } from '@/lib/data/orderAssignmentData';
import VersionOrdersTable from '@/app/components/experiment/tasks/order-assignment/VersionOrdersTable';
import DriversPanel from '@/app/components/experiment/tasks/order-assignment/DriversPanel';
import { useOrderAssignment } from '@/lib/hooks/useOrderAssignment';
import { useHesitationTracker } from '@/lib/hooks/useHesitationTracker';
import { OrderAssignmentProps } from '@/lib/types/experiment';
import TaskTemplate from '@/app/components/experiment/shared/TaskTemplate';
import OrderAssignmentExample from './OrderAssignmentExample';

interface ExtendedOrderAssignmentProps extends OrderAssignmentProps {
  onComplete?: () => void;
}

export default function OrderAssignmentTask({ 
  version, 
  onComplete 
}: ExtendedOrderAssignmentProps) {
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
  
  // Hesitation tracking hook
  const {
    startHesitationTracking,
    recordHesitationTime
  } = useHesitationTracker();
  
  // Task guidelines
  const guidelines = [
    "Match orders to drivers in the same zone when possible for efficient delivery",
    "Process high priority orders first, followed by medium and low priority",
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
      version={version}
      taskType="assignment"
      title="Driver Assignment Task"
      description="In this task, you'll assign orders to drivers based on matching delivery zone."
      guidelines={guidelines}
      progressCount={assignedOrdersCount}
      totalCount={orders.length}
      isTaskCompleted={taskCompleted}
      onComplete={onComplete}
      example={
        <OrderAssignmentExample 
          version={version} 
        />
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <VersionOrdersTable 
          orders={orders}
          selectedOrder={selectedOrder}
          assignments={assignments}
          onOrderSelect={handleOrderSelect}
          onUnassignOrder={unassignOrder}
          version={version}
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