import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export interface OrderItem {
  id: string;
  customer: string;
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Pending' | 'Validated' | 'Assigned' | 'Scheduled';
  isCompleted?: boolean;
  preferredTimeRange?: { start: string; end: string };
}

interface OrdersListProps {
  orders: OrderItem[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
  title: string;
}

export default function OrdersList({
  orders,
  selectedOrderId,
  onOrderSelect,
  title,
}: OrdersListProps) {
  
  // Base badge style for all badges - use a standardized badge style
  const baseBadgeClass = "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border";
  
  // Get time range badge
  const getTimeRangeBadge = (timeRange?: { start: string; end: string }) => {
    if (!timeRange) return null;
    
    return (
      <span className={`${baseBadgeClass} bg-blue-50 text-blue-800 border-blue-200`}>
        {timeRange.start} - {timeRange.end}
      </span>
    );
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'Scheduled') {
      return (
        <span className={`${baseBadgeClass} bg-green-50 text-green-800 border-green-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
          Scheduled
        </span>
      );
    } else if (status === 'Validated') {
      return (
        <span className={`${baseBadgeClass} bg-green-50 text-green-800 border-green-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
          Validated
        </span>
      );
    } else if (status === 'Pending') {
      return (
        <span className={`${baseBadgeClass} bg-amber-50 text-amber-700 border-amber-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
          Pending
        </span>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">{title}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {orders.map((order) => {
            const isSelected = selectedOrderId === order.id;
            const isCompleted = order.isCompleted ?? false;
            
            return (
              <div
                key={order.id}
                className={`
                  p-4 cursor-pointer transition-colors duration-150 min-h-[4rem] flex items-center
                  ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : isCompleted ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}
                `}
                onClick={() => {
                  if (!isCompleted) {
                    onOrderSelect(order.id);
                  }
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <div className="font-medium text-gray-800">Order #{order.id}</div>
                    <div className="text-sm text-gray-600">{order.customer}</div>
                  </div>
                  
                  <div className="flex items-center ml-2 flex-shrink-0 space-x-2">
                    {order.status && getStatusBadge(order.status)}
                    {order.preferredTimeRange && !order.status && getTimeRangeBadge(order.preferredTimeRange)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 