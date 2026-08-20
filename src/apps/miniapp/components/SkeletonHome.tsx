import React from 'react';

export function SkeletonHome() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/5 -mx-4 -mt-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="h-3 w-20 bg-white/10 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Actions Skeleton */}
      <div className="flex gap-3">
        <div className="flex-1 h-[44px] bg-white/10 rounded-xl animate-pulse"></div>
        <div className="flex-1 h-[44px] bg-white/10 rounded-xl animate-pulse"></div>
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <div className="h-5 w-24 bg-white/10 rounded mb-3 animate-pulse"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass p-3 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse"></div>
              <div className="h-2 w-12 bg-white/10 rounded animate-pulse mt-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="h-5 w-28 bg-white/10 rounded animate-pulse"></div>
          <div className="h-3 w-8 bg-white/10 rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2 flex flex-col items-end">
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
