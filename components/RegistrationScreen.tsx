import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface RegistrationScreenProps {
  onComplete: (name: string) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'ask' | 'listening' | 'confirming'>('ask');
  const [recognizedName, setRecognizedName] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeechRecognition();
  const { speak, isSpeaking } = useTextToSpeech();
  
  const timeoutRef = useRef<number | null>(null);

  const clearListenTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (transcript) {
      clearListenTimeout();
      const formattedName = transcript
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setRecognizedName(formattedName);
      setStep('confirming');
      speak(`Entendi, seu nome é ${formattedName}?`);
    }
  }, [transcript, speak]);

  useEffect(() => {
    // Se ocorrer um erro durante a escuta (ex: 'no-speech'), mostre a opção de texto.
    if (error && step === 'listening') {
      clearListenTimeout();
      stopListening();
      setShowTextInput(true);
      setStep('ask');
    }
  }, [error, step, stopListening]);
  
  const handleStartListening = () => {
      setRecognizedName(''); // Limpa o nome digitado anteriormente
      startListening();
      setStep('listening');

      // Define um timeout de 10 segundos. Se nada for ouvido, oferece a opção de texto.
      timeoutRef.current = window.setTimeout(() => {
        stopListening();
        setShowTextInput(true);
        setStep('ask');
        speak("Não consegui ouvir. Tente falar de novo ou digite seu nome.");
      }, 10000);
  };

  const handleTryAgain = () => {
    clearListenTimeout();
    setRecognizedName('');
    setShowTextInput(true); // Garante que a opção de texto esteja visível na nova tentativa
    setStep('ask');
  };
  
  const handleConfirm = () => {
    if (recognizedName.trim()) {
      onComplete(recognizedName.trim());
    }
  };
  
  // Limpa o timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      clearListenTimeout();
    };
  }, []);

  if (!isSupported) {
    // Fallback para navegadores sem suporte de reconhecimento de voz
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-amber-50 p-4 text-center">
        <div className="max-w-xl bg-white p-10 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-display text-amber-800 mb-4">Qual é o seu nome?</h1>
            <p className="mb-4">Seu navegador não suporta reconhecimento de voz. Por favor, digite seu nome:</p>
            <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
              <input 
                  type="text" 
                  value={recognizedName} 
                  onChange={(e) => setRecognizedName(e.target.value)}
                  className="w-full font-display text-center text-xl px-4 py-2 border-b-4 rounded-t-md border-amber-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Digite seu nome aqui"
              />
              <button
                  type="submit"
                  disabled={!recognizedName.trim()}
                  className="mt-6 font-display text-2xl px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transform transition-all duration-150 disabled:bg-gray-400"
              >
                  Confirmar
              </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-50 p-4 text-center">
        <div className="max-w-xl bg-white p-10 rounded-2xl shadow-lg">
            {step === 'ask' && (
                <>
                    <h1 className="text-3xl font-display text-amber-800 mb-4">Olá! Qual é o seu nome?</h1>
                    {!showTextInput && (
                        <p className="mb-6 text-lg text-amber-900">Clique no microfone e diga seu nome em voz alta para começarmos a aventura!</p>
                    )}
                    <button
                        onClick={handleStartListening}
                        className="p-6 rounded-full bg-red-600 text-white shadow-lg border-b-4 border-red-800 hover:bg-red-500 transform transition-transform hover:scale-110"
                        aria-label="Começar a ouvir"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    {showTextInput && (
                      <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="mt-8 flex flex-col items-center gap-4">
                        <label htmlFor="name-input" className="text-lg">Tente falar de novo ou, se preferir, digite seu nome:</label>
                        <input 
                            id="name-input"
                            type="text" 
                            value={recognizedName} 
                            onChange={(e) => setRecognizedName(e.target.value)}
                            className="w-full font-display text-center text-xl px-4 py-2 border-b-4 rounded-t-md border-amber-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Digite seu nome aqui"
                        />
                        <button
                            type="submit"
                            disabled={!recognizedName.trim()}
                            className="font-display text-xl px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transform transition-all duration-150 disabled:bg-gray-400"
                        >
                            Confirmar e Começar
                        </button>
                      </form>
                    )}
                </>
            )}

            {step === 'listening' && (
                <>
                    <h1 className="text-3xl font-display text-blue-600 animate-pulse">Ouvindo...</h1>
                    <p className="mt-4 text-lg text-amber-900">Diga seu nome...</p>
                    <div className="mt-6 p-6 rounded-full bg-red-600 text-white animate-pulse">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                </>
            )}

            {step === 'confirming' && (
                <>
                    <h1 className="text-3xl font-display text-amber-800 mb-4">Confirme seu nome:</h1>
                    <p className="mb-6 text-4xl font-display text-blue-700 bg-amber-100 py-4 px-6 rounded-lg">{recognizedName}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button
                            onClick={handleTryAgain}
                            disabled={isSpeaking}
                            className="font-display text-xl px-8 py-3 bg-red-600 text-white rounded-xl shadow-lg border-b-4 border-red-800 hover:bg-red-500 transform transition-all duration-150 disabled:bg-gray-400"
                         >
                            Não, tentar de novo
                         </button>
                         <button
                            onClick={handleConfirm}
                            disabled={isSpeaking}
                            className="font-display text-xl px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg border-b-4 border-green-800 hover:bg-green-500 transform transition-all duration-150 disabled:bg-gray-400"
                         >
                            Sim, sou eu!
                         </button>
                    </div>
                </>
            )}
             <div className="h-6 mt-4 text-center">
                {error && step !== 'listening' && <p className="text-red-600">{error}</p>}
            </div>
        </div>
    </div>
  );
};

export default RegistrationScreen;