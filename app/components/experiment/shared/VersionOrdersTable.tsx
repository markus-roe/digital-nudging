import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Order, Assignment } from '@/lib/types/orderAssignment';
import { getZoneColor, getVersionPriorityBadgeClass } from '@/lib/utils/orderUtils';
import { ExperimentVersion } from '@/lib/types/experiment';

interface VersionOrdersTableProps {
  orders: Order[];
  selectedOrder: string | null;
  assignments: Record<string, Assignment>;
  onOrderSelect: (orderId: string) => void;
  onUnassignOrder: (orderId: string) => void;
  version: ExperimentVersion;
}

export default function VersionOrdersTable({ 
  orders, 
  selectedOrder, 
  assignments, 
  onOrderSelect,
  onUnassignOrder,
  version
}: VersionOrdersTableProps) {
  return (
    <div className={`lg:w-2/3 transition-[opacity] duration-150 ${selectedOrder ? 'opacity-90' : 'opacity-100'}`}>
      <Card className="h-full shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Pending Orders</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHeaderCell className="w-12">&nbsp;</TableHeaderCell>
                <TableHeaderCell>
                  <div className="flex items-center gap-1 font-medium">Order ID</div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div className="flex items-center gap-1 font-medium">Priority</div>
                </TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                    Zone
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className="w-48">Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const orderZone = order.zone;
                const zoneColors = getZoneColor(orderZone);
                const priorityBadgeClass = getVersionPriorityBadgeClass(order.priority, version);
                const isSelected = selectedOrder === order.id;
                
                return (
                  <TableRow 
                    key={order.id}
                    className={`
                      ${
                        isSelected
                          ? 'bg-blue-100' 
                          : assignments[order.id]
                            ? 'bg-gray-50 opacity-60' 
                            : ''
                      }
                      transition-[opacity] duration-150
                    `}
                    isSelected={isSelected}
                    onClick={() => {
                      if (!assignments[order.id]) {
                        onOrderSelect(order.id);
                      }
                    }}
                  >
                    <TableCell className="w-12">
                      {!assignments[order.id] && (
                        <div className="flex items-center justify-center h-full">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {
                              if (!assignments[order.id]) {
                                onOrderSelect(order.id);
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            onClick={(e) => e.stopPropagation()} 
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium"># {order.id}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadgeClass} inline-block min-w-[60px] text-center`}>
                        {order.priority}
                      </span>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${zoneColors.dot} mr-2`}></span>
                        <span className={`${zoneColors.text}`}>{orderZone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-48">
                      <div className="flex items-center justify-between">
                        <span className={`${assignments[order.id] ? 'font-medium text-green-700' : 'text-gray-600'}`}>
                          {assignments[order.id] ? 'Assigned' : 'Pending'}
                        </span>
                        
                        <div className="w-6 h-6 flex items-center justify-center">
                          {assignments[order.id] && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnassignOrder(order.id);
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 