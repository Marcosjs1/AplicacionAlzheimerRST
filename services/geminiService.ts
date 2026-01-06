import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chat: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getClient = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY not found in environment");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const startChat = async (): Promise<void> => {
    try {
        const client = getClient();
        // Initialize chat session using ai.chats.create
        chat = client.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: "You are a warm, patient, and empathetic companion for an elderly person. Your name is 'Aida'. Speak clearly, use simple language but do not be patronizing. Offer encouragement, help with remembering things, and engage in pleasant conversation about their day, health, or memories. Keep responses concise and easy to read.",
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            }
        });
    } catch (error) {
        console.error("Error starting chat:", error);
        throw error;
    }
};

export const sendMessage = async (text: string): Promise<string> => {
    if (!chat) {
        await startChat();
    }
    
    if (!chat) {
        throw new Error("Failed to initialize chat session");
    }

    try {
        const result: GenerateContentResponse = await chat.sendMessage({ message: text });
        return result.text || "Lo siento, no pude entender eso. ¿Podrías repetirlo?";
    } catch (error) {
        console.error("Error sending message:", error);
        return "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.";
    }
};

export const streamMessage = async function* (text: string) {
    if (!chat) {
        await startChat();
    }

    if (!chat) {
         throw new Error("Failed to initialize chat session");
    }

    try {
        const resultStream = await chat.sendMessageStream({ message: text });
        for await (const chunk of resultStream) {
            const response = chunk as GenerateContentResponse;
            if (response.text) {
                yield response.text;
            }
        }
    } catch (error) {
        console.error("Error streaming message:", error);
        yield "Error de conexión.";
    }
};