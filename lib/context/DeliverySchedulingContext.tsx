import React, { createContext, useContext, ReactNode } from 'react';
import { 
  ScheduledOrder, 
  TimeSlot,
} from '@/lib/data/deliverySchedulingData';
import { useDeliveryScheduling } from '@/lib/hooks/useDeliveryScheduling';

interface DeliverySchedulingContextType {
  // Order management
  orders: ScheduledOrder[];
  timeSlots: TimeSlot[];
  selectedOrder: string | null;
  scheduledOrdersCount: number;
  totalOrdersCount: number;
  allOrdersScheduled: boolean;
  
  // Actions
  handleOrderSelect: (orderId: string) => void;
  scheduleOrderToTimeSlot: (orderId: string, timeSlot: TimeSlot) => void;
  unscheduleOrder: (orderId: string) => void;
  
  // Helpers
  isPreferredTimeSlot: (orderId: string, timeSlot: TimeSlot) => boolean;
  getDriverTimeSlots: () => Record<string, number>;
}

const DeliverySchedulingContext = createContext<DeliverySchedulingContextType | null>(null);

export function DeliverySchedulingProvider({ 
  children, 
  initialOrders,
  initialTimeSlots,
}: { 
  children: ReactNode; 
  initialOrders: ScheduledOrder[];
  initialTimeSlots: TimeSlot[];
}) {
  const schedulingState = useDeliveryScheduling(
    initialOrders,
    initialTimeSlots,
  );
  
  return (
    <DeliverySchedulingContext.Provider value={schedulingState}>
      {children}
    </DeliverySchedulingContext.Provider>
  );
}

export function useDeliverySchedulingContext() {
  const context = useContext(DeliverySchedulingContext);
  if (!context) {
    throw new Error('useDeliverySchedulingContext must be used within DeliverySchedulingProvider');
  }
  return context;
} 