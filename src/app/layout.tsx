import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeManager } from '@/components/ThemeManager';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrackHub AR',
  description: 'Seguimiento unificado de envíos en Argentina.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full bg-layer-0">
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
