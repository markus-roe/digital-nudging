import { useState, useCallback, useEffect } from 'react';
import { 
  ScheduledOrder, 
  TimeSlot,
} from '@/lib/data/deliverySchedulingData';
import { useActionLogger } from '@/lib/hooks/useActionLogger';
import { useErrorLogger } from '@/lib/hooks/useErrorLogger';

export const useDeliveryScheduling = (
  initialOrders: ScheduledOrder[],
  initialTimeSlots: TimeSlot[],
) => {
  const { logOrderSelect, logCaseSubmit } = useActionLogger();
  const { logSchedulingError } = useErrorLogger();

  // State
  const [orders, setOrders] = useState<ScheduledOrder[]>(initialOrders);
  const [timeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(initialOrders[0].id);
  
  // Initialize first order selection
  useEffect(() => {
    if (initialOrders.length > 0) {
      logOrderSelect(initialOrders[0].id);
    }
  }, [initialOrders, logOrderSelect]);
  
  // Get order by ID
  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);
  
  // Check if a time slot is within the preferred time range for an order
  const isPreferredTimeSlot = useCallback((orderId: string, timeSlot: TimeSlot) => {
    const order = getOrderById(orderId);
    if (!order) return false;
    
    return timeSlot.start >= order.preferredTimeRange.start && 
           timeSlot.end <= order.preferredTimeRange.end;
  }, [getOrderById]);
  
  // Get all time slots a driver is scheduled for
  const getDriverTimeSlots = useCallback(() => {
    const driverOrders = orders.filter(order => 
      order.scheduledTimeSlot !== null
    );
    
    return driverOrders.reduce((acc, order) => {
      const timeSlot = order.scheduledTimeSlot;
      if (timeSlot) {
        if (!acc[timeSlot.id]) {
          acc[timeSlot.id] = 0;
        }
        acc[timeSlot.id]++;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [orders]);
  
  // Handle order selection with validation
  const handleOrderSelect = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.scheduledTimeSlot === null) {
      setSelectedOrder(prevSelected => {
        const newSelected = prevSelected === orderId ? null : orderId;
        if (newSelected) {
          logOrderSelect(newSelected);
        }
        return newSelected;
      });
    }
  }, [orders, logOrderSelect]);
  
  // Schedule order to a time slot
  const scheduleOrderToTimeSlot = useCallback((orderId: string, timeSlot: TimeSlot) => {
    const order = getOrderById(orderId);
    if (!order) return;
    
    // Get customer preferences
    const isPreferred = isPreferredTimeSlot(orderId, timeSlot);
    
    // Get the workload for this time slot
    const selectedSlotWorkload = order.timeSlotWorkloads.find(
      w => w.timeSlotId === timeSlot.id
    )?.workload ?? Infinity;
    
    // Get workloads only for preferred time slots
    const preferredSlotWorkloads = timeSlots.map(ts => ({
      timeSlot: ts,
      workload: isPreferredTimeSlot(orderId, ts) 
        ? order.timeSlotWorkloads.find(w => w.timeSlotId === ts.id)?.workload ?? Infinity
        : Infinity
    }));
    
    const minWorkload = Math.min(...preferredSlotWorkloads.map(tw => tw.workload));
    const isOptimalWorkload = selectedSlotWorkload === minWorkload;
    
    // Update orders
    setOrders(prevOrders => prevOrders.map(o => 
      o.id === orderId ? { ...o, scheduledTimeSlot: timeSlot } : o
    ));
    
    // Track errors if any
    let preferenceMismatchError = false;
    let highWorkloadError = false;

    if (!isPreferred) {
      preferenceMismatchError = true;
      logSchedulingError(orderId);
    }
    
    if (isPreferred && !isOptimalWorkload) {
      highWorkloadError = true;
      logSchedulingError(orderId);
    }

    if (preferenceMismatchError) {
      console.warn('Preference mismatch error');
    }

    if (highWorkloadError) {
      console.warn('High workload error');
    }
    
    // Log successful case submission
    logCaseSubmit(orderId);
    
    // Clear selection
    setSelectedOrder(null);
  }, [getOrderById, isPreferredTimeSlot, timeSlots, logCaseSubmit, logSchedulingError]);
  
  // Unschedule an order
  const unscheduleOrder = useCallback((orderId: string) => {
    setOrders(prevOrders => prevOrders.map(o => 
      o.id === orderId ? { ...o, scheduledTimeSlot: null } : o
    ));
  }, []);
  
  // Calculate scheduling completion stats
  const scheduledOrdersCount = orders.filter(o => o.scheduledTimeSlot !== null).length;
  const totalOrdersCount = orders.length;
  const allOrdersScheduled = scheduledOrdersCount === totalOrdersCount;
  
  return {
    orders,
    timeSlots,
    selectedOrder,
    scheduledOrdersCount,
    totalOrdersCount,
    allOrdersScheduled,
    handleOrderSelect,
    scheduleOrderToTimeSlot,
    unscheduleOrder,
    isPreferredTimeSlot,
    getDriverTimeSlots
  };
}; 