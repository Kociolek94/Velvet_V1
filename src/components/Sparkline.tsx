'use client'

import { useMemo } from 'react'

interface SparklineProps {
    data: number[]
    width?: number
    height?: number
    color?: string
}

export default function Sparkline({ data, width = 100, height = 30, color = "#C6A355" }: SparklineProps) {
    const points = useMemo(() => {
        if (!data || data.length < 2) return ""
        
        const max = Math.max(...data, 10)
        const min = Math.min(...data, 0)
        const range = max - min
        
        return data.map((val, i) => {
            const x = (i / (data.length - 1)) * width
            const y = height - ((val - min) / (range || 1)) * height
            return `${x},${y}`
        }).join(" ")
    }, [data, width, height])

    if (!data || data.length < 2) return null

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="opacity-30"
            />
            {/* Pulsing end point */}
            <circle 
                cx={width} 
                cy={points.split(" ").pop()?.split(",")[1]} 
                r="2" 
                fill={color} 
                className="animate-pulse"
            />
        </svg>
    )
}
