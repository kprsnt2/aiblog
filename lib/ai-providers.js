import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai'; // Assuming new SDK based on previous conversation history

let nvidiaClient = null;
if (process.env.NVIDIA_API_KEY) {
    nvidiaClient = new OpenAI({
        baseURL: 'https://integrate.api.nvidia.com/v1',
        apiKey: process.env.NVIDIA_API_KEY,
    });
}

const anthropicClient = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const geminiClient = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

export async function generateBlogContent(promptContent, useFallback = false) {
    const systemPrompt = `You are an expert technical blogger and writer. 
Your task is to expand the user's notes into a comprehensive, well-structured, 
and highly engaging blog post (800-1500 words). 
If the user provides image paths or YouTube URLs, embed them smoothly into the article.
Use Markdown formatting extensively (headers, lists, bold text).
At the end of the blog post, include an "### AI View" section where you (the AI model) 
provide your own perspective, insights, or gentle critique of the author's opinions/notes.`;

    // Try NVIDIA first (z-ai/glm5)
    if (!useFallback && process.env.NVIDIA_API_KEY) {
        try {
            console.log('Attempting generation with NVIDIA NIM (z-ai/glm5)...');
            const completion = await nvidiaClient.chat.completions.create({
                model: 'z-ai/glm5',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: promptContent }
                ],
                temperature: 0.7,
                max_tokens: 4096,
            });
            return {
                content: completion.choices[0].message.content,
                model: 'NVIDIA z-ai/glm5'
            };
        } catch (error) {
            console.error('NVIDIA generation failed, falling back:', error.message);
        }
    }

    // Fallback 1: Claude
    if (anthropicClient) {
        try {
            console.log('Attempting generation with Claude Haiku 4.5...');
            const response = await anthropicClient.messages.create({
                model: 'claude-3-5-haiku-20241022',
                system: systemPrompt,
                messages: [{ role: 'user', content: promptContent }],
                max_tokens: 4096,
            });
            return {
                content: response.content[0].text,
                model: 'Claude 3.5 Haiku'
            };
        } catch (error) {
            console.error('Claude generation failed, falling back:', error.message);
        }
    }

    // Fallback 2: Gemini
    if (geminiClient) {
        try {
            console.log('Attempting generation with Gemini 2.5 Pro...');
            const response = await geminiClient.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: promptContent,
                config: {
                    systemInstruction: systemPrompt,
                }
            });
            return {
                content: response.text,
                model: 'Gemini 2.5 Pro'
            };
        } catch (error) {
            console.error('Gemini generation failed:', error.message);
        }
    }

    throw new Error('All AI providers failed or are not configured.');
}
