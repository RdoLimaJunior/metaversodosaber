
import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-yellow-400"></div>
);

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-blue-900 text-white">
      <LoadingSpinner />
      <h2 className="text-3xl font-display mt-8 text-yellow-300 tracking-wider animate-pulse">{message}</h2>
    </div>
  );
};

export default LoadingScreen;
