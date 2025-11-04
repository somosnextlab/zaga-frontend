"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import styles from "./footer.module.scss";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const productLinks = [
  { name: "Préstamos Personales", href: "#" },
  { name: "Simulador", href: "#" },
  { name: "Tasas y Comisiones", href: "#" },
  { name: "Calculadora", href: "#" },
];

const companyLinks = [
  { name: "Nosotros", href: "#" },
  { name: "Carreras", href: "#" },
  { name: "Prensa", href: "#" },
  { name: "Blog", href: "#" },
];

const legalLinks = [
  { name: "Términos y Condiciones", href: "#" },
  { name: "Política de Privacidad", href: "#" },
  { name: "Aviso Legal", href: "#" },
];

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        {/* Main Footer Content */}
        <div className={styles.footer__main}>
          {/* Brand Column */}
          <div className={styles.footer__brand}>
            <div className={styles.footer__brandLogo}>
              <span className={styles.footer__brandName}>Zaga</span>
              <span className={styles.footer__brandTagline}>by NextLab</span>
            </div>
            <p className={styles.footer__brandDescription}>
              La forma más rápida y segura de obtener el préstamo personal que
              necesitas. Proceso 100% digital con las mejores tasas del mercado.
            </p>
            <div className={styles.footer__socialLinks}>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className={styles.footer__socialLink}
                    aria-label={social.label}
                  >
                    <IconComponent className={styles.footer__socialIcon} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Productos Column */}
          <div className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Productos</h3>
            <ul className={styles.footer__sectionLinks}>
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className={styles.footer__sectionLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa Column */}
          <div className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Empresa</h3>
            <ul className={styles.footer__sectionLinks}>
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className={styles.footer__sectionLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto Column */}
          <div className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Contacto</h3>
            <div className={styles.footer__contact}>
              <div className={styles.footer__contactItem}>
                <Mail className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>
                  soporte@zaga.com
                </span>
              </div>
              <div className={styles.footer__contactItem}>
                <Phone className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>
                  +54 9 351234567
                </span>
              </div>
              <div className={styles.footer__contactItem}>
                <MapPin className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>
                  Cordoba, Argentina
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footer__bottom}>
          <div className={styles.footer__bottomContent}>
            <div className={styles.footer__copyright}>
              © 2025 Zaga. Todos los derechos reservados.
            </div>
            <div className={styles.footer__legalLinks}>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={styles.footer__legalLink}
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
