
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateStyledAvatar } from '../services/geminiService';

interface AvatarCaptureScreenProps {
  onComplete: (imageDataUrl: string | null) => void;
}

const filters = [
    { key: 'original', name: 'Original', icon: '📷' },
    { key: 'explorer', name: 'Espacial', icon: '🚀', prompt: 'um(a) explorador(a) espacial com um capacete legal e estrelas ao fundo' },
    { key: 'historian', name: 'Historiador(a)', icon: '📜', prompt: 'um(a) historiador(a) valente com um chapéu de explorador e um mapa antigo ao fundo' },
    { key: 'adventurer', name: 'Aventureiro(a)', icon: '🗺️', prompt: 'um(a) aventureiro(a) da selva com um binóculo e plantas tropicais ao fundo' },
];

const AvatarCaptureScreen: React.FC<AvatarCaptureScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'setup' | 'live' | 'countdown' | 'preview'>('setup');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilter, setActiveFilter] = useState('original');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setStep('live');
      setError(null);
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador e tente novamente.");
      setStep('setup');
    }
  }, [stopCamera]);
  
  useEffect(() => {
      startCamera();
      return () => {
          stopCamera();
          if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
          }
      };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (step === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [step]);


  const handleTakePicture = () => {
    setStep('countdown');
    setCountdown(3);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          captureFrame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Define o tamanho do canvas para corresponder ao do vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Inverte a imagem horizontalmente para um efeito de "espelho"
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        setStep('preview');
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setFilteredImage(null);
    setActiveFilter('original');
    setCountdown(null);
    startCamera();
  };
  
  const handleApplyFilter = async (filterKey: string, prompt?: string) => {
      if (!capturedImage) return;

      setActiveFilter(filterKey);
      if (filterKey === 'original') {
          setFilteredImage(null);
          return;
      }
      
      setIsFiltering(true);
      setError(null);
      try {
          // A imagem capturada já está em base64
          const base64Data = capturedImage.split(',')[1];
          const newAvatarUrl = await generateStyledAvatar(base64Data, prompt!);
          setFilteredImage(newAvatarUrl);
      } catch (err: any) {
          console.error("Erro ao aplicar filtro:", err);
          setError(err.message || "A magia falhou! Não consegui criar o avatar. Tente de novo.");
          setActiveFilter('original'); // Volta para o original em caso de erro
      } finally {
          setIsFiltering(false);
      }
  }

  const renderContent = () => {
    if (step === 'setup') {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                {error ? (
                    <p className="text-red-500 text-center max-w-sm">{error}</p>
                ) : (
                    <p>Iniciando câmera...</p>
                )}
            </div>
        );
    }

    if (step === 'live' || step === 'countdown') {
      return (
        <div className="relative w-full max-w-lg mx-auto aspect-square rounded-full overflow-hidden border-8 border-amber-300 shadow-lg">
          <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" playsInline muted />
          {step === 'countdown' && countdown !== null && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-9xl font-display text-white drop-shadow-lg animate-ping">{countdown}</span>
            </div>
          )}
        </div>
      );
    }

    if (step === 'preview') {
        const imageToShow = filteredImage || capturedImage;
        return (
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-full overflow-hidden border-8 border-amber-300 shadow-lg">
                {imageToShow ? (
                    <img src={imageToShow} alt="Avatar capturado" className="w-full h-full object-cover" />
                ): null}
                {isFiltering && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-300 mb-4"></div>
                        <p className="font-display text-2xl text-yellow-300">Criando sua fantasia...</p>
                    </div>
                )}
            </div>
        );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4 text-center">
      <div className="w-full max-w-xl bg-white p-6 sm:p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-display text-amber-800 mb-4">
          {step === 'preview' ? 'Gostou do seu avatar?' : 'Prepare seu melhor sorriso!'}
        </h1>
        <p className="text-amber-900 mb-6">
            {step === 'preview' ? 'Use esta foto como seu avatar ou aplique um filtro mágico!' : 'Vamos tirar uma foto para o seu avatar. Quando estiver pronto(a), clique no botão.'}
        </p>

        {renderContent()}
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {error && step === 'preview' && <p className="text-red-600 mt-4">{error}</p>}

        {step === 'preview' && (
            <div className="mt-6 w-full">
                <h3 className="text-xl font-display text-amber-800">✨ Aplicar Filtro Mágico ✨</h3>
                 <div className="flex gap-2 sm:gap-4 justify-center mt-3 flex-wrap">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => handleApplyFilter(filter.key, filter.prompt)}
                            disabled={isFiltering}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${activeFilter === filter.key ? 'border-blue-500 bg-blue-100' : 'border-transparent hover:bg-amber-100'}`}
                        >
                            <span className="text-3xl">{filter.icon}</span>
                            <span className="text-xs font-bold">{filter.name}</span>
                        </button>
                    ))}
                 </div>
            </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {step === 'live' && (
            <button onClick={handleTakePicture} className="font-display text-2xl px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transform transition-all duration-150">
                Tirar Foto!
            </button>
          )}
           {step === 'preview' && (
            <>
                <button onClick={handleRetake} disabled={isFiltering} className="font-display text-xl px-8 py-3 bg-amber-500 text-white rounded-xl shadow-lg border-b-4 border-amber-700 hover:bg-amber-400 transform transition-all duration-150 disabled:opacity-50">
                    Tentar de Novo
                </button>
                <button onClick={() => onComplete(filteredImage || capturedImage)} disabled={isFiltering} className="font-display text-xl px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg border-b-4 border-green-800 hover:bg-green-500 transform transition-all duration-150 disabled:opacity-50">
                    Usar este Avatar
                </button>
            </>
          )}
        </div>
        <button onClick={() => onComplete(null)} className="mt-4 text-sm text-gray-600 hover:text-blue-700 hover:underline">
            Pular esta etapa
        </button>
      </div>
    </div>
  );
};

export default AvatarCaptureScreen;
