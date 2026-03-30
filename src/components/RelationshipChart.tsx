'use client'

import { useState, useEffect } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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
        return <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl" />
    }

    return (
        <div className="w-full h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#F0EAD6', fontSize: 11, fontWeight: 300, letterSpacing: '0.1em' }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        tick={false}
                        axisLine={false}
                        domain={[0, 10]}
                    />
                    {/* You - Burgundy */}
                    <Radar
                        name={`Ty (${userName})`}
                        dataKey="A"
                        stroke="#4A0E0E"
                        fill="#4A0E0E"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                    {/* Partner - Gold */}
                    <Radar
                        name={`Partnerka (${partnerName})`}
                        dataKey="B"
                        stroke="#D4AF37"
                        fill="#D4AF37"
                        fillOpacity={0.4}
                        strokeWidth={2}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                            paddingTop: '30px',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: '#F0EAD6'
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0D121A',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#F0EAD6' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

