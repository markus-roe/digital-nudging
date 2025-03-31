import React from "react";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import OrdersSchedulingPanel from "./OrdersSchedulingPanel";
import TimeSlotsPanel from "./TimeSlotsPanel";
import { 
  initialOrders, 
  timeSlots, 
} from "@/lib/data/deliverySchedulingData";
import DeliverySchedulingExample from "./DeliverySchedulingExample";
import { DeliverySchedulingProvider, useDeliverySchedulingContext } from "@/lib/context/DeliverySchedulingContext";

interface ExtendedDeliverySchedulingProps {
  onComplete?: () => void;
}

export default function DeliverySchedulingTask({ onComplete }: ExtendedDeliverySchedulingProps) {
  
  return (
    <DeliverySchedulingProvider
      initialOrders={initialOrders}
      initialTimeSlots={timeSlots}
    >
      <DeliverySchedulingTaskContent onComplete={onComplete} />
    </DeliverySchedulingProvider>
  );
}

function DeliverySchedulingTaskContent({ onComplete }: ExtendedDeliverySchedulingProps) {
  const {
    orders,
    timeSlots: availableTimeSlots,
    selectedOrder,
    scheduledOrdersCount,
    totalOrdersCount,
    allOrdersScheduled,
    handleOrderSelect,
    scheduleOrderToTimeSlot,
    unscheduleOrder,
  } = useDeliverySchedulingContext();
  
  // Task guidelines
  const guidelines = [
    "Choose slots within the customer's preferred time range",
    "Assign orders to time slots with the least workload",
    "Schedule all orders to complete the task"
  ].filter(Boolean);
  
  return (
    <TaskTemplate
      taskType="scheduling"
      title="Delivery Scheduling Task"
      description="In this task, you'll schedule delivery time slots for orders."
      guidelines={guidelines}
      progressCount={scheduledOrdersCount}
      totalCount={totalOrdersCount}
      isTaskCompleted={allOrdersScheduled}
      onComplete={onComplete}
      example={<DeliverySchedulingExample />}
    >
      {/* Main task interface */}
      <div className="flex flex-col lg:flex-row gap-6 select-none">
        <div className="w-full lg:w-1/3">
          <OrdersSchedulingPanel
          />
        </div>
        
        <div className="w-full lg:w-2/3">
          <TimeSlotsPanel
          />
        </div>
      </div>
    </TaskTemplate>
  );
} 