"use client";

import React, { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./header.module.scss";
import { Button } from "../../ui/Button/Button";
import { ThemeSwitcher } from "../../auth/themeSwitcher/theme-switcher";
import { AuthButton } from "../../auth/authButtons/auth-button";
import { useHeaderMode } from "@/app/hooks/useHeaderMode";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { getDashboardRouteByRole } from "@/app/utils/roleUtils";
import { useRouter } from "next/navigation";
import type { HeaderProps } from "./header.types";
import { LANDING_NAVIGATION_ITEMS } from "@/app/utils/constants/routes";
import { fetchWithHeader } from "@/app/utils/apiCallUtils/apiUtils";
import { LoginAuthResponse } from "@/app/types/login.types";

export const Header: FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    showLandingNavigation,
    showProtectedNavigation,
    mode,
    isAuthenticated,
  } = useHeaderMode();
  const {
    state: { role },
    actions: { setRole },
  } = useUserContext();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleGoToDashboard = () => {
    if (role) {
      const dashboardRoute = getDashboardRouteByRole(role);
      router.push(dashboardRoute);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      // Solo ejecutar si está autenticado pero no tiene rol
      if (isAuthenticated && !role) {
        try {
          const supabase = createClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.access_token) {
            const { data, error } = await fetchWithHeader({
              url: "/api/auth",
              method: "GET",
              accessToken: session.access_token,
            });

            if (!error && data) {
              const authResponse = data as LoginAuthResponse;
              const { role } = authResponse.data;
              setRole(role);
            }
          }
        } catch (error) {
          // Silenciar errores, no es crítico
          console.warn("Error al obtener rol:", error);
        }
      }
    };

    fetchRole();
  }, [isAuthenticated, role, setRole]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md ${
        className || ""
      }`}
    >
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

          {/* Desktop Navigation - Landing Page */}
          {showLandingNavigation && (
            <nav className="hidden md:flex items-center space-x-8">
              {LANDING_NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Navigation - Protected Routes */}
          {showProtectedNavigation && (
            <nav className="hidden md:flex items-center space-x-8">
              {/* Aquí se pueden agregar enlaces para usuarios autenticados */}
            </nav>
          )}

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            {/* Botón Ir al Dashboard - Solo mostrar si está autenticado y en landing page */}
            {isAuthenticated && mode === "landing" && (
              <Button variant="outline" size="sm" onClick={handleGoToDashboard}>
                Ir al Dashboard
              </Button>
            )}
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation - Landing Page */}
              {showLandingNavigation && (
                <nav className="flex flex-col space-y-4">
                  {LANDING_NAVIGATION_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}

              {/* Mobile Navigation - Protected Routes */}
              {showProtectedNavigation && (
                <nav className="flex flex-col space-y-4">
                  {/* Aquí se pueden agregar enlaces para usuarios autenticados */}
                </nav>
              )}

              {/* Mobile CTAs */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <ThemeSwitcher />
                {/* Botón Ir al Dashboard - Solo mostrar si está autenticado y en landing page */}
                {isAuthenticated && mode === "landing" && role && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleGoToDashboard();
                      closeMenu();
                    }}
                  >
                    Ir al Dashboard
                  </Button>
                )}
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
