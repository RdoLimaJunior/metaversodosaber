
import type { StoryNodeData } from './types';
import { InteractionType } from './types';

const historyStory: Record<string, StoryNodeData> = {
  start: {
    id: 'start',
    title: 'O Metaverso da História',
    text: 'Olá, {name}! Você ativou o portal para o Metaverso da História. Ele vai nos transportar para conhecer a incrível história do Brasil. Vamos começar nossa aventura?',
    imagePrompt: "A child explorer stepping through a glowing, digital portal. On the other side of the portal, a scene from colonial Brazil is visible, with Portuguese caravels arriving. The portal frame is futuristic and glitchy. The style is a vibrant, colorful children's storybook illustration, bridging the gap between a digital world and history.",
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Sim! Vamos viajar!', nextNodeId: 'arrival_1500' },
      { text: 'Estou pronto(a)!', nextNodeId: 'arrival_1500' },
    ],
  },
  arrival_1500: {
    id: 'arrival_1500',
    title: 'A Chegada em Pindorama',
    text: 'Nossa primeira parada, {name}: o ano 1500! Vemos as caravelas portuguesas chegando. Os habitantes daqui, os povos indígenas, chamavam esta terra de Pindorama, que significa "Terra das Palmeiras". Eles vivem em harmonia com a natureza.',
    imagePrompt: "Vibrant children's storybook illustration of Portuguese caravels on a beautiful tropical beach. In the foreground, a group of curious Tupi indigenous people, with feather accessories, are watching from the edge of a lush green jungle full of palm trees.",
    interactionType: InteractionType.Choice,
    choices: [
        { text: 'O que aconteceu depois?', nextNodeId: 'pau_brasil_trade' },
    ],
  },
  pau_brasil_trade: {
    id: 'pau_brasil_trade',
    title: 'A Troca do Pau-Brasil',
    text: 'Os portugueses viram uma árvore muito valiosa, o Pau-Brasil, com sua madeira vermelha. Eles começaram a trocar objetos pela madeira que os indígenas cortavam. {name}, ajude-me a encontrar o Pau-Brasil na imagem! Clique nele.',
    imagePrompt: 'A vibrant, busy scene on a Brazilian beach in 1500. In the scene, make sure to include: Portuguese ships (caravels) in the water, Tupi indigenous people with feather accessories talking to portuguese sailors, stacks of reddish logs (Pau-Brasil) near the jungle, coconut palm trees, and some monkeys in the trees. The style is a colorful and detailed children\'s storybook illustration, like a "Where\'s Wally" page.',
    interactionType: InteractionType.FindTheItem,
    findTheItem: {
      prompt: 'Encontre o Pau-Brasil!',
      items: [
        { name: 'Pau-Brasil', isCorrect: true },
        { name: 'Navio português', isCorrect: false },
        { name: 'Índio Tupi', isCorrect: false },
        { name: 'Coqueiro', isCorrect: false },
      ],
      nextNodeId: 'pau_brasil_correct'
    },
  },
  pau_brasil_try_again: {
    id: 'pau_brasil_try_again',
    title: 'Quase lá!',
    text: 'Jatobá é uma árvore importante, mas não foi ela! A árvore que os portugueses queriam tinha uma madeira vermelha como brasa. Tente de novo, {name}! Qual era o nome?',
    imagePrompt: 'A funny cartoon parrot shrugging its shoulders next to a tall Jatobá tree on a Brazilian beach. Colorful and bright storybook style.',
    interactionType: InteractionType.VoiceChoice,
    voiceChoices: [
      { text: 'Pau-Brasil', nextNodeId: 'pau_brasil_correct', keywords: ['pau', 'brasil', 'pau-brasil'] },
      { text: 'Jatobá', nextNodeId: 'pau_brasil_try_again', keywords: ['jatobá'] },
    ],
  },
  pau_brasil_correct: {
    id: 'pau_brasil_correct',
    title: 'Você Encontrou!',
    text: 'Isso mesmo, {name}! Era o Pau-Brasil. Sua madeira vermelha era muito valiosa. Você tem olhos de águia! Vamos continuar?',
    imagePrompt: "A child historian smiling and giving a thumbs up, with a map of colonial Brazil and a drawing of the Pau-Brasil tree in the background. Colorful storybook illustration.",
    interactionType: InteractionType.Choice,
    choices: [
        { text: 'Continuar!', nextNodeId: 'sugar_cane_era' }
    ],
  },
  sugar_cane_era: {
    id: 'sugar_cane_era',
    title: 'A Era do Açúcar',
    text: 'Avançando no tempo, {name}! Agora, o Brasil é uma colônia de Portugal e produz muito açúcar em grandes fazendas chamadas engenhos. Para o trabalho duro nos canaviais, milhões de africanos foram trazidos à força e escravizados. É uma parte triste, mas muito importante da nossa história.',
    imagePrompt: 'A children\'s storybook illustration of a colonial Brazilian "engenho". In the background, there is a large water wheel and sugar cane fields. In the foreground, a group of African enslaved people are shown working with dignity and strength, without showing violence. The mood is serious but respectful.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Eles aceitaram isso?', nextNodeId: 'quilombo_dos_palmares' },
    ],
  },
  quilombo_dos_palmares: {
    id: 'quilombo_dos_palmares',
    title: 'A Luta por Liberdade',
    text: 'Não! Muitos africanos escravizados lutaram por sua liberdade. Eles fugiam e criavam comunidades secretas na mata, chamadas quilombos. O maior deles foi o Quilombo dos Palmares, liderado por Zumbi. Como se chamavam essas comunidades de resistência, {name}?',
    imagePrompt: 'A hopeful storybook illustration of a quilombo hidden in the Brazilian forest. You can see simple wooden houses, people farming, and children playing. The atmosphere is one of community, freedom, and safety. Zumbi dos Palmares is shown as a brave leader looking over his village.',
    interactionType: InteractionType.FillInTheBlank,
    fillInTheBlank: {
      promptParts: ['As comunidades secretas se chamavam', '.'],
      correctAnswer: 'Quilombos',
      nextNodeId: 'quilombo_correct',
    },
  },
  quilombo_correct: {
    id: 'quilombo_correct',
    title: 'Você Acertou!',
    text: 'Quilombos, exatamente! {name}, você tem uma memória excelente! Eram lugares de esperança e liberdade. Agora, vamos dar outro salto no tempo.',
    imagePrompt: 'A child giving a happy thumbs-up gesture in front of a slightly transparent image of a quilombo. The child is the main focus. Storybook illustration style.',
    interactionType: InteractionType.Choice,
    choices: [
        { text: 'Para onde vamos?', nextNodeId: 'independence_1822' }
    ],
  },
  independence_1822: {
    id: 'independence_1822',
    title: 'O Grito da Independência',
    text: 'Agora, outra viagem, para 1822! O Brasil ainda era governado por Portugal. Mas o príncipe Dom Pedro I, às margens do rio Ipiranga, declarou a separação. O que ele gritou para tornar o Brasil um país independente, {name}?',
    imagePrompt: 'A cute, child-friendly cartoon illustration of Dom Pedro I as a heroic young prince, sitting on a proud white horse by a river. He is raising his sword to the sky with a determined face. The scene is heroic but not violent, in a storybook style.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Independência ou Morte!', nextNodeId: 'proclamation_republic_1889' },
      { text: 'Viva o Brasil!', nextNodeId: 'independence_almost' },
    ],
  },
  independence_almost: {
    id: 'independence_almost',
    title: 'Quase Lá!',
    text: "'Viva o Brasil!' é um ótimo grito de amor ao nosso país, {name}! Mas o grito histórico foi 'Independência ou Morte!'. De qualquer forma, o importante é que o Brasil se tornou um império. Vamos ver o que veio depois?",
    imagePrompt: 'A cute cartoon parrot looking thoughtful and scratching its head, with the Ipiranga river in the background. Storybook illustration style.',
    interactionType: InteractionType.Choice,
    choices: [
        { text: 'Vamos!', nextNodeId: 'proclamation_republic_1889' }
    ],
  },
  proclamation_republic_1889: {
    id: 'proclamation_republic_1889',
    title: 'O Fim da Monarquia',
    text: 'Isso mesmo, {name}! O Brasil se tornou um império independente. Mas o tempo passou e, em 1889, o Brasil mudou de novo. Deixamos de ter um imperador e passamos a ser uma república, governada por um presidente. Quem proclamou a República foi o Marechal Deodoro da Fonseca.',
    imagePrompt: 'A storybook illustration showing Marechal Deodoro da Fonseca on a horse in a city square, surrounded by celebrating people and soldiers. A Brazilian republic flag is being raised. The style is colorful and historical.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Entendi! E agora?', nextNodeId: 'end' },
    ],
  },
  end: {
    id: 'end',
    title: 'Fim da Viagem!',
    text: 'Nossa viagem pelo tempo termina aqui, {name}! Vimos como o Brasil foi formado pela união e luta de muitos povos: os indígenas, os europeus e os africanos. Nossa história é rica e cheia de lições. Parabéns, {name}, por ser um(a) excelente historiador(a)!',
    imagePrompt: 'A beautiful illustration showing three children side-by-side, looking at a modern Brazilian city skyline. One child is of indigenous descent, one of European descent, and one of African descent. They are smiling, representing the diversity of Brazil. A banner above says "Nossa História".',
    interactionType: InteractionType.End,
  },
};

