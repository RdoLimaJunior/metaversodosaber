import { GoogleGenAI, Type } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// Valide a chave de API no início.
if (!process.env.API_KEY) {
  throw new Error("A variável de ambiente API_KEY não está definida.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handler: Handler = async (event: HandlerEvent) => {
  console.log(`Recebida solicitação: ${event.httpMethod} ${event.path}`);
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;
    console.log(`Ação solicitada: ${action}`);

    switch (action) {
      case 'generateImage': {
        const { prompt, aspectRatio } = body;
        try {
            console.log(`Iniciando geração de imagem para prompt: "${prompt.substring(0, 50)}..."`);
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                console.log("Geração de imagem bem-sucedida.");
                return { statusCode: 200, body: JSON.stringify({ imageUrl }) };
            } else {
                 console.warn("API não retornou imagens (possivelmente devido a filtros de segurança) para o prompt:", prompt);
                 return { statusCode: 200, body: JSON.stringify({ imageUrl: 'placeholder' }) };
            }
        } catch (error: any) {
            console.error("Erro detalhado da API Gemini ao gerar imagem:", error);
            const errorMessage = error.message || '';
            // Para erros de limite de taxa, retornamos um placeholder para manter o aplicativo funcionando.
            if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
                console.warn("Limite de taxa da API atingido. Retornando placeholder.");
                return { statusCode: 200, body: JSON.stringify({ imageUrl: 'placeholder' }) };
            }
            // Para qualquer outro erro, retorne um erro 500.
             return {
                statusCode: 500,
                body: JSON.stringify({ error: "A IA não conseguiu desenhar a imagem. Pode ser devido a filtros de segurança ou um erro temporário." })
            };
        }
      }

      case 'describePerson': {
        const { base64Image } = body;
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
        const textPart = { text: "Descreva de forma concisa as características da criança nesta foto para que um artista possa desenhá-la. Inclua cor do cabelo, penteado, cor dos olhos e expressão. Exemplo: 'Uma menina sorridente com cabelo castanho cacheado e olhos escuros'." };
        
        console.log("Iniciando descrição de pessoa na imagem.");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        console.log("Descrição da imagem bem-sucedida.");
        return { statusCode: 200, body: JSON.stringify({ description: response.text }) };
      }

      case 'locateItems': {
        const { base64Image, itemsToLocate } = body;
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
        const textPart = { text: `Na imagem fornecida, localize os seguintes itens: ${itemsToLocate.join(', ')}. Forneça as coordenadas (x, y do canto superior esquerdo, largura, altura) de cada item como porcentagens do tamanho total da imagem.` };

        console.log(`Iniciando localização de itens: ${itemsToLocate.join(', ')}`);
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
                            name: { type: Type.STRING },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER }
                        },
                        required: ["name", "x", "y", "width", "height"]
                    }
                }
            }
        });
        
        const locations = JSON.parse(response.text.trim());
        console.log("Localização de itens bem-sucedida.");
        return { statusCode: 200, body: JSON.stringify({ locations }) };
      }

      default:
        console.warn(`Ação inválida recebida: ${action}`);
        return { statusCode: 400, body: JSON.stringify({ error: 'Ação inválida' }) };
    }
  } catch (error: any) {
    console.error("Erro não tratado na função Gemini:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
    };
  }
};

export { handler };