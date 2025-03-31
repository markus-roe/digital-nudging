import React from 'react';
import { OrderValidation } from '@/lib/types/orderValidation';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';
import { useOrderValidationContext } from '@/lib/context/OrderValidationContext';

export default function OrderValidationList() {
  const {
    orders,
    selectedOrderId,
    handleOrderSelect
  } = useOrderValidationContext();

  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = orders.map(order => {
    const isValidated = !order.hasErrors;
    
    return {
      id: order.id,
      customer: order.customer,
      status: isValidated ? 'Validated' : 'Pending',
      isCompleted: isValidated
    };
  });
  
  return (
    <OrdersList
      orders={orderItems}
      selectedOrderId={selectedOrderId}
      onOrderSelect={handleOrderSelect}
      title="Orders Pending Validation"
    />
  );
} 