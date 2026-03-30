'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import HeavyIssueForm from "@/components/HeavyIssueForm"
import TalkIssueForm from "@/components/TalkIssueForm"
import { ShieldCheck, MessageSquare, Sparkles } from "lucide-react"

type FormType = 'heavy' | 'talk'

export default function NewIssuePage() {
    const [type, setType] = useState<FormType>('heavy')

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-12">
                <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="v-card p-3 rounded-2xl bg-velvet-gold/10 mb-6">
                        <Sparkles className="text-velvet-gold" size={32} />
                    </div>
                    <h1 className="text-4xl font-heading text-velvet-gold uppercase tracking-widest mb-4">
                        Nowy <span className="text-velvet-cream italic font-light lowercase">Komunikat</span>
                    </h1>

                    {/* Form Switcher */}
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mt-8">
                        <button
                            onClick={() => setType('heavy')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-500 text-[10px] uppercase tracking-widest font-bold ${type === 'heavy'
                                    ? 'bg-velvet-burgundy/20 text-velvet-gold border border-velvet-gold/20 shadow-lg'
                                    : 'text-velvet-cream/30 hover:text-velvet-cream/60'
                                }`}
                        >
                            <ShieldCheck size={16} />
                            Ciężko mi z tym
                        </button>
                        <button
                            onClick={() => setType('talk')}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-500 text-[10px] uppercase tracking-widest font-bold ${type === 'talk'
                                    ? 'bg-velvet-gold/10 text-velvet-gold border border-velvet-gold/20 shadow-lg'
                                    : 'text-velvet-cream/30 hover:text-velvet-cream/60'
                                }`}
                        >
                            <MessageSquare size={16} />
                            Musimy pogadać
                        </button>
                    </div>
                </div>

                <div className="animate-in fade-in zoom-in-95 duration-700">
                    {type === 'heavy' ? <HeavyIssueForm /> : <TalkIssueForm />}
                </div>
            </div>
        </DashboardLayout>
    );
}
