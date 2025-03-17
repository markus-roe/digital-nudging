import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { ExperimentVersion } from '@/lib/types/experiment';
import { getInputErrorClass } from '@/lib/utils/orderValidationUtils';

interface OrderValidationFormProps {
  order: OrderValidation;
  version: ExperimentVersion;
  formErrors: Record<string, string>;
  onSubmit: (orderId: string, formData: OrderValidationFormData) => boolean;
  onCancel: () => void;
}

export default function OrderValidationForm({
  order,
  version,
  formErrors,
  onSubmit,
  onCancel
}: OrderValidationFormProps) {
  const [formData, setFormData] = useState<OrderValidationFormData>({
    address: order.address,
    contactName: order.contactName,
    contactPhone: order.contactPhone,
    contactEmail: order.contactEmail,
    deliveryInstructions: order.deliveryInstructions
  });
  
  // Reset form data when order changes
  useEffect(() => {
    setFormData({
      address: order.address,
      contactName: order.contactName,
      contactPhone: order.contactPhone,
      contactEmail: order.contactEmail,
      deliveryInstructions: order.deliveryInstructions
    });
  }, [order]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(order.id, formData);
  };
  
  // Determine if a field has an error
  const hasError = (fieldName: string): boolean => {
    return !!formErrors[fieldName] || (version === 'b' && !!order.errors[fieldName]);
  };
  
  // Get error message for a field
  const getErrorMessage = (fieldName: string): string => {
    return formErrors[fieldName] || (version === 'b' && order.errors[fieldName]) || '';
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Validate Order #{order.id} - {order.customer}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={getInputErrorClass('address', formErrors, version, order)}
                placeholder="Street, City, Postal Code"
              />
              {hasError('address') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('address')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                className={getInputErrorClass('contactName', formErrors, version, order)}
                placeholder="Full Name"
              />
              {hasError('contactName') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('contactName')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="text"
                value={formData.contactPhone}
                onChange={handleChange}
                className={getInputErrorClass('contactPhone', formErrors, version, order)}
                placeholder="XXX-XXX-XXXX"
              />
              {hasError('contactPhone') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('contactPhone')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="text"
                value={formData.contactEmail}
                onChange={handleChange}
                className={getInputErrorClass('contactEmail', formErrors, version, order)}
                placeholder="email@example.com"
              />
              {hasError('contactEmail') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('contactEmail')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instructions
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Special delivery instructions (optional)"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2"
              >
                Validate Order
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 