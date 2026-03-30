import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0A0E14] text-velvet-cream">
            <Sidebar />
            <div className="lg:pl-72 flex flex-col min-h-screen">
                <TopBar />
                <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    )
}

