import React, { useEffect } from "react";
import { initialOrders, initialDrivers } from "@/lib/data/orderAssignmentData";
import DriversPanel from "./DriversPanel";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import OrderAssignmentExample from "./OrderAssignmentExample";
import { useHesitationTracker } from "@/lib/hooks/useHesitationTracker";
import { useExperiment } from "@/lib/context/ExperimentContext";
import { OrderAssignmentProvider, useOrderAssignmentContext } from "@/lib/context/OrderAssignmentContext";
import VersionOrdersTable from "./VersionOrdersTable";

interface OrderAssignmentProps {
  onComplete?: () => void;
}

export default function OrderAssignmentTask({ onComplete }: OrderAssignmentProps) {
  return (
    <OrderAssignmentProvider 
      initialOrders={initialOrders}
      initialDrivers={initialDrivers}
    >
      <OrderAssignmentTaskContent onComplete={onComplete} />
    </OrderAssignmentProvider>
  );
}

function OrderAssignmentTaskContent({ onComplete }: OrderAssignmentProps) {
  const { 
    orders,
    selectedOrder,
    assignedOrdersCount,
  } = useOrderAssignmentContext();
  
  const { participantId } = useExperiment();
  
  // Add hesitation tracking with task and participant IDs
  const {
    startHesitationTracking,
  } = useHesitationTracker('order-assignment', participantId);
  
  // Task guidelines
  const guidelines = [
    "Match drivers to their zones",
    "Process by priority",
    "Complete all assignments to finish the task"
  ];
  
  // Check if task is completed
  const taskCompleted = assignedOrdersCount === orders.length;
  
  // Track hesitation time when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      startHesitationTracking();
    }
  }, [selectedOrder, startHesitationTracking]);

  return (
    <TaskTemplate
      taskType="assignment"
      title="Order Assignment Task"
      description="In this task, you'll assign delivery orders to available drivers based on priority levels and zones."
      guidelines={guidelines}
      progressCount={assignedOrdersCount}
      totalCount={orders.length}
      isTaskCompleted={taskCompleted}
      onComplete={onComplete}
      example={<OrderAssignmentExample />}
    >
      <div className="flex flex-col lg:flex-row gap-6 select-none">
          <VersionOrdersTable />
          <DriversPanel />
      </div>
    </TaskTemplate>
  );
}