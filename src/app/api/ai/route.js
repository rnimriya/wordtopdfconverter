import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const { task, documentText, customPrompt, language, questions } = await req.json();

    if (!documentText) {
      return NextResponse.json({ error: 'No document text provided.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'AI is currently unavailable. The server administrator needs to configure the GEMINI_API_KEY in the environment variables.' 
      }, { status: 503 });
    }

    // Initialize SDK using official Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let systemInstruction = '';
    let userPrompt = '';

    // Determine the prompt based on the task
    switch (task) {
      case 'summarize':
        systemInstruction = 'You are an expert document summarizer. Summarize the provided document in a clear, structured format using Markdown. Include a high-level overview followed by key bullet points. Do not include any introductory fluff, just output the summary.';
        userPrompt = `Please summarize the following document:\n\n${documentText}`;
        break;
      case 'translate':
        systemInstruction = `You are an expert translator. Translate the provided document into ${language || 'English'}. Preserve the formatting and structure as much as possible. Do not include any introductory fluff, just output the translated text.`;
        userPrompt = `Please translate the following document into ${language || 'English'}:\n\n${documentText}`;
        break;
      case 'question_generator':
        systemInstruction = 'You are an expert educational content creator. Based on the provided document, generate a list of insightful questions and answers. Format it as a Q&A section using Markdown. Include 5-10 questions depending on the document length.';
        userPrompt = `Please generate questions and answers based on the following document:\n\n${documentText}`;
        break;
      case 'chat':
        systemInstruction = 'You are a helpful AI assistant that answers questions based *only* on the provided document context. If the answer is not in the document, say "I cannot find the answer to that in the document."';
        userPrompt = `Context Document:\n${documentText}\n\nUser Question:\n${customPrompt}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid task type specified.' }, { status: 400 });
    }

    // Call the Gemini 2.5 Flash model
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Low temperature for more deterministic/factual output
        }
    });

    const resultText = response.text;

    return NextResponse.json({ result: resultText }, { status: 200 });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during AI processing.' }, { status: 500 });
  }
}
