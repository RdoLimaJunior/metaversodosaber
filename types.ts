export enum InteractionType {
  Choice = 'CHOICE',
  FillInTheBlank = 'FILL_IN_THE_BLANK',
  VoiceChoice = 'VOICE_CHOICE',
  FindTheItem = 'FIND_THE_ITEM',
  DragAndDropMath = 'DRAG_AND_DROP_MATH',
  End = 'END',
}

export interface Choice {
  text: string;
  nextNodeId: string;
  keywords?: string[];
}

export interface FillInTheBlank {
  promptParts: [string, string];
  correctAnswer: string;
  nextNodeId: string;
}

export interface FindableItem {
  name: string;
  isCorrect: boolean;
}

export interface FindTheItemData {
  prompt: string;
  items: FindableItem[];
  nextNodeId: string;
}

export interface MathProblem {
  question: string;
  correctAnswer: number;
}

export interface DragAndDropMathData {
  problems: MathProblem[];
  nextNodeId: string;
  piecePrompts: string[];
}

export interface StoryNodeData {
  id: string;
  title: string;
  text: string;
  imagePrompt: string;
  interactionType: InteractionType;
  choices?: Choice[];
  fillInTheBlank?: FillInTheBlank;
  voiceChoices?: Choice[];
  findTheItem?: FindTheItemData;
  dragAndDropMath?: DragAndDropMathData;
  soundUrl?: string;
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}