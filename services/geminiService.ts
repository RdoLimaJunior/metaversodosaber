
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Gemini API based on a prompt.
 * @param prompt - The text prompt for the image.
 * @param aspectRatio - The desired aspect ratio for the image.
 * @returns A promise that resolves to the base64-encoded image URL or 'placeholder' on rate limit errors.
 */
export async function generateStoryImage(prompt: string, aspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' = '16:9'): Promise<string> {
  console.log(`Generating image for prompt: "${prompt}"`);
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("A API não retornou nenhuma imagem.");
    }
  } catch (error) {
    console.error("Erro ao gerar imagem com a API Gemini:", error);
    // Convert the error to a string to safely check for rate limit messages
    const errorString = JSON.stringify(error);
    if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
         console.warn("Limite de gerações de imagem atingido. Usando placeholder.");
         return 'placeholder';
    }
    // For other errors, re-throw a more generic error so the app can handle it.
    throw new Error("Não foi possível desenhar esta parte da história. A API pode estar indisponível.");
  }
}

/**
 * Describes the person in the provided image.
 * @param base64Image - The base64 encoded string of the image.
 * @returns A promise that resolves to a text description of the person.
 */
async function describePersonInImage(base64Image: string): Promise<string> {
    try {
        const imagePart = {
            inlineData: { mimeType: 'image/jpeg', data: base64Image },
        };
        const textPart = { text: "Descreva de forma concisa as características da criança nesta foto para que um artista possa desenhá-la. Inclua cor do cabelo, penteado, cor dos olhos e expressão. Exemplo: 'Uma menina sorridente com cabelo castanho cacheado e olhos escuros'." };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Erro ao descrever imagem:", error);
        throw new Error("Não foi possível analisar a foto para criar o avatar.");
    }
}

/**
 * Generates a styled avatar based on a user's photo.
 * It first describes the photo, then uses that description to generate a new image.
 * @param base64Image - The base64 encoded string of the user's photo.
 * @param stylePrompt - The desired style for the avatar (e.g., 'a space explorer').
 * @returns A promise that resolves to the base64-encoded avatar URL.
 */
export async function generateStyledAvatar(base64Image: string, stylePrompt: string): Promise<string> {
    console.log("Gerando avatar estilizado...");
    
    // 1. Descrever a foto do usuário
    const description = await describePersonInImage(base64Image);
    console.log("Descrição da IA:", description);

    // 2. Criar um prompt detalhado para gerar o novo avatar
    const finalPrompt = `Crie um avatar de desenho animado para um jogo infantil. O personagem é: ${description}. O estilo do personagem deve ser de '${stylePrompt}'. O fundo deve ser simples e complementar ao tema. O estilo de arte deve ser uma ilustração de livro de histórias vibrante, colorida e amigável.`;

    // 3. Gerar a imagem do avatar
    // A função generateStoryImage já lida com a chamada à API de imagem e tratamento de erro.
    return generateStoryImage(finalPrompt, '1:1');
}


/**
 * Locates specified items within an image and returns their bounding boxes.
 * @param base64Image - The base64 encoded string of the image to analyze.
 * @param itemsToLocate - An array of strings with the names of items to find.
 * @returns A promise that resolves to an array of objects, each containing an item's name and its bounding box.
 */
export async function locateItemsInImage(base64Image: string, itemsToLocate: string[]): Promise<{ name: string; x: number; y: number; width: number; height: number; }[]> {
    console.log(`Localizing items: ${itemsToLocate.join(', ')}`);
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };
        const textPart = {
            text: `Na imagem fornecida, localize os seguintes itens: ${itemsToLocate.join(', ')}. Forneça as coordenadas (x, y do canto superior esquerdo, largura, altura) de cada item como porcentagens do tamanho total da imagem. Certifique-se de que cada caixa delimitadora seja precisa.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: "O nome do item localizado."
                            },
                            x: {
                                type: Type.NUMBER,
                                description: "A coordenada X (em porcentagem, de 0 a 100) do canto superior esquerdo da caixa delimitadora."
                            },
                            y: {
                                type: Type.NUMBER,
                                description: "A coordenada Y (em porcentagem, de 0 a 100) do canto superior esquerdo da caixa delimitadora."
                            },
                            width: {
                                type: Type.NUMBER,
                                description: "A largura (em porcentagem, de 0 a 100) da caixa delimitadora."
                            },
                            height: {
                                type: Type.NUMBER,
                                description: "A altura (em porcentagem, de 0 a 100) da caixa delimitadora."
                            }
                        },
                        required: ["name", "x", "y", "width", "height"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const locations = JSON.parse(jsonString);
        console.log("Localized items successfully:", locations);
        return locations;

    } catch (error) {
        console.error("Erro ao localizar itens na imagem com a API Gemini:", error);
        let message = "Falha ao analisar a imagem da história.";
        // Convert the error to a string to safely check for rate limit messages
        const errorString = JSON.stringify(error);
        if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
            message = "Limite de análise de imagem atingido. Por favor, tente novamente mais tarde.";
        }
        throw new Error(message);
    }
}