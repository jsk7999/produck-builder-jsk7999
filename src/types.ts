export interface Ingredient {
  name: string;
  baseAmount: number; // For 1 serving
  unit: string;
  category: "주재료" | "부재료" | "양념" | "육수";
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
  durationSec?: number; // Optional timer
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  name: string;
  engName: string;
  category: string;
  description: string;
  prepTimeMin: number;
  cookTimeMin: number;
  difficulty: "쉬움" | "보통" | "어려움";
  baseServings: number;
  tags: string[];
  variations?: {
    id: string;
    name: string;
    description: string;
    ingredients: Ingredient[];
  }[];
  ingredients: Ingredient[]; // Default ingredients
  steps: CookingStep[];
  tips: string[];
}
