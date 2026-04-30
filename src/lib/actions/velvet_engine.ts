'use server'

import { createClient } from '@/utils/supabase/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

// --- AI Initialization ---

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATED_AI_API_KEY,
});

// --- Public Actions ---

export async function generateRelationshipInsight() {
  try {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.warn('AI Engine: No user found or auth error', authError)
      return { error: 'Nieautoryzowany dostęp' }
    }

    // 2. Get profile and couple_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('couple_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.couple_id) {
      console.warn('AI Engine: No couple_id found for user', user.id, profileError)
      return { error: 'Nie znaleziono powiązanej pary' }
    }

    // 3. Fetch latest daily metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('closeness, communication, support, intimacy, user_id, created_at')
      .eq('couple_id', profile.couple_id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (metricsError) {
      console.error('AI Engine: Error fetching metrics:', metricsError)
    }

    // 4. Calculate Perception Gaps
    const partnerData: Record<string, any> = {}
    if (metrics) {
      metrics.forEach(m => {
        if (!partnerData[m.user_id]) {
          partnerData[m.user_id] = { ...m } // Most recent metric for this user
        }
      })
    }

    const userIds = Object.keys(partnerData)
    let gapContext = ""
    if (userIds.length >= 2) {
      const u1 = partnerData[userIds[0]]
      const u2 = partnerData[userIds[1]]
      
      const categories = ['closeness', 'communication', 'support', 'intimacy'] as const
      categories.forEach(cat => {
        const val1 = Number(u1[cat]) || 0
        const val2 = Number(u2[cat]) || 0
        const gap = Math.abs(val1 - val2)
        gapContext += `Różnica w kategorii ${String(cat)}: ${gap.toFixed(1)} punktów (Osoba A: ${val1}, Osoba B: ${val2}). `
      })
    }

    // 5. Prepare context and prompt
    const metricsContext = metrics && metrics.length > 0 
      ? JSON.stringify(metrics.slice(0, 10)) 
      : "Brak danych."

    const systemMessage = `Jesteś 'Velvet Confidant' - luksusowym, mądrym asystentem i powiernikiem dla par. 
    Otrzymujesz dane o relacji, w tym 'Perception Gap' (różnice w ocenach partnerów na skali 1-10) oraz ostatnie metryki.
    
    ZASADY LOGIKI:
    1. Twoim zadaniem jest wygenerowanie głębokiego, wielozdaniowego wglądu (3-5 zdań), który skłoni parę do szczerej refleksji. ZAWSZE KOŃCZ WYPOWIEDŹ PEŁNĄ KROPKĄ. NIE UCINAJ ZDANIA W POŁOWIE.
    2. Jeśli wykryjesz istotne różnice (Perception Gap > 3.0), odnieś się do nich z empatią, tłumacząc co mogą one oznaczać dla relacji i zadaj otwierające pytanie.
    3. Jeśli różnice są małe, pochwal ich synchronizację, ale wciąż zaproponuj obszar do dalszego rozwoju lub wspólnego świętowania bliskości.
    4. Styl: Luksusowy, polski, intymny, terapeutyczny, poetycki ale konkretny. Unikaj banałów.
    5. Zawsze zwracaj się bezpośrednio do nich jako pary ("Wy", "Wasze").`
    
    const prompt = `DANE PERCEPTION GAP: ${gapContext || "Brak danych od obojga partnerów."}\n\nOSTATNIE METRYKI: ${metricsContext}\n\nWygeneruj swój Velvet Insight.`;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemMessage,
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 1000,
    });

    console.log('--- VELVET ENGINE AI RESPONSE ---', text);

    if (!text) {
      throw new Error('Pusta odpowiedź od AI');
    }

    return { insight: text.replace(/"/g, '').trim() }
  } catch (error: any) {
    console.error('Velvet Engine Final Error Detail:', error)
    return { error: 'Ostatni błąd AI: ' + (error.message || 'Unknown error') }
  }
}

export async function analyzeMessage(content: string) {
  if (!content || content.length < 5) return { isFine: true };

  try {
    const systemPrompt = `Jesteś 'Velvet Messaging Assistant'. Twoim zadaniem jest analiza wiadomości w 'Bezpiecznej Przestrzeni' dla par.
    Szukasz 'Ty-komunikatów' (np. 'Zawsze tak robisz', 'Ty nigdy nie słuchasz'), agresji lub pasywnej agresji. 
    Jeśli wiadomość narusza zasady NVC (Porozumienie bez Przemocy), zaproponuj lepszą wersję skupioną na 'Ja-komunikatach', potrzebach i uczuciach.
    Jeśli wiadomość jest w porządku, odpowiedz 'OK'.
    Jeśli sugerujesz poprawę, napisz KRÓTKĄ korektę po polsku (max 25 słów), która brzmi luksusowo i wspierająco.
    Zacznij od 'Velvet Engine sugeruje: '`;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      prompt: `Wiadomość użytkownika: "${content}"`,
      temperature: 0.4,
      maxOutputTokens: 200,
    });

    if (!text || text.trim().toUpperCase() === 'OK') {
      return { isFine: true };
    }

    return { 
      isFine: false, 
      suggestion: text.trim() 
    };
  } catch (error: any) {
    console.error('AI Engine Message Analysis Error:', error);
    return { error: error.message };
  }
}
