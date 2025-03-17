import { OrderValidation } from '@/lib/types/orderValidation';

export const initialOrderValidations: OrderValidation[] = [
  {
    id: '1',
    customer: 'Acme Corp',
    address: '123 Main St, City, 12345',
    contactName: 'John Smith',
    contactPhone: '555-123-456',
    contactEmail: 'john.smith@acmecorp.com',
    deliveryInstructions: 'Leave at reception desk',
    hasErrors: true,
    errors: {
      contactPhone: 'Invalid phone format'
    }
  },
  {
    id: '2',
    customer: 'Widget Inc',
    address: '456 Oak Ave',
    contactName: 'Jane Doe',
    contactPhone: '555-987-6543',
    contactEmail: 'jane.doe@widgetinc.com',
    deliveryInstructions: 'Call before delivery',
    hasErrors: true,
    errors: {
      address: 'Missing postal code'
    }
  },
  {
    id: '3',
    customer: 'ABC Company',
    address: '789 Pine Rd, Village, 54321',
    contactName: 'Mike Johnson',
    contactPhone: '555-456-7890',
    contactEmail: 'mikejohnson@abccompany',
    deliveryInstructions: '',
    hasErrors: true,
    errors: {
      contactEmail: 'Invalid email format'
    }
  },
  {
    id: '4',
    customer: 'XYZ Ltd',
    address: '101 Elm Blvd, County, 67890',
    contactName: 'Sarah Williams',
    contactPhone: '55512345',
    contactEmail: 'sarah.williams@xyzltd.com',
    deliveryInstructions: 'Fragile items, handle with care',
    hasErrors: true,
    errors: {
      contactPhone: 'Invalid phone format'
    }
  },
  {
    id: '5',
    customer: 'Tech Solutions',
    address: '202 Oak Lane, District, 13579',
    contactName: '',
    contactPhone: '555-246-8101',
    contactEmail: 'contact@techsolutions.com',
    deliveryInstructions: 'Security check required at entrance',
    hasErrors: true,
    errors: {
      contactName: 'Contact name required'
    }
  },
  {
    id: '6',
    customer: 'Global Enterprises',
    address: '303 Elm Way, Borough, 24680',
    contactName: 'Robert',
    contactPhone: '555-369-1470',
    contactEmail: 'robert.brown@globalent.com',
    deliveryInstructions: 'Delivery hours: 9 AM - 5 PM only',
    hasErrors: true,
    errors: {
      contactName: 'Full name required',
    }
  },
  {
    id: '7',
    customer: 'Local Shop',
    address: '404 Main Ave, Village, 97531',
    contactName: 'Emma Davis',
    contactPhone: '555-159-7531',
    contactEmail: 'emma.davis.localshop.com',
    deliveryInstructions: 'Back entrance only',
    hasErrors: true,
    errors: {
      contactEmail: 'Invalid email format'
    }
  },
  {
    id: '8',
    customer: 'Big Corporation',
    address: '505 Pine St',
    contactName: 'David Wilson',
    contactPhone: '555-753-9510',
    contactEmail: 'david.wilson@bigcorp.com',
    deliveryInstructions: 'ID verification required',
    hasErrors: true,
    errors: {
      address: 'Missing city and postal code'
    }
  }
]; 