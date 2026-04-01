'use client'

import { useState, useEffect } from 'react'
import { useCompletion } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import { Sparkles, Brain, Loader2, Play, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRelationshipContext } from '@/lib/actions/getRelationshipContext'
import { getLatestAnalysis, saveAnalysis } from '@/lib/actions/aiAnalyses'
import { useAuth } from '@/hooks/useAuth'

/**
 * Komponent RelationshipAnalysis - zaawansowana analiza AI stanu relacji.
 * Wykorzystuje Vercel AI SDK do strumieniowania odpowiedzi oraz react-markdown do formatowania.
 * Zapisuje wyniki w bazie danych, aby umożliwić powrót do dzisiejszej analizy.
 */
export default function RelationshipAnalysis() {
  const { coupleId, loading: authLoading } = useAuth()
  const [loadingContext, setLoadingContext] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: '/api/chat',
    streamProtocol: 'text',
    onFinish: async (_prompt: string, completion: string) => {
      if (coupleId && completion) {
        try {
          await saveAnalysis(coupleId, completion)
        } catch (error) {
          console.error('Błąd zapisu analizy:', error)
        }
      }
    }
  })

  // Ładowanie dzisiejszej analizy przy starcie
  useEffect(() => {
    async function loadTodayAnalysis() {
      if (!coupleId) {
        if (!authLoading) setInitialLoading(false)
        return
      }
      
      try {
        const latest = await getLatestAnalysis(coupleId)
        if (latest) {
          const today = new Date().toISOString().split('T')[0]
          const analysisDate = new Date(latest.created_at).toISOString().split('T')[0]
          
          if (today === analysisDate) {
            setCompletion(latest.content)
          }
        }
      } catch (error) {
        console.error('Błąd ładowania dzisiejszej analizy:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    loadTodayAnalysis()
  }, [coupleId, authLoading, setCompletion])

  // Funkcja inicjująca analizę
  const handleStartAnalysis = async () => {
    setLoadingContext(true)
    setCompletion('')
    try {
      // Pobranie kontekstu relacji (metryki, zadania, wyzwania)
      const context = await getRelationshipContext()
      
      // Budowa promptu dla modelu
      const prompt = `Oto aktualne dane o relacji pary z ostatnich dni:\n${JSON.stringify(context, null, 2)}\n\nNa podstawie tych danych przeprowadź głęboką analizę psychologiczną. Skup się na dynamice między partnerami i daj im wspierające, luksusowe rady w duchu Velvet.`
      
      // Rozpoczęcie generowania AI
      await complete(prompt)
    } catch (error) {
      console.error('Błąd podczas generowania analizy:', error)
    } finally {
      setLoadingContext(false)
    }
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="v-card-burgundy min-h-[500px] flex flex-col relative group"
      >
        {/* Dekoracyjne obramowanie dla efektu premium */}
        <div className="absolute inset-0 border border-velvet-gold/10 rounded-3xl pointer-events-none transition-colors group-hover:border-velvet-gold/20" />

        {/* Header Section */}
        <header className="p-8 md:p-10 border-b border-velvet-gold/10 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-velvet-gold/20 rounded-full blur-md animate-glow-gold" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-velvet-gold/20 to-transparent flex items-center justify-center border border-velvet-gold/30 relative z-10">
                <Sparkles className="text-velvet-gold" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-velvet-gold tracking-[0.2em] uppercase">
                Analiza Velvet Confidant
              </h2>
              <p className="text-[10px] text-velvet-cream/40 uppercase tracking-[0.4em] mt-1 font-bold">
                Inteligentny Wgląd w Waszą Przestrzeń
              </p>
            </div>
          </div>
          
          <button
            onClick={handleStartAnalysis}
            disabled={isLoading || loadingContext || authLoading}
            className="v-button-gold min-w-[200px] px-8 py-4 rounded-xl disabled:opacity-50 disabled:grayscale transition-all text-[11px] uppercase tracking-widest font-black"
          >
            {isLoading || loadingContext ? (
              <Loader2 className="animate-spin" size={20} />
            ) : completion ? (
              <>
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Generuj nową analizę</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Rozpocznij Sesję</span>
              </>
            )}
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-8 md:p-14 relative z-10">
          <AnimatePresence mode="wait">
            {initialLoading ? (
               <motion.div 
                key="initial-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80"
              >
                <div className="w-12 h-12 rounded-full border-2 border-velvet-gold/10 border-t-velvet-gold/40 animate-spin" />
              </motion.div>
            ) : isLoading || loadingContext ? (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 space-y-10"
              >
                <div className="relative">
                  <div className="absolute inset-[-40px] bg-velvet-gold/10 rounded-full blur-[60px] animate-pulse" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10 w-24 h-24 rounded-[2rem] bg-gradient-to-br from-velvet-gold/40 to-velvet-burgundy/40 p-[1px]"
                  >
                    <div className="w-full h-full rounded-[2rem] bg-velvet-dark flex items-center justify-center border border-velvet-gold/20 shadow-gold">
                      <Brain className="text-velvet-gold animate-pulse" size={44} />
                    </div>
                  </motion.div>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-velvet-gold font-heading tracking-[0.5em] uppercase text-xs">
                      Velvet Engine Analizuje
                    </span>
                    <div className="flex justify-center gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-velvet-gold rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-velvet-gold rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-velvet-gold rounded-full" />
                    </div>
                  </div>
                  
                  {/* Luxury Skeleton */}
                  <div className="w-full max-w-sm space-y-4 pt-6 mx-auto">
                    <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full w-full" />
                    <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full w-[80%] mx-auto" />
                    <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full w-[90%] mx-auto" />
                  </div>
                </div>
              </motion.div>
            ) : completion ? (
              <motion.article 
                key="analysis-result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="prose prose-invert prose-gold max-w-none 
                  prose-headings:font-heading prose-headings:tracking-widest prose-headings:uppercase 
                  prose-h1:text-4xl prose-h1:text-velvet-gold prose-h1:mb-12 prose-h1:text-center
                  prose-h2:text-xl prose-h2:text-velvet-gold/90 prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-velvet-gold/20 prose-h2:pb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                  prose-p:text-velvet-cream/80 prose-p:leading-[1.8] prose-p:text-base prose-p:font-light prose-p:mb-8
                  prose-li:text-velvet-cream/70 prose-li:text-base prose-li:mb-2
                  prose-strong:text-velvet-gold prose-strong:font-bold
                  prose-blockquote:border-l-velvet-gold/30 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                  selection:bg-velvet-gold/30"
              >
                <ReactMarkdown>{completion}</ReactMarkdown>
              </motion.article>
            ) : (
              <motion.div 
                key="idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-80 text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 text-velvet-gold/10 border border-white/5 transition-all hover:border-velvet-gold/20 hover:bg-velvet-gold/5 shadow-premium"
                >
                  <Brain size={40} className="text-white/20" />
                </motion.div>
                <h3 className="text-xl font-heading text-velvet-gold/50 uppercase tracking-[0.3em] mb-4">Gotowi na głębszy wgląd?</h3>
                <p className="text-sm text-velvet-cream/30 max-w-sm mx-auto leading-relaxed font-light uppercase tracking-widest text-[10px]">
                  Velvet Confidant przeanalizuje Wasze ostatnie metryki, wyzwania i sukcesy, aby nakreślić mapę Waszej bliskości.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer Accent */}
        <footer className="p-8 border-t border-white/5 flex justify-center bg-black/10">
          <div className="flex items-center gap-3 text-velvet-gold/30">
            <div className="w-1 h-1 bg-velvet-gold/30 rounded-full" />
            <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Powered by Velvet Engine & AI</span>
            <div className="w-1 h-1 bg-velvet-gold/30 rounded-full" />
          </div>
        </footer>
      </motion.div>
    </section>
  )
}
