import React from 'react';
import { ScheduledOrder } from '@/lib/data/deliverySchedulingData';
import { useExperiment } from '@/lib/context/ExperimentContext';
import { useDeliverySchedulingContext } from '@/lib/context/DeliverySchedulingContext';
import OrdersList, { OrderItem } from '@/app/components/experiment/shared/OrdersList';

export default function OrdersSchedulingPanel() {
  const { version } = useExperiment();
  const {
    orders,
    selectedOrder,
    handleOrderSelect,
    isPreferredTimeSlot,
    timeSlots
  } = useDeliverySchedulingContext();
  
  // Transform orders to match OrderItem interface
  const orderItems: OrderItem[] = orders.map(order => {
    const isScheduled = order.scheduledTimeSlot !== null;
    
    return {
      id: order.id,
      customer: order.customer,
      status: isScheduled ? 'Scheduled' : undefined,
      isCompleted: isScheduled,
      preferredTimeRange: order.preferredTimeRange,
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
      selectedOrderId={selectedOrder}
      onOrderSelect={handleOrderSelect}
      title="Orders Pending Scheduling"
    />
  );
}
