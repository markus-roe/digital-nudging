export interface TimeRange {
  start: string;  // Format: "HH:mm"
  end: string;    // Format: "HH:mm"
}

export interface TimeSlot {
  id: string;
  start: string;  // Format: "HH:mm"
  end: string;    // Format: "HH:mm"
}

export interface TimeSlotWorkload {
  timeSlotId: string;
  workload: number;  // percentage
}

export interface ScheduledOrder {
  id: string;
  customer: string;
  scheduledTimeSlot: TimeSlot | null;
  preferredTimeRange: TimeRange;
  timeSlotWorkloads: TimeSlotWorkload[];
}

// Available time slots
export const timeSlots: TimeSlot[] = [
  { id: 'ts-1', start: '8:00', end: '10:00' },
  { id: 'ts-2', start: '10:00', end: '12:00' },
  { id: 'ts-3', start: '12:00', end: '14:00' },
  { id: 'ts-4', start: '14:00', end: '16:00' },
  { id: 'ts-5', start: '16:00', end: '18:00' },
];

// Initial assigned orders that need scheduling
export const initialOrders: ScheduledOrder[] = [
  {
    id: '1',
    customer: 'Acme Corp',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '8:00', end: '12:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 10 },
      { timeSlotId: 'ts-2', workload: 30 },
      { timeSlotId: 'ts-3', workload: 60 },
      { timeSlotId: 'ts-4', workload: 80 },
      { timeSlotId: 'ts-5', workload: 50 }
    ],
  },
  {
    id: '2',
    customer: 'Widget Inc',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '10:00', end: '14:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 70 },
      { timeSlotId: 'ts-2', workload: 20 },
      { timeSlotId: 'ts-3', workload: 40 },
      { timeSlotId: 'ts-4', workload: 30 },
      { timeSlotId: 'ts-5', workload: 60 }
    ],
  },
  {
    id: '3',
    customer: 'ABC Company',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '14:00', end: '18:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 50 },
      { timeSlotId: 'ts-2', workload: 80 },
      { timeSlotId: 'ts-3', workload: 30 },
      { timeSlotId: 'ts-4', workload: 20 },
      { timeSlotId: 'ts-5', workload: 90 }
    ],
  },
  {
    id: '4',
    customer: 'XYZ Ltd',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '12:00', end: '16:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 40 },
      { timeSlotId: 'ts-2', workload: 60 },
      { timeSlotId: 'ts-3', workload: 70 },
      { timeSlotId: 'ts-4', workload: 50 },
      { timeSlotId: 'ts-5', workload: 10 }
    ],
  },
  {
    id: '5',
    customer: 'Tech Solutions',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '12:00', end: '16:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 40 },
      { timeSlotId: 'ts-2', workload: 60 },
      { timeSlotId: 'ts-3', workload: 70 },
      { timeSlotId: 'ts-4', workload: 50 },
      { timeSlotId: 'ts-5', workload: 10 }
    ],
  },
  {
    id: '6',
    customer: 'Global Enterprises',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '10:00', end: '14:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 40 },
      { timeSlotId: 'ts-2', workload: 60 },
      { timeSlotId: 'ts-3', workload: 70 },
      { timeSlotId: 'ts-4', workload: 50 },
      { timeSlotId: 'ts-5', workload: 10 }
    ],
  },
  {
    id: '7',
    customer: 'Local Shop',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '8:00', end: '12:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 40 },
      { timeSlotId: 'ts-2', workload: 60 },
      { timeSlotId: 'ts-3', workload: 70 },
      { timeSlotId: 'ts-4', workload: 50 },
      { timeSlotId: 'ts-5', workload: 10 }
    ],
  },
  {
    id: '8',
    customer: 'Big Corporation',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '14:00', end: '18:00' },
    timeSlotWorkloads: [
      { timeSlotId: 'ts-1', workload: 40 },
      { timeSlotId: 'ts-2', workload: 60 },
      { timeSlotId: 'ts-3', workload: 70 },
      { timeSlotId: 'ts-4', workload: 50 },
      { timeSlotId: 'ts-5', workload: 10 }
    ],
  },
];
