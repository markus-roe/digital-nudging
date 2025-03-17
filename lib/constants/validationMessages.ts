export const VALIDATION_MESSAGES = {
  address: {
    required: 'Address is required',
    format: 'Address must include street name followed by a number'
  },
  contactName: {
    required: 'Contact name is required'
  },
  contactPhone: {
    required: 'Phone number is required',
    format: 'Phone format should be XXX-XXX-XXXX'
  },
  contactEmail: {
    required: 'Email is required',
    format: 'Invalid email format'
  }
} as const;

export type ValidationField = keyof typeof VALIDATION_MESSAGES; 