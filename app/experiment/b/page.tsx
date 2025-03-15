"use client";

import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/Button';
import { initialOrders, initialDrivers } from '@/lib/data/orderAssignmentData';
import TaskInstructions from '@/app/components/experiment/TaskInstructions';
import TaskHeader from '@/app/components/experiment/TaskHeader';
import OrdersTable from '@/app/components/experiment/OrdersTable';
import DriversPanel from '@/app/components/experiment/DriversPanel';
import { useTaskTimer } from '@/lib/hooks/useTaskTimer';
import { useOrderAssignment } from '@/lib/hooks/useOrderAssignment';
import { useHesitationTracker } from '@/lib/hooks/useHesitationTracker';
import Link from 'next/link';

export default function OrderDriverAssignmentPage() {
  // Task state
  const [taskStarted, setTaskStarted] = useState<boolean>(false);
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const TIME_LIMIT = 180; // 3 minute time limit
  
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
  
  // Add this state for modal visibility
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  
  // Start the task and timer when user clicks "Start Task"
  const handleStartTask = () => {
    setTaskStarted(true);
    startTimer();
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
    setShowCompletionModal(true);
  };

  // Add a function to close the modal
  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };

  useEffect(() => {
    console.log(`${assignedOrdersCount} / ${orders.length}`);
    console.log(taskCompleted);
    console.log(orders)
  }, [orders]);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Driver Assignment</h1>

      {!taskStarted ? (
        <TaskInstructions onStartTask={handleStartTask} />
      ) : (
        <>
          <TaskHeader 
            assignedOrdersCount={assignedOrdersCount} 
            totalOrders={orders.length} 
            timeRemaining={timeRemaining} 
            formatTime={formatTime} 
          />

          <div className="flex flex-col lg:flex-row gap-6">
            <OrdersTable 
              orders={orders}
              selectedOrder={selectedOrder}
              assignments={assignments}
              onOrderSelect={handleOrderSelect}
              onUnassignOrder={unassignOrder}
            />
            
            <DriversPanel 
              drivers={drivers}
              selectedOrder={selectedOrder}
              assignments={assignments}
              onDriverSelect={handleDriverSelect}
            />
          </div>
          
          {taskCompleted && (
            <div className="mt-6 text-center">
              <Button 
                variant="primary" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                onClick={handleTaskComplete}
              >
                Complete Task
              </Button>
            </div>
          )}

          {/* Task Completion Modal */}
          {showCompletionModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Task Completed!</h2>
                <div className="mb-6">
                  <p className="mb-2">Task completed in <span className="font-semibold">{formatTime(TIME_LIMIT - timeRemaining)}</span></p>
                  <p className="mb-2">Sequence errors: <span className="font-semibold">{sequenceErrors}</span></p>
                  <p className="mb-2">Zone matching errors: <span className="font-semibold">{zoneMatchErrors}</span></p>
                  <p className="mb-2">Average decision time: <span className="font-semibold">{Math.round(averageHesitationTime / 1000)} seconds</span></p>
                  <p className="mb-2">Total hesitation time: <span className="font-semibold">{Math.round(totalHesitationTime / 1000)} seconds</span></p>
                </div>
                <div className="flex justify-between">
                  <Link href="/">
                    <Button 
                      variant="outline"
                      className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded"
                    >
                      Return Home
                    </Button>
                  </Link>
                  <Button 
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={closeCompletionModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 