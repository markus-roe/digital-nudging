import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useOrderValidationContext } from '@/lib/context/OrderValidationContext';

export default function OrderValidationForm() {
  const {
    selectedOrder,
    formData,
    formErrors,
    handleFormChange,
    handleFormSubmit,
    getInputClass,
    shouldShowError,
    getErrorMessage
  } = useOrderValidationContext();

  if (!selectedOrder) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Validate Order #{selectedOrder.id} - {selectedOrder.customer}</span>
        </div>
      </CardHeader>

      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="font-medium text-gray-700 mb-3">Fields requiring correction:</h4>
        <ul className="space-y-2">
          {selectedOrder.errors.map((field) => (
            <li key={field} className="flex flex-col">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <p className="text-sm text-gray-600 ml-6 mt-1">{getErrorMessage(field)}</p>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-t border-gray-200 mb-3" />

      <CardContent className="">
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>
                {shouldShowError('address') && (
                  <span className="text-xs text-red-600">{formErrors.address}</span>
                )}
              </div>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleFormChange}
                className={getInputClass('address')}
                placeholder="Street, City, Postal Code"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                {shouldShowError('contactName') && (
                  <span className="text-xs text-red-600">{formErrors.contactName}</span>
                )}
              </div>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleFormChange}
                className={getInputClass('contactName')}
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                {shouldShowError('contactPhone') && (
                  <span className="text-xs text-red-600">{formErrors.contactPhone}</span>
                )}
              </div>
              <input
                id="contactPhone"
                name="contactPhone"
                type="text"
                value={formData.contactPhone}
                onChange={handleFormChange}
                className={getInputClass('contactPhone')}
                placeholder="XXX-XXX-XXXX"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                {shouldShowError('contactEmail') && (
                  <span className="text-xs text-red-600">{formErrors.contactEmail}</span>
                )}
              </div>
              <input
                id="contactEmail"
                name="contactEmail"
                type="text"
                value={formData.contactEmail}
                onChange={handleFormChange}
                className={getInputClass('contactEmail')}
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instructions
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Special delivery instructions (optional)"
              />
            </div>
            
            <div className="flex justify-start space-x-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 