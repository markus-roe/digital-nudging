import React, { createContext, useContext, ReactNode } from 'react';
import { Order, Driver, Assignment } from '@/lib/types/orderAssignment';
import { useOrderAssignment } from '@/lib/hooks/useOrderAssignment';
import { useExperiment } from '@/lib/context/ExperimentContext';

interface OrderAssignmentContextType {
  // Order management
  orders: Order[];
  selectedOrder: Order | null;
  selectedOrderId: string | null;
  assignedOrdersCount: number;
  handleOrderSelect: (orderId: string) => void;
  
  // Driver management
  drivers: Driver[];
  handleDriverSelect: (driverId: string) => void;
  selectedDriver: Driver | null;
  
  // Assignment management
  assignments: Record<string, Assignment>;
  handleAssignOrder: (orderId: string, driverId: string) => void;
  handleUnassignOrder: (orderId: string) => void;
  
  // UI helpers
  getOrderStatusClass: (order: Order) => string;
  getDriverStatusClass: (driver: Driver) => string;
}

const OrderAssignmentContext = createContext<OrderAssignmentContextType | null>(null);

export function OrderAssignmentProvider({ 
  children, 
  initialOrders,
  initialDrivers 
}: { 
  children: ReactNode; 
  initialOrders: Order[];
  initialDrivers: Driver[];
}) {
  const { version } = useExperiment();
  const assignmentState = useOrderAssignment(initialOrders, initialDrivers);
  
  return (
    <OrderAssignmentContext.Provider value={assignmentState}>
      {children}
    </OrderAssignmentContext.Provider>
  );
}

export function useOrderAssignmentContext() {
  const context = useContext(OrderAssignmentContext);
  if (!context) {
    throw new Error('useOrderAssignmentContext must be used within OrderAssignmentProvider');
  }
  return context;
} 