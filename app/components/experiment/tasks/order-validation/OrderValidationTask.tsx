import React, { useState } from "react";
import { ExperimentVersion } from "@/lib/types/experiment";
import { useOrderValidation } from "@/lib/hooks/useOrderValidation";
import { initialOrderValidations } from "@/lib/data/orderValidationData";
import { OrderValidationFormData } from "@/lib/types/orderValidation";
import OrderValidationList from "./OrderValidationList";
import OrderValidationForm from "./OrderValidationForm";
import TaskTemplate from "@/app/components/experiment/shared/TaskTemplate";
import { VALIDATION_MESSAGES } from "@/lib/constants/validationMessages";
import OrderValidationExample from "./OrderValidationExample";

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
  
  // Task guidelines
  const guidelines = [
    "Review each order's delivery details for errors",
    "Correct any errors in the form fields",
    "Validate all orders to complete the task"
  ];
  
  // Check if task is completed
  const taskCompleted = validatedOrdersCount === orders.length;
  
  // Handle canceling order selection
  const handleCancelOrderSelection = () => {
    handleOrderSelect('');
    setCurrentFormData(null);
  };

  // Handle form data changes
  const handleFormDataChange = (formData: OrderValidationFormData) => {
    setCurrentFormData(formData);
  };
  
  // Get error message for a field
  const getErrorMessage = (field: string): string => {
    if (formErrors[field]) {
      return formErrors[field];
    }
    
    // If no current error, return the standard validation message
    if (field === 'address') {
      return VALIDATION_MESSAGES.address.format;
    } else if (field === 'contactName') {
      return VALIDATION_MESSAGES.contactName.required;
    } else if (field === 'contactPhone') {
      return VALIDATION_MESSAGES.contactPhone.format;
    } else if (field === 'contactEmail') {
      return VALIDATION_MESSAGES.contactEmail.format;
    }
    
    return '';
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
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-700 mb-3">Fields requiring correction:</h4>
                <ul className="space-y-2">
                  {selectedOrder.errors.map((field) => (
                    <li key={field} className="flex flex-col">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6 mt-1">{getErrorMessage(field)}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <OrderValidationForm
                order={selectedOrder}
                version={version}
                formErrors={formErrors}
                onSubmit={submitValidation}
                onCancel={handleCancelOrderSelection}
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