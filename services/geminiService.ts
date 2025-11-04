import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Utility Functions ---

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// --- Chat Service ---

export const startChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [],
    });
};

// --- Content Analysis & Editing Services ---

export const analyzeText = async (prompt: string, textToAnalyze: string): Promise<string> => {
    try {
        const fullPrompt = `${prompt}:\n\n---\n\n${textToAnalyze}`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing text:", error);
        return "Sorry, I couldn't process that request. Please try again.";
    }
};

export const analyzeImage = async (prompt: string, image: File): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(image);
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [ {text: prompt}, imagePart ] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Sorry, I couldn't process the image. Please try another one.";
    }
};

// --- Image Creation Service ---

export const createImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error creating image:", error);
        return null;
    }
};
