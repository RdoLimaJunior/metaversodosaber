import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      // As vozes são frequentemente carregadas de forma assíncrona.
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices(); // Chamada inicial

      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const { speechSynthesis } = window;
    
    // Cancela qualquer fala em andamento antes de iniciar uma nova
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const ptBRVoices = voices.filter(voice => voice.lang.startsWith('pt-BR'));
    
    let selectedVoice: SpeechSynthesisVoice | undefined;
    
    // 1. Tenta encontrar vozes femininas com nomes conhecidos e de alta qualidade.
    selectedVoice = ptBRVoices.find(voice => /luciana|maria|francisca|female|feminina/i.test(voice.name));

    // 2. Se não encontrar, procura por uma voz padrão que não seja masculina.
    if (!selectedVoice) {
      selectedVoice = ptBRVoices.find(voice => voice.default && !/male|masculino/i.test(voice.name));
    }
    // 3. Se ainda não encontrar, pega a primeira voz que não seja masculina.
    if (!selectedVoice) {
      selectedVoice = ptBRVoices.find(voice => !/male|masculino/i.test(voice.name));
    }
    // 4. Como último recurso, pega a primeira voz pt-BR disponível.
    if (!selectedVoice && ptBRVoices.length > 0) {
      selectedVoice = ptBRVoices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = 'pt-BR';
    utterance.rate = 1.2; // Velocidade natural, como de uma professora.
    utterance.pitch = 1.0; // Tom normal
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      // O erro 'canceled' ou 'interrupted' é esperado quando paramos a fala intencionalmente
      // (por exemplo, ao avançar para a próxima tela). Não é um erro real do aplicativo.
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Erro no SpeechSynthesis:', e.error);
      }
      setIsSpeaking(false);
    };
    
    speechSynthesis.speak(utterance);
  }, [voices]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  // Efeito de limpeza para cancelar a fala na desmontagem do componente
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, cancel, isSpeaking };
};