import React, { useEffect } from "react";
import { DeliverySchedulingProps } from "@/lib/types/experiment";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import OrdersSchedulingPanel from "./OrdersSchedulingPanel";
import TimeSlotsPanel from "./TimeSlotsPanel";
import { useDeliveryScheduling } from "@/lib/hooks/useDeliveryScheduling";
import { useHesitationTracker } from "@/lib/hooks/useHesitationTracker";
import { 
  initialOrders, 
  timeSlots, 
  initialDriverWorkloads
} from "@/lib/data/deliverySchedulingData";
import DeliverySchedulingExample from "./DeliverySchedulingExample";

interface ExtendedDeliverySchedulingProps extends DeliverySchedulingProps {
  onComplete?: () => void;
}

export default function DeliverySchedulingTask({ 
  version, 
  onComplete 
}: ExtendedDeliverySchedulingProps) {
  // Core functionality hooks
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
    getDriverWorkload
  } = useDeliveryScheduling(
    initialOrders,
    timeSlots,
    initialDriverWorkloads
  );
  
  // Hesitation tracking hook
  const {
    startHesitationTracking,
    recordHesitationTime
  } = useHesitationTracker();
  
  // Task guidelines
  const guidelines = [
    "Schedule delivery time slots for orders",
    "Consider customer preferences when selecting time slots",
    "Complete all scheduling decisions to finish the task"
  ].filter(Boolean); // Remove empty strings
  
  // Track hesitation time when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      startHesitationTracking();
    }
  }, [selectedOrder, startHesitationTracking]);
  
  // Handle time slot selection and scheduling
  const handleScheduleToTimeSlot = (orderId: string, timeSlotId: string) => {
    scheduleOrderToTimeSlot(orderId, timeSlotId);
    recordHesitationTime(orderId);
  };

  // Only allow selecting orders that haven't been scheduled yet
  const handleOrderSelection = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.scheduledTimeSlotId === null) {
      handleOrderSelect(orderId);
    }
  };
  
  return (
    <TaskTemplate
      version={version}
      taskType="scheduling"
      title="Delivery Scheduling Task"
      description="In this task, you'll schedule delivery time slots for orders."
      guidelines={guidelines}
      progressCount={scheduledOrdersCount}
      totalCount={totalOrdersCount}
      isTaskCompleted={allOrdersScheduled}
      onComplete={onComplete}
      example={
        <DeliverySchedulingExample 
          version={version} 
        />
      }
    >
      {/* Main task interface */}
      <div className="flex flex-col lg:flex-row gap-6 select-none">
        <div className="w-full lg:w-1/3">
          <OrdersSchedulingPanel
            orders={orders}
            selectedOrderId={selectedOrder}
            onOrderSelect={handleOrderSelection}
            version={version}
          />
        </div>
        
        <div className="w-full lg:w-2/3">
          <TimeSlotsPanel
            timeSlots={availableTimeSlots}
            orders={orders}
            selectedOrderId={selectedOrder}
            onSchedule={handleScheduleToTimeSlot}
            onUnschedule={unscheduleOrder}
            getDriverWorkload={getDriverWorkload}
            version={version}
          />
        </div>
      </div>
    </TaskTemplate>
  );
} 