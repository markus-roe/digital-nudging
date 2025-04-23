import { VALIDATION_MESSAGES } from '@/lib/constants/validationMessages';

// Validate form data
export function validateOrderData(formData: {
  address: string;
  zip: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Address validation
  if (!formData.address) {
    errors.address = VALIDATION_MESSAGES.address.required;
  } else if (!/^[A-Za-zäöüßÄÖÜ]+(\s+[A-Za-zäöüßÄÖÜ]+)*\s+\d+/.test(formData.address)) {
    errors.address = VALIDATION_MESSAGES.address.format;
  }
  
  // Contact name validation
  if (!formData.contactName) {
    errors.contactName = VALIDATION_MESSAGES.contactName.required;
  }
  
  // Phone validation
  if (!formData.contactPhone) {
    errors.contactPhone = VALIDATION_MESSAGES.contactPhone.required;
  } else if (!/^\+43\s\d{3}\s\d{3}\s\d{4}$/.test(formData.contactPhone)) {
    errors.contactPhone = VALIDATION_MESSAGES.contactPhone.format;
  }
  
  // Email validation
  if (!formData.contactEmail) {
    errors.contactEmail = VALIDATION_MESSAGES.contactEmail.required;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    errors.contactEmail = VALIDATION_MESSAGES.contactEmail.format;
  }

  // Zip validation
  if (!formData.zip) {
    errors.zip = VALIDATION_MESSAGES.zip.required;
  } else if (!/^\d{4}$/.test(formData.zip)) {
    errors.zip = VALIDATION_MESSAGES.zip.format;
  }
  
  return errors;
} 