import { useState, useCallback } from 'react';
import { 
  ScheduledOrder, 
  TimeSlot, 
  DriverScheduleInfo
} from '@/lib/data/deliverySchedulingData';

interface SchedulingError {
  orderId: string;
  errorType: 'preference_mismatch' | 'high_workload';
  description: string;
}

export const useDeliveryScheduling = (
  initialOrders: ScheduledOrder[],
  initialTimeSlots: TimeSlot[],
  initialDriverWorkloads: DriverScheduleInfo[]
) => {
  // State
  const [orders, setOrders] = useState<ScheduledOrder[]>(initialOrders);
  const [timeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [driverWorkloads] = useState<DriverScheduleInfo[]>(initialDriverWorkloads);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(initialOrders[0].id);
  const [schedulingErrors, setSchedulingErrors] = useState<SchedulingError[]>([]);
  
  // Get order by ID
  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);
  
  // Check if a time slot is within the preferred time range for an order
  const isPreferredTimeSlot = useCallback((orderId: string, timeSlotId: string) => {
    const order = getOrderById(orderId);
    if (!order) return false;
    
    const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
    if (!timeSlot) return false;
    
    // Get time range bounds
    const preferredRange = order.preferredTimeRange.split(' - ');
    const slotRange = timeSlot.time.split(' - ');
    
    // Check if the time slot is within the preferred range
    return slotRange[0] >= preferredRange[0] && slotRange[1] <= preferredRange[1];
  }, [getOrderById, timeSlots]);
  
  // Get driver workload for a given driver and time slot
  const getDriverWorkload = useCallback((driverId: string, timeSlotId: string) => {
    const driverInfo = driverWorkloads.find(d => d.driverId === driverId);
    return driverInfo ? driverInfo.timeSlotWorkloads[timeSlotId] || 0 : 0;
  }, [driverWorkloads]);
  
  // Get all time slots a driver is scheduled for
  const getDriverTimeSlots = useCallback((driverId: string) => {
    const driverOrders = orders.filter(order => 
      order.driverId === driverId && order.scheduledTimeSlotId !== null
    );
    
    return driverOrders.reduce((acc, order) => {
      const timeSlotId = order.scheduledTimeSlotId;
      if (timeSlotId) {
        if (!acc[timeSlotId]) {
          acc[timeSlotId] = 0;
        }
        acc[timeSlotId]++;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [orders]);
  
  // Handle order selection
  const handleOrderSelect = useCallback((orderId: string) => {
    setSelectedOrder(prevSelected => prevSelected === orderId ? null : orderId);
  }, []);
  
  // Schedule order to a time slot
  const scheduleOrderToTimeSlot = useCallback((orderId: string, timeSlotId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;
    
    // Get customer preferences
    const isPreferred = isPreferredTimeSlot(orderId, timeSlotId);
    
    // Get workload for this driver/timeslot
    const workload = getDriverWorkload(order.driverId, timeSlotId);
    const isHighWorkload = workload >= 70;
    
    // Update orders
    setOrders(prevOrders => prevOrders.map(o => 
      o.id === orderId ? { ...o, scheduledTimeSlotId: timeSlotId } : o
    ));
    
    // Track errors if any
    const newErrors: SchedulingError[] = [];
    
    if (!isPreferred) {
      newErrors.push({
        orderId,
        errorType: 'preference_mismatch',
        description: 'Order scheduled outside customer preferred time slots'
      });
    }
    
    if (isHighWorkload) {
      newErrors.push({
        orderId,
        errorType: 'high_workload',
        description: 'Order scheduled during high workload time for driver'
      });
    }
    
    if (newErrors.length > 0) {
      setSchedulingErrors(prev => [...prev, ...newErrors]);
    }
    
    // Clear selection
    setSelectedOrder(null);
  }, [getOrderById, isPreferredTimeSlot, getDriverWorkload]);
  
  // Unschedule an order
  const unscheduleOrder = useCallback((orderId: string) => {
    setOrders(prevOrders => prevOrders.map(o => 
      o.id === orderId ? { ...o, scheduledTimeSlotId: null } : o
    ));
    
    // Remove errors related to this order
    setSchedulingErrors(prev => prev.filter(e => e.orderId !== orderId));
  }, []);
  
  // Calculate scheduling completion stats
  const scheduledOrdersCount = orders.filter(o => o.scheduledTimeSlotId !== null).length;
  const totalOrdersCount = orders.length;
  const allOrdersScheduled = scheduledOrdersCount === totalOrdersCount;
  
  // Calculate error stats
  const preferenceErrorsCount = schedulingErrors.filter(e => e.errorType === 'preference_mismatch').length;
  const workloadErrorsCount = schedulingErrors.filter(e => e.errorType === 'high_workload').length;
  
  return {
    orders,
    timeSlots,
    selectedOrder,
    schedulingErrors,
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
  };
}; 