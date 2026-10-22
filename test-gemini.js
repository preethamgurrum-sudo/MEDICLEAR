import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
console.log("API Key found:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: "Hello" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("test message");
    console.log("Response:", result.response.text());
  } catch(e) {
    console.error("SDK Error:", e);
  }
}

test();
