import { useState, useEffect } from 'react';
import { ExperimentTask } from '@/lib/types/experiment';

interface TrackingData {
  task: ExperimentTask;
  version: 'a' | 'b';
  startTime: number;
  interactions: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

export function useParticipantTracking(task: ExperimentTask, version: 'a' | 'b') {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  
  // Initialize tracking data
  useEffect(() => {
    setTrackingData({
      task,
      version,
      startTime: Date.now(),
      interactions: [],
    });
    
    // Log task start (placeholder for future Supabase implementation)
    console.log('Task started:', { task, version, timestamp: Date.now() });
    
    // Log task end when component unmounts
    return () => {
      console.log('Task ended:', { 
        task, 
        version,
        duration: Date.now() - (trackingData?.startTime || Date.now()),
        timestamp: Date.now()
      });
    };
  }, [task, version, trackingData?.startTime]);
  
  // Track an interaction
  const trackInteraction = (type: string, data?: any) => {
    if (!trackingData) return;
    
    const interaction = {
      type,
      timestamp: Date.now(),
      data,
    };
    
    setTrackingData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        interactions: [...prev.interactions, interaction],
      };
    });
    
    // Log the interaction (placeholder for future Supabase implementation)
    console.log('Interaction:', { type, data, timestamp: Date.now() });
  };
  
  // Log completion time
  const trackCompletion = (data?: any) => {
    if (!trackingData) return;
    
    const completionTime = Date.now() - trackingData.startTime;
    
    // Log completion (placeholder for future Supabase implementation)
    console.log('Task completed:', {
      ...data,
      completionTime,
      timestamp: Date.now()
    });
    
    return completionTime;
  };
  
  // Log error (e.g., sequence error, zone matching error)
  const trackError = (errorType: string, data?: any) => {
    trackInteraction('error', {
      errorType,
      ...data,
    });
  };
  
  // Log hesitation (time spent before making a decision)
  const trackHesitation = (decisionType: string, hesitationTime: number, data?: any) => {
    trackInteraction('hesitation', {
      decisionType,
      hesitationTime,
      ...data,
    });
  };
  
  return {
    trackingData,
    trackInteraction,
    trackCompletion,
    trackError,
    trackHesitation,
  };
} 