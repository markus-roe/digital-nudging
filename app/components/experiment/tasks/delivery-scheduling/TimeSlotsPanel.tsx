import React from 'react';
import { 
  TimeSlot, 
  ScheduledOrder
} from '@/lib/data/deliverySchedulingData';
import { ExperimentVersion } from '@/lib/types/experiment';

interface TimeSlotsPanelProps {
  timeSlots: TimeSlot[];
  orders: ScheduledOrder[];
  selectedOrderId: string | null;
  onSchedule: (orderId: string, timeSlotId: string) => void;
  onUnschedule: (orderId: string) => void;
  getDriverWorkload: (driverId: string, timeSlotId: string) => number;
  version: ExperimentVersion;
}

export default function TimeSlotsPanel({
  timeSlots,
  orders,
  selectedOrderId,
  onSchedule,
  onUnschedule,
  getDriverWorkload,
  version
}: TimeSlotsPanelProps) {
  // Get selected order details
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;
    
  // Group scheduled orders by time slot
  const ordersByTimeSlot: Record<string, ScheduledOrder[]> = {};
  
  // Create a map of time slots and orders
  orders.forEach(order => {
    if (order.scheduledTimeSlotId) {
      if (!ordersByTimeSlot[order.scheduledTimeSlotId]) {
        ordersByTimeSlot[order.scheduledTimeSlotId] = [];
      }
      
      ordersByTimeSlot[order.scheduledTimeSlotId].push(order);
    }
  });
  
  
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
            {timeSlots.map(timeSlot => {
              const ordersInSlot = ordersByTimeSlot[timeSlot.id] || [];
              // Calculate workload indicators if there's a selected order
              const workload = selectedOrder 
                ? getDriverWorkload(selectedOrder.driverId, timeSlot.id) 
                : 0;
                
              const canSchedule = selectedOrder && !selectedOrder.scheduledTimeSlotId;
              
              return (
                <div 
                  key={timeSlot.id} 
                  className={`h-36 p-2 relative ${canSchedule ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                  onClick={() => {
                    if (canSchedule) {
                      onSchedule(selectedOrder.id, timeSlot.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{timeSlot.time}</span>
                  </div>
                  
                  {/* Scheduled Orders */}
                  <div className="mt-1 space-y-1">
                    {ordersInSlot.map(order => (
                      <div
                        key={order.id}
                        className={`relative group text-xs px-2 py-1 rounded bg-blue-100 border-blue-200 truncate`}
                      >
                        <div className="flex justify-between items-center">
                          <span>Order #{order.orderNumber}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnschedule(order.id);
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
                  
                  {/* Slot availability indicator - different for versions A and B */}
                  {selectedOrder && (
                    <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs font-medium text-right">
                          <span className="text-gray-500">
                            Driver Workload: 
                          </span>
                        </div>
                      
                      {/* Version B: Enhanced visual indicator with color-coding and availability (digital nudging) */}
                      {version === 'b' && (
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${Math.min(workload, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {version === 'a' && (
                      <div className="flex justify-end items-center text-xs">
                      <span className="text-gray-500">
                          <span className="font-semibold">{Math.round(workload / 20)}/5</span> slots used
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