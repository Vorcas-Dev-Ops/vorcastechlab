import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-orange-500 uppercase tracking-[0.35em] text-sm font-bold">404</p>
        <h1 className="text-5xl md:text-6xl font-black">Page not found</h1>
        <p className="text-white/60 text-lg">
          The page you are looking for doesn’t exist or has been moved. Use the button below to return home.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-orange-600 text-black font-bold uppercase tracking-widest hover:bg-orange-500 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
