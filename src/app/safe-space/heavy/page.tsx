import HeavyIssueForm from '@/components/HeavyIssueForm'

export default function HeavyIssuePage() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-velvet-burgundy/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-velvet-gold/5 rounded-full blur-[100px] -z-10" />

            <div className="mb-12 text-center z-10">
                <h1 className="text-velvet-gold text-sm uppercase tracking-[0.4em] mb-2 font-bold">Safe Space</h1>
                <h2 className="text-4xl font-bold text-white uppercase tracking-wider">Ciężko mi z tym</h2>
            </div>

            <HeavyIssueForm />
        </main>
    )
}
