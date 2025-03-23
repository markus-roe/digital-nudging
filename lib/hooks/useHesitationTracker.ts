import { useState } from 'react';

export function useHesitationTracker() {
  const [selectionStartTime, setSelectionStartTime] = useState<number | null>(null);
  const [hesitationTimes, setHesitationTimes] = useState<{orderId: string, time: number}[]>([]);
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
  
  const recordHesitationTime = (orderId: string) => {
    if (selectionStartTime) {
      const currentTime = Date.now();
      const hesitationTime = currentTime - selectionStartTime;
      
      console.log(`[HesitationTracker] Recording hesitation for order ${orderId}:`);
      console.log(`  - Started: ${new Date(selectionStartTime).toISOString()}`);
      console.log(`  - Ended: ${new Date(currentTime).toISOString()}`);
      console.log(`  - Duration: ${hesitationTime}ms (${(hesitationTime / 1000).toFixed(2)}s)`);
      
      // Record this hesitation time
      setHesitationTimes(prev => {
        const updated = [...prev, {
          orderId,
          time: hesitationTime
        }];
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