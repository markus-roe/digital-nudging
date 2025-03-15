import { useState } from 'react';
import { Order, Driver, Assignment } from '@/lib/types/orderAssignment';

export function useOrderAssignment(initialOrders: Order[], initialDrivers: Driver[]) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [sequenceErrors, setSequenceErrors] = useState(0);
  const [zoneMatchErrors, setZoneMatchErrors] = useState(0);
  const assignedOrdersCount = Object.keys(assignments).length;
  
  // Handle order selection
  const handleOrderSelect = (orderId: string) => {
    if (selectedOrder === orderId) {
      // Deselecting the order
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
    }
  };
  
  // Assign order to driver
  const assignOrderToDriver = (orderId: string, driverId: string) => {
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
        setSequenceErrors(prev => prev + 1);
      }
      
      // Check for zone matching error
      const orderZone = order.zone;
      const driverZone = driver.location;
      
      if (orderZone !== driverZone) {
        setZoneMatchErrors(prev => prev + 1);
      }
      
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
      setSelectedOrder(null);
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
    selectedOrder,
    sequenceErrors,
    zoneMatchErrors,
    assignedOrdersCount,
    handleOrderSelect,
    assignOrderToDriver,
    unassignOrder
  };
} 