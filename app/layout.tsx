import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from './components/core/Header/Header';

const inter = Inter({
  variable: '--font-inter',
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
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
