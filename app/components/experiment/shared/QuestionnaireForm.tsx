import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface QuestionnaireFormProps {
  onSubmit: (data: {
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
  }) => void;
}

const NASA_TLX_DESCRIPTIONS = {
  mental: {
    label: "Mental Demand",
    description: "How much mental and perceptual activity was required? For example, how much did you need to think, decide, calculate, remember, look, search, etc.?"
  },
  physical: {
    label: "Physical Demand",
    description: "How much physical activity was required? For example, how much did you need to push, pull, turn, control, or activate?"
  },
  temporal: {
    label: "Time Pressure",
    description: "How much time pressure did you feel due to the rate or pace at which the tasks or task elements occurred?"
  },
  performance: {
    label: "Task Performance",
    description: "How successful were you in accomplishing what you were asked to do? How satisfied were you with your performance in accomplishing these tasks?"
  },
  effort: {
    label: "Effort Required",
    description: "How hard did you have to work (mentally and physically) to accomplish your level of performance?"
  },
  frustration: {
    label: "Frustration Level",
    description: "How irritated, stressed, and annoyed versus content, relaxed, and complacent did you feel during the tasks?"
  }
};

const NASA_TLX_LABELS = {
  mental: {
    left: "Very Low",
    right: "Very High"
  },
  physical: {
    left: "Very Low",
    right: "Very High"
  },
  temporal: {
    left: "Very Low",
    right: "Very High"
  },
  performance: {
    left: "Perfect",
    right: "Failure"
  },
  effort: {
    left: "Very Low",
    right: "Very High"
  },
  frustration: {
    left: "Very Low",
    right: "Very High"
  }
};

const STEPS = ['nasa-tlx', 'sus', 'confidence', 'feedback'] as const;
type Step = typeof STEPS[number];

type BaseQuestion = {
  title: string;
  description?: string;
};

type RadioQuestion = BaseQuestion & {
  isTextArea?: false;
  value: number;
  onChange: (rating: number) => void;
  options: number[];
  leftLabel: string;
  rightLabel: string;
  name: string;
};

