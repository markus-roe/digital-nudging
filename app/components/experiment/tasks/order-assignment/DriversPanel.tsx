import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Driver, Assignment } from '@/lib/types/orderAssignment';
import { getZoneColor } from '@/lib/utils/orderUtils';
import { FaTruck, FaShuttleVan, FaCar, FaMotorcycle } from 'react-icons/fa';

// Helper function to get vehicle icon based on driver ID
const getVehicleInfo = (driverId: string) => {
  // Use driver ID to deterministically assign vehicle types
  const vehicleTypes = [
    { type: 'Van', icon: <FaShuttleVan className="h-4 w-4" /> },
    { type: 'Truck', icon: <FaTruck className="h-4 w-4" /> },
    { type: 'Car', icon: <FaCar className="h-4 w-4" /> },
    { type: 'Motorcycle', icon: <FaMotorcycle className="h-4 w-4" /> }
  ];
  
  const index = parseInt(driverId) % vehicleTypes.length;
  return vehicleTypes[index];
};

interface DriversPanelProps {
  drivers: Driver[];
  selectedOrder: string | null;
  assignments: Record<string, Assignment>;
  onDriverSelect: (driverId: string) => void;
}

export default function DriversPanel({ 
  drivers, 
  selectedOrder, 
  assignments,
  onDriverSelect
}: DriversPanelProps) {
  return (
    <div className={`lg:w-1/3 transition-all duration-300 ${selectedOrder ? 'opacity-100' : 'opacity-50'}`}>
      <Card className="h-full shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Available Drivers</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {drivers.map(driver => {
              const zoneColors = getZoneColor(driver.location);
              const vehicleInfo = getVehicleInfo(driver.id);
              
              // Get all orders assigned to this driver
              const assignedOrderIds = Object.entries(assignments)
                .filter(([__, assignment]) => assignment.driverId === driver.id)
                .map(([orderId]) => orderId);
              
              // Determine card styling based on selection and availability
              let cardClass = "p-4 rounded-lg border transition-all duration-200 ";
              
              if (!selectedOrder) {
                cardClass += "bg-gray-50 border-gray-200 cursor-not-allowed filter blur-[0.3px]";
              } else {
                cardClass += "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow";
              }
              
              return (
                <div 
                  key={driver.id}
                  className={cardClass}
                  onClick={() => {
                    if (selectedOrder) {
                      onDriverSelect(driver.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{driver.name}</div>
                    <div className="text-md px-2 py-1 rounded-full text-gray-500 flex items-center justify-center w-8 h-8">
                      {vehicleInfo.icon}
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${zoneColors.dot} mr-2`}></span>
                      <span className={`${zoneColors.text}`}>{driver.location}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs">
                    {assignedOrderIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {assignedOrderIds.map(orderId => (
                          <span key={orderId} className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 min-w-[70px] text-center">
                            Order #{orderId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 min-w-[70px] text-center">
                          No orders
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 