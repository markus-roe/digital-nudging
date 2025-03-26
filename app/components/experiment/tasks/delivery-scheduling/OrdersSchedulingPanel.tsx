import React from 'react';
import { ScheduledOrder } from '@/lib/data/deliverySchedulingData';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';

interface OrdersSchedulingPanelProps {
  orders: ScheduledOrder[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
}

export default function OrdersSchedulingPanel({
  orders,
  selectedOrderId,
  onOrderSelect,
}: OrdersSchedulingPanelProps) {
  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = orders.map(order => {
    const isScheduled = order.scheduledTimeSlotId !== null;
    
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      priority: order.priority,
      status: isScheduled ? 'Scheduled' : undefined,
      isCompleted: isScheduled,
      additionalInfo: order.preferredTimeRange,
      highlightTimeRange: true,
    };
  });
  
  // If there are no orders, show empty state
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
        <h2 className="font-medium text-gray-800 mb-3">Orders Pending Scheduling</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No orders available</p>
        </div>
      </div>
    );
  }
  
  // Otherwise, show the OrdersList component
  return (
    <OrdersList
      orders={orderItems}
      selectedOrderId={selectedOrderId}
      onOrderSelect={onOrderSelect}
      title="Orders Pending Scheduling"
    />
  );
}
