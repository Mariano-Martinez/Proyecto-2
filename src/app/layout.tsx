import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { MotionProvider } from '@/components/layout/MotionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrackHub AR',
  description: 'Seguimiento unificado de envíos en Argentina.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <MotionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
