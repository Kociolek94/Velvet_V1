'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Quote, ArrowLeft, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { getSparks } from '@/lib/actions/sparks'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/DashboardLayout'
import SparkItem from '@/components/SparkItem'
import SendSparkForm from '@/components/SendSparkForm'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SparksPage() {
    const { userId, loading: authLoading } = useAuth()
    const [sparks, setSparks] = useState<{ mySparks: any[], partnerSparks: any[] }>({ mySparks: [], partnerSparks: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getSparks()
                setSparks(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (!authLoading) load()
    }, [authLoading])

    if (authLoading || loading) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                    <Sparkles className="animate-spin-slow text-velvet-gold/20" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-velvet-gold animate-pulse">Ładowanie Iskier...</span>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-16 pb-32 px-6">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-velvet-cream/30 hover:text-velvet-gold transition-colors group mb-4">
                             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[1px] bg-velvet-gold/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-velvet-gold/60">Moduł Bliskości</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-white uppercase">
                            Okruchy <span className="text-velvet-gold italic font-light lowercase">Miłości</span>
                        </h1>
                    </div>
                </header>

                {/* Send Section */}
                <section className="py-8">
                     <div className="text-center mb-12">
                        <h2 className="text-sm font-heading text-velvet-gold uppercase tracking-[0.4em] mb-2 underline underline-offset-8 decoration-velvet-gold/20">Rozpal Iskrę</h2>
                        <p className="text-[9px] text-velvet-cream/30 uppercase tracking-[0.2em]">Drobne gesty budują wielką miłość</p>
                    </div>
                    <SendSparkForm />
                </section>

                {/* Mirrored Feed Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* Left Column: My Sparks for Partner */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-velvet-burgundy/10 border border-velvet-burgundy/20 flex items-center justify-center">
                                <Heart className="text-velvet-burgundy" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-heading text-white uppercase tracking-widest leading-none">Twoje Okruchy</h3>
                                <p className="text-[9px] text-velvet-cream/20 uppercase tracking-[0.2em] mt-2">Dla Twojej połówki</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {sparks.mySparks.length === 0 ? (
                                <div className="p-12 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-velvet-cream/20 font-black">Czekamy na Twoją pierwszą iskrę...</p>
                                </div>
                            ) : (
                                sparks.mySparks.map(spark => (
                                    <SparkItem key={spark.id} content={spark.content} date={spark.created_at} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Partner's Sparks for Me */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-6 mb-10 lg:flex-row-reverse lg:text-right">
                            <div className="w-12 h-12 rounded-2xl bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center">
                                <Sparkles className="text-velvet-gold" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-heading text-white uppercase tracking-widest leading-none">Okruchy od Partnera</h3>
                                <p className="text-[9px] text-velvet-cream/20 uppercase tracking-[0.2em] mt-2">Twoje złote chwile</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {sparks.partnerSparks.length === 0 ? (
                                <div className="p-12 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-velvet-cream/20 font-black">Tu pojawią się iskry od partnera...</p>
                                </div>
                            ) : (
                                sparks.partnerSparks.map(spark => (
                                    <SparkItem key={spark.id} content={spark.content} date={spark.created_at} isPartner />
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}
