'use client'

import { useState } from 'react'
import { OctagonAlert } from 'lucide-react'
import VelvetDateTimePicker from './VelvetDateTimePicker'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Card from './ui/Card'

interface OverloadModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (until: string) => void
}

export default function OverloadModal({ isOpen, onClose, onConfirm }: OverloadModalProps) {
    const [selectedTime, setSelectedTime] = useState('')

    const quickPicks = [
        { label: '15 min', value: () => new Date(Date.now() + 15 * 60000) },
        { label: '1 godzina', value: () => new Date(Date.now() + 60 * 60000) },
        { label: 'Jutro rano', value: () => {
            const d = new Date()
            d.setDate(d.getDate() + 1)
            d.setHours(9, 0, 0, 0)
            return d
        }}
    ]

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Potrzebujesz oddechu?"
            width="md"
        >
            <div className="flex flex-col items-center text-center gap-10">
                <div className="p-5 bg-velvet-gold/10 rounded-3xl shadow-gold/10">
                    <OctagonAlert className="text-velvet-gold" size={40} />
                </div>
                
                <p className="text-sm text-velvet-cream/50 font-light leading-relaxed max-w-sm px-4">
                    To naturalne, że emocje mogą być przytłaczające. Zróbmy przerwę.
                    Zadeklaruj czas, w którym wrócisz do tej rozmowy.
                </p>

                <div className="w-full space-y-10 pt-4">
                    {/* Quick Picks */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {quickPicks.map((pick) => (
                            <Button
                                key={pick.label}
                                variant="outline"
                                size="sm"
                                onClick={() => onConfirm(pick.value().toISOString())}
                                className="border-velvet-gold/20 hover:border-velvet-gold/50"
                            >
                                {pick.label}
                            </Button>
                        ))}
                    </div>

                    <Card variant="glass" padding="sm" className="border-velvet-gold/10">
                        <VelvetDateTimePicker 
                            value={selectedTime}
                            onChange={(iso) => setSelectedTime(iso)}
                            placeholder="Lub wybierz własny termin..."
                        />
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={() => onConfirm(new Date(selectedTime).toISOString())}
                            disabled={!selectedTime}
                            variant="gold"
                            className="w-full"
                        >
                            Zatwierdzam przerwę
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-velvet-cream/30 hover:text-velvet-gold"
                        >
                            Wróć do rozmowy
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
