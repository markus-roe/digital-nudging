import React from 'react';
import { ScheduledOrder } from '@/lib/data/deliverySchedulingData';
import { useExperiment } from '@/lib/context/ExperimentContext';
import { useDeliverySchedulingContext } from '@/lib/context/DeliverySchedulingContext';

export default function TimeSlotsPanel() {
  const { version } = useExperiment();
  const {
    timeSlots,
    orders,
    selectedOrder,
    scheduleOrderToTimeSlot,
    unscheduleOrder,
  } = useDeliverySchedulingContext();
  
  // Group scheduled orders by time slot
  const ordersByTimeSlot: Record<string, ScheduledOrder[]> = {};
  orders.forEach(order => {
    if (order.scheduledTimeSlot) {
      if (!ordersByTimeSlot[order.scheduledTimeSlot.id]) {
        ordersByTimeSlot[order.scheduledTimeSlot.id] = [];
      }
      ordersByTimeSlot[order.scheduledTimeSlot.id].push(order);
    }
  });
  
  const selectedOrderData = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
      <h2 className="text-lg font-medium mb-4">Schedule Time Slots</h2>
      
      {/* Visual Timeline */}
      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Hours label */}
        <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 border-b border-gray-300">
          Time Slots
        </div>
        
        <div className="flex">
          {/* Time Slots */}
          <div className="flex-1 grid grid-cols-5 divide-x divide-gray-200 border-r border-gray-300">
            {timeSlots.map((timeSlot) => {
              const ordersInSlot = ordersByTimeSlot[timeSlot.id] || [];
              // Get workload from the selected order's available time slots
              const workload = selectedOrderData 
                ? selectedOrderData.availableTimeSlots.find(ts => ts.id === timeSlot.id)?.workload ?? 0
                : 0;
                
              const canSchedule = selectedOrder && !selectedOrderData?.scheduledTimeSlot;
              
              return (
                <div 
                  key={timeSlot.id} 
                  className={`h-36 p-2 relative ${canSchedule ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                  onClick={() => {
                    if (canSchedule) {
                      scheduleOrderToTimeSlot(selectedOrder, timeSlot);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{`${timeSlot.start} - ${timeSlot.end}`}</span>
                  </div>
                  
                  {/* Scheduled Orders */}
                  <div className="mt-1 space-y-1">
                    {ordersInSlot.map(order => (
                      <div
                        key={order.id}
                        className={`relative group text-xs px-2 py-1 rounded bg-blue-100 border-blue-200 truncate`}
                      >
                        <div className="flex justify-between items-center">
                          <span>Order #{order.id}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              unscheduleOrder(order.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-xs cursor-pointer"
                            title="Remove order"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Slot workload indicator */}
                  {selectedOrder && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-xs font-medium text-right">
                        <span className="text-gray-500">Workload:</span>
                      </div>
                      
                      {version === 'b' && (
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${workload}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {version === 'a' && (
                        <div className="flex justify-end items-center text-xs">
                          <span className="text-gray-500">
                            {workload}% utilized
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 