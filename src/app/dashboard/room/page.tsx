'use client'

import DashboardLayout from "@/components/DashboardLayout";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Flame } from "lucide-react";

export default function RoomPage() {
    return (
        <DashboardLayout>
            <ModulePlaceholder
                title="Pokój Namiętności"
                description="Twoja prywatna przestrzeń intymnej synchronizacji i odkrywania nowych wymiarów bliskości."
                icon={Flame}
            />
        </DashboardLayout>
    );
}
