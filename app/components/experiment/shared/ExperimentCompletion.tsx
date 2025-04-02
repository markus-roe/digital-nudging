import React, { useState } from 'react';
import QuestionnaireForm from './QuestionnaireForm';
import { useExperiment } from '@/lib/context/ExperimentContext';
import { Button } from '@/components/ui/Button';

interface ExperimentCompletionProps {
  onComplete: () => void;
}

export default function ExperimentCompletion({ onComplete }: ExperimentCompletionProps) {
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const { participantId, version } = useExperiment();

  const handleQuestionnaireSubmit = async (data: {
    nasaTlx: {
      mental: number;
      physical: number;
      temporal: number;
      performance: number;
      effort: number;
      frustration: number;
    };
    sus: number[];
    confidence: number;
    feedback: string;
  }) => {
    try {
      const response = await fetch('/api/tracking/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          version,
          ...data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }

      setQuestionnaireCompleted(true);
      onComplete();
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  };

  if (questionnaireCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your responses have been recorded. Thank you for participating in our study.
          </p>
          <p className="text-sm text-gray-500">
            You may now close this window.
          </p>
        </div>
      </div>
    );
  }

  if (!questionnaireStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for completing all the tasks. Please take a few minutes to complete the following questionnaires.
          </p>
          <p className="text-gray-600 mb-8">
            The questionnaires will help us understand your experience with the system and improve it for future users.
            Your feedback is invaluable to our research.
          </p>
          <Button
            onClick={() => setQuestionnaireStarted(true)}
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-lg"
          >
            Start Questionnaire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full">
        <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
      </div>
    </div>
  );
} 