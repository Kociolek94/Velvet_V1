import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import NotificationDrawer from './NotificationDrawer'
import { useState } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    return (
        <div className="min-h-screen bg-[#0A0E14] text-velvet-cream overflow-x-hidden">
            <Sidebar />
            <div className="lg:pl-72 flex flex-col min-h-screen">
                <TopBar 
                    onOpenNotifications={() => setIsNotificationOpen(true)} 
                    unreadCount={unreadCount}
                    setUnreadCount={setUnreadCount}
                />
                <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
            <BottomNav />
            
            <NotificationDrawer 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
                onUnreadUpdate={(count) => setUnreadCount(count)}
            />
        </div>
    )
}

