import React, { createContext, useContext, ReactNode } from 'react';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { useOrderValidation } from '@/lib/hooks/useOrderValidation';
import { useExperiment } from '@/lib/context/ExperimentContext';

interface OrderValidationContextType {
  // Order management
  orders: OrderValidation[];
  selectedOrder: OrderValidation | null;
  selectedOrderId: string | null;
  validatedOrdersCount: number;
  handleOrderSelect: (orderId: string) => void;
  allOrdersValidated: boolean;
  // Form management
  formData: OrderValidationFormData;
  formErrors: Record<string, string>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  
  // UI helpers
  getInputClass: (fieldName: string) => string;
  shouldShowError: (fieldName: string) => boolean;
  getErrorMessage: (field: string) => string;
}

const OrderValidationContext = createContext<OrderValidationContextType | null>(null);

export function OrderValidationProvider({ children, initialOrders }: { children: ReactNode; initialOrders: OrderValidation[] }) {
  const { version } = useExperiment();
  const validationState = useOrderValidation({ initialOrders, version });
  
  return (
    <OrderValidationContext.Provider value={validationState}>
      {children}
    </OrderValidationContext.Provider>
  );
}

export function useOrderValidationContext() {
  const context = useContext(OrderValidationContext);
  if (!context) {
    throw new Error('useOrderValidationContext must be used within OrderValidationProvider');
  }
  return context;
} 