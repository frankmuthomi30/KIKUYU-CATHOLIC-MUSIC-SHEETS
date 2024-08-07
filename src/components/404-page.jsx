import React from 'react';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! Page not found.</p>
      <p className="text-lg text-gray-500 mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <p className='text-base text-gray-500'>Check you connecion and retry.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        Go back to homepage
      </Link>
    </div>
  );
};

export default Page404;