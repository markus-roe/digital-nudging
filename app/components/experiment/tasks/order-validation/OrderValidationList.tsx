import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { OrderValidation } from '@/lib/types/orderValidation';

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
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Orders Pending Validation</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {orders.map((order) => {
            const isSelected = selectedOrderId === order.id;
            const hasBeenValidated = !order.hasErrors;
            
            return (
              <div
                key={order.id}
                className={`
                  p-3 cursor-pointer transition-colors duration-150
                  ${isSelected ? 'bg-blue-100' : ''}
                  ${hasBeenValidated ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}
                `}
                onClick={() => {
                  if (!hasBeenValidated) {
                    onOrderSelect(order.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Order #{order.id} - {order.customer}</div>
                  </div>
                  <div>
                    {hasBeenValidated ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Validated
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Needs Validation
                      </span>
                    )}
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