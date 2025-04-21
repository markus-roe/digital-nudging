import React, { useState, useEffect } from "react";
import { FiHelpCircle, FiBell, FiSettings, FiUser } from 'react-icons/fi';
import ExperimentOnboarding from "./ExperimentOnboarding";
import NavItem from './NavItem';
import { workflowSteps, WorkflowStep } from '@/lib/data/workflowSteps';
import { isStepDisabled, canChangeToStep } from '@/lib/utils/workflowHelpers';

interface ERPDashboardProps {
  children?: React.ReactNode;
  introCompleted: boolean;
  onIntroComplete: () => void;
  currentTask: "validation" | "assignment" | "scheduling" | null;
  onTaskChange: (task: "validation" | "assignment" | "scheduling") => void;
  taskProgress: {
    validation: boolean;
    assignment: boolean;
    scheduling: boolean;
  };
}

export default function ERPDashboard({
  children,
  introCompleted,
  onIntroComplete,
  currentTask,
  onTaskChange,
  taskProgress
}: ERPDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isWindowTooSmall, setIsWindowTooSmall] = useState(false);
  
  useEffect(() => {
    const checkDeviceCompatibility = () => {
      const width = window.innerWidth;
      const screenWidth = window.screen.width;
      setIsMobile(screenWidth < 1025);
      setIsTablet(screenWidth >= 1025 && screenWidth < 1350);
      setIsWindowTooSmall(width < 1025 && screenWidth >= 1025);
    };
    
    checkDeviceCompatibility();
    window.addEventListener('resize', checkDeviceCompatibility);
    return () => window.removeEventListener('resize', checkDeviceCompatibility);
  }, []);

  // Render warning for devices with insufficient screen size
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
          <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Larger Screen Required</h2>
          <p className="text-gray-600 mb-4">
            This research study requires a screen width of at least 1025 pixels.
          </p>
          <p className="text-gray-600 mb-6">
            Please use a device with a larger screen to participate in this study.
          </p>
        </div>
      </div>
    );
  }

  // Render warning for small window size
  if (isWindowTooSmall) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
          <div className="mx-auto mb-4 relative w-32 h-32">
            {/* Window frame */}
            <div className="absolute inset-0 border-2 border-blue-500 rounded-md"></div>
            
            {/* Window title bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-blue-500 flex items-center px-2 rounded-t-sm">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            {/* Expand arrows animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 animate-pulse">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </div>
            
            {/* Animated border that expands */}
            <div className="absolute inset-0 border-2 border-blue-500 rounded-md opacity-75"></div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-3">Maximize Your Browser Window</h2>
          <p className="text-gray-600 mb-4">
            Your browser window is too small for optimal viewing. Please maximize your browser window or increase its width to at least 1025 pixels.
          </p>
        </div>
      </div>
    );
  }

  // Render registration and introduction screens
  if (!introCompleted) {
    return <ExperimentOnboarding onIntroComplete={onIntroComplete} />;
  }

  // Shared function to render workflow navigation items
  const renderWorkflowNavItems = (variant: 'stepper' | 'sidebar') => {
    return workflowSteps.map((step: WorkflowStep, index: number) => {
      const commonProps = {
        stepNumber: step.number,
        title: step.title,
        description: step.description,
        isActive: currentTask === step.id,
        isCompleted: taskProgress[step.id],
        isDisabled: isStepDisabled(step, currentTask, taskProgress),
        onClick: () => {
          if (canChangeToStep(step, currentTask, taskProgress)) {
            onTaskChange(step.id);
          }
        },
        variant,
      };

      if (variant === 'stepper') {
        return (
          <NavItem
            key={step.id}
            {...commonProps}
            showRightBorder={index < workflowSteps.length - 1}
          />
        );
      }

      return <NavItem key={step.id} {...commonProps} />;
    });
  };

  const StepperNav = () => (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-full mx-auto">
        <div className="flex">
          {renderWorkflowNavItems('stepper')}
        </div>
      </div>
    </div>
  );

  const SidebarNav = () => (
    <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-700">Order Management</h2>
      </div>
      <nav className="flex-1">
        <ul>
          {renderWorkflowNavItems('sidebar')}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-2">Workflow Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ 
              width: `${(
                (taskProgress.validation ? 1 : 0) + 
                (taskProgress.assignment ? 1 : 0) + 
                (taskProgress.scheduling ? 1 : 0)
              ) * 33.33}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Render main dashboard with tabs
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between cursor-default select-none">
          <div className="flex items-center">
          <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">DeliverEase</h1>
          </div>
          
          {/* Navigation menu */}
          <div className="hidden md:flex items-center space-x-6 ml-10">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</a>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                Orders
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 w-48 z-10 hidden group-hover:block">
                <div className="bg-white rounded-md shadow-lg border border-gray-100">
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">New Orders</a>
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Pending Orders</a>
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Completed Orders</a>
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Order History</a>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                Delivery
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 w-48 z-10 hidden group-hover:block">
                <div className="bg-white rounded-md shadow-lg border border-gray-100">
                  <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Driver Management</a>
                  <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Route Planning</a>
                  <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Delivery Zones</a>
                  <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Delivery Reports</a>
                </div>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Reports</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            {/* <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value=""
                  onChange={() => {}}
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-none"
                />
                <div className="absolute left-3 top-2.5">
                  <FiSearch className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div> */}
            
            {/* Help Button */}
            <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" aria-label="Help">
              <FiHelpCircle className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" aria-label="Notifications">
                <FiBell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Settings */}
            <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" aria-label="Settings">
              <FiSettings className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-white">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">User</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block border border-gray-100">
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Sign out</a>
              </div>
            </div>
            
            {/* Version Badge */}
            {/* <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Version {version.toUpperCase()}</span> */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        <div className="flex flex-col w-full">
          {/* Show stepper nav for tablet view */}
          {isTablet && <StepperNav />}
          
          <div className="flex flex-1">
            {/* Show sidebar only for desktop view */}
            {!isTablet && <SidebarNav />}
            
            {/* Main content */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}