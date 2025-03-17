import { OrderValidation } from '@/lib/types/orderValidation';

export const initialOrderValidations: OrderValidation[] = [
  {
    id: '1',
    customer: 'Acme Corp',
    address: 'Main Street 123',
    contactName: 'John Smith',
    contactPhone: '555-123-456',
    contactEmail: 'john.smith@acmecorp.com',
    deliveryInstructions: 'Leave at reception desk',
    hasErrors: true,
    errors: ['contactPhone']
  },
  {
    id: '2',
    customer: 'Widget Inc',
    address: 'Oak Street456',
    contactName: 'Jane Doe',
    contactPhone: '555-987-6543',
    contactEmail: 'jane.doe@widgetinc.com',
    deliveryInstructions: 'Call before delivery',
    hasErrors: true,
    errors: ['address']
  },
  {
    id: '3',
    customer: 'ABC Company',
    address: 'Pine Road 789',
    contactName: 'Mike Johnson',
    contactPhone: '555-456-7890',
    contactEmail: 'mikejohnson@abccompany',
    deliveryInstructions: '',
    hasErrors: true,
    errors: ['contactEmail']
  },
  {
    id: '4',
    customer: 'XYZ Ltd',
    address: 'Elm Blvd 101',
    contactName: 'Sarah Williams',
    contactPhone: '555-123-45',
    contactEmail: 'sarah.williams@xyzltd.com',
    deliveryInstructions: 'Fragile items, handle with care',
    hasErrors: true,
    errors: ['contactPhone']
  },
  {
    id: '5',
    customer: 'Tech Solutions',
    address: 'Oak Lane 202',
    contactName: '',
    contactPhone: '555-246-8101',
    contactEmail: 'contact@techsolutions.com',
    deliveryInstructions: 'Security check required at entrance',
    hasErrors: true,
    errors: ['contactName']
  },
  {
    id: '6',
    customer: 'Global Enterprises',
    address: 'Elm Way 303',
    contactName: 'Robert',
    contactPhone: '555-369-1470',
    contactEmail: 'robert.brown@globalent',
    deliveryInstructions: 'Delivery hours: 9 AM - 5 PM only',
    hasErrors: true,
    errors: ['contactEmail']
  },
  {
    id: '7',
    customer: 'Local Shop',
    address: 'Main Ave 404',
    contactName: 'Emma Davis',
    contactPhone: '555-159-7531',
    contactEmail: 'emma davis@localshop.com',
    deliveryInstructions: 'Back entrance only',
    hasErrors: true,
    errors: ['contactEmail']
  },
  {
    id: '8',
    customer: 'Big Corporation',
    address: 'Pine Street',
    contactName: 'David Wilson',
    contactPhone: '555-753-9510',
    contactEmail: 'david.wilson@bigcorp.com',
    deliveryInstructions: 'ID verification required',
    hasErrors: true,
    errors: ['address']
  }
]; 