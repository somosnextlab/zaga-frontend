'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import './Footer.module.scss';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const productLinks = [
  { name: 'Préstamos Personales', href: '#' },
  { name: 'Simulador', href: '#' },
  { name: 'Tasas y Comisiones', href: '#' },
  { name: 'Calculadora', href: '#' },
];

const companyLinks = [
  { name: 'Nosotros', href: '#' },
  { name: 'Carreras', href: '#' },
  { name: 'Prensa', href: '#' },
  { name: 'Blog', href: '#' },
];

const legalLinks = [
  { name: 'Términos y Condiciones', href: '#' },
  { name: 'Política de Privacidad', href: '#' },
  { name: 'Aviso Legal', href: '#' },
  { name: 'Cookies', href: '#' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[hsl(var(--color-zaga-black))] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
          <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-[hsl(var(--color-zaga-green-gray))]">
                Zaga
              </span>
              <span className="opacity-70 text-sm font-normal text-[hsl(var(--color-zaga-white))]">
                by NextLab
              </span>
            </div>
            <p className="text-body-sm text-gray-300 leading-relaxed">
              La forma más rápida y segura de obtener el préstamo personal que
              necesitas. Proceso 100% digital con las mejores tasas del mercado.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[hsl(var(--color-zaga-green-gray))] flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Productos Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Productos</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-gray-300 hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-gray-300 hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                <span className="text-body-sm text-gray-300">
                  soporte@zaga.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                <span className="text-body-sm text-gray-300">
                  +54 9 351234567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                <span className="text-body-sm text-gray-300">
                  Cordoba, Argentina
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-body-sm text-gray-400">
              © 2025 Zaga. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-body-sm text-gray-400 hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
