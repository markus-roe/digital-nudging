import { useState } from 'react';

export function useHesitationTracker() {
  const [selectionStartTime, setSelectionStartTime] = useState<number | null>(null);
  const [hesitationTimes, setHesitationTimes] = useState<{orderId: string, time: number}[]>([]);
  const [totalHesitationTime, setTotalHesitationTime] = useState<number>(0);
  const [averageHesitationTime, setAverageHesitationTime] = useState<number>(0);
  
  const startHesitationTracking = () => {
    if (!selectionStartTime) {
      setSelectionStartTime(Date.now());
    }
  };
  
  const recordHesitationTime = (orderId: string) => {
    if (selectionStartTime) {
      const hesitationTime = Date.now() - selectionStartTime;
      
      // Record this hesitation time
      setHesitationTimes(prev => [...prev, {
        orderId,
        time: hesitationTime
      }]);
      
      // Update total and average
      setTotalHesitationTime(prev => prev + hesitationTime);
      setAverageHesitationTime(
        (totalHesitationTime + hesitationTime) / (hesitationTimes.length + 1)
      );
      
      // Reset the selection start time
      setSelectionStartTime(null);
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