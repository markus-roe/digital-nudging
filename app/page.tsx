import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Digital Nudging in ERP Order Delivery Management
        </h1>
        
        <p className="text-gray-600 mb-6 text-center">
          A bachelor thesis prototype exploring the impact of digital nudging in ERP interfaces.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <Link href="/register">
            <Button 
              variant="primary" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Participate in Study
            </Button>
          </Link>
          
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>This prototype tests how subtle UI interventions can improve decision-making efficiency.</p>
            <p className="mt-2">Participants will be entered into a giveaway as a thank you for their time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
