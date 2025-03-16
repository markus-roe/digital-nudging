import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/Button';
import { initialOrders, initialDrivers } from '@/lib/data/orderAssignmentData';
import VersionTaskHeader from '@/app/components/experiment/shared/VersionTaskHeader';
import VersionOrdersTable from '@/app/components/experiment/shared/VersionOrdersTable';
import DriversPanel from '@/app/components/experiment/tasks/order-assignment/DriversPanel';
import { useTaskTimer } from '@/lib/hooks/useTaskTimer';
import { useOrderAssignment } from '@/lib/hooks/useOrderAssignment';
import { useHesitationTracker } from '@/lib/hooks/useHesitationTracker';
import { OrderAssignmentProps } from '@/lib/types/experiment';
import OrderAssignmentExample from './OrderAssignmentExample';

interface ExtendedOrderAssignmentProps extends OrderAssignmentProps {
  embedded?: boolean;
  onComplete?: () => void;
}

export default function OrderAssignmentTask({ 
  version, 
  embedded = true,
  onComplete 
}: ExtendedOrderAssignmentProps) {
  // Task state
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [taskStarted, setTaskStarted] = useState<boolean>(false);
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const TIME_LIMIT = 180; // 3 minute time limit
  const totalAnimationSteps = 4;
  const allStepsCompleted = animationStep === totalAnimationSteps - 1;
  
  // Core functionality hooks
  const { 
    orders, 
    drivers, 
    assignments,
    selectedOrder,
    sequenceErrors,
    zoneMatchErrors,
    assignedOrdersCount,
    handleOrderSelect,
    assignOrderToDriver,
    unassignOrder
  } = useOrderAssignment(initialOrders, initialDrivers);
  
  // Timer hook
  const {
    startTime,
    timeRemaining,
    formatTime,
    startTimer,
    stopTimer
  } = useTaskTimer(TIME_LIMIT);
  
  // Hesitation tracking hook
  const {
    selectionStartTime,
    hesitationTimes,
    totalHesitationTime,
    averageHesitationTime,
    startHesitationTracking,
    recordHesitationTime
  } = useHesitationTracker();
  
  // Start the task and timer when user dismisses the intro modal
  useEffect(() => {
    if (taskStarted && !startTime) {
      startTimer();
    }
  }, [taskStarted, startTime]);
  
  // Handle animation navigation
  const nextAnimationStep = () => {
    if (animationStep < totalAnimationSteps - 1) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };
  
  // Handle starting the task after viewing the intro
  const handleStartTask = () => {
    setShowIntroModal(false);
    setTaskStarted(true);
  };
  
  // Track hesitation time when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      startHesitationTracking();
    }
  }, [selectedOrder]);
  
  // Check if task is completed
  const taskCompleted = Object.keys(assignments).length === orders.length;
  
  // Automatically stop timer when task is completed
  useEffect(() => {
    if (taskCompleted && timeRemaining > 0 && !taskFinished) {
      stopTimer();
      setTaskFinished(true);
    }
  }, [taskCompleted, timeRemaining, taskFinished]);
  
  // Handle driver selection and assignment
  const handleDriverSelect = (driverId: string) => {
    if (selectedOrder) {
      assignOrderToDriver(selectedOrder, driverId);
      recordHesitationTime(selectedOrder);
    }
  };
  
  // Handle task completion
  const handleTaskComplete = () => {
    if (!taskFinished) {
      stopTimer();
      setTaskFinished(true);
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // Render the component with or without the modal
  return (
    <div className="relative">
      <VersionTaskHeader 
        assignedOrdersCount={assignedOrdersCount} 
        totalOrders={orders.length} 
        timeRemaining={timeRemaining} 
        formatTime={formatTime}
        version={version}
      />

      <div className={`flex flex-col lg:flex-row gap-6 ${showIntroModal ? 'opacity-50 pointer-events-none' : ''}`}>
        <VersionOrdersTable 
          orders={orders}
          selectedOrder={selectedOrder}
          assignments={assignments}
          onOrderSelect={handleOrderSelect}
          onUnassignOrder={unassignOrder}
          version={version}
        />
        
        <DriversPanel 
          drivers={drivers}
          selectedOrder={selectedOrder}
          assignments={assignments}
          onDriverSelect={handleDriverSelect}
        />
      </div>
      
      {taskCompleted && !showIntroModal && (
        <div className="mt-6 text-center">
          <Button 
            variant="primary" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            onClick={handleTaskComplete}
          >
            Complete Assignment Task
          </Button>
        </div>
      )}

      {/* Modal overlay */}
      {showIntroModal && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Driver Assignment Task</h2>
            
            <div className="mb-6">
              <p className="mb-4">
                In this task, you'll assign orders to drivers based on matching delivery zone.
              </p>
              <p className="mb-4">
                <strong>Follow these guidelines:</strong>
              </p>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Match orders to drivers in the same zone</strong> when possible for efficient delivery</li>
                <li><strong>Process high priority orders first</strong>, followed by medium and low priority</li>
              </ul>
              
              {/* Animation example */}
              <div className="mt-6 mb-4">
                <h3 className="text-lg font-medium mb-3">Watch how it works:</h3>
                <div className="flex justify-center">
                  <OrderAssignmentExample 
                    version={version} 
                    animationStep={animationStep} 
                    totalSteps={totalAnimationSteps} 
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center font-medium">
                  {animationStep === 0 && "Step 1: Select an order from the list"}
                  {animationStep === 1 && "Step 2: Notice the matching zone between order and driver"}
                  {animationStep === 2 && "Step 3: Click on a driver to assign the order"}
                  {animationStep === 3 && "Step 4: The order is now assigned to the driver"}
                </p>
              </div>
              
  
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-end">
              
              <div className="flex space-x-3">
                {animationStep > 0 && (
                  <Button 
                    variant="outline"
                    className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded"
                    onClick={prevAnimationStep}
                  >
                    Previous
                  </Button>
                )}
                
                {!allStepsCompleted ? (
                  <Button 
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={nextAnimationStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    onClick={handleStartTask}
                  >
                    Start Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}