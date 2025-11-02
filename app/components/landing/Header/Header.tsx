"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import "./header.module.scss";
import { Button } from "../../ui/Button/Button";
import { ThemeSwitcher } from "../../auth/theme-switcher";
import { AuthButton } from "../../auth/auth-button";
import { User } from "@supabase/supabase-js";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determinar si estamos en la landing page (no en un dashboard)
  const isLandingPage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-[hsl(var(--color-zaga-green-gray))]">
                Zaga
              </span>
              <span className="opacity-70 text-sm font-normal text-[hsl(var(--color-zaga-black))]">
                by NextLab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Solo mostrar si no hay usuario logueado */}
          {!user && isLandingPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#beneficios"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Beneficios
              </Link>
              <Link
                href="#como-funciona"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Cómo funciona
              </Link>
              <Link
                href="#faq"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Preguntas
              </Link>
            </nav>
          )}

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            <AuthButton setUser={setUser} user={user} />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation - Solo mostrar si no hay usuario logueado */}
              {!user && isLandingPage && (
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="#beneficios"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Beneficios
                  </Link>
                  <Link
                    href="#como-funciona"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cómo funciona
                  </Link>
                  <Link
                    href="#faq"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Preguntas
                  </Link>
                </nav>
              )}

              {/* CTAs */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <ThemeSwitcher />
                <AuthButton setUser={setUser} user={user} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
