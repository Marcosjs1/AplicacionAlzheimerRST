import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let chatSession: ChatSession | null = null;
let currentModelName: string | null = null;

const SUPPORTED_MODELS = [
    "gemini-2.5-flash", 
    "gemini-2.0-flash", 
    "gemini-flash-latest", 
    "gemini-pro-latest",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash", // Mantenemos fallback por si acaso en otros entornos
    "gemini-pro"
];

const getClient = () => {
    if (!genAI) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("VITE_GEMINI_API_KEY not found in environment");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
};

export const startChat = async (): Promise<void> => {
    const client = getClient();
    let lastError: any = null;

    for (const modelName of SUPPORTED_MODELS) {
        try {
            console.log(`🔌 Probando compatibilidad con: ${modelName}...`);
            const model = client.getGenerativeModel({
                model: modelName,
                systemInstruction: "You are a warm, patient, and empathetic companion for an elderly person. Your name is 'Aida'. Speak clearly, use simple language but do not be patronizing.",
            });

            // Pequeña prueba real para confirmar que el modelo soporta generación
            // Usamos un texto muy corto para minimizar latencia y consumo
            await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }] });

            chatSession = model.startChat({
                history: [],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1000,
                },
            });

            currentModelName = modelName;
            console.log(`✅ Conexión establecida con éxito usando: ${modelName}`);
            return;
        } catch (error: any) {
            const msg = error?.message || "";
            console.warn(`⚠️ Modelo ${modelName} no compatible o no encontrado:`, msg);
            lastError = error;
            // Continuar con el siguiente modelo si es 404 o similar
            continue;
        }
    }

    throw lastError || new Error("No se pudo conectar con ningún modelo de Gemini disponible. Verifique su API Key.");
};

export const sendMessage = async (text: string): Promise<string> => {
    try {
        if (!chatSession) {
            await startChat();
        }
        
        if (!chatSession) throw new Error("Sesión de chat no inicializada");

        const result = await chatSession.sendMessage(text);
        const response = await result.response;
        return response.text() || "Lo siento, no pude entender eso.";
    } catch (error: any) {
        console.error("Error en sendMessage:", error);
        const msg = error?.message || "";
        
        if (error?.status === 429 || msg.includes("429")) {
            return "QUOTA_EXCEEDED: Límite de uso alcanzado, probá en unos segundos.";
        }
        
        if (msg.includes("404") || msg.includes("not found")) {
            // Si el modelo que creíamos que funcionaba da 404 de repente, intentamos resetear y fallar con gracia
            chatSession = null;
            return "ERROR: El modelo de IA tuvo un problema de disponibilidad. Por favor, recargá el chat.";
        }

        return "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.";
    }
};

export const streamMessage = async function* (text: string) {
    try {
        if (!chatSession) {
            await startChat();
        }

        if (!chatSession) throw new Error("Sesión de chat no inicializada");

        const result = await chatSession.sendMessageStream(text);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                yield chunkText;
            }
        }
    } catch (error: any) {
        console.error("Error en streamMessage:", error);
        const msg = (error?.message || "").toLowerCase();
        
        if (msg.includes("429")) {
            yield "QUOTA_EXCEEDED: Límite de uso alcanzado, probá en unos segundos.";
        } else if (msg.includes("404") || msg.includes("not found")) {
            chatSession = null;
            yield "ERROR: Se perdió la conexión con el modelo (404). Por favor, intentá enviar el mensaje de nuevo.";
        } else {
            yield "Error de conexión temporal. Por favor intentá de nuevo.";
        }
    }
};