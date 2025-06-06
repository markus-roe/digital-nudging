'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const RefreshButton = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if 'R' key is pressed and no input element is focused
      if (event.key.toLowerCase() === 'r' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault(); // Prevent default browser behavior
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []); // Empty dependency array since handleRefresh is stable

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center px-3 py-3 border border-gray-300 shadow-lg text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-100 active:shadow-inner active:translate-y-px transition-all duration-75"
      >
        {isRefreshing ? (
          <svg
            className="animate-spin h-4 w-4 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
      </button>
    </div>
  );
}; 