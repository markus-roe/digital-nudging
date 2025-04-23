import React from "react";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import OrdersSchedulingPanel from "./OrdersSchedulingPanel";
import TimeSlotsPanel from "./TimeSlotsPanel";
import { initialOrders, timeSlots } from "@/lib/data/deliverySchedulingData";
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
    selectedOrder,
    scheduledOrdersCount,
    totalOrdersCount,
    allOrdersScheduled,
  } = useDeliverySchedulingContext();
  
  return (
    <TaskTemplate
      taskType="scheduling"
      title="Delivery Scheduling Task"
      description="In this task, you'll schedule delivery time slots for orders."
      guidelines={[
        "Choose slots within the customer's preferred time range",
        "Assign orders to time slots with the least workload",
        "Schedule all orders to complete the task"
      ]}
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
          {selectedOrder ? (
            <TimeSlotsPanel
            />
          ) : (
            <>
               <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No Order Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an order from the list to schedule its delivery time slot
                </p>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </TaskTemplate>
  );
} 