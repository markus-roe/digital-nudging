export interface OrderValidation {
  id: string;
  customer: string;
  address: string;
  zip: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryInstructions: string;
  hasErrors: boolean;
  errors: string[];
}

export interface OrderValidationFormData {
  address: string;
  zip: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryInstructions: string;
}

export interface ValidationError {
  field: string;
  message: string;
} 