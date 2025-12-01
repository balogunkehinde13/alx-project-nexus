"use client";
import Link from 'next/link';
 

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center animate-[fadeIn_0.7s_ease-out]">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="inline-block relative">
            {/* Large 404 Text */}
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 leading-none">
              404
            </h1>
            
            {/* Floating Icons */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="absolute -bottom-2 -right-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/create"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Create Poll
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              About
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}