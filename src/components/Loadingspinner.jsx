import React from 'react';
import { RingLoader } from 'react-spinners';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <RingLoader color="#3490dc" size={60} />
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
);

export default LoadingSpinner;
