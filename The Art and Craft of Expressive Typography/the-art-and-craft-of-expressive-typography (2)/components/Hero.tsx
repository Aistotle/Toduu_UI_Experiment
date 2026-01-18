
import React from 'react';

const Hero: React.FC = () => {
  return (
    <header className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          The Art of Expressive Typography
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          An exploration of type that doesn't just say something—it{' '}
          <span className="italic text-gray-200">is</span> something.
        </p>
      </div>
       <div className="absolute bottom-10 animate-bounce">
            <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    </header>
  );
};

export default Hero;
