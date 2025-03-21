export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface ScheduledOrder {
  id: string;
  orderNumber: string;
  driverId: string;
  driverName: string;
  customerName: string;
  priority: 'High' | 'Medium' | 'Low';
  scheduledTimeSlotId: string | null;
  preferredTimeRange: string; // Direct preferred time range (e.g., "8:00 - 12:00")
}

export interface DriverScheduleInfo {
  driverId: string;
  driverName: string;
  timeSlotWorkloads: Record<string, number>; // timeSlotId -> workload (0-100)
}

// Available time slots
export const timeSlots: TimeSlot[] = [
  { id: 'ts-1', time: '8:00 - 10:00', isAvailable: true },
  { id: 'ts-2', time: '10:00 - 12:00', isAvailable: true },
  { id: 'ts-3', time: '12:00 - 14:00', isAvailable: true },
  { id: 'ts-4', time: '14:00 - 16:00', isAvailable: true },
  { id: 'ts-5', time: '16:00 - 18:00', isAvailable: true },
];

// Initial assigned orders that need scheduling (with simplified preferred time ranges)
export const initialOrders: ScheduledOrder[] = [
  {
    id: 'so-1',
    orderNumber: '1',
    driverId: 'driver-1',
    driverName: 'John Smith',
    customerName: 'Alice Johnson',
    priority: 'High',
    scheduledTimeSlotId: null,
    preferredTimeRange: '8:00 - 12:00'
  },
  {
    id: 'so-2',
    orderNumber: '2',
    driverId: 'driver-1',
    driverName: 'John Smith',
    customerName: 'Bob Williams',
    priority: 'Medium',
    scheduledTimeSlotId: null,
    preferredTimeRange: '10:00 - 14:00'
  },
  {
    id: 'so-3',
    orderNumber: '3',
    driverId: 'driver-2',
    driverName: 'Sarah Davis',
    customerName: 'Charlie Brown',
    priority: 'Low',
    scheduledTimeSlotId: null,
    preferredTimeRange: '14:00 - 18:00'
  },
  {
    id: 'so-4',
    orderNumber: '4',
    driverId: 'driver-2',
    driverName: 'Sarah Davis',
    customerName: 'David Miller',
    priority: 'High',
    scheduledTimeSlotId: null,
    preferredTimeRange: '8:00 - 10:00'
  },
  {
    id: 'so-5',
    orderNumber: '5',
    driverId: 'driver-3',
    driverName: 'Michael Wilson',
    customerName: 'Emma Garcia',
    priority: 'Medium',
    scheduledTimeSlotId: null,
    preferredTimeRange: '12:00 - 16:00'
  },
  {
    id: 'so-6',
    orderNumber: '6',
    driverId: 'driver-3',
    driverName: 'Michael Wilson',
    customerName: 'Frank Martinez',
    priority: 'Low',
    scheduledTimeSlotId: null,
    preferredTimeRange: '10:00 - 14:00'
  },
  {
    id: 'so-7',
    orderNumber: '7',
    driverId: 'driver-4',
    driverName: 'Lisa Taylor',
    customerName: 'Grace Lee',
    priority: 'High',
    scheduledTimeSlotId: null,
    preferredTimeRange: '8:00 - 12:00'
  },
  {
    id: 'so-8',
    orderNumber: '8',
    driverId: 'driver-4',
    driverName: 'Lisa Taylor',
    customerName: 'Henry Clark',
    priority: 'Medium',
    scheduledTimeSlotId: null,
    preferredTimeRange: '14:00 - 18:00'
  },
];

// Initial driver workloads for each time slot (for version B's nudging)
export const initialDriverWorkloads: DriverScheduleInfo[] = [
  {
    driverId: 'driver-1',
    driverName: 'John Smith',
    timeSlotWorkloads: {
      'ts-1': 10, // 10% workload - Low (green)
      'ts-2': 30, // 30% workload - Low (green)
      'ts-3': 60, // 60% workload - Moderate (yellow)
      'ts-4': 80, // 80% workload - High (red)
      'ts-5': 50, // 50% workload - Moderate (yellow)
    }
  },
  {
    driverId: 'driver-2',
    driverName: 'Sarah Davis',
    timeSlotWorkloads: {
      'ts-1': 70, // 70% workload - Moderate (yellow)
      'ts-2': 20, // 20% workload - Low (green)
      'ts-3': 40, // 40% workload - Moderate (yellow)
      'ts-4': 30, // 30% workload - Low (green)
      'ts-5': 60, // 60% workload - Moderate (yellow)
    }
  },
  {
    driverId: 'driver-3',
    driverName: 'Michael Wilson',
    timeSlotWorkloads: {
      'ts-1': 50, // 50% workload - Moderate (yellow)
      'ts-2': 80, // 80% workload - High (red)
      'ts-3': 30, // 30% workload - Low (green)
      'ts-4': 20, // 20% workload - Low (green)
      'ts-5': 90, // 90% workload - High (red)
    }
  },
  {
    driverId: 'driver-4',
    driverName: 'Lisa Taylor',
    timeSlotWorkloads: {
      'ts-1': 40, // 40% workload - Moderate (yellow)
      'ts-2': 60, // 60% workload - Moderate (yellow)
      'ts-3': 70, // 70% workload - Moderate (yellow)
      'ts-4': 50, // 50% workload - Moderate (yellow)
      'ts-5': 10, // 10% workload - Low (green)
    }
  },
]; 