export interface TimeRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  workload: number;
}

export interface ScheduledOrder {
  id: string;
  customer: string;
  scheduledTimeSlot: TimeSlot | null;
  preferredTimeRange: TimeRange;
  availableTimeSlots: TimeSlot[];
  optimalTimeSlotId: string;
}

// Available time slots
export const timeSlots: TimeSlot[] = [
  { id: 'ts-1', start: '8:00', end: '10:00', workload: 0 },
  { id: 'ts-2', start: '10:00', end: '12:00', workload: 0 },
  { id: 'ts-3', start: '12:00', end: '14:00', workload: 0 },
  { id: 'ts-4', start: '14:00', end: '16:00', workload: 0 },
  { id: 'ts-5', start: '16:00', end: '18:00', workload: 0 },
];

// Initial assigned orders that need scheduling
export const initialOrders: ScheduledOrder[] = [
  {
    id: '1',
    customer: 'Red Bull GmbH',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '8:00', end: '12:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 10 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 30 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 60 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 80 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 50 }
    ],
    optimalTimeSlotId: 'ts-1'
  },
  {
    id: '2',
    customer: 'Swarovski KG',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '10:00', end: '14:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 70 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 20 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 40 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 30 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 60 }
    ],
    optimalTimeSlotId: 'ts-2'
  },
  {
    id: '3',
    customer: 'OMV AG',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '14:00', end: '18:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 50 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 80 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 30 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 20 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 90 }
    ],
    optimalTimeSlotId: 'ts-4'
  },
  {
    id: '4',
    customer: 'Voestalpine AG',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '12:00', end: '16:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 40 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 60 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 70 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 50 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 10 }
    ],
    optimalTimeSlotId: 'ts-4'
  },
  {
    id: '5',
    customer: 'Spar Österreich',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '12:00', end: '16:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 40 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 60 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 70 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 50 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 10 }
    ],
    optimalTimeSlotId: 'ts-4'
  },
  {
    id: '6',
    customer: 'Raiffeisen Bank International',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '10:00', end: '14:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 80 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 30 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 40 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 70 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 90 }
    ],
    optimalTimeSlotId: 'ts-2'
  },
  {
    id: '7',
    customer: 'Billa AG',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '8:00', end: '12:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 40 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 60 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 70 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 50 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 10 }
    ],
    optimalTimeSlotId: 'ts-1'
  },
  {
    id: '8',
    customer: 'Österreichische Post AG',
    scheduledTimeSlot: null,
    preferredTimeRange: { start: '14:00', end: '18:00' },
    availableTimeSlots: [
      { id: 'ts-1', start: '8:00', end: '10:00', workload: 40 },
      { id: 'ts-2', start: '10:00', end: '12:00', workload: 60 },
      { id: 'ts-3', start: '12:00', end: '14:00', workload: 70 },
      { id: 'ts-4', start: '14:00', end: '16:00', workload: 50 },
      { id: 'ts-5', start: '16:00', end: '18:00', workload: 10 }
    ],
    optimalTimeSlotId: 'ts-5'
  }
];
