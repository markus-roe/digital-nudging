export interface Order {
  id: string;
  customer: string;
  address: string;
  zone: string;
  items: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned';
}

export interface Driver {
  id: string;
  name: string;
  status: string;
  location: string;
}

export interface Assignment {
  driverId: string;
}

export interface HesitationRecord {
  orderId: string;
  time: number;
} 