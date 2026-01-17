
import { GoogleGenAI, Modality } from "@google/genai";

// Audio Utilities for PCM processing
export function decodeBase64(base64: string) {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Base64 decoding failed", e);
    return new Uint8Array(0);
  }
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const askTutor = async (prompt: string, context?: string) => {
  // Create fresh instance per call as per best practices for Gemini 3
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are a world-class JET (Joint Entrance Test) Tutor for English Honours. 
  Explain things in "Hinglish" (Mix of Hindi and English). 
  Use English for technical terms (e.g., "Post-structuralism", "Teaching Aptitude") but explain them in simple Hindi sentences. 
  Example: "Derrida ka deconstruction theory humein batata hai ki text ka koi fixed meaning nahi hota."
  Keep responses formatted in clear Markdown. Provide full, detailed explanations. If a topic is complex, break it down.`;

  const fullPrompt = context 
    ? `Context: ${context}\n\nUser Question: ${prompt}`
    : prompt;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    if (error.message?.includes("not found") || error.message?.includes("key")) {
      return "CONNECTION_ERROR: Please click the 'Fix Connection' button at the top.";
    }
    return "API Connection Error: Please check your internet or try a shorter question.";
  }
};

export const generateNotes = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Topic: "${topic}" par JET 2025 ke liye detailed Hinglish study notes banayein. 
  Technical terms English mein honge (like authors, movements, theories) par explanations Hindi mein honi chahiye taaki student easily samajh sake. 
  Include: 
  1. Main Summary (Hinglish mein)
  2. Key Points (Bulleted)
  3. Important Authors/Works
  4. JET 2025 Exam Tips.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior professor specialized in JET exam prep for English Honours. You speak perfect Hinglish.",
      },
    });
    return response.text || "Notes could not be generated at this time.";
  } catch (error: any) {
    console.error("Notes Generation Error:", error);
    if (error.message?.includes("not found") || error.message?.includes("key")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw new Error("Failed to connect to AI server. Please retry.");
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const limitedText = text.replace(/[*#]/g, '').slice(0, 1500);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Is content ko natural Hinglish teacher voice mein samjhayein: ${limitedText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};
