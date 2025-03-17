import { useState, useCallback, useEffect } from 'react';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { validateOrderData } from '@/lib/utils/orderValidationUtils';

export function useOrderValidation(initialOrders: OrderValidation[]) {
  const [orders, setOrders] = useState<OrderValidation[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [validatedOrderIds, setValidatedOrderIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Calculate validated orders count from the Set
  const validatedOrdersCount = validatedOrderIds.size;
  
  // Get the currently selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;
  
  // Initialize the selected order on component mount
  useEffect(() => {
    if (!selectedOrderId && orders.length > 0) {
      // Find the first order with errors, if any
      const firstOrderWithErrors = orders.find(order => order.hasErrors);
      // If no orders have errors, just select the first order
      const firstOrderId = firstOrderWithErrors ? firstOrderWithErrors.id : orders[0].id;
      setSelectedOrderId(firstOrderId);
    }
  }, [orders, selectedOrderId]);
  
  // Handle order selection
  const handleOrderSelect = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setFormErrors({});
  }, []);
  
  // Find the next unvalidated order
  const findNextUnvalidatedOrder = useCallback((currentOrderId: string) => {
    // Get the index of the current order
    const currentIndex = orders.findIndex(order => order.id === currentOrderId);
    
    // Start looking from the next order
    for (let i = currentIndex + 1; i < orders.length; i++) {
      if (orders[i].hasErrors) {
        return orders[i].id;
      }
    }
    
    // If no orders found after current one, look from the beginning
    for (let i = 0; i < currentIndex; i++) {
      if (orders[i].hasErrors) {
        return orders[i].id;
      }
    }
    
    // If no unvalidated orders found, return empty string
    return '';
  }, [orders]);
  
  // Submit validation
  const submitValidation = useCallback((orderId: string, formData: OrderValidationFormData) => {
    // Validate the form data
    const validationErrors = validateOrderData(formData);
    const hasErrors = Object.keys(validationErrors).length > 0;
    
    if (hasErrors) {
      // Update form errors
      setFormErrors(validationErrors);
      return false;
    }
    
    // Update the order with new data
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            ...formData,
            hasErrors: false
          };
        }
        return order;
      })
    );
    
    // Mark order as validated
    setValidatedOrderIds(prev => {
      const newSet = new Set(prev);
      newSet.add(orderId);
      return newSet;
    });
    
    // Clear form errors before changing the selection
    // This prevents the brief flash of error styling
    setFormErrors({});
    
    // Find the next unvalidated order and select it
    const nextOrderId = findNextUnvalidatedOrder(orderId);
    setSelectedOrderId(nextOrderId);
    
    return true;
  }, [findNextUnvalidatedOrder]);
  
  return {
    orders,
    selectedOrder,
    selectedOrderId,
    validatedOrdersCount,
    formErrors,
    handleOrderSelect,
    submitValidation
  };
} 