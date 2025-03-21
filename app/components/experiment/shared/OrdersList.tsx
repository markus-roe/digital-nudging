import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: string;
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Pending' | 'Validated' | 'Assigned' | 'Scheduled';
  isCompleted?: boolean;
  additionalInfo?: string;
}

interface OrdersListProps {
  orders: OrderItem[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
  title: string;
  showBadge?: boolean;
}

export default function OrdersList({
  orders,
  selectedOrderId,
  onOrderSelect,
  title,
  showBadge = false
}: OrdersListProps) {
  
  // Get priority badge if enabled
  const getPriorityBadge = (priority?: string) => {
    if (!showBadge || !priority) return null;
    
    const priorityClasses = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-amber-100 text-amber-800',
      Low: 'bg-gray-100 text-gray-800'
    };
    
    const dotClasses = {
      High: 'bg-red-500',
      Medium: 'bg-amber-500',
      Low: 'bg-gray-500'
    };
    
    const bgClass = priorityClasses[priority as keyof typeof priorityClasses] || priorityClasses.Low;
    const dotClass = dotClasses[priority as keyof typeof dotClasses] || dotClasses.Low;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 ${bgClass} text-xs font-medium rounded-full whitespace-nowrap mr-2`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mr-1`}></span>
        {priority}
      </span>
    );
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
                    <div className="font-medium text-gray-800">Order #{order.orderNumber || order.id}</div>
                    <div className="text-sm text-gray-600">{order.customer}</div>
                    {order.additionalInfo && (
                      <div className="text-xs text-blue-600">{order.additionalInfo}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-2 flex-shrink-0 space-x-2">
                    {showBadge && getPriorityBadge(order.priority)}
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