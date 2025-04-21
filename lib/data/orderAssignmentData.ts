import { Order, Driver } from '@/lib/types/orderAssignment';

export const initialOrders: Order[] = [
  { 
    id: '1', 
    customer: 'Red Bull GmbH', 
    address: 'Am Brunnen 1', 
    zone: 'North Zone',
    items: 3, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '2', 
    customer: 'Swarovski KG', 
    address: 'Swarovski Straße 70', 
    zone: 'South Zone',
    items: 1, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '3', 
    customer: 'OMV AG', 
    address: 'Trabrennstraße 6-8', 
    zone: 'East Zone',
    items: 5, 
    priority: 'Low', 
    status: 'Pending',
  },
  { 
    id: '4', 
    customer: 'Voestalpine AG', 
    address: 'Voestalpine Straße 1', 
    zone: 'West Zone',
    items: 2, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '5', 
    customer: 'Spar Österreich', 
    address: 'Europastraße 3', 
    zone: 'South Zone',
    items: 4, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '6', 
    customer: 'Raiffeisen Bank International',
    address: 'Am Stadtpark 9',
    zone: 'West Zone',
    items: 2, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '7', 
    customer: 'Billa AG', 
    address: 'Wiener Straße 55',
    zone: 'North Zone',
    items: 1, 
    priority: 'Low', 
    status: 'Pending',
  },
  { 
    id: '8', 
    customer: 'Österreichische Post AG', 
    address: 'Rochusplatz 1',
    zone: 'East Zone',
    items: 6, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '9', 
    customer: 'Magna Steyr', 
    address: 'Magna Straße 1',
    zone: 'North Zone',
    items: 3, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '10', 
    customer: 'Andritz AG', 
    address: 'Stattegger Straße 18',
    zone: 'South Zone',
    items: 5, 
    priority: 'Low', 
    status: 'Pending',
  }
];

export const initialDrivers: Driver[] = [
  { 
    id: '1', 
    name: 'Franz Huber', 
    status: 'Available', 
    location: 'North Zone'
  },
  { 
    id: '2', 
    name: 'Maria Schmidt', 
    status: 'Available', 
    location: 'South Zone'
  },
  { 
    id: '3', 
    name: 'Thomas Wagner', 
    status: 'Available', 
    location: 'East Zone'
  },
  { 
    id: '4', 
    name: 'Anna Bauer', 
    status: 'Available', 
    location: 'West Zone'
  }
]; 