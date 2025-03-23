import React from 'react';
import { OrderValidation } from '@/lib/types/orderValidation';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';

interface OrderValidationListProps {
  orders: OrderValidation[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
}

export default function OrderValidationList({
  orders,
  selectedOrderId,
  onOrderSelect
}: OrderValidationListProps) {
  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = orders.map(order => {
    const isValidated = !order.hasErrors;
    
    return {
      id: order.id,
      orderNumber: order.id,
      customer: order.customer,
      status: isValidated ? 'Validated' : 'Pending',
      isCompleted: isValidated
    };
  });
  
  return (
    <OrdersList
      orders={orderItems}
      selectedOrderId={selectedOrderId}
      onOrderSelect={onOrderSelect}
      title="Orders Pending Validation"
    />
  );
} 