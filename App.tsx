import React, { useState, useEffect, useCallback } from 'react';
import { stories } from './story';
import type { StoryNodeData, BoundingBox } from './types';
import { InteractionType } from './types';
import { generateStoryImage, locateItemsInImage } from './services/geminiService';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import StoryScreen from './components/StoryScreen';
import LoadingScreen from './components/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationScreen from './components/RegistrationScreen';
import AvatarCaptureScreen from './components/AvatarCaptureScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import { getAllImages, storeImage, clearImages as clearImageCacheDB } from './services/cacheService';
import PlayerHUD from './components/PlayerHUD';
import GameMenu from './components/GameMenu';


const App: React.FC = () => {
  // Estado do fluxo do jogo
  const [gameState, setGameState] = useState<'welcome' | 'registration' | 'avatar_capture' | 'subject_selection' | 'playing'>('welcome');
  const [studentName, setStudentName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Estado da história
  const [currentStory, setCurrentStory] = useState<Record<string, StoryNodeData> | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [currentStoryNode, setCurrentStoryNode] = useState<StoryNodeData | null>(null);
  const [itemLocations, setItemLocations] = useState<Record<string, BoundingBox & { isCorrect: boolean }>>({});
  const [interactiveElementImages, setInteractiveElementImages] = useState<string[]>([]);
  
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());
  
  // Estado da UI
  const [isSceneLoading, setIsSceneLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Carregando aventura...');
  const [error, setError] = useState<string | null>(null);
  const [welcomeImageUrl, setWelcomeImageUrl] = useState<string>('placeholder');
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const FADE_DURATION = 400; // Corresponde à duração da animação em CSS

  const { speak, isSpeaking, cancel } = useTextToSpeech();

  const handleTransition = useCallback((stateUpdateFn: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
        stateUpdateFn();
    }, FADE_DURATION);
  }, [isTransitioning]);


  // Carrega as imagens do cache do IndexedDB na inicialização
  useEffect(() => {
    const loadCache = async () => {
        const cachedImages = await getAllImages();
        setGeneratedImages(cachedImages);
        setIsCacheLoaded(true);
    };
    loadCache();
  }, []);
  
  // Gera a imagem de boas-vindas em segundo plano, de forma não-bloqueante
  useEffect(() => {
    const generateWelcomeImageInBackground = async () => {
        console.log("Tentando gerar imagem de boas-vindas em segundo plano...");
        try {
            const prompt = "A futuristic and vibrant digital landscape, representing a 'cyberspace' or 'metaverse' hub. In the center, there's a child explorer looking at several glowing portals, each portal hinting at a different subject like history (ancient scrolls and pyramids), geography (floating globes), math (glowing numbers), and science (DNA strands and atoms). The style should be a colorful, exciting children's storybook illustration with a high-tech feel, 16:9 aspect ratio.";
            const imageUrl = await generateStoryImage(prompt);
            // Só atualiza se for uma imagem real, não o placeholder de fallback da API
            if (imageUrl && imageUrl !== 'placeholder') {
                setWelcomeImageUrl(imageUrl);
                console.log("Imagem de boas-vindas gerada e atualizada com sucesso.");
            }
        } catch(err) {
            console.error("Falha ao gerar imagem de boas-vindas em segundo plano. O placeholder será mantido.", err);
        }
    };

    if (gameState === 'welcome') {
      generateWelcomeImageInBackground();
    }
  }, [gameState]);


  // Efeito de narração
  useEffect(() => {
    if (!isSceneLoading && currentStoryNode && gameState === 'playing' && currentNodeId !== 'start' && currentStoryNode.interactionType !== InteractionType.End) {
      speak(currentStoryNode.text);
    }
  }, [isSceneLoading, currentStoryNode, speak, gameState, currentNodeId]);
  
  // Efeito para gerenciar o estado de transição (fade-in)
  useEffect(() => {
    if (isTransitioning) {
        // Após a mudança de estado e a re-renderização com o novo conteúdo,
        // redefinimos isTransitioning para false, o que acionará a animação de fade-in.
        setIsTransitioning(false);
    }
  }, [currentNodeId, gameState, isTransitioning]);

  const preloadImage = useCallback(async (nodeId: string) => {
    if (!currentStory || generatedImages[nodeId] || generatingImages.has(nodeId)) {
        return;
    }

    const node = currentStory[nodeId];
    if (!node) return;

    setGeneratingImages(prev => new Set(prev).add(nodeId));
    try {
        const personalizedNode = { ...node };
        if (studentName) {
            personalizedNode.text = personalizedNode.text.replace(/{name}/g, studentName);
        }
        const imageUrl = await generateStoryImage(personalizedNode.imagePrompt);
        await storeImage(nodeId, imageUrl);
        setGeneratedImages(prev => ({ ...prev, [nodeId]: imageUrl }));
    } catch (err: any) {
        console.error(`Falha ao pré-carregar imagem para ${nodeId}:`, err);
        // Não define um erro global para falhas de pré-carregamento para não interromper o jogo
    } finally {
        setGeneratingImages(prev => {
            const newSet = new Set(prev);
            newSet.delete(nodeId);
            return newSet;
        });
    }
  }, [currentStory, generatedImages, generatingImages, studentName]);

  const loadNode = useCallback(async (nodeId: string) => {
    if (!currentStory) {
        setError("Nenhuma história foi selecionada.");
        return;
    }
    const node = currentStory[nodeId];
    if (!node) {
      setError(`Nó da história não encontrado: ${nodeId}`);
      return;
    }

    // Limpa os dados interativos do nó anterior
    setItemLocations({});
    setInteractiveElementImages([]);

    const personalizedNode = { ...node };
    if (studentName) {
        personalizedNode.text = personalizedNode.text.replace(/{name}/g, studentName);
    }
    
    setCurrentStoryNode(personalizedNode);

    let imageUrl = generatedImages[nodeId];
    if (!imageUrl) {
      setIsSceneLoading(true);
      setLoadingMessage('Desenhando o cenário com magia...');
      try {
        imageUrl = await generateStoryImage(personalizedNode.imagePrompt);
        await storeImage(nodeId, imageUrl);
        setGeneratedImages(prev => ({ ...prev, [nodeId]: imageUrl }));
      } catch (err: any) {
        console.error(`Erro ao gerar imagem para o nó ${nodeId}:`, err);
        // Em caso de falha, use um placeholder para não interromper o jogo.
        imageUrl = 'placeholder'; 
        // Não armazena o placeholder no cache permanente, mas o define para a sessão atual.
        setGeneratedImages(prev => ({ ...prev, [nodeId]: imageUrl }));
      }
    }
    
    // Se for uma interação de encontrar item, localize os itens na imagem
    if (node.interactionType === InteractionType.FindTheItem && node.findTheItem) {
        if (imageUrl === 'placeholder') {
            console.warn("Cannot run FindTheItem interaction without an image. Bypassing.");
            const bypassNode: StoryNodeData = {
                id: 'bypass_find_item',
                title: 'Um Pequeno Imprevisto!',
                text: `A imagem desta cena não pôde ser desenhada agora, {name}. Mas não se preocupe! Confiamos na sua habilidade de explorador(a) para encontrar o caminho. Vamos continuar a jornada!`,
                imagePrompt: '', // No image needed
                interactionType: InteractionType.Choice,
                choices: [{ text: 'Continuar Jornada!', nextNodeId: node.findTheItem.nextNodeId }]
            };
            const personalizedBypassNode = { ...bypassNode };
            if (studentName) {
                personalizedBypassNode.text = personalizedBypassNode.text.replace(/{name}/g, studentName);
            }
            setCurrentStoryNode(personalizedBypassNode);
            setIsSceneLoading(false);
            return;
        }

        setIsSceneLoading(true);
        setLoadingMessage('Analisando a cena...');
        try {
            const base64Image = imageUrl.split(',')[1];
            const itemsToFind = node.findTheItem.items.map(item => item.name);
            const locations = await locateItemsInImage(base64Image, itemsToFind);
            
            const locationsMap = locations.reduce((acc, loc) => {
                const itemData = node.findTheItem?.items.find(i => i.name.toLowerCase() === loc.name.toLowerCase());
                if(itemData) {
                    acc[itemData.name] = { ...loc, isCorrect: itemData.isCorrect };
                }
                return acc;
            }, {} as Record<string, BoundingBox & { isCorrect: boolean }>);

            setItemLocations(locationsMap);
        } catch (err: any) {
            console.error("Erro ao localizar itens:", err);
            setError(err.message || "Tive um problema para identificar os objetos na cena. Vamos pular esta parte.");
            // Avança para o próximo nó em caso de erro
            handleAdvance(node.findTheItem.nextNodeId);
            return;
        }
    }

    // Se for uma interação de matemática, gera as peças
    if (node.interactionType === InteractionType.DragAndDropMath && node.dragAndDropMath) {
        setIsSceneLoading(true);
        setLoadingMessage('Fabricando peças da sua espaçonave...');
        try {
            const piecePrompts = node.dragAndDropMath.piecePrompts;
            const pieceImagePromises = piecePrompts.map(prompt => generateStoryImage(prompt, '1:1'));
            // Usa allSettled para lidar com falhas individuais na geração de peças.
            const results = await Promise.allSettled(pieceImagePromises);
            const generatedPieces = results.map(result => 
                result.status === 'fulfilled' ? result.value : 'placeholder'
            );
            setInteractiveElementImages(generatedPieces);
        } catch (err: any) { // Este catch é agora para erros inesperados
             console.error("Erro inesperado ao gerar peças da nave:", err);
             setError("Ocorreu um problema inesperado na fabricação das peças. Vamos tentar a próxima parte.");
             handleAdvance(node.dragAndDropMath.nextNodeId); // Mantém o fallback para pular
             setIsSceneLoading(false);
             return;
        }
    }

    setIsSceneLoading(false);

  }, [currentStory, generatedImages, studentName, handleTransition]);

  useEffect(() => {
    if (gameState === 'playing' && isCacheLoaded) {
        loadNode(currentNodeId);
    }
  }, [currentNodeId, gameState, isCacheLoaded, loadNode]);

  // Efeito de pré-carregamento
  useEffect(() => {
    if (!currentStoryNode || isSceneLoading) {
      return;
    }

    const nextNodeIdsToPreload: string[] = [];
    if (currentStoryNode.interactionType === InteractionType.Choice && currentStoryNode.choices) {
        currentStoryNode.choices.forEach(choice => nextNodeIdsToPreload.push(choice.nextNodeId));
    }
    if (currentStoryNode.interactionType === InteractionType.VoiceChoice && currentStoryNode.voiceChoices) {
        currentStoryNode.voiceChoices.forEach(choice => nextNodeIdsToPreload.push(choice.nextNodeId));
    }
    if (currentStoryNode.interactionType === InteractionType.FillInTheBlank && currentStoryNode.fillInTheBlank) {
        nextNodeIdsToPreload.push(currentStoryNode.fillInTheBlank.nextNodeId);
    }
     if (currentStoryNode.interactionType === InteractionType.FindTheItem && currentStoryNode.findTheItem) {
        nextNodeIdsToPreload.push(currentStoryNode.findTheItem.nextNodeId);
    }
    if (currentStoryNode.interactionType === InteractionType.DragAndDropMath && currentStoryNode.dragAndDropMath) {
        nextNodeIdsToPreload.push(currentStoryNode.dragAndDropMath.nextNodeId);
    }

    // Pré-carrega apenas a primeira imagem possível para evitar sobrecarregar a API
    if (nextNodeIdsToPreload.length > 0) {
      preloadImage(nextNodeIdsToPreload[0]);
    }
  }, [currentStoryNode, isSceneLoading, preloadImage]);

  const handleAdvance = (nextNodeId: string) => {
    if (isSpeaking) {
      cancel();
    }
    handleTransition(() => setCurrentNodeId(nextNodeId));
  };

  const handleScoreUpdate = (points: number) => {
    setScore(prevScore => prevScore + points);
  };

  const restartGame = useCallback(() => {
    if (isSpeaking) {
      cancel();
    }
    handleTransition(() => {
        setGameState('welcome');
        setCurrentNodeId('start');
        setStudentName('');
        setAvatarUrl(null);
        setError(null);
        setCurrentStoryNode(null);
        setCurrentStory(null);
        setScore(0);
    });
  }, [cancel, isSpeaking, handleTransition]);
  
  const restartSubject = useCallback(() => {
    if (isSpeaking) {
      cancel();
    }
    handleTransition(() => {
        setCurrentNodeId('start');
        setScore(0);
        setGameState('playing');
    });
  }, [cancel, isSpeaking, handleTransition]);


  const handleRegistrationComplete = (name: string) => {
    handleTransition(() => {
        setStudentName(name);
        setGameState('avatar_capture');
    });
  };

  const handleAvatarCaptureComplete = (imageDataUrl: string | null) => {
    handleTransition(() => {
        setAvatarUrl(imageDataUrl);
        setGameState('subject_selection');
    });
  };

  const handleSubjectSelect = (subjectKey: string) => {
    const selectedStory = stories[subjectKey];
    if (selectedStory) {
      handleTransition(() => {
        setCurrentStory(selectedStory);
        setCurrentNodeId('start');
        setScore(0); // Zera a pontuação para a nova matéria
        setGameState('playing');
      });
    } else {
      setError(`Aventura de "${subjectKey}" não encontrada.`);
    }
  };

  const handleBackToSubjects = () => {
    if (isSpeaking) {
      cancel();
    }
    handleTransition(() => {
        setCurrentStory(null);
        setCurrentStoryNode(null);
        setCurrentNodeId('start');
        setGameState('subject_selection');
    });
  };

  const clearImageCache = async () => {
    try {
        await clearImageCacheDB();
        setGeneratedImages({});
        alert("Cache de imagens limpo! Novas imagens serão geradas na sua próxima aventura.");
    } catch (error) {
        console.error("Falha ao limpar cache de imagens:", error);
        alert("Ocorreu um erro ao limpar o cache de imagens.");
    }
  };
  
  const screenAnimationClass = isTransitioning ? 'animate-screen-fade-out' : 'animate-screen-fade-in';

  if (!isCacheLoaded) {
    return <LoadingScreen message="Carregando aventura..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700 p-8">
        <h1 className="text-4xl font-display mb-4">Ops! Um erro ocorreu!</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={restartGame}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }
  
  if (gameState === 'welcome') {
      return <div key="welcome" className={`${screenAnimationClass} w-full h-full`}><WelcomeScreen onStart={() => handleTransition(() => setGameState('registration'))} imageUrl={welcomeImageUrl} /></div>;
  }
  
  if (gameState === 'registration') {
      return <div key="registration" className={`${screenAnimationClass} w-full h-full`}><RegistrationScreen onComplete={handleRegistrationComplete} /></div>;
  }
  
  if (gameState === 'avatar_capture') {
      return <div key="avatar_capture" className={`${screenAnimationClass} w-full h-full`}><AvatarCaptureScreen onComplete={handleAvatarCaptureComplete} /></div>;
  }

  if (gameState === 'subject_selection') {
    return (
      <div key="subject_selection" className={`relative w-full min-h-screen bg-amber-50 flex items-center justify-center p-4 ${screenAnimationClass}`}>
        <GameMenu onRestart={restartGame} onBackToSubjects={handleBackToSubjects} />
        <PlayerHUD 
            name={studentName}
            sceneTitle="Menu de Matérias"
            score={score}
            avatarUrl={avatarUrl}
        />
        <SubjectSelectionScreen 
          studentName={studentName} 
          onSelectSubject={handleSubjectSelect} 
          onClearCache={clearImageCache} 
        />
      </div>
    );
  }
  
  if (isSceneLoading || !currentStoryNode) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div key={`playing_${currentNodeId}`} className={`relative w-full min-h-screen bg-amber-50 flex items-center justify-center p-4 ${screenAnimationClass}`}>
      {gameState === 'playing' && (
        <>
         <GameMenu onRestart={restartGame} onBackToSubjects={handleBackToSubjects} />
         <PlayerHUD 
            name={studentName}
            sceneTitle={currentStoryNode.title}
            score={score}
            avatarUrl={avatarUrl}
         />
        </>
      )}
      <StoryScreen
        node={currentStoryNode}
        imageUrl={generatedImages[currentNodeId]}
        itemLocations={itemLocations}
        interactiveElementImages={interactiveElementImages}
        studentName={studentName}
        score={score}
        onAdvance={handleAdvance}
        onRestartSubject={restartSubject}
        onBackToSubjects={handleBackToSubjects}
        speak={speak}
        isSpeaking={isSpeaking}
        cancel={cancel}
        onScoreUpdate={handleScoreUpdate}
      />
    </div>
  );
};

export default App;