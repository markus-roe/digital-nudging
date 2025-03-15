import { Order, Driver } from '@/lib/types/orderAssignment';

export const initialOrders: Order[] = [
  { 
    id: '1', 
    customer: 'Acme Corp', 
    address: '123 Main St, City', 
    zone: 'North Zone',
    items: 3, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '2', 
    customer: 'Widget Inc', 
    address: '456 Oak Ave, Town', 
    zone: 'South Zone',
    items: 1, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '3', 
    customer: 'ABC Company', 
    address: '789 Pine Rd, Village', 
    zone: 'East Zone',
    items: 5, 
    priority: 'Low', 
    status: 'Pending',
  },
  { 
    id: '4', 
    customer: 'XYZ Ltd', 
    address: '101 Elm Blvd, County', 
    zone: 'West Zone',
    items: 2, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '5', 
    customer: 'Tech Solutions', 
    address: '202 Oak Lane, District', 
    zone: 'West Zone',
    items: 4, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '6', 
    customer: 'Global Enterprises',
    address: '303 Elm Way, Borough',
    zone: 'West Zone',
    items: 2, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '7', 
    customer: 'Local Shop', 
    address: '404 Main Ave, Village',
    zone: 'West Zone',
    items: 1, 
    priority: 'Low', 
    status: 'Pending',
  },
  { 
    id: '8', 
    customer: 'Big Corporation', 
    address: '505 Pine St, City',
    zone: 'West Zone',
    items: 6, 
    priority: 'High', 
    status: 'Pending',
  },
  { 
    id: '9', 
    customer: 'Metro Distributors', 
    address: '606 Main Blvd, Suburb',
    zone: 'West Zone',
    items: 3, 
    priority: 'Medium', 
    status: 'Pending',
  },
  { 
    id: '10', 
    customer: 'Coastal Supplies', 
    address: '707 Oak Drive, Harbor',
    zone: 'West Zone',
    items: 5, 
    priority: 'Low', 
    status: 'Pending',
  }
];

export const initialDrivers: Driver[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    status: 'Available', 
    location: 'North Zone'
  },
  { 
    id: '2', 
    name: 'Jane Doe', 
    status: 'Available', 
    location: 'South Zone'
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    status: 'Available', 
    location: 'East Zone'
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    status: 'Available', 
    location: 'West Zone'
  }
]; 