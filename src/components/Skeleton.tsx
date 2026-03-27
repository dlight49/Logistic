import React from "react";
import { cn } from "../utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="hidden lg:block h-24 rounded-2xl" />
      </div>

      {/* Title */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 overflow-hidden">
            <Skeleton className="h-32 w-full rounded-none" />
            <div className="p-5 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-16 rounded-lg" />
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between gap-4">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
