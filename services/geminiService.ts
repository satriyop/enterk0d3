
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askOracle = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `You are the "Oracle" for the developer enterk0d3. 
        Your personality is brutalist, concise, slightly chaotic, and technical. 
        You know that enterk0d3 is a master of low-level systems, WebGL, and minimalist design. 
        Answer in short, punchy sentences. Use technical jargon where appropriate. 
        Respond as if you are a terminal output.`,
        temperature: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Oracle Failure:", error);
    return "SYSTEM_ERROR: ORACLE_OFFLINE. PLEASE TRY AGAIN.";
  }
};
