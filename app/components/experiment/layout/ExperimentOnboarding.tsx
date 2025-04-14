import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useExperiment } from "@/lib/context/ExperimentContext";
interface ExperimentOnboardingProps {
  onIntroComplete: () => void;
}

export default function ExperimentOnboarding({ onIntroComplete }: ExperimentOnboardingProps) {
  // Registration and introduction state
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const { setParticipantId, version } = useExperiment();
  // Registration form state
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
          demographics: {
            age,
            gender,
            experience,
            education
          },
          version // Pass the version to the registration API
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      
      // Store participantId in localStorage for persistence
      localStorage.setItem('participantId', data.participantId);
      setParticipantId(data.participantId);
      
      // Move to introduction steps
      setRegistrationCompleted(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                {!registrationCompleted ? "Thank you for participating in this study!" : "Welcome to DeliverEase ERP System"}
              </h1>
            </div>
            
            <div className={`flex-grow ${registrationCompleted ? 'overflow-y-auto pr-1 max-h-[550px]' : ''}`}>
              {!registrationCompleted ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">About the Study</h3>
                    <p className="text-gray-700">
                      This study explores how different interface designs affect decision-making in ERP systems. Your participation will help improve these systems for real-world users.
                    </p>
                  </div>
  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="orange" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-700">
                        ERP (Enterprise Resource Planning) systems are software platforms that integrate business processes, helping companies manage information and resources efficiently.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 mb-2 font-medium text-gray-600 text-center">
                    Please complete this form to begin:
                  </p>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">

                    
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
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                      <h3 className="font-medium text-blue-800 mb-2">Your Mission Today</h3>
                      <p className="text-gray-700">
                        You'll be stepping into the role of an order management specialist at DeliverEase, helping ensure orders are processed efficiently and shipped on time.
                      </p>
                    </div>
                  
                    <h3 className="font-medium text-gray-800 mb-3">Your workflow consists of three key tasks:</h3>
                    <ol className="list-decimal text-left mx-auto max-w-md space-y-3 mb-6">
                      <li className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Validating order details</span>
                        <br />
                        Ensure all customer information is accurate
                      </li>
                      <li className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Assigning drivers</span>
                        <br />
                        Match orders with the right delivery personnel
                      </li>
                      <li className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">Scheduling deliveries</span>
                        <br />
                        Set optimal delivery times for each order
                      </li>
                    </ol>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-center">
              <Button
                type="button"
                onClick={!registrationCompleted 
                  ? () => document.querySelector('form')?.requestSubmit() 
                  : onIntroComplete
                }
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : !registrationCompleted ? 'Continue' : 'Start'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 