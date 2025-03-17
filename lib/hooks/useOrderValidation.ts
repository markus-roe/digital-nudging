import { useState, useCallback } from 'react';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { validateOrderData } from '@/lib/utils/orderValidationUtils';

export function useOrderValidation(initialOrders: OrderValidation[]) {
  const [orders, setOrders] = useState<OrderValidation[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [validatedOrdersCount, setValidatedOrdersCount] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [correctionTime, setCorrectionTime] = useState<Record<string, number>>({});
  
  // Get the currently selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;
  
  // Handle order selection
  const handleOrderSelect = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setFormErrors({});
  }, []);
  
  // Handle form data update
  const updateOrderData = useCallback((orderId: string, formData: OrderValidationFormData) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            ...formData,
            hasErrors: false,
            errors: {}
          };
        }
        return order;
      })
    );
  }, []);
  
  // Submit validation
  const submitValidation = useCallback((orderId: string, formData: OrderValidationFormData) => {
    const validationErrors = validateOrderData(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      // No errors, update the order
      updateOrderData(orderId, formData);
      setValidatedOrdersCount(prev => prev + 1);
      // setSelectedOrderId(null);
      setFormErrors({});
      return true;
    } else {
      // Has errors, update the form errors
      setFormErrors(validationErrors);
      return false;
    }
  }, [updateOrderData]);
  
  // Record correction time
  const recordCorrectionTime = useCallback((orderId: string, timeInSeconds: number) => {
    setCorrectionTime(prev => ({
      ...prev,
      [orderId]: timeInSeconds
    }));
  }, []);
  
  return {
    orders,
    selectedOrder,
    selectedOrderId,
    validatedOrdersCount,
    formErrors,
    correctionTime,
    handleOrderSelect,
    updateOrderData,
    submitValidation,
    recordCorrectionTime
  };
} 