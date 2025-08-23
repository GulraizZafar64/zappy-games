import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    for (let i = 0; i < uniqueRange.length; i++) {
      rangeWithDots.push(uniqueRange[i]);
      
      if (uniqueRange[i + 1] && uniqueRange[i + 1] - uniqueRange[i] > 1) {
        rangeWithDots.push('...');
      }
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center mt-8 ${className}`}>
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-300
            ${currentPage === 1 
              ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
            }
            sm:w-12 sm:h-12
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-300 text-sm
                    ${currentPage === page
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
                    }
                    sm:w-12 sm:h-12 sm:text-base
                  `}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-300
            ${currentPage === totalPages 
              ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
            }
            sm:w-12 sm:h-12
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </nav>

      {/* Page Info - Hidden on very small screens */}
      <div className="hidden sm:flex items-center ml-4 text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};