type TextAreaQuestion = BaseQuestion & {
  isTextArea: true;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

type Question = RadioQuestion | TextAreaQuestion;

type SectionConfig = {
  questions: Question[];
  totalSteps: number;
};

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('nasa-tlx');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [nasaTlx, setNasaTlx] = useState({
    mental: 0,
    physical: 0,
    temporal: 0,
    performance: 0,
    effort: 0,
    frustration: 0
  });
  const [sus, setSus] = useState<number[]>(Array(10).fill(0));
  const [confidence, setConfidence] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [currentStep]);

  useEffect(() => {
    if (questionRefs.current[activeQuestionIndex] && contentRef.current) {
      const question = questionRefs.current[activeQuestionIndex];
      const container = contentRef.current;
      
      container.scrollTo({
        top: question.offsetTop - container.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  }, [activeQuestionIndex]);

  const handleNasaTlxChange = (field: keyof typeof nasaTlx, value: number) => {
    setNasaTlx(prev => ({ ...prev, [field]: value }));
    
    const currentIndex = Object.keys(nasaTlx).indexOf(field);
    const totalQuestions = Object.keys(nasaTlx).length;
    
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setActiveQuestionIndex(currentIndex + 1);
      }, 300); // Reduced delay to 300ms
    }
  };

  const handleSusChange = (index: number, value: number) => {
    setSus(prev => {
      const newSus = [...prev];
      newSus[index] = value;
      return newSus;
    });

    if (index < 9) {
      setTimeout(() => {
        setActiveQuestionIndex(index + 1);
      }, 300);
    }
  };

  const handleConfidenceChange = (value: number) => {
    setConfidence(value);
    setTimeout(() => {
      const currentIndex = STEPS.indexOf(currentStep);
      setCurrentStep(STEPS[currentIndex + 1]);
      setActiveQuestionIndex(0);
    }, 300);
  };

  const handleSubmit = () => {
    onSubmit({
      nasaTlx,
      sus,
      confidence,
      feedback
    });
  };

  const getStepStatus = (step: Step) => {
    const currentIndex = STEPS.indexOf(currentStep);
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const stepTitles = {
    'nasa-tlx': {
      main: 'Task Workload Assessment',
      description: 'Please rate your experience with the task workload across different dimensions.'
    },
    'sus': {
      main: 'System Usability Evaluation',
      description: 'Please evaluate your experience with the order delivery management system.'
    },
    'confidence': {
      main: 'Decision Confidence Assessment',
      description: 'Please reflect on your confidence in the decisions made during the tasks.'
    },
    'feedback': {
      main: 'Additional Feedback',
      description: 'Please share any additional thoughts about your experience.'
    }
  };

  const renderProgressDots = (totalDots: number, activeDot: number) => (
    totalDots > 1 ? (
      <div className="flex justify-center gap-2 mb-10">
        {Array.from({ length: totalDots }).map((_, index) => (
            <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activeDot 
              ? 'bg-blue-500 w-4' 
              : index < activeDot 
                ? 'bg-blue-300' 
                : 'bg-gray-200'
          }`}
          />
        ))}
      </div>
    ) : (
      <div className="flex justify-center gap-2 mb-10">
        <div className="w-2 h-2" />
      </div>
    )
  );

  const renderRadioGroup = ({
    value,
    onChange,
    options,
    leftLabel,
    rightLabel,
    name
  }: {
    value: number;
    onChange: (value: number) => void;
    options: number[];
    leftLabel: string;
    rightLabel: string;
    name: string;
  }) => (
    <div className="h-[80px] flex justify-between items-center gap-4">
      <span className="text-sm font-medium text-gray-800 w-[100px] text-right">{leftLabel}</span>
      <div className="flex-1 flex justify-between items-center gap-1">
        {options.map((rating) => {
          return (
            <label 
              key={rating}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                border-2 transition-all duration-200 cursor-pointer
                transform hover:scale-110 active:scale-95
                ${value === rating 
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg ring-4 ring-blue-200' 
                  : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={rating}
                checked={value === rating}
                onChange={() => onChange(rating)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{rating}</span>
            </label>
          );
        })}
      </div>
      <span className="text-sm font-medium text-gray-800 w-[100px] text-left">{rightLabel}</span>
    </div>
  );

  const isStepComplete = () => {
    switch (currentStep) {
      case 'nasa-tlx':
        return Object.values(nasaTlx).every(value => value > 0);
      case 'sus':
        return sus.every(value => value > 0);
      case 'confidence':
        return confidence > 0;
      case 'feedback':
        return feedback.trim().length > 0;
      default:
        return false;
    }
  };

  const renderSection = () => {
    const config: Record<Step, SectionConfig> = {
      'nasa-tlx': {
        questions: Object.entries(nasaTlx).map(([key, value]) => ({
          title: NASA_TLX_DESCRIPTIONS[key as keyof typeof NASA_TLX_DESCRIPTIONS].label,
          description: NASA_TLX_DESCRIPTIONS[key as keyof typeof NASA_TLX_DESCRIPTIONS].description,
          value,
          onChange: (rating: number) => handleNasaTlxChange(key as keyof typeof nasaTlx, rating),
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          leftLabel: NASA_TLX_LABELS[key as keyof typeof NASA_TLX_LABELS].left,
          rightLabel: NASA_TLX_LABELS[key as keyof typeof NASA_TLX_LABELS].right,
          name: `nasa-tlx-${key}`
        })),
        totalSteps: Object.keys(nasaTlx).length
      },
      'sus': {
        questions: [
          "I think that I would like to use this order delivery management system frequently",
          "I found the order delivery management system unnecessarily complex",
          "I thought the order delivery management system was easy to use",
          "I think that I would need the support of a technical person to be able to use this system",
          "I found the various functions in the order delivery management system were well integrated",
          "I thought there was too much inconsistency in the order delivery management system",
          "I would imagine that most people would learn to use this order delivery management system very quickly",
          "I found the order delivery management system very cumbersome to use",
          "I felt very confident using the order delivery management system",
          "I needed to learn a lot of things before I could get going with this order delivery management system"
        ].map((question, index) => ({
          title: question,
          value: sus[index],
          onChange: (rating: number) => handleSusChange(index, rating),
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          leftLabel: "Disagree",
          rightLabel: "Agree",
          name: `sus-${index}`
        })),
        totalSteps: 10
      },
      'confidence': {
        questions: [{
          title: "Decision Confidence",
          description: "How confident were you in your decisions during the order delivery management tasks? This includes your confidence in validating order details, assigning drivers, and scheduling deliveries.",
          value: confidence,
          onChange: handleConfidenceChange,
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          leftLabel: "Not Confident",
          rightLabel: "Very Confident",
          name: "confidence"
        }],
        totalSteps: 1
      },
      'feedback': {
        questions: [{
          title: "Additional Feedback",
          description: "Please provide any additional feedback about your experience with the order delivery management system. For example, what aspects were particularly helpful or challenging? How did the interface influence your decision-making process?",
          isTextArea: true,
          value: feedback,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)
        }],
        totalSteps: 1
      }
    };

    const currentConfig = config[currentStep];
    const isLastQuestion = (currentStep === 'feedback' && false) || (currentStep === 'confidence' && false) || (currentStep !== 'feedback' && activeQuestionIndex === currentConfig.totalSteps - 1);

    return (
      <div className="space-y-8">
        {renderProgressDots(currentConfig.totalSteps, activeQuestionIndex)}
        {currentConfig.questions.map((question, index) => (
          <div 
            key={`${currentStep}-${index}`}
            className={`transition-all duration-300 transform absolute w-full
              ${index === activeQuestionIndex 
                ? 'translate-y-0' 
                : 'opacity-0 translate-y-8 pointer-events-none absolute'}`}
          >
            <div className={`h-[100px] mb-6 ${isLastQuestion && isStepComplete() ? 'opacity-60' : 'opacity-100'}`}>
              <h4 className="text-xl font-medium text-gray-900 mb-2">{question.title}</h4>
              {question.description && (
                <p className="text-base text-gray-600">{question.description}</p>
              )}
            </div>
            {question.isTextArea ? (
              <textarea
                value={question.value}
                onChange={question.onChange}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your feedback here..."
              />
            ) : (
              <div className="space-y-6">
                <div className={`space-y-6 ${isLastQuestion && isStepComplete() ? 'opacity-60' : 'opacity-100'}`}>
                  {renderRadioGroup({
                    value: question.value,
                    onChange: question.onChange,
                    options: question.options,
                    leftLabel: question.leftLabel,
                    rightLabel: question.rightLabel,
                    name: question.name
                  })}
                </div>
                {isLastQuestion && isStepComplete() && currentStep !== 'feedback' && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        const currentIndex = STEPS.indexOf(currentStep);
                        setCurrentStep(STEPS[currentIndex + 1]);
                        setActiveQuestionIndex(0);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
              )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-24">
        {/* Progress Line */}
        <div className="relative mb-16">
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ 
                width: `${(STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100}%` 
              }}
            />
          </div>
          
          {/* Step Circles on top of line */}
          <div className="flex items-center justify-between relative">
            {STEPS.map((step, index) => {
              const status = getStepStatus(step);
              return (
                <div 
                  key={step}
                  className="flex flex-col items-center relative"
                >
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                      transition-colors relative z-10 text-sm font-medium
                      ${status === 'completed' ? 'border-blue-400 bg-blue-400 text-white' : 
                        status === 'current' ? 'border-blue-500 bg-blue-500 text-white' : 
                        'border-gray-300 bg-white text-gray-500'}`}
                  >
                    <span className="relative z-10">{index + 1}</span>
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-40">
                    <span className={`block text-sm text-center whitespace-normal transition-colors duration-300
                      ${status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {stepTitles[step].main}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Section Title */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {stepTitles[currentStep].main}
          </h3>
          <p className="text-sm text-gray-600">
            {stepTitles[currentStep].description}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="min-h-[300px] relative">
            {renderSection()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 flex justify-end">
          {currentStep === 'feedback' && isStepComplete() ? (
            <Button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
          ) : (
            <div className="h-[40px]"></div>
          )}
        </div>
      </div>
    </div>
  );
}