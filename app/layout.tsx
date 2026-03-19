import './globals.css';
import { AppProvider } from './context/AppContext';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        </head>
        <body>
        <AppProvider>
            <header className="fixed top-0 w-full z-50 glass-panel border-b border-black/5">
                <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
                    <Link href="/" className="font-serif italic text-2xl">Decoracion y Eventos</Link>
                    <nav className="flex gap-12 font-bold text-[10px] uppercase tracking-[0.2em]">
                        <Link href="/" className="hover:text-primary">Inicio</Link>
                        <Link href="/catalogo" className="hover:text-primary">Catálogo</Link>
                        <Link href="/presupuesto" className="hover:text-primary">Presupuesto</Link>
                        <Link href="/admin" className="hover:text-primary">Admin</Link>
                    </nav>
                </div>
            </header>
            <main className="pt-28 min-h-screen">
                {children}
            </main>
        </AppProvider>
        </body>
        </html>
    );
}