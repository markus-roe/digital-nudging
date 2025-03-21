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
  getDriverTimeSlots?: (driverId: string) => Record<string, number>;
  version: ExperimentVersion;
}

export default function TimeSlotsPanel({
  timeSlots,
  orders,
  selectedOrderId,
  onSchedule,
  onUnschedule,
  getDriverWorkload,
  getDriverTimeSlots,
  version
}: TimeSlotsPanelProps) {
  // Get selected order details
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;
    
  // Group scheduled orders by time slot and by driver
  const ordersByTimeSlot: Record<string, Record<string, ScheduledOrder[]>> = {};
  
  // Create a map of time slots and drivers
  orders.forEach(order => {
    if (order.scheduledTimeSlotId) {
      if (!ordersByTimeSlot[order.scheduledTimeSlotId]) {
        ordersByTimeSlot[order.scheduledTimeSlotId] = {};
      }
      
      if (!ordersByTimeSlot[order.scheduledTimeSlotId][order.driverId]) {
        ordersByTimeSlot[order.scheduledTimeSlotId][order.driverId] = [];
      }
      
      ordersByTimeSlot[order.scheduledTimeSlotId][order.driverId].push(order);
    }
  });
  
  // Get all unique drivers
  const uniqueDrivers = [...new Set(orders.map(order => order.driverId))];
  const driverColors: Record<string, string> = {};
  
  // Assign colors to drivers (for visual distinction)
  const colorClasses = [
    'bg-indigo-200 border-indigo-300',
    'bg-teal-200 border-teal-300',
    'bg-amber-200 border-amber-300',
    'bg-rose-200 border-rose-300'
  ];
  
  uniqueDrivers.forEach((driverId, index) => {
    driverColors[driverId] = colorClasses[index % colorClasses.length];
  });
  
  // Get progress bar color based on workload
  const getProgressBarColor = (workload: number) => {
    if (workload <= 30) return 'bg-green-500';
    if (workload <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Check if a driver already has orders scheduled in other time slots
  const getDriverOtherTimeSlots = (driverId: string, currentTimeSlotId: string) => {
    if (!getDriverTimeSlots) return [];
    
    const slots = getDriverTimeSlots(driverId);
    const otherSlots = Object.entries(slots)
      .filter(([slotId]) => slotId !== currentTimeSlotId)
      .map(([slotId, count]) => {
        const slot = timeSlots.find(s => s.id === slotId);
        return {
          id: slotId,
          time: slot?.time || '',
          count
        };
      });
      
    return otherSlots;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
      <h2 className="text-lg font-medium mb-4">Schedule Time Slots</h2>
      
      {/* Driver Color Legend */}
      {uniqueDrivers.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500">Drivers:</span>
          {uniqueDrivers.map(driverId => {
            const driver = orders.find(order => order.driverId === driverId);
            if (!driver) return null;
            
            return (
              <div key={driverId} className="flex items-center">
                <span className={`inline-block w-3 h-3 mr-1 rounded-sm ${driverColors[driverId]}`}></span>
                <span className="text-xs">{driver.driverName}</span>
              </div>
            );
          })}
        </div>
      )}
      
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
              const drivers = ordersByTimeSlot[timeSlot.id] || {};
              const totalOrdersInSlot = Object.values(drivers).flat().length;
              
              // Calculate workload indicators if there's a selected order
              const workload = selectedOrder 
                ? getDriverWorkload(selectedOrder.driverId, timeSlot.id) 
                : 0;
                
              const canSchedule = selectedOrder && !selectedOrder.scheduledTimeSlotId;

              // Get other time slots where the driver is scheduled (if applicable)
              const otherTimeSlots = selectedOrder && getDriverTimeSlots
                ? getDriverOtherTimeSlots(selectedOrder.driverId, timeSlot.id)
                : [];

              const hasDriverInOtherSlots = otherTimeSlots.length > 0;
              
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
                    {totalOrdersInSlot > 0 && (
                      <span className="bg-gray-100 border border-gray-300 text-gray-700 text-xs px-1.5 rounded">
                        {totalOrdersInSlot}
                      </span>
                    )}
                  </div>
                  
                  {/* Customer preference indicator removed to focus on workload nudging */}
                  
                  {/* Driver blocks */}
                  <div className="mt-1 space-y-1">
                    {Object.entries(drivers).map(([driverId, driverOrders]) => (
                      <div
                        key={driverId}
                        className={`relative group text-xs px-2 py-1 rounded ${driverColors[driverId]} truncate`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{driverOrders[0].driverName} {driverOrders.length > 1 && `(${driverOrders.length})`}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              driverOrders.forEach(order => onUnschedule(order.id));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-xs"
                            title="Remove all orders for this driver"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {/* Order numbers (small and discrete) */}
                        <div className="mt-0.5 text-xs text-gray-600 truncate">
                          {driverOrders.map((order, i) => (
                            <span key={order.id}>
                              {order.orderNumber}
                              {i < driverOrders.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Driver availability/workload indicator - different for versions A and B */}
                  {selectedOrder && (
                    <div className="absolute bottom-1 left-2 right-2">
                      {/* Version A: Basic numerical workload without visual cues */}
                      {version === 'a' && (
                        <div className="text-xs text-right">
                          <span className="text-gray-500">
                            Driver workload: {workload}%
                          </span>
                        </div>
                      )}
                      
                      {/* Version B: Enhanced visual indicator with color-coding and availability (digital nudging) */}
                      {version === 'b' && (
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${getProgressBarColor(workload)}`}
                              style={{ width: `${Math.min(workload, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className={`${workload > 70 ? 'text-red-600' : workload > 30 ? 'text-amber-600' : 'text-green-600'} font-medium`}>
                              {workload > 70 ? 'High workload' : workload > 30 ? 'Medium workload' : 'Low workload'}
                            </span>
                            <span className="text-gray-500">
                              {5 - Math.round(workload / 20)} / 5 slots available
                            </span>
                          </div>
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