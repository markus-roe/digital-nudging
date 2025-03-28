import React, { createContext, useContext, ReactNode } from 'react';
import { 
  ScheduledOrder, 
  TimeSlot,
  TimeRange,
  TimeSlotWorkload
} from '@/lib/data/deliverySchedulingData';
import { useDeliveryScheduling } from '@/lib/hooks/useDeliveryScheduling';
import { useExperiment } from '@/lib/context/ExperimentContext';

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
  participantId 
}: { 
  children: ReactNode; 
  initialOrders: ScheduledOrder[];
  initialTimeSlots: TimeSlot[];
  participantId: string;
}) {
  const schedulingState = useDeliveryScheduling(
    initialOrders,
    initialTimeSlots,
    participantId
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