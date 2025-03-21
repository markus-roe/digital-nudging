import React, { useEffect, useContext } from "react";
import { ExperimentVersion, DeliverySchedulingProps } from "@/lib/types/experiment";
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
import { ExampleCompletionContext } from "@/app/components/experiment/shared/TaskTemplate";

interface ExtendedDeliverySchedulingProps extends DeliverySchedulingProps {
  onComplete?: () => void;
}

export default function DeliverySchedulingTask({ 
  version, 
  onComplete 
}: ExtendedDeliverySchedulingProps) {
  // Access the example completion context directly
  const { setExampleCompleted } = useContext(ExampleCompletionContext);
  
  // Core functionality hooks
  const {
    orders,
    timeSlots: availableTimeSlots,
    selectedOrder,
    scheduledOrdersCount,
    totalOrdersCount,
    allOrdersScheduled,
    preferenceErrorsCount,
    workloadErrorsCount,
    handleOrderSelect,
    scheduleOrderToTimeSlot,
    unscheduleOrder,
    isPreferredTimeSlot,
    getDriverWorkload,
    getDriverTimeSlots
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
    "<strong>Schedule delivery time slots</strong> for orders that have already been assigned to drivers",
    "<strong>Consider customer preferences</strong> when selecting time slots",
    "Complete all scheduling decisions to finish the task"
  ].filter(Boolean); // Remove empty strings
  
  // Track hesitation time when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      startHesitationTracking();
    }
  }, [selectedOrder, startHesitationTracking]);
  
  // Set example as completed since there's no example implementation
  useEffect(() => {
    setExampleCompleted(true);
  }, [setExampleCompleted]);
  
  // Handle time slot selection and scheduling
  const handleScheduleToTimeSlot = (orderId: string, timeSlotId: string) => {
    scheduleOrderToTimeSlot(orderId, timeSlotId);
    recordHesitationTime(orderId);
  };
  
  return (
    <TaskTemplate
      version={version}
      taskType="scheduling"
      title="Delivery Scheduling Task"
      description="In this task, you'll schedule delivery time slots for orders that have already been assigned to drivers."
      guidelines={guidelines}
      progressCount={scheduledOrdersCount}
      totalCount={totalOrdersCount}
      isTaskCompleted={allOrdersScheduled}
      onComplete={onComplete}
      example={null}
    >
      {/* Main task interface */}
      <div className="flex flex-col lg:flex-row gap-6 select-none">
        <div className="lg:w-2/8">
          <OrdersSchedulingPanel
            orders={orders}
            selectedOrderId={selectedOrder}
            onOrderSelect={handleOrderSelect}
            version={version}
            timeSlots={availableTimeSlots}
          />
        </div>
        
        <div className="lg:w-6/8">
          <TimeSlotsPanel
            timeSlots={availableTimeSlots}
            orders={orders}
            selectedOrderId={selectedOrder}
            onSchedule={handleScheduleToTimeSlot}
            onUnschedule={unscheduleOrder}
            getDriverWorkload={getDriverWorkload}
            getDriverTimeSlots={getDriverTimeSlots}
            version={version}
          />
        </div>
      </div>
    </TaskTemplate>
  );
} 