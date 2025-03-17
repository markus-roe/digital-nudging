import { ExperimentVersion } from '@/lib/types/experiment';
import { OrderValidation } from '@/lib/types/orderValidation';

// Utility function to get input class based on error state and version
export function getInputErrorClass(
  fieldName: string, 
  errors: Record<string, string>, 
  version: ExperimentVersion,
  order?: OrderValidation
): string {
  const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  if (shouldShowErrorStyling(fieldName, errors, version, order)) {
    return `${baseClass} border-red-500 bg-red-50`;
  }
  
  return `${baseClass} border-gray-300`;
}

// Determine if a field should show error styling based on version
export function shouldShowErrorStyling(
  fieldName: string, 
  errors: Record<string, string>, 
  version: ExperimentVersion,
  order?: OrderValidation
): boolean {
  if (version === 'b') {
    // In version B (nudged), show error styling for fields with errors
    // Check both form validation errors and original order errors
    return !!errors[fieldName] || !!(order?.errors && order.errors[fieldName]);
  }
  return false; // In version A (control), don't show error styling
}

// Validate form data
export function validateOrderData(formData: {
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Address validation
  if (!formData.address) {
    errors.address = 'Address is required';
  } else if (!formData.address.includes(',')) {
    errors.address = 'Address should include street, city, and postal code';
  }
  
  // Contact name validation
  if (!formData.contactName) {
    errors.contactName = 'Contact name is required';
  }
  
  // Phone validation
  if (!formData.contactPhone) {
    errors.contactPhone = 'Phone number is required';
  } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.contactPhone)) {
    errors.contactPhone = 'Phone format should be XXX-XXX-XXXX';
  }
  
  // Email validation
  if (!formData.contactEmail) {
    errors.contactEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    errors.contactEmail = 'Invalid email format';
  }
  
  return errors;
} 