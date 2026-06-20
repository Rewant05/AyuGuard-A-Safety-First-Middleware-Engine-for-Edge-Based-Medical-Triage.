import { NextResponse } from 'next/server';
import { safetyRoute } from '@/lib/safetyRouter';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API using the secure AQ. auth key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Run the AyuGuard Safety Router FIRST
    const guardrailResult = safetyRoute(prompt);

    // 2. If AyuGuard BLOCKS or ESCALATES, stop immediately. Do not call Gemini.
    if (guardrailResult.action === 'block' || guardrailResult.action === 'escalate') {
      return NextResponse.json({
        status: 'blocked_by_ayuguard',
        safety_data: guardrailResult, // snake_case to match frontend
        ai_response: null,            // snake_case to match frontend
      });
    }

    // 3. If AyuGuard ALLOWS or REWRITES, call the live Gemini AI
    // Updated to 'latest' to fix the 404 Model Not Found bug
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    
    // If it's a 'rewrite', secretly inject AyuGuard's safety constraint into the prompt
    const finalPrompt = guardrailResult.action === 'rewrite' 
      ? `User asked: "${prompt}". Please answer safely. ${guardrailResult.safe_response}`
      : prompt;

    // Send to Google and wait for the response
    const result = await model.generateContent(finalPrompt);
    const aiText = result.response.text();

    // Return the successful text back to your frontend UI
    return NextResponse.json({
      status: 'cleared_by_ayuguard',
      safety_data: guardrailResult,
      ai_response: aiText,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Check terminal logs.' }, 
      { status: 500 }
    );
  }
}