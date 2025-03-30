import { useState } from 'react';
import { Order, Driver, Assignment } from '@/lib/types/orderAssignment';
import { useActionLogger } from '@/lib/hooks/useActionLogger';
import { ActionType } from '@/lib/types/logging';

export function useOrderAssignment(initialOrders: Order[], initialDrivers: Driver[]) {
  const { logAction } = useActionLogger();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sequenceErrors, setSequenceErrors] = useState(0);
  const [zoneMatchErrors, setZoneMatchErrors] = useState(0);
  const assignedOrdersCount = Object.keys(assignments).length;
  
  // Handle order selection
  const handleOrderSelect = (orderId: string) => {
    if (selectedOrderId === orderId) {
      // Deselecting the order
      setSelectedOrderId(null);
    } else {
      setSelectedOrderId(orderId);
      logAction(ActionType.ORDER_SELECT, 0);
    }
  };
  
  // Assign order to driver
  const assignOrderToDriver = (orderId: string, driverId: string) => {
    const startTime = Date.now();
    const order = orders.find(o => o.id === orderId);
    const driver = drivers.find(d => d.id === driverId);
    
    if (order && driver) {
      // Check if this assignment would violate priority sequence
      const highPriorityPending = orders.some(o => 
        o.priority === 'High' && 
        o.id !== orderId && 
        !assignments[o.id]
      );
      
      const mediumPriorityPending = orders.some(o => 
        o.priority === 'Medium' && 
        o.id !== orderId && 
        !assignments[o.id]
      );
      
      let sequenceError = false;
      
      if (order.priority === 'Low' && (highPriorityPending || mediumPriorityPending)) {
        sequenceError = true;
      } else if (order.priority === 'Medium' && highPriorityPending) {
        sequenceError = true;
      }
      
      if (sequenceError) {
        console.warn('Sequence error');
      }
      
      // Check for zone matching error
      let zoneMatchError = false;

      const orderZone = order.zone;
      const driverZone = driver.location;
      
      if (orderZone !== driverZone) {
        zoneMatchError = true;
      }
      
      if (zoneMatchError) {
        console.warn('Zone match error');
      }

      let errors = 0;
      if (sequenceError) errors++;
      if (zoneMatchError) errors++;

      // Log the case submission with proper action type
      logAction(
        ActionType.CASE_SUBMIT,
        errors
      );

      // Update order status
      setOrders(prevOrders => 
        prevOrders.map(o => {
          if (o.id === orderId) {
            return { ...o, status: 'Assigned' };
          }
          return o;
        })
      );
      
      // Record assignment
      setAssignments(prev => {
        const newAssignments = {
          ...prev,
          [orderId]: { driverId }
        };
        
        return newAssignments;
      });
      
      // Clear selection
      setSelectedOrderId(null);
    }
  };
  
  // Unassign order
  const unassignOrder = (orderId: string) => {
    if (assignments[orderId]) {
      // Remove from assignments
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[orderId];
        
        return newAssignments;
      });
      
      // Update order status
      setOrders(prevOrders => 
        prevOrders.map(o => {
          if (o.id === orderId) {
            return { ...o, status: 'Pending' };
          }
          return o;
        })
      );
    }
  };
  
  return {
    orders,
    drivers,
    assignments,
    selectedOrder: selectedOrderId ? orders.find(o => o.id === selectedOrderId) ?? null : null,
    selectedOrderId,
    selectedDriver: null, // Add driver selection state if needed
    assignedOrdersCount,
    handleOrderSelect,
    handleDriverSelect: (driverId: string) => {
      if (selectedOrderId) {
        assignOrderToDriver(selectedOrderId, driverId);
      }
    },
    handleAssignOrder: assignOrderToDriver,
    handleUnassignOrder: unassignOrder,
    getOrderStatusClass: (order: Order) => "border-gray-300", // Add proper styling logic
    getDriverStatusClass: (driver: Driver) => "border-gray-300" // Add proper styling logic
  };
} 