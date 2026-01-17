
import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Audio Utilities for PCM processing
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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
  const ai = getAI();
  const systemInstruction = `You are a world-class JET (Joint Entrance Test) Tutor. 
  Explain things in "Hinglish" (Mix of Hindi and English). 
  Use English for technical terms (e.g., "Post-structuralism", "Teaching Aptitude") but explain them in simple Hindi sentences. 
  Example: "Derrida ka deconstruction theory humein batata hai ki text ka koi fixed meaning nahi hota."
  Keep responses formatted in clear Markdown. Ensure you provide full, detailed explanations without cutting off.`;

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
        maxOutputTokens: 4096, // Ensure long responses aren't truncated
      },
    });
    return response.text || "Kuch error aa gaya hai. Phir se try karein.";
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return "AI Tutor abhi available nahi hai. Connection check karein.";
  }
};

export const generateNotes = async (topic: string) => {
  const ai = getAI();
  const prompt = `Topic: "${topic}" par JET 2025 ke liye detailed Hinglish study notes banayein. 
  Technical terms English mein honge (like authors, movements, theories) par explanations Hindi mein honi chahiye taaki student easily samajh sake. 
  Include: 
  1. Main Summary (Hinglish mein)
  2. Key Points (Bulleted)
  3. Important Authors/Works
  4. JET 2025 Exam Tips.
  Provide a complete and comprehensive analysis.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior professor specialized in JET exam prep for English Honours. You speak perfect Hinglish.",
        maxOutputTokens: 4096, // Increase to prevent truncation
      },
    });
    return response.text || "Notes generate nahi ho paye.";
  } catch (error) {
    return "Error generating AI notes.";
  }
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  // Limit to a generous 5000 chars per chunk for the TTS model. 
  // For even longer notes, the UI component will handle chunking.
  const limitedText = text.slice(0, 5000);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Is content ko bahut hi natural Hinglish voice mein samjhayein. Technical terms English mein bole par context Hindi mein samjhayein: ${limitedText}` }] }],
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
