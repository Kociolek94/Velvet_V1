import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "VELVET - Ekosystem Relacji",
    description: "Nowoczesne, luksusowe wsparcie dla Twojej relacji.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-background" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
