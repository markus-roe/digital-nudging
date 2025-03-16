"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Call API to register participant and get assigned version
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

      const data = await response.json();
      
      // Redirect to the assigned task with the assigned version
      router.push(`/${data.task}/${data.version}`);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="p-6 shadow-md w-full max-w-3xl">
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (for giveaway participation)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // required
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
              // required
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
              // required
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
              // required
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
              // required
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
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              {isSubmitting ? 'Submitting...' : 'Start Experiment'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            By submitting this form, you agree to participate in our study. Your data will be handled according to our privacy policy.
          </p>
        </form>
      </Card>
    </div>
  );
} 