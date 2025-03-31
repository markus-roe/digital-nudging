import { useState, useCallback, useEffect } from 'react';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { validateOrderData } from '@/lib/utils/orderValidationUtils';
import { VALIDATION_MESSAGES } from '@/lib/constants/validationMessages';
import { ExperimentVersion } from '../types/experiment';
import { useActionLogger } from '@/lib/hooks/useActionLogger';
import { useErrorLogger } from '@/lib/hooks/useErrorLogger';

interface UseOrderValidationProps {
  initialOrders: OrderValidation[];
  version: ExperimentVersion;
}

export function useOrderValidation({ initialOrders, version }: UseOrderValidationProps) {
  const { logOrderSelect, logCaseSubmit } = useActionLogger();
  const { logValidationError } = useErrorLogger();
  const [orders, setOrders] = useState<OrderValidation[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [validatedOrderIds, setValidatedOrderIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OrderValidationFormData>({
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    deliveryInstructions: ''
  });
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Calculate validated orders count from the Set
  const validatedOrdersCount = validatedOrderIds.size;
  
  // Get the currently selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) ?? null
    : null;
  
  // Reset form data when order changes
  useEffect(() => {
    if (!selectedOrder) return;
    
    const newFormData = {
      address: selectedOrder.address,
      contactName: selectedOrder.contactName,
      contactPhone: selectedOrder.contactPhone,
      contactEmail: selectedOrder.contactEmail,
      deliveryInstructions: selectedOrder.deliveryInstructions
    };
    setFormData(newFormData);
    
    if (selectedOrder.hasErrors) {
      const validationErrors = validateOrderData(newFormData);
      setFormErrors(validationErrors);
      setValidatedFields(new Set());
    } else {
      setFormErrors({});
    }
    
    setHasSubmitted(false);
  }, [selectedOrder]);
  
  // Handle order selection
  const handleOrderSelect = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setFormErrors({});
    logOrderSelect(orderId);
  }, [logOrderSelect]);
  
  // Handle form changes
  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Only validate in real-time for version B
    if (version === 'b') {
      const validationErrors = validateOrderData(updatedFormData);
      
      setValidatedFields(prev => {
        const newSet = new Set(prev);
        newSet.add(name);
        return newSet;
      });
      
      setFormErrors(prev => {
        const newErrors = { ...prev };
        if (validationErrors[name]) {
          newErrors[name] = validationErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  }, [formData, version]);

    // Find the next unvalidated order
    const findNextUnvalidatedOrder = useCallback((currentOrderId: string) => {
      const currentIndex = orders.findIndex(order => order.id === currentOrderId);
      
      for (let i = currentIndex + 1; i < orders.length; i++) {
        if (orders[i].hasErrors) {
          return orders[i].id;
        }
      }
      
      for (let i = 0; i < currentIndex; i++) {
        if (orders[i].hasErrors) {
          return orders[i].id;
        }
      }
      
      return '';
    }, [orders]);

  // Handle form submission
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    
    setHasSubmitted(true);
    
    const validationErrors = validateOrderData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      console.warn('Validation errors:', validationErrors);
      setFormErrors(validationErrors);
      logValidationError(selectedOrderId);
      return;
    }
    
    // Update the order with new data
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === selectedOrderId) {
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
      newSet.add(selectedOrderId);
      return newSet;
    });
    
    // Clear form errors
    setFormErrors({});
    
    // Log successful case submission
    logCaseSubmit(selectedOrderId);
    
    // Find the next unvalidated order and select it
    const nextOrderId = findNextUnvalidatedOrder(selectedOrderId);
    if (nextOrderId) {
      setSelectedOrderId(nextOrderId);
      logOrderSelect(nextOrderId);
    }
  }, [formData, selectedOrderId, findNextUnvalidatedOrder, logCaseSubmit, logOrderSelect, logValidationError]);

  const shouldShowError = useCallback((fieldName: string): boolean => {
    if (version === 'a') {
      return hasSubmitted && !!formErrors[fieldName];
    }
    return !!formErrors[fieldName];
  }, [version, hasSubmitted, formErrors]);

  const getInputClass = useCallback((fieldName: string): string => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    
    if (version === 'a') {
      if (shouldShowError(fieldName)) {
        return `${baseClass} border-red-500 bg-red-50`;
      }
      return `${baseClass} border-gray-300`;
    }
    
    if (validatedFields.has(fieldName) && !formErrors[fieldName]) {
      return `${baseClass} border-gray-300`;
    }
    
    if (formErrors[fieldName] || (selectedOrder?.errors.includes(fieldName) && selectedOrder?.hasErrors)) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    
    return `${baseClass} border-gray-300`;
  }, [version, validatedFields, formErrors, selectedOrder, shouldShowError]);



  const getErrorMessage = useCallback((field: string): string => {
    if (formErrors[field]) {
      return formErrors[field];
    }
    
    switch (field) {
      case 'address':
        return VALIDATION_MESSAGES.address.format;
      case 'contactName':
        return VALIDATION_MESSAGES.contactName.required;
      case 'contactPhone':
        return VALIDATION_MESSAGES.contactPhone.format;
      case 'contactEmail':
        return VALIDATION_MESSAGES.contactEmail.format;
      default:
        return '';
    }
  }, [formErrors]);
  
  return {
    orders,
    selectedOrder,
    selectedOrderId,
    validatedOrdersCount,
    formData,
    formErrors,
    handleOrderSelect,
    handleFormChange,
    handleFormSubmit,
    getInputClass,
    shouldShowError,
    getErrorMessage
  };
} 