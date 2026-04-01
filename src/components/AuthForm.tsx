'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuthFormProps {
    type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = type === 'login'
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Redirect to onboarding to ensure pairing
            router.push('/onboarding')
            router.refresh()
        }
    }

    return (
        <div className="w-full max-w-md p-10 bg-velvet-dark/50 border border-velvet-burgundy/30 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Logo placement */}
            <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-velvet-gold/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <img 
                    src="/Velvet.png" 
                    alt="Velvet" 
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-gold" 
                />
            </div>

            <h2 className="text-3xl font-heading text-velvet-gold mb-10 text-center uppercase tracking-[0.3em] font-bold">
                {type === 'login' ? 'Witaj ponowie' : 'Zacznijmy Razem'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-6">
                <div>
                    <label className="block text-velvet-gold text-sm mb-2 uppercase tracking-tighter">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-velvet-burgundy/50 rounded-lg p-3 text-white focus:border-velvet-gold focus:outline-none transition-colors"
                        placeholder="twoj@email.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-velvet-gold text-sm mb-2 uppercase tracking-tighter">Hasło</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background border border-velvet-burgundy/50 rounded-lg p-3 text-white focus:border-velvet-gold focus:outline-none transition-colors"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-velvet-burgundy text-white font-bold py-4 rounded-lg hover:bg-opacity-80 transition-all border border-velvet-gold/30 uppercase tracking-widest disabled:opacity-50"
                >
                    {loading ? 'Przetwarzanie...' : (type === 'login' ? 'Wejdź' : 'Zarejestruj się')}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                {type === 'login' ? (
                    <p>
                        Nie masz konta?{' '}
                        <Link href="/register" className="text-velvet-gold hover:underline">Zarejestruj się</Link>
                    </p>
                ) : (
                    <p>
                        Masz już konto?{' '}
                        <Link href="/login" className="text-velvet-gold hover:underline">Zaloguj się</Link>
                    </p>
                )}
            </div>
        </div>
    )
}
