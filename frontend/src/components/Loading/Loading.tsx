import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "blue",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "red" | "green" | "purple" | "gray";
}) => {
  // Tailwind size classes mapping
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClasses[size]} ${colorClasses[color]} motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" color="blue" />
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

const LoadingOverlay = ({
  children,
  isLoading,
}: {
  children: any;
  isLoading: any;
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
        <LoadingSpinner size="lg" color="blue" />
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingPage, LoadingOverlay };

export default LoadingSpinner;
