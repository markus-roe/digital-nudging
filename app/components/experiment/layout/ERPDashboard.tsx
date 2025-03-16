import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExperimentVersion } from "@/lib/types/experiment";
import { FiSearch, FiHelpCircle, FiBell, FiSettings, FiUser } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';

interface ERPDashboardProps {
  version: ExperimentVersion;
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
  version,
  children,
  introCompleted,
  onIntroComplete,
  currentTask,
  onTaskChange,
  taskProgress
}: ERPDashboardProps) {
  // Registration and introduction state
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [introStep, setIntroStep] = useState(0); // Start at 0 for registration
  const totalIntroSteps = 2;
  
  // Registration form state
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle registration submission
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Call API to register participant
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          demographics: {
            age,
            gender,
            experience,
            education
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      // Move to introduction steps
      setRegistrationCompleted(true);
      setIntroStep(1);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Render registration and introduction screens
  if (!introCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex items-center justify-center min-h-screen">
          <div className="container mx-auto p-6 max-w-4xl">
            {!registrationCompleted && introStep === 0 ? (
              <Card className="p-6 shadow-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Experiment Registration</h1>
                
                <p className="mb-6 text-gray-600">
                  Thank you for participating in our study on ERP interfaces. Please complete this form to begin.
                  Your email will only be used for the giveaway and will not be shared with third parties.
                </p>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (for giveaway participation)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group
                    </label>
                    <select
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                      <option value="">Select age group</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55+">55+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience with ERP Systems
                    </label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                      <option value="">Select experience level</option>
                      <option value="none">No experience</option>
                      <option value="beginner">Beginner (less than 1 year)</option>
                      <option value="intermediate">Intermediate (1-3 years)</option>
                      <option value="advanced">Advanced (3+ years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Highest Education Level
                    </label>
                    <select
                      id="education"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD or Doctorate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      {isSubmitting ? 'Submitting...' : 'Continue'}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    By submitting this form, you agree to participate in our study. Your data will be handled according to our privacy policy.
                  </p>
                </form>
              </Card>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                  Welcome to DeliverEase ERP System
                </h1>
                
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Introduction</h2>
                    <p>
                      You'll be working with our order delivery management system to process customer orders.
                      Your role involves three main tasks that follow the natural order processing workflow:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Validating order details to ensure accuracy</li>
                      <li>Assigning validated orders to appropriate drivers</li>
                      <li>Scheduling delivery times for assigned orders</li>
                    </ol>
                    <p>
                      This simulates a typical day in the life of an order management specialist.
                    </p>
                  </div>
                
                
                <div className="mt-8 flex justify-between items-center">
                  <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                    onClick={onIntroComplete}
                  >
                    Start
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Render main dashboard with tabs
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
              <div className="absolute left-0 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block border border-gray-100">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">New Orders</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pending Orders</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Completed Orders</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Order History</a>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                Delivery
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block border border-gray-100">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Driver Management</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Route Planning</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delivery Zones</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delivery Reports</a>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Reports</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value=""
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-none"
                />
                <div className="absolute left-3 top-2.5">
                  <FiSearch className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
            
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
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
              </div>
            </div>
            
            {/* Version Badge */}
            {/* <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Version {version.toUpperCase()}</span> */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        <div className="flex flex-col h-full w-full">
          {/* Main content area */}
          <div className="flex flex-1">
            {/* Left sidebar */}
            <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-700">Order Management</h2>
              </div>
              <nav className="flex-1">
                <ul>
                  <li>
                    <button 
                      className={`cursor-pointer w-full text-left px-4 py-3 flex items-center ${currentTask === 'validation' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => currentTask === 'validation' || taskProgress.validation ? onTaskChange('validation') : null}
                      disabled={currentTask !== 'validation' && !taskProgress.validation}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${taskProgress.validation ? 'bg-green-100 text-green-700' : currentTask === 'validation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                        {taskProgress.validation ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Order Validation</div>
                        <div className="text-xs text-gray-500">Verify order details</div>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`cursor-pointer w-full text-left px-4 py-3 flex items-center ${currentTask === 'assignment' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => taskProgress.validation && (currentTask === 'assignment' || taskProgress.assignment) ? onTaskChange('assignment') : null}
                      disabled={!taskProgress.validation || (currentTask !== 'assignment' && !taskProgress.assignment)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${taskProgress.assignment ? 'bg-green-100 text-green-700' : currentTask === 'assignment' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                        {taskProgress.assignment ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Driver Assignment</div>
                        <div className="text-xs text-gray-500">Assign orders to drivers</div>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`cursor-pointer w-full text-left px-4 py-3 flex items-center ${currentTask === 'scheduling' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => taskProgress.assignment && (currentTask === 'scheduling' || taskProgress.scheduling) ? onTaskChange('scheduling') : null}
                      disabled={!taskProgress.assignment || (currentTask !== 'scheduling' && !taskProgress.scheduling)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${taskProgress.scheduling ? 'bg-green-100 text-green-700' : currentTask === 'scheduling' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                        {taskProgress.scheduling ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Delivery Scheduling</div>
                        <div className="text-xs text-gray-500">Schedule delivery times</div>
                      </div>
                    </button>
                  </li>
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
            
            {/* Main content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentTask === 'validation' && 'Order Validation'}
                    {currentTask === 'assignment' && 'Driver Assignment'}
                    {currentTask === 'scheduling' && 'Delivery Scheduling'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentTask === 'validation' && 'Review and validate order details before processing'}
                    {currentTask === 'assignment' && 'Assign validated orders to appropriate drivers'}
                    {currentTask === 'scheduling' && 'Schedule delivery times for assigned orders'}
                  </p>
                </div>
                
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}