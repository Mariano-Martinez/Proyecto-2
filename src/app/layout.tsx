import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrackHub AR',
  description: 'Seguimiento unificado de envíos en Argentina.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full bg-slate-950">
      <body className={`${inter.className} h-full text-slate-900 antialiased bg-slate-50`}>{children}</body>
    </html>
  );
}
