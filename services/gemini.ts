
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are a world-class JET (Joint Entrance Test) Tutor for English Honours. 
  Explain things in "Hinglish". Use English for technical terms. 
  Keep responses formatted in Markdown.`;

  const fullPrompt = context 
    ? `Context: ${context}\n\nUser Question: ${prompt}`
    : prompt;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: { systemInstruction, temperature: 0.7 },
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    return "CONNECTION_ERROR: Please check your API key.";
  }
};

export const generateNotes = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Topic: "${topic}" par JET 2025 ke liye detailed Hinglish study notes banayein. 
  Technical terms English mein honge. Include Summary, Key Points, Authors, and Exam Tips.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior professor specialized in JET exam prep. You speak Hinglish.",
      },
    });
    return response.text || "Notes could not be generated.";
  } catch (error: any) {
    throw new Error("Failed to connect to AI server.");
  }
};

export const generateQuickRevision = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Topic: "${topic}" ke liye 7-10 "Bullet Points" mein ultra-quick revision content banayein.
  Rules:
  1. Language: Hinglish (mix of Hindi/English).
  2. Format: Har point ek line ka hona chahiye.
  3. Content: Sirf vahi points likhein jo exam mein direct poochhe ja sakte hain (Facts, Dates, Definitions).
  4. Short & Sharp points only. No long paragraphs.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert at creating exam cheat sheets for JET students. You provide concise, punchy facts in Hinglish.",
      },
    });
    return response.text || "Revision points unavailable.";
  } catch (error: any) {
    throw new Error("AI Connection Error");
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const limitedText = text.replace(/[*#]/g, '').slice(0, 1500);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Explain this briefly in Hinglish: ${limitedText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return null;
  }
};
