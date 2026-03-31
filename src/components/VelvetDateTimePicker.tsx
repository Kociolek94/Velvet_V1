'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface VelvetDateTimePickerProps {
    value: string
    onChange: (isoString: string) => void
    placeholder?: string
}

export default function VelvetDateTimePicker({ value, onChange, placeholder }: VelvetDateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const containerRef = useRef<HTMLDivElement>(null)

    // Internal state parsed from value
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
    const [hour, setHour] = useState(value ? new Date(value).getHours() : 12)
    const [minute, setMinute] = useState(value ? new Date(value).getMinutes() : 0)

    useEffect(() => {
        if (value) {
            const d = new Date(value)
            if (!isNaN(d.getTime())) {
                setSelectedDate(d)
                setHour(d.getHours())
                setMinute(d.getMinutes())
            }
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        newDate.setHours(hour, minute, 0, 0)
        setSelectedDate(newDate)
        onChange(newDate.toISOString())
    }

    const handleTimeChange = (newHour: number, newMinute: number) => {
        setHour(newHour)
        setMinute(newMinute)
        if (selectedDate) {
            const newDate = new Date(selectedDate)
            newDate.setHours(newHour, newMinute, 0, 0)
            setSelectedDate(newDate)
            onChange(newDate.toISOString())
        }
    }

    // Calendar logic
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const offset = (firstDayOfMonth + 6) % 7 // Monday start

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

    return (
        <div className="relative" ref={containerRef}>
            {/* Display Input */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-velvet-cream focus-within:border-velvet-gold/30 cursor-pointer transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <span className={selectedDate ? 'text-velvet-cream' : 'text-white/10'}>
                        {selectedDate 
                            ? selectedDate.toLocaleString('pl-PL', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })
                            : placeholder || 'Wybierz termin...'
                        }
                    </span>
                </div>
                <CalendarIcon className="text-velvet-cream/20 group-hover:text-velvet-gold transition-colors" size={18} />
            </div>

            {/* Dropdown Picker */}
            {isOpen && (
                <div className="absolute bottom-[calc(100%+12px)] md:top-[calc(100%+12px)] md:bottom-auto left-0 z-[100] w-[340px] md:w-[480px] bg-[#0A0E14] border border-velvet-gold/20 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Calendar Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[10px] text-velvet-gold uppercase tracking-widest font-black">
                                    {currentMonth.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}
                                </h4>
                                <div className="flex gap-2">
                                    <button type="button" onClick={prevMonth} className="p-1 text-velvet-cream/40 hover:text-velvet-gold transition-colors"><ChevronLeft size={16} /></button>
                                    <button type="button" onClick={nextMonth} className="p-1 text-velvet-cream/40 hover:text-velvet-gold transition-colors"><ChevronRight size={16} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                                {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                                    <span key={d} className="text-[8px] text-white/20 font-bold uppercase py-2">{d}</span>
                                ))}
                                {Array.from({ length: offset }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1
                                    const isSelected = selectedDate?.getDate() === day && 
                                                     selectedDate?.getMonth() === currentMonth.getMonth() &&
                                                     selectedDate?.getFullYear() === currentMonth.getFullYear()
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateSelect(day)}
                                            className={`aspect-square rounded-lg text-[10px] flex items-center justify-center transition-all ${
                                                isSelected 
                                                ? 'bg-velvet-gold text-black font-bold' 
                                                : 'text-velvet-cream/60 hover:bg-white/5'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Time Column */}
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center gap-2 text-velvet-gold/40 mb-2">
                                <Clock size={12} />
                                <h4 className="text-[10px] uppercase tracking-widest font-black">Wybierz Godzinę (24H)</h4>
                            </div>

                            <div className="flex gap-4">
                                {/* Hour Scroller */}
                                <div className="flex-1 space-y-2">
                                    <label className="text-[8px] text-white/20 uppercase font-bold text-center block">Godz</label>
                                    <div className="h-48 overflow-y-auto scrollbar-hide space-y-1 bg-black/20 rounded-xl p-1">
                                        {hours.map(h => (
                                            <button
                                                key={h}
                                                type="button"
                                                onClick={() => handleTimeChange(h, minute)}
                                                className={`w-full py-2 rounded-lg text-xs transition-all ${
                                                    hour === h 
                                                    ? 'bg-velvet-burgundy/20 text-velvet-burgundy font-black' 
                                                    : 'text-velvet-cream/40 hover:bg-white/5'
                                                }`}
                                            >
                                                {h.toString().padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Minute Scroller */}
                                <div className="flex-1 space-y-2">
                                    <label className="text-[8px] text-white/20 uppercase font-bold text-center block">Min</label>
                                    <div className="h-48 overflow-y-auto scrollbar-hide space-y-1 bg-black/20 rounded-xl p-1">
                                        {minutes.map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => handleTimeChange(hour, m)}
                                                className={`w-full py-2 rounded-lg text-xs transition-all ${
                                                    minute === m 
                                                    ? 'bg-velvet-gold/20 text-velvet-gold font-black' 
                                                    : 'text-velvet-cream/40 hover:bg-white/5'
                                                }`}
                                            >
                                                {m.toString().padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-velvet-gold text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Check size={14} /> Zatwierdź
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
