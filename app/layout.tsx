import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./styles/globals.css";
import styles from "./styles/defaultPage.module.scss";
import { Header } from "./components/landing/Header/Header";
import { UserContextProvider } from "./context/UserContext/UserContextContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl), // revisar esto
  title: "Zaga — Préstamos personales rápidos y seguros",
  description:
    "Obtén el préstamo personal que necesitas en minutos. Proceso 100% digital, transparente y con las mejores tasas del mercado.",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserContextProvider>
            <Header />
            <main className={styles.defaultPage}>{children}</main>
          </UserContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
