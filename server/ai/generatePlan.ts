import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateItineraryAI(destination: string, days: number, preferences: string[]) {
    const prompt = `Create a ${days}-day travel itinerary for ${destination} focused on: ${preferences.join(', ')}. Return it in a day-by-day plan.`;

    const chat = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
    });

    return chat.choices[0].message.content;
}
