"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Digital Nudging in ERP Order Delivery Management</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-2">About This Experiment</h2>
          <p className="mb-2">
            This prototype explores the impact of digital nudging in ERP order delivery management interfaces.
            It aims to reduce mental effort and improve decision-making efficiency through subtle UI interventions.
          </p>
          <p>
            The experiment includes multiple interface versions to test different approaches to driver assignment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>Version A: Control Interface</CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                The baseline interface with no digital nudging techniques applied.
                Features a two-column layout with orders and drivers in separate tables.
              </p>
              <Link 
                href="/experiment/a" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
              >
                Try Version A
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>Version B: Nudged Interface</CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Enhanced interface with digital nudging techniques applied.
                Features visual cues, recommendations, and feedback mechanisms.
              </p>
              <Link 
                href="/experiment/b" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
              >
                Try Version B
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>Version C: Single Table Layout</CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Redesigned interface with driver cards displayed above the orders table.
                Simplifies the workflow by focusing on one table at a time.
              </p>
              <Link 
                href="/experiment/c" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
              >
                Try Version C
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>Version D: Nudged Single Table</CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Single table layout with digital nudging techniques applied.
                Features match scores, recommendations, and interactive selection.
              </p>
              <Link 
                href="/experiment/d" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
              >
                Try Version D
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
