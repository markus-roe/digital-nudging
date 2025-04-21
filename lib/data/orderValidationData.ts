import { OrderValidation } from '@/lib/types/orderValidation';

export const initialOrderValidations: OrderValidation[] = [
  {
    id: '1',
    customer: 'Red Bull GmbH',
    address: 'Am Brunnen 1',
    zip: '1010',
    city: 'Wien',
    contactName: 'Franz Huber',
    contactPhone: '+43 654 123 452 3',
    contactEmail: 'franz.huber@redbull.com',
    deliveryInstructions: 'Leave at reception desk',
    hasErrors: true,
    errors: ['contactPhone']
  },
  {
    id: '2',
    customer: 'Swarovski KG',
    address: 'Swarovski Straße70',
    zip: '1010',
    city: 'Wien',
    contactName: 'Maria Schmidt',
    contactPhone: '+43 522 987 6542',
    contactEmail: 'maria.schmidt@swarovski.com',
    deliveryInstructions: 'Call before delivery',
    hasErrors: true,
    errors: ['address']
  },
  {
    id: '3',
    customer: 'OMV AG',
    address: 'Trabrennstraße 6-8',
    zip: '1010',
    city: 'Wien',
    contactName: 'Thomas Wagner',
    contactPhone: '+43 131 404 4210',
    contactEmail: 'thomas.wagner@omv-at',
    deliveryInstructions: '',
    hasErrors: true,
    errors: ['contactEmail']
  },
  {
    id: '4',
    customer: 'Voestalpine AG',
    address: 'Voestalpine Straße 1',
    zip: '1010',
    city: 'Wien',
    contactName: 'Anna Bauer',
    contactPhone: '+43 503 024 3 130',
    contactEmail: 'anna.bauer@voestalpine.com',
    deliveryInstructions: 'Fragile items, handle with care',
    hasErrors: true,
    errors: ['contactPhone']
  },
  {
    id: '5',
    customer: 'Spar Österreich',
    address: 'Europastraße3',
    zip: '1010',
    city: 'Wien',
    contactName: 'Franz Huber',
    contactPhone: '+43 727 920 1062',
    contactEmail: 'info@spar.at',
    deliveryInstructions: 'Security check required at entrance',
    hasErrors: true,
    errors: ['address']
  },
  {
    id: '6',
    customer: 'Raiffeisen Bank International',
    address: 'Am Stadtpark 9',
    zip: '1010',
    city: 'Wi en',
    contactName: 'Peter Fischer',
    contactPhone: '+43 341 717 0720',
    contactEmail: 'peter.fischer@rbinternational.at',
    deliveryInstructions: 'Delivery hours: 9 AM - 5 PM only',
    hasErrors: true,
    errors: ['city']
  },
  {
    id: '7',
    customer: 'Billa AG',
    address: 'Wiener Straße 55',
    zip: '10 10',
    city: 'Wien',
    contactName: 'Lisa Weber',
    contactPhone: '+43 150 100 2406',
    contactEmail: 'lisa.weber@billa.at',
    deliveryInstructions: 'Back entrance only',
    hasErrors: true,
    errors: ['zip']
  },
  {
    id: '8',
    customer: 'Österreichische Post AG',
    address: 'Rochusplatz 1',
    zip: '1010',
    city: 'Wien',
    contactName: 'Michael Gruber',
    contactPhone: '+43 577 672 052',
    contactEmail: 'michael.gruber@post.at',
    deliveryInstructions: 'ID verification required',
    hasErrors: true,
    errors: ['contactPhone']
  }
]; 