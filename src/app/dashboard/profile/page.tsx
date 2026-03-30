'use client'

import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Users, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <ModulePlaceholder
                    title="Profil Pary"
                    description="Zarządzaj ustawieniami wspólnego konta, poznajcie swoje języki miłości i dostosujcie Velvet do Waszych potrzeb."
                    icon={Users}
                />

                <div className="max-w-md mx-auto pt-8">
                    <button
                        onClick={handleLogout}
                        className="v-button-outline-gold w-full flex items-center justify-center gap-3 py-4 group"
                    >
                        <LogOut size={18} className="text-velvet-gold group-hover:translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Wyloguj się z Velvet</span>
                    </button>
                    <p className="text-center text-[10px] text-velvet-cream/20 uppercase tracking-widest mt-6">
                        Twoje dane są bezpieczne i zaszyfrowane.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
