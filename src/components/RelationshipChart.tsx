'use client'

import { useState, useEffect } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

interface ChartData {
    subject: string
    A: number // You
    B: number // Partner
    fullMark: number
}

interface RelationshipChartProps {
    data: ChartData[]
    userName: string
    partnerName: string
}

export default function RelationshipChart({ data, userName, partnerName }: RelationshipChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                 <div className="w-64 h-64 rounded-full border border-dashed border-white/5 animate-spin-slow flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-dashed border-velvet-gold/20 animate-reverse-spin-slow" />
                 </div>
            </div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-[400px] relative"
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ 
                            fill: 'rgba(240, 234, 214, 0.4)', 
                            fontSize: 9, 
                            fontWeight: 700, 
                            letterSpacing: '0.2em',
                            textAnchor: 'middle'
                        }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        tick={false}
                        axisLine={false}
                        domain={[0, 10]}
                    />
                    
                    {/* You - Burgundy */}
                    <Radar
                        name={userName}
                        dataKey="A"
                        stroke="#9E2B2B"
                        fill="#9E2B2B"
                        fillOpacity={0.5}
                        strokeWidth={2}
                        animationBegin={300}
                        animationDuration={1500}
                    />
                    
                    {/* Partner - Gold */}
                    <Radar
                        name={partnerName}
                        dataKey="B"
                        stroke="#D4AF37"
                        fill="#D4AF37"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        animationBegin={800}
                        animationDuration={1500}
                    />

                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#0D121A]/95 backdrop-blur-xl border border-velvet-gold/20 p-4 rounded-2xl shadow-2xl space-y-3 min-w-[160px]">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-velvet-gold border-b border-white/5 pb-2">
                                            {payload[0].payload.subject}
                                        </p>
                                        <div className="space-y-2">
                                            {payload.map((entry: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                        <span className="text-[9px] uppercase tracking-widest font-bold text-velvet-cream/60">
                                                            {entry.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-heading text-white">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        iconType="diamond"
                        wrapperStyle={{
                            paddingTop: '40px',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontWeight: 900,
                            color: 'rgba(255,255,255,0.4)'
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

