import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderValidation, OrderValidationFormData } from '@/lib/types/orderValidation';
import { ExperimentVersion } from '@/lib/types/experiment';
import { validateOrderData } from '@/lib/utils/orderValidationUtils';
import { VALIDATION_MESSAGES } from '@/lib/constants/validationMessages';

interface OrderValidationFormProps {
  order: OrderValidation;
  version: ExperimentVersion;
  formErrors: Record<string, string>;
  onSubmit: (orderId: string, formData: OrderValidationFormData) => boolean;
  onFormDataChange?: (formData: OrderValidationFormData) => void;
}

export default function OrderValidationForm({
  order,
  version,
  formErrors: initialFormErrors,
  onSubmit,
  onFormDataChange
}: OrderValidationFormProps) {
  const [formData, setFormData] = useState<OrderValidationFormData>({
    address: order.address,
    contactName: order.contactName,
    contactPhone: order.contactPhone,
    contactEmail: order.contactEmail,
    deliveryInstructions: order.deliveryInstructions
  });
  
  // Local form errors state for real-time validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>(initialFormErrors);
  
  // Track which fields have been validated
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set());
  
  // Track if form has been submitted (for version A)
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Reset form data when order changes and validate immediately
  useEffect(() => {
    const newFormData = {
      address: order.address,
      contactName: order.contactName,
      contactPhone: order.contactPhone,
      contactEmail: order.contactEmail,
      deliveryInstructions: order.deliveryInstructions
    };
    setFormData(newFormData);
    
    // Validate all fields immediately on load
    if (order.hasErrors) {
      const validationErrors = validateOrderData(newFormData);
      setFormErrors(validationErrors);
      
      // Reset validated fields
      setValidatedFields(new Set());
    } else {
      setFormErrors(initialFormErrors);
    }
    
    // Reset submission state
    setHasSubmitted(false);
  }, [order, initialFormErrors]);
  
  // Handle input change with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Only validate in real-time for version B
    if (version === 'b') {
      // Validate the field in real-time
      const validationErrors = validateOrderData(updatedFormData);
      
      // Mark this field as validated
      setValidatedFields(prev => {
        const newSet = new Set(prev);
        newSet.add(name);
        return newSet;
      });
      
      // Update errors state - add or remove error for this field
      setFormErrors(prev => {
        const newErrors = { ...prev };
        if (validationErrors[name]) {
          newErrors[name] = validationErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }

    // Notify parent of changes
    if (onFormDataChange) {
      onFormDataChange(updatedFormData);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For version A, don't update the hasSubmitted state
    // This prevents the momentary flash of error styling
    if (version === 'a') {
      // Skip setting hasSubmitted to true
      // Just validate and submit directly
      const validationErrors = validateOrderData(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        setHasSubmitted(true); // Only set this if there are errors
        return;
      }
      
      // If validation passes, submit without setting hasSubmitted
      onSubmit(order.id, formData);
      return;
    }
    
    // For version B, continue with normal flow
    // Validate all fields before submission
    const validationErrors = validateOrderData(formData);
    setHasSubmitted(true);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    onSubmit(order.id, formData);
  };
  
  // Get input class based on error state
  const getInputClass = (fieldName: string): string => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    
    // For version A, only apply error styling when explicitly showing errors
    if (version === 'a') {
      if (shouldShowError(fieldName)) {
        return `${baseClass} border-red-500 bg-red-50`;
      }
      return `${baseClass} border-gray-300`;
    }
    
    // For version B, show real-time validation
    // If the field has been validated and has no errors, or if it's not in the error list
    if (validatedFields.has(fieldName) && !formErrors[fieldName]) {
      return `${baseClass} border-gray-300`;
    }
    
    // If the field has an error or is in the error list for version B
    if (formErrors[fieldName] || (order.errors.includes(fieldName) && order.hasErrors)) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    
    return `${baseClass} border-gray-300`;
  };
  
  // Check if a field has an error and should show the error message
  const shouldShowError = (fieldName: string): boolean => {
    if (version === 'a') {
      // For version A, only show errors after submission and if there are errors
      // This prevents the flash of errors during transition
      return hasSubmitted && !!formErrors[fieldName];
    }
    // Always show errors for version B
    return !!formErrors[fieldName];
  };

    
  // Get error message for a field
  const getErrorMessage = (field: string): string => {
    if (formErrors[field]) {
      return formErrors[field];
    }
    
    // If no current error, return the standard validation message
    if (field === 'address') {
      return VALIDATION_MESSAGES.address.format;
    } else if (field === 'contactName') {
      return VALIDATION_MESSAGES.contactName.required;
    } else if (field === 'contactPhone') {
      return VALIDATION_MESSAGES.contactPhone.format;
    } else if (field === 'contactEmail') {
      return VALIDATION_MESSAGES.contactEmail.format;
    }
    
    return '';
  };
  
  
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Validate Order #{order.id} - {order.customer}</span>
        </div>
      </CardHeader>

      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="font-medium text-gray-700 mb-3">Fields requiring correction:</h4>
        <ul className="space-y-2">
          {order.errors.map((field) => (
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
        <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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