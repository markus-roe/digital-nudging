export const VALIDATION_MESSAGES = {
  address: {
    required: 'Address is required',
    format: 'Address must include street name and house number'
  },
  contactName: {
    required: 'Contact name is required'
  },
  contactPhone: {
    required: 'Phone number is required',
    format: 'Phone format should be +43 XXX XXX XXXX'
  },
  contactEmail: {
    required: 'Email is required',
    format: 'Invalid email format'
  },
  zip: {
    required: 'Zip code is required',
    format: 'Zip code must be 4 digits long'
  }
} as const;

export type ValidationField = keyof typeof VALIDATION_MESSAGES; 