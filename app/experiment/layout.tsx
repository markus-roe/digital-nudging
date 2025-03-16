import React from "react";
import { FiBell, FiHelpCircle, FiSettings, FiUser, FiSearch } from "react-icons/fi"; // Using React Icons (Feather set)

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">ERP Order Delivery Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
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
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  );
}
