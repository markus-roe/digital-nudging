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
                  p-4 cursor-pointer transition-colors duration-150 min-h-[4rem] flex items-center
                  ${isSelected ? 'bg-blue-100 hover:bg-blue-100' : hasBeenValidated ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}
                `}
                onClick={() => {
                  if (!hasBeenValidated) {
                    onOrderSelect(order.id);
                  }
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-gray-600">{order.customer}</div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {hasBeenValidated ? (
                      <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-md border border-transparent whitespace-nowrap">
                        <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
                        Validated
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 mr-1 rounded-full bg-amber-500"></span>
                        Pending
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