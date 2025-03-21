import React from 'react';
import { Order, Assignment } from '@/lib/types/orderAssignment';
import { ExperimentVersion } from '@/lib/types/experiment';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';

interface OrdersListProps {
  orders: Order[];
  selectedOrderId: string | null;
  assignments: Record<string, Assignment>;
  onOrderSelect: (orderId: string) => void;
  version: ExperimentVersion;
}

export default function OrderAssignmentList({
  orders,
  selectedOrderId,
  assignments,
  onOrderSelect,
  version
}: OrdersListProps) {
  // Filter orders that haven't been assigned yet
  const pendingOrders = orders.filter(order => !assignments[order.id]);
  
  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = pendingOrders.map(order => ({
    id: order.id,
    orderNumber: order.id, // Use id as orderNumber
    customer: order.customer,
    priority: order.priority,
    status: 'Pending',
    isCompleted: false
  }));
  
  return (
    <OrdersList
      orders={orderItems}
      selectedOrderId={selectedOrderId}
      onOrderSelect={onOrderSelect}
      title="Orders Pending Assignment"
      showBadge={true}
    />
  );
}