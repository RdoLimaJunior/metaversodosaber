/**
 * Chama a função serverless do Netlify que atua como um proxy seguro para a API Gemini.
 * @param payload - O corpo da solicitação a ser enviado para a função.
 * @returns Uma promessa que resolve para a resposta JSON da função.
 */
async function callGeminiFunction(payload: any) {
  // Implementa um timeout para a solicitação para evitar que o app fique preso.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 segundos

  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal, // Passa o sinal do AbortController para o fetch
    });

    clearTimeout(timeoutId); // Limpa o timeout se a resposta chegar a tempo

    if (!response.ok) {
      let errorData;
      try {
        // Tenta extrair uma mensagem de erro JSON do corpo da resposta
        errorData = await response.json();
      } catch (e) {
        // Se o corpo não for JSON (ex: erro 502, 504), usa o status text
        throw new Error(`Erro de comunicação com o servidor: ${response.status} ${response.statusText}`);
      }
      console.error("Erro da função serverless:", errorData);
      throw new Error(errorData.error || `O servidor retornou um erro ${response.status}.`);
    }
    
    return response.json();

  } catch (error: any) {
    clearTimeout(timeoutId); // Garante a limpeza do timeout em caso de erro

    if (error.name === 'AbortError') {
      console.error('A solicitação para a função serverless expirou (timeout).');
      throw new Error('A IA está demorando muito para responder. Por favor, tente novamente.');
    }
    // Lança novamente outros erros (erros de rede, JSON inválido, etc.)
    throw error;
  }
}


/**
 * Generates an image using the Gemini API based on a prompt.
 * @param prompt - The text prompt for the image.
 * @param aspectRatio - The desired aspect ratio for the image.
 * @returns A promise that resolves to the base64-encoded image URL or 'placeholder' on rate limit errors.
 */
export async function generateStoryImage(prompt: string, aspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' = '16:9'): Promise<string> {
  console.log(`Requesting image for prompt: "${prompt}"`);
  try {
    const { imageUrl } = await callGeminiFunction({
      action: 'generateImage',
      prompt,
      aspectRatio,
    });
    return imageUrl;
  } catch (error) {
     console.error("Erro ao gerar imagem através da função serverless:", error);
     // Lançar um erro genérico para a UI tratar
     throw new Error("Não foi possível desenhar esta parte da história. A IA pode estar indisponível.");
  }
}

/**
 * Describes the person in the provided image.
 * @param base64Image - The base64 encoded string of the image.
 * @returns A promise that resolves to a text description of the person.
 */
async function describePersonInImage(base64Image: string): Promise<string> {
    try {
        const { description } = await callGeminiFunction({
            action: 'describePerson',
            base64Image,
        });
        return description;
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
        const { locations } = await callGeminiFunction({
            action: 'locateItems',
            base64Image,
            itemsToLocate,
        });
        return locations;
    } catch (error) {
        console.error("Erro ao localizar itens na imagem:", error);
        let message = "Falha ao analisar a imagem da história.";
        if (error instanceof Error && (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429'))) {
            message = "Limite de análise de imagem atingido. Por favor, tente novamente mais tarde.";
        }
        throw new Error(message);
    }
}