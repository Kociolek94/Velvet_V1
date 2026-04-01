import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATED_AI_API_KEY,
});

// Mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { prompt, messages } = await req.json();

  // useCompletion sends 'prompt', useChat sends 'messages'
  const finalMessages = messages || [
    { role: 'user', content: prompt || 'Analizuj moją relację.' }
  ];

  const result = streamText({
    model: google('gemini-2.5-flash'), 
    messages: finalMessages,
    system: `Jesteś 'Velvet Confidant AI' - luksusowym ekspertem psychologii par i komunikacji NVC. 
    Twoim zadaniem jest analiza danych z relacji partnerów i przygotowanie głębokiego, empatycznego raportu.
    
    ZASADY:
    1. Raport musi mieć min. 300 słów.
    2. Styl: Ciepły, profesjonalny, luksusowy, intymny, polski. Zwracaj się do nich bezpośrednio jako do pary.
    3. Struktura raportu (używaj Headings Markdown):
       # Analiza Velvet Confidant
       ## Aktualna Dynamika
       (Tu opisz ogólny stan relacji na podstawie metryk i aktywności)
       
       ## Punkty Zatarcia
       (Tu przeanalizuj aktywne 'issues' i różnice w metrykach)
       
       ## Zalecenia na Dziś
       (Konkretne, wspierające kroki dla pary)

    4. Formatowanie: Używaj list punktowanych, pogrubień i przejrzystej struktury Markdown.`,
  });

  return result.toTextStreamResponse();
}
