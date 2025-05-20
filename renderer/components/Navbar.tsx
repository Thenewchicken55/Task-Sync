"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/calendar"
              className="text-2xl font-bold text-white tracking-tight hover:tracking-wide transition-all duration-300"
            >
              TaskSync
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/archive"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
