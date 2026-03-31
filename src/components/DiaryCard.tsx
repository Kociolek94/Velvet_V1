import { Calendar, Heart, Compass, Star, Pen, LucideIcon } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'

interface DiaryCardProps {
    title: string
    imagePath: string
    eventDate: string
    templateType?: string
    onClick: () => void
}

const templateConfig: Record<string, { icon: LucideIcon, label: string }> = {
    origin: { icon: Heart, label: 'Początki' },
    adventure: { icon: Compass, label: 'Przygoda' },
    milestone: { icon: Star, label: 'Sukcesy' },
    daily: { icon: Pen, label: 'Codzienność' }
}

export default function DiaryCard({ title, imagePath, eventDate, templateType = 'daily', onClick }: DiaryCardProps) {
    const PUBLIC_STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/diary_media/`
    const imageUrl = imagePath ? (imagePath.startsWith('http') ? imagePath : `${PUBLIC_STORAGE_URL}${imagePath}`) : ''

    const config = templateConfig[templateType] || templateConfig.daily
    const Icon = config.icon

    return (
        <Card 
            onClick={onClick}
            padding="none"
            className="group relative h-80 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Background Image / Placeholder */}
            {imagePath ? (
                <>
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500" />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-velvet-burgundy/5 via-black to-velvet-burgundy/5 flex flex-col items-center justify-center pt-8">
                    <div className="relative">
                        <div className="absolute inset-0 blur-2xl bg-velvet-gold/20 rounded-full animate-pulse" />
                        <Icon size={48} className="relative text-velvet-gold/20" />
                    </div>
                </div>
            )}
            
            {/* Template Badge */}
            <div className="absolute top-4 left-4 z-10">
                <Badge variant="gold" dot className="backdrop-blur-md bg-black/40">
                    <div className="flex items-center gap-1.5">
                        <Icon size={10} />
                        <span>{config.label}</span>
                    </div>
                </Badge>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 text-velvet-gold/60 text-[10px] uppercase tracking-[0.2em] mb-2">
                    <Calendar size={12} />
                    <span>{new Date(eventDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-heading text-velvet-gold uppercase tracking-widest leading-tight group-hover:text-white transition-colors">
                    {title}
                </h3>
                
                {/* Visual Indicator */}
                <div className="w-0 group-hover:w-16 h-px bg-velvet-gold mt-4 transition-all duration-700 delay-100" />
            </div>
        </Card>
    )
}
