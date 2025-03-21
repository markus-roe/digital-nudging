import React from 'react';
import { ScheduledOrder, TimeSlot } from '@/lib/data/deliverySchedulingData';
import { ExperimentVersion } from '@/lib/types/experiment';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';

interface OrdersSchedulingPanelProps {
  orders: ScheduledOrder[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
  version: ExperimentVersion;
  timeSlots: TimeSlot[];
}

export default function OrdersSchedulingPanel({
  orders,
  selectedOrderId,
  onOrderSelect,
  version,
  timeSlots
}: OrdersSchedulingPanelProps) {
  // Filter unscheduled orders
  const unscheduledOrders = orders.filter(order => order.scheduledTimeSlotId === null);
  
  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = unscheduledOrders.map(order => {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customerName,
      priority: order.priority,
      status: 'Assigned',
      isCompleted: false,
      additionalInfo: `Preferred: ${order.preferredTimeRange}`
    };
  });
  
  // If there are no unscheduled orders, show empty state
  if (unscheduledOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
        <h2 className="font-medium text-gray-800 mb-3">Orders Pending Scheduling</h2>
        <div className="text-center py-8 text-gray-500">
          <p>All orders have been scheduled!</p>
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
