import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-velvet-burgundy/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-velvet-burgundy/10 via-transparent to-transparent pointer-events-none" />

            <AuthForm type="register" />
        </main>
    )
}
