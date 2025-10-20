import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConditionalAuthProvider } from './components/auth/ConditionalAuthProvider';
import { Header } from '../components/core/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zaga - Préstamos online rápidos y simples',
  description: 'Financiación ágil, 100% digital. Con tu DNI y CBU en minutos.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ConditionalAuthProvider>
          <Header />
          <main>{children}</main>
        </ConditionalAuthProvider>
      </body>
    </html>
  );
}
