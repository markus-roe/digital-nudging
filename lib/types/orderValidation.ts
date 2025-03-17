export interface OrderValidation {
  id: string;
  customer: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryInstructions: string;
  hasErrors: boolean;
  errors: Record<string, string>;
}

export interface OrderValidationFormData {
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryInstructions: string;
}

export interface ValidationError {
  field: string;
  message: string;
} 