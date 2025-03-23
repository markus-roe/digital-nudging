import React, { useState, useEffect } from "react";
import { ExperimentVersion } from "@/lib/types/experiment";
import { useOrderValidation } from "@/lib/hooks/useOrderValidation";
import { initialOrderValidations } from "@/lib/data/orderValidationData";
import { OrderValidationFormData } from "@/lib/types/orderValidation";
import OrderValidationList from "./OrderValidationList";
import OrderValidationForm from "./OrderValidationForm";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import OrderValidationExample from "./OrderValidationExample";
import { useHesitationTracker } from "@/lib/hooks/useHesitationTracker";

interface OrderValidationProps {
  version: ExperimentVersion;
  onComplete?: () => void;
}

export default function OrderValidationTask({ 
  version, 
  onComplete 
}: OrderValidationProps) {
  // Core functionality hooks
  const {
    orders,
    selectedOrder,
    selectedOrderId,
    validatedOrdersCount,
    formErrors,
    handleOrderSelect,
    submitValidation
  } = useOrderValidation(initialOrderValidations);

  // Track current form data
  const [currentFormData, setCurrentFormData] = useState<OrderValidationFormData | null>(null);
  
  // Add hesitation tracking
  const {
    startHesitationTracking,
    recordHesitationTime
  } = useHesitationTracker();
  
  // Task guidelines
  const guidelines = [
    "Review each order's delivery details for errors",
    "Correct any errors in the form fields",
    "Validate all orders to complete the task"
  ];
  
  // Check if task is completed
  const taskCompleted = validatedOrdersCount === orders.length;
  
  // Track hesitation time when an order is selected
  useEffect(() => {
    if (selectedOrderId) {
      startHesitationTracking();
    }
  }, [selectedOrderId, startHesitationTracking]);
  
  // Handle form data changes
  const handleFormDataChange = (formData: OrderValidationFormData) => {
    setCurrentFormData(formData);
  };
  
  // Wrap submit validation to include hesitation tracking
  const handleSubmitValidation = (orderId: string, formData: OrderValidationFormData) => {
    // Record hesitation time before submitting
    recordHesitationTime(orderId);
    
    // Submit the validation
    return submitValidation(orderId, formData);
  };

  return (
    <TaskTemplate
      version={version}
      taskType="validation"
      title="Order Validation Task"
      description="In this task, you'll review and validate delivery details before orders are processed."
      guidelines={guidelines}
      progressCount={validatedOrdersCount}
      totalCount={orders.length}
      isTaskCompleted={taskCompleted}
      onComplete={onComplete}
      example={
        <OrderValidationExample 
          version={version} 
          onComplete={onComplete}
        />
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 select-none">
        <div className="lg:w-2/8">
          <OrderValidationList
            orders={orders}
            selectedOrderId={selectedOrderId}
            onOrderSelect={handleOrderSelect}
          />
        </div>
        
        <div className="lg:w-6/8">
          {selectedOrder ? (
            <>
              <OrderValidationForm
                order={selectedOrder}
                version={version}
                formErrors={formErrors}
                onSubmit={handleSubmitValidation}
                onFormDataChange={handleFormDataChange}
              />
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No Order Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an order from the list to validate its delivery details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TaskTemplate>
  );
} 