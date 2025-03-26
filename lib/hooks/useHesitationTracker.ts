import { useState } from 'react';

interface HesitationRecord {
  orderId: string;
  taskId: string;
  participantId: string;
  time: number;
  timestamp: string;
}

export function useHesitationTracker(taskId: string, participantId: string) {
  const [selectionStartTime, setSelectionStartTime] = useState<number | null>(null);
  const [hesitationTimes, setHesitationTimes] = useState<HesitationRecord[]>([]);
  const [totalHesitationTime, setTotalHesitationTime] = useState<number>(0);
  const [averageHesitationTime, setAverageHesitationTime] = useState<number>(0);
  
  const startHesitationTracking = () => {
    if (!selectionStartTime) {
      const startTime = Date.now();
      console.log(`[HesitationTracker] Starting hesitation tracking at ${new Date(startTime).toISOString()}`);
      setSelectionStartTime(startTime);
    } else {
      console.log(`[HesitationTracker] Hesitation tracking already in progress since ${new Date(selectionStartTime).toISOString()}`);
    }
  };
  
  const recordHesitationTime = async (orderId: string) => {
    if (selectionStartTime) {
      const currentTime = Date.now();
      const hesitationTime = currentTime - selectionStartTime;
      
      console.log(`[HesitationTracker] Recording hesitation for order ${orderId}:`);
      console.log(`  - Started: ${new Date(selectionStartTime).toISOString()}`);
      console.log(`  - Ended: ${new Date(currentTime).toISOString()}`);
      console.log(`  - Duration: ${hesitationTime}ms (${(hesitationTime / 1000).toFixed(2)}s)`);
      
      const record: HesitationRecord = {
        orderId,
        taskId,
        participantId,
        time: hesitationTime,
        timestamp: new Date().toISOString()
      };
      
      // Record this hesitation time
      setHesitationTimes(prev => {
        const updated = [...prev, record];
        console.log(`[HesitationTracker] Total hesitations recorded: ${updated.length}`);
        return updated;
      });
      
      // Update total and average
      setTotalHesitationTime(prev => {
        const newTotal = prev + hesitationTime;
        console.log(`[HesitationTracker] Total hesitation time: ${newTotal}ms (${(newTotal / 1000).toFixed(2)}s)`);
        return newTotal;
      });
      
      setAverageHesitationTime(prev => {
        const newAvg = (totalHesitationTime + hesitationTime) / (hesitationTimes.length + 1);
        console.log(`[HesitationTracker] Average hesitation time: ${newAvg.toFixed(2)}ms (${(newAvg / 1000).toFixed(2)}s)`);
        return newAvg;
      });
      
      // Reset the selection start time
      setSelectionStartTime(null);
      console.log(`[HesitationTracker] Reset tracking state`);
      
      // Save to backend
      try {
        await saveHesitationRecord(record);
      } catch (error) {
        console.error('[HesitationTracker] Failed to save hesitation record:', error);
      }
    } else {
      console.warn(`[HesitationTracker] Attempted to record hesitation for order ${orderId}, but no tracking was in progress`);
    }
  };
  
  return {
    selectionStartTime,
    hesitationTimes,
    totalHesitationTime,
    averageHesitationTime,
    startHesitationTracking,
    recordHesitationTime
  };
}

async function saveHesitationRecord(record: HesitationRecord) {
  const response = await fetch('/api/experiment/hesitation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save hesitation record');
  }
  
  return response.json();
} 