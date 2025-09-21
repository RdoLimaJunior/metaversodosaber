import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  imageUrl: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, imageUrl }) => {
  const isPlaceholder = imageUrl === 'placeholder';
  return (
    <div className={`relative w-full h-screen flex items-center justify-center text-white text-center p-4 ${isPlaceholder ? 'bg-gradient-to-br from-blue-900 to-purple-800' : 'bg-black'}`}>
      {!isPlaceholder && imageUrl && (
        <img 
          src={imageUrl} 
          alt="Aventura nos metaversos do saber" 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50" 
        />
      )}
      <div className="relative z-10 bg-black/50 p-8 rounded-2xl backdrop-blur-sm">
        <h1 className="text-5xl md:text-7xl font-display text-yellow-300 drop-shadow-lg">
          Aventura nos Metaversos do Saber
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-amber-100">
          Explore Mundos Incríveis de Aprendizagem
        </p>
        <button
          onClick={onStart}
          className="mt-8 font-display text-3xl px-12 py-5 bg-green-600 text-white rounded-xl shadow-lg border-b-4 border-green-800 hover:bg-green-500 hover:-translate-y-1 transform transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Começar Aventura!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;