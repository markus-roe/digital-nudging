import { v4 as uuidv4 } from 'uuid';

export function generateParticipantId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomStr = uuidv4().slice(0, 4).toUpperCase();
  
  return `P-${dateStr}-${timeStr}-${randomStr}`;
} 