const geographyStory: Record<string, StoryNodeData> = {
  start: {
    id: 'start',
    title: 'O Metaverso da Geografia',
    text: 'Olá, {name}! Bem-vindo(a) ao Metaverso da Geografia. Vamos mergulhar em um mapa digital gigante do Brasil para explorar suas paisagens e biomas. Qual portal de bioma você quer abrir primeiro?',
    imagePrompt: "A child explorer stands on a futuristic platform, looking at a giant, glowing holographic map of Brazil. The map's different biomes (Amazon, Cerrado) are highlighted and look like interactive zones. Colorful children's storybook illustration with a high-tech feel.",
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'A Amazônia', nextNodeId: 'amazon' },
      { text: 'O Cerrado', nextNodeId: 'cerrado' },
    ],
  },
  amazon: {
    id: 'amazon',
    title: 'A Selva Amazônica',
    text: 'A Amazônia! É a maior floresta tropical do mundo, cheia de rios gigantes e milhões de animais e plantas. Qual você acha que é o maior rio da Amazônia, {name}?',
    imagePrompt: 'A lush, vibrant illustration of the Amazon rainforest with a wide, winding river (the Amazon River). Macaws are flying, and a monkey is visible in the trees. Bright, storybook style.',
    interactionType: InteractionType.VoiceChoice,
    voiceChoices: [
      { text: 'Rio Amazonas', nextNodeId: 'amazon_correct', keywords: ['amazonas'] },
      { text: 'Rio Tietê', nextNodeId: 'amazon_try_again', keywords: ['tietê', 'tiete'] },
    ],
  },
  amazon_correct: {
    id: 'amazon_correct',
    title: 'Resposta Certa!',
    text: 'Isso mesmo! O Rio Amazonas é o maior do mundo em volume de água. Você é um(a) explorador(a) incrível! A Amazônia é cheia de vida. Quer conhecer um animal famoso que vive aqui?',
    imagePrompt: "A happy child wearing an explorer's hat, holding binoculars, with a map of the Amazon river in the background. Colorful storybook style.",
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Sim, quero conhecer!', nextNodeId: 'amazon_arara' },
      { text: 'Quero explorar outro bioma.', nextNodeId: 'cerrado' },
    ],
  },
  amazon_try_again: {
    id: 'amazon_try_again',
    title: 'Quase lá!',
    text: 'O Rio Tietê é muito importante em São Paulo, mas o gigante da Amazônia é outro. Tente de novo!',
    imagePrompt: 'A funny cartoon capybara looking confused next to the Tietê river in a city, with a thought bubble showing the Amazon rainforest. Storybook style.',
    interactionType: InteractionType.VoiceChoice,
    voiceChoices: [
      { text: 'Rio Amazonas', nextNodeId: 'amazon_correct', keywords: ['amazonas'] },
      { text: 'Rio Tietê', nextNodeId: 'amazon_try_again', keywords: ['tietê', 'tiete'] },
    ],
  },
  amazon_arara: {
      id: 'amazon_arara',
      title: 'A Arara-Vermelha',
      text: 'Olha que linda! Esta é a arara-vermelha. Com suas penas super coloridas, ela voa em bandos e faz uma festa no céu da floresta. Clique no botão de som para ouvir a conversa delas!',
      imagePrompt: "A beautiful, detailed close-up illustration of a scarlet macaw (arara-vermelha) perched on a branch in the Amazon rainforest. Its feathers are a brilliant red, yellow, and blue. The style is a realistic yet enchanting children's storybook illustration.",
      soundUrl: 'https://www.myinstants.com/media/sounds/arara_2.mp3',
      interactionType: InteractionType.Choice,
      choices: [
        { text: 'Que incrível! Vamos para o Cerrado.', nextNodeId: 'cerrado' },
      ]
  },
  cerrado: {
    id: 'cerrado',
    title: 'A Savana Brasileira',
    text: 'Bem-vindo(a) ao Cerrado, a savana brasileira! Aqui as árvores são baixinhas, com troncos tortos, e o solo é avermelhado. É o lar de animais muito especiais. Quer conhecer o mais famoso deles?',
    imagePrompt: 'A beautiful illustration of the Brazilian Cerrado at sunset, with its characteristic twisted trees, reddish soil, and tall termite mounds. The atmosphere is warm and inviting. Colorful storybook style.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Sim, me mostre!', nextNodeId: 'cerrado_lobo_guara' },
      { text: 'Já aprendi bastante por hoje.', nextNodeId: 'end' },
    ],
  },
  cerrado_lobo_guara: {
    id: 'cerrado_lobo_guara',
    title: 'O Lobo-Guará',
    text: 'Este é o lobo-guará! Com suas pernas longas, ele parece um lobo de "pernas de pau". Ele não é perigoso para as pessoas e adora comer uma frutinha chamada lobeira. Clique no botão de som para ouvir como ele "conversa"!',
    imagePrompt: "A beautiful, detailed close-up illustration of a maned wolf (lobo-guará) in the Brazilian Cerrado. The wolf has long legs, a reddish-brown coat, and a distinctive black mane, looking curiously at the viewer. The style is a realistic yet enchanting children's storybook illustration.",
    soundUrl: 'https://www.myinstants.com/media/sounds/wolf-howl.mp3',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Que legal! Podemos continuar.', nextNodeId: 'end' },
    ],
  },
  end: {
    id: 'end',
    title: 'Fim da Exploração!',
    text: 'Nossa exploração geográfica termina aqui, {name}! O Brasil tem uma natureza incrível, e você aprendeu um pouco sobre ela hoje. Parabéns! Vamos jogar de novo?',
    imagePrompt: "A group of diverse Brazilian animals (a jaguar, a toucan, a maned wolf, a capybara) waving goodbye in front of a map of Brazil's biomes. A banner above says 'Até a próxima aventura!'. Storybook style.",
    interactionType: InteractionType.End,
  },
};

const mathStory: Record<string, StoryNodeData> = {
  start: {
    id: 'start',
    title: 'O Metaverso da Matemática',
    text: 'Olá, {name}! Bem-vindo(a) ao Metaverso da Matemática, onde os números ganham vida! Sua central de missões de engenharia espacial está pronta. Vamos começar?',
    imagePrompt: "A child explorer stands before a swirling, colorful wormhole made of glowing numbers and geometric shapes. The entrance to the wormhole is framed by a futuristic portal. The style is a vibrant, exciting children's storybook illustration with a high-tech feel.",
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Ir para a Central de Missões!', nextNodeId: 'multiplication_menu' },
    ],
  },
  multiplication_menu: {
    id: 'multiplication_menu',
    title: 'Central de Missões',
    text: 'Engenheiro(a) {name}, aqui estão as plantas dos projetos. Cada um testa seu conhecimento em uma tabuada diferente. Escolha sua próxima missão!',
    imagePrompt: 'A futuristic mission control room. A child explorer is looking at a large holographic table displaying several glowing blueprints: a spaceship, a robot, a satellite, a drone, etc. The style is a colorful and bright children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Tabuada do 1: Espaçonave', nextNodeId: 'multiplication_game_1' },
      { text: 'Tabuada do 2: Robô Explorador', nextNodeId: 'multiplication_game_2' },
      { text: 'Tabuada do 3: Satélite', nextNodeId: 'multiplication_game_3' },
      { text: 'Tabuada do 4: Drone', nextNodeId: 'multiplication_game_4' },
      { text: 'Tabuada do 5: Habitat', nextNodeId: 'multiplication_game_5' },
      { text: 'Tabuada do 6: Telescópio', nextNodeId: 'multiplication_game_6' },
      { text: 'Tabuada do 7: Painel Solar', nextNodeId: 'multiplication_game_7' },
      { text: 'Tabuada do 8: Escudo Defletor', nextNodeId: 'multiplication_game_8' },
      { text: 'Tabuada do 9: Torre', nextNodeId: 'multiplication_game_9' },
      { text: 'Tabuada do 10: Portal Galáctico', nextNodeId: 'multiplication_game_10' },
      { text: 'Concluir treinamento por hoje', nextNodeId: 'end' },
    ],
  },
  // --- Tabuada do 1 ---
  multiplication_game_1: {
    id: 'multiplication_game_1',
    title: 'Missão: Tabuada do 1',
    text: 'Sua missão é construir uma nave novinha em folha. Para cada resposta certa na tabuada do 1, você ganha uma nova peça para sua nave. Arraste a resposta correta para o lugar certo!',
    imagePrompt: "A determined and happy child, wearing a cute space engineer helmet and overalls, standing in a futuristic spaceship hangar. They are looking at a holographic blueprint of a cool spaceship. The style is a colorful and bright children's storybook illustration.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '1 x 3', correctAnswer: 3 },
        { question: '1 x 5', correctAnswer: 5 },
        { question: '1 x 7', correctAnswer: 7 },
        { question: '1 x 9', correctAnswer: 9 },
        { question: '1 x 10', correctAnswer: 10 },
      ],
      nextNodeId: 'multiplication_game_1_success',
      piecePrompts: [
        'The main body or fuselage of a cool cartoon spaceship, white and red. Isolated on a plain background, sticker style.',
        'A sleek, pointed nose cone for a cool cartoon spaceship, white and red. Isolated on a plain background, sticker style.',
        'A pair of cool, swept-back wings for a cartoon spaceship, white and red. Isolated on a plain background, sticker style.',
        'A powerful rocket engine nozzle for a cartoon spaceship, with a glowing orange light inside. Isolated on a plain background, sticker style.',
        'A clear cockpit canopy bubble for a cartoon spaceship. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_1_success: {
    id: 'multiplication_game_1_success',
    title: 'Nave Construída!',
    text: 'Contagem regressiva: 3... 2... 1... DECOLAR! Sua nave está pronta e você é um mestre da tabuada do 1. Excelente trabalho, engenheiro(a) {name}!',
    imagePrompt: 'The fully assembled cool cartoon spaceship, white and red, blasting off from a launchpad into a starry sky. The child engineer is waving happily from the cockpit window. Action-packed and exciting children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 2 ---
  multiplication_game_2: {
    id: 'multiplication_game_2',
    title: 'Missão: Tabuada do 2',
    text: 'Um robô explorador é necessário para investigar um novo planeta! Responda a tabuada do 2 para montar seu robô, peça por peça.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a friendly, all-terrain explorer robot. The background is a futuristic workshop. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '2 x 2', correctAnswer: 4 },
        { question: '2 x 4', correctAnswer: 8 },
        { question: '2 x 6', correctAnswer: 12 },
        { question: '2 x 8', correctAnswer: 16 },
        { question: '2 x 10', correctAnswer: 20 },
      ],
      nextNodeId: 'multiplication_game_2_success',
      piecePrompts: [
        'The boxy main body of a friendly cartoon explorer robot, blue and silver. Isolated on a plain background, sticker style.',
        'A head for a friendly cartoon robot with two big camera eyes, blue and silver. Isolated on a plain background, sticker style.',
        'A pair of sturdy robotic arms with grippy claws, blue and silver. Isolated on a plain background, sticker style.',
        'A set of rugged caterpillar tracks for an all-terrain robot, dark grey. Isolated on a plain background, sticker style.',
        'A small satellite dish antenna for a cartoon robot. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_2_success: {
    id: 'multiplication_game_2_success',
    title: 'Robô Ativado!',
    text: 'Seu Robô Explorador está online e pronto para a missão! Ele já está enviando dados do novo planeta. Você é um expert na tabuada do 2!',
    imagePrompt: 'The fully assembled friendly cartoon explorer robot, blue and silver, rolling across the surface of a colorful alien planet with strange plants. The robot is waving one of its claws. Exciting children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 3 ---
  multiplication_game_3: {
    id: 'multiplication_game_3',
    title: 'Missão: Tabuada do 3',
    text: 'Precisamos nos comunicar com a frota estelar. Construa um satélite de comunicação de longo alcance usando seus conhecimentos da tabuada do 3.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a high-tech communications satellite. The background is the interior of a space station. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '3 x 3', correctAnswer: 9 },
        { question: '3 x 5', correctAnswer: 15 },
        { question: '3 x 7', correctAnswer: 21 },
        { question: '3 x 8', correctAnswer: 24 },
        { question: '3 x 10', correctAnswer: 30 },
      ],
      nextNodeId: 'multiplication_game_3_success',
      piecePrompts: [
        'The central body of a cartoon communications satellite, gold and white. Isolated on a plain background, sticker style.',
        'A large, circular satellite dish antenna for a cartoon satellite. Isolated on a plain background, sticker style.',
        'A pair of large, rectangular solar panel wings for a cartoon satellite, blue cells. Isolated on a plain background, sticker style.',
        'A set of small thruster nozzles for a cartoon satellite. Isolated on a plain background, sticker style.',
        'A cluster of small communication antennas for a cartoon satellite. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_3_success: {
    id: 'multiplication_game_3_success',
    title: 'Sinal Recebido!',
    text: 'O satélite está em órbita e funcionando perfeitamente! A comunicação com a frota está clara como cristal. Você domina a tabuada do 3!',
    imagePrompt: 'The fully assembled cartoon satellite orbiting a beautiful, earth-like planet. Beams of light are transmitting from its antennas. Colorful and inspiring children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
    // --- Tabuada do 4 ---
  multiplication_game_4: {
    id: 'multiplication_game_4',
    title: 'Missão: Tabuada do 4',
    text: 'Detectamos um asteroide rico em cristais de energia! Construa um drone de mineração para coletá-los. A tabuada do 4 lhe dará as peças.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a rugged mining drone with drills and claws. The background is an asteroid mining facility. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '4 x 3', correctAnswer: 12 },
        { question: '4 x 5', correctAnswer: 20 },
        { question: '4 x 7', correctAnswer: 28 },
        { question: '4 x 8', correctAnswer: 32 },
        { question: '4 x 9', correctAnswer: 36 },
      ],
      nextNodeId: 'multiplication_game_4_success',
      piecePrompts: [
        'The tough, armored body of a cartoon mining drone, yellow and black. Isolated on a plain background, sticker style.',
        'A powerful laser drill for a cartoon mining drone. Isolated on a plain background, sticker style.',
        'A pair of strong robotic arms with grabbing claws for a cartoon mining drone. Isolated on a plain background, sticker style.',
        'A set of four powerful thrusters to maneuver a cartoon drone in space. Isolated on a plain background, sticker style.',
        'A cargo container attached to the bottom of a cartoon mining drone. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_4_success: {
    id: 'multiplication_game_4_success',
    title: 'Mineração Concluída!',
    text: 'O drone está funcionando e já coletou os cristais! Nossa energia está garantida. Você é fera na tabuada do 4!',
    imagePrompt: 'The fully assembled cartoon mining drone, yellow and black, using its laser drill on a floating asteroid full of glowing purple crystals. Colorful and dynamic children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },

  // --- Tabuada do 5 ---
  multiplication_game_5: {
    id: 'multiplication_game_5',
    title: 'Missão: Tabuada do 5',
    text: 'A primeira colônia em Marte precisa de um lugar para morar! Use a tabuada do 5 para montar um módulo de habitação para os astronautas.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a dome-shaped Mars habitat module. The background is a Martian landscape. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '5 x 2', correctAnswer: 10 },
        { question: '5 x 5', correctAnswer: 25 },
        { question: '5 x 6', correctAnswer: 30 },
        { question: '5 x 8', correctAnswer: 40 },
        { question: '5 x 10', correctAnswer: 50 },
      ],
      nextNodeId: 'multiplication_game_5_success',
      piecePrompts: [
        'The main dome structure of a cartoon Mars habitat, white and orange. Isolated on a plain background, sticker style.',
        'An airlock entrance module for a cartoon Mars habitat. Isolated on a plain background, sticker style.',
        'A large, transparent window panel for a cartoon Mars habitat. Isolated on a plain background, sticker style.',
        'A solar panel array to provide power to a cartoon Mars habitat. Isolated on a plain background, sticker style.',
        'A small communications antenna for a cartoon Mars habitat. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_5_success: {
    id: 'multiplication_game_5_success',
    title: 'Lar Doce Lar!',
    text: 'O habitat está montado e pressurizado! Os astronautas em Marte têm um lugar seguro para viver, graças a você e à tabuada do 5!',
    imagePrompt: 'The fully assembled cartoon Mars habitat, white and orange, on the red surface of Mars. An astronaut is waving from inside the large window. A Martian sunset is in the background. Colorful and hopeful children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 6 ---
  multiplication_game_6: {
    id: 'multiplication_game_6',
    title: 'Missão: Tabuada do 6',
    text: 'Vamos descobrir novos mundos! Monte um telescópio espacial superpotente com as peças que você ganhará acertando a tabuada do 6.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a large, complex space telescope like the Hubble. The background is deep space. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '6 x 2', correctAnswer: 12 },
        { question: '6 x 4', correctAnswer: 24 },
        { question: '6 x 6', correctAnswer: 36 },
        { question: '6 x 8', correctAnswer: 48 },
        { question: '6 x 10', correctAnswer: 60 },
      ],
      nextNodeId: 'multiplication_game_6_success',
      piecePrompts: [
        'The main cylindrical tube of a cartoon space telescope, silver. Isolated on a plain background, sticker style.',
        'A large primary mirror for a cartoon space telescope, gold honeycomb pattern. Isolated on a plain background, sticker style.',
        'A sunshield made of multiple layers for a cartoon space telescope. Isolated on a plain background, sticker style.',
        'A set of solar panels to power a cartoon space telescope. Isolated on a plain background, sticker style.',
        'A small antenna for a cartoon space telescope to send data back to Earth. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_6_success: {
    id: 'multiplication_game_6_success',
    title: 'Olhando as Estrelas!',
    text: 'O telescópio está em posição e nos enviando imagens de galáxias distantes! Você é um gênio da tabuada do 6!',
    imagePrompt: 'The fully assembled cartoon space telescope floating in deep space. It is pointed towards a beautiful, colorful nebula. Stars and galaxies are in the background. Awe-inspiring children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 7 ---
  multiplication_game_7: {
    id: 'multiplication_game_7',
    title: 'Missão: Tabuada do 7',
    text: 'A estação espacial precisa de mais energia! Monte um novo conjunto de painéis solares. A tabuada do 7 vai te guiar.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a massive solar array for a space station. The background is the interior of a space station looking out a window. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '7 x 2', correctAnswer: 14 },
        { question: '7 x 3', correctAnswer: 21 },
        { question: '7 x 5', correctAnswer: 35 },
        { question: '7 x 7', correctAnswer: 49 },
        { question: '7 x 9', correctAnswer: 63 },
      ],
      nextNodeId: 'multiplication_game_7_success',
      piecePrompts: [
        'The central truss structure for a cartoon solar array, grey metal. Isolated on a plain background, sticker style.',
        'A large, foldable solar panel wing for a cartoon space station, blue cells. Isolated on a plain background, sticker style.',
        'Another large, foldable solar panel wing, identical to the first. Isolated on a plain background, sticker style.',
        'A rotating joint mechanism (alpha joint) for a cartoon solar array. Isolated on a plain background, sticker style.',
        'A power storage and distribution module for a cartoon solar array. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_7_success: {
    id: 'multiplication_game_7_success',
    title: 'Energia Máxima!',
    text: 'Os painéis foram instalados e a estação espacial está com 100% de energia! Missão cumprida, especialista na tabuada do 7!',
    imagePrompt: 'A large, friendly cartoon space station orbiting Earth. The newly assembled solar arrays are glowing, catching the sunlight. Colorful and vibrant children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 8 ---
  multiplication_game_8: {
    id: 'multiplication_game_8',
    title: 'Missão: Tabuada do 8',
    text: 'Uma chuva de meteoros se aproxima! Construa um escudo defletor de energia para proteger nossa base. A tabuada do 8 é a chave!',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a powerful energy shield generator. The background shows a base on the moon with meteors in the sky. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '8 x 2', correctAnswer: 16 },
        { question: '8 x 4', correctAnswer: 32 },
        { question: '8 x 5', correctAnswer: 40 },
        { question: '8 x 8', correctAnswer: 64 },
        { question: '8 x 9', correctAnswer: 72 },
      ],
      nextNodeId: 'multiplication_game_8_success',
      piecePrompts: [
        'The main power core for a cartoon energy shield generator, glowing blue. Isolated on a plain background, sticker style.',
        'A large, satellite-dish-like projector for a cartoon energy shield. Isolated on a plain background, sticker style.',
        'A set of three energy conductor pylons for a cartoon shield generator. Isolated on a plain background, sticker style.',
        'A reinforced base platform for a cartoon shield generator. Isolated on a plain background, sticker style.',
        'A control console with lots of buttons for a cartoon shield generator. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_8_success: {
    id: 'multiplication_game_8_success',
    title: 'Base Protegida!',
    text: 'O escudo defletor está ativado! Os meteoros se desintegram ao tocar no campo de energia. A base está segura, graças à sua maestria na tabuada do 8!',
    imagePrompt: 'A moon base being protected by a large, glowing blue energy dome. Small cartoon meteors are bouncing off the shield. Colorful and action-packed children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  // --- Tabuada do 9 ---
  multiplication_game_9: {
    id: 'multiplication_game_9',
    title: 'Missão: Tabuada do 9',
    text: 'Hora de dar vida a um planeta sem atmosfera! Construa uma torre de terraformação que liberará oxigênio. Use a tabuada do 9!',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a very tall, futuristic terraforming tower. The background is a barren, rocky planet. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '9 x 2', correctAnswer: 18 },
        { question: '9 x 4', correctAnswer: 36 },
        { question: '9 x 5', correctAnswer: 45 },
        { question: '9 x 7', correctAnswer: 63 },
        { question: '9 x 9', correctAnswer: 81 },
      ],
      nextNodeId: 'multiplication_game_9_success',
      piecePrompts: [
        'The reinforced foundation of a tall cartoon terraforming tower. Isolated on a plain background, sticker style.',
        'The tall, segmented main shaft of a cartoon terraforming tower. Isolated on a plain background, sticker style.',
        'A large processing unit that fits in the middle of a cartoon terraforming tower. Isolated on a plain background, sticker style.',
        'A large ring-shaped emitter for the top of a cartoon terraforming tower. Isolated on a plain background, sticker style.',
        'A set of atmospheric sensors for a cartoon terraforming tower. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_9_success: {
    id: 'multiplication_game_9_success',
    title: 'Respire Fundo!',
    text: 'A torre está funcionando! Nuvens azuis começam a se formar no céu do planeta. Você está criando um novo mundo com o poder da tabuada do 9!',
    imagePrompt: 'The fully assembled, very tall cartoon terraforming tower on a barren planet. It is emitting a gentle blue energy from the top, and the sky around it is starting to turn from black to blue with white clouds. Hopeful and grand children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },

  // --- Tabuada do 10 ---
  multiplication_game_10: {
    id: 'multiplication_game_10',
    title: 'Missão: Tabuada do 10',
    text: 'A missão final! Construa um Portal Galáctico para viajar para outras galáxias! A tabuada do 10 é o desafio supremo.',
    imagePrompt: "A child space engineer looking at a holographic blueprint of a massive, ring-shaped galactic portal, like a stargate. The background is an advanced control room. Colorful storybook style.",
    interactionType: InteractionType.DragAndDropMath,
    dragAndDropMath: {
      problems: [
        { question: '10 x 2', correctAnswer: 20 },
        { question: '10 x 4', correctAnswer: 40 },
        { question: '10 x 6', correctAnswer: 60 },
        { question: '10 x 8', correctAnswer: 80 },
        { question: '10 x 10', correctAnswer: 100 },
      ],
      nextNodeId: 'multiplication_game_10_success',
      piecePrompts: [
        'A large, curved section of a cartoon galactic portal ring, made of a strange metal. Isolated on a plain background, sticker style.',
        'Another large, curved section to complete the ring of a cartoon galactic portal. Isolated on a plain background, sticker style.',
        'A set of nine glowing chevron-like symbols to place on the ring of a cartoon galactic portal. Isolated on a plain background, sticker style.',
        'The main power generator for a cartoon galactic portal. Isolated on a plain background, sticker style.',
        'A control pedestal to activate a cartoon galactic portal. Isolated on a plain background, sticker style.',
      ],
    },
  },
  multiplication_game_10_success: {
    id: 'multiplication_game_10_success',
    title: 'Portal Ativado!',
    text: 'O Portal Galáctico está online! O universo de possibilidades é infinito. Você se formou como Mestre Engenheiro(a) Espacial e dominou a tabuada do 10!',
    imagePrompt: 'The fully assembled cartoon galactic portal is active, showing a swirling, watery vortex inside the ring. A distant, beautiful alien galaxy is visible through the portal. Awe-inspiring and epic children\'s storybook illustration.',
    interactionType: InteractionType.Choice,
    choices: [
      { text: 'Voltar para a Central de Missões', nextNodeId: 'multiplication_menu' },
    ],
  },
  end: {
    id: 'end',
    title: 'Fim da Missão!',
    text: 'Sua jornada matemática foi um sucesso, {name}! Você mostrou que os números são seus amigos. Continue explorando e até a próxima missão!',
    imagePrompt: 'A happy child wearing a space helmet, floating in a star-filled space with colorful planets. The child is giving a thumbs up. A banner says "Você é uma estrela da matemática!". Storybook style.',
    interactionType: InteractionType.End,
  },
};

export const stories: Record<string, Record<string, StoryNodeData>> = {
  history: historyStory,
  geography: geographyStory,
  math: mathStory,
};
