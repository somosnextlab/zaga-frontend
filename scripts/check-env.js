#!/usr/bin/env node

/**
 * Script para verificar la configuración de variables de entorno
 * Ejecutar con: node scripts/check-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_BACKEND_URL'
];

const optionalEnvVars = [
  'NODE_ENV'
];

console.log('🔍 Verificando configuración de variables de entorno...\n');

let hasErrors = false;

// Verificar variables requeridas
console.log('📋 Variables requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    hasErrors = true;
  }
});

console.log('\n📋 Variables opcionales:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: No configurada (opcional)`);
  }
});

// Verificaciones específicas
console.log('\n🔧 Verificaciones específicas:');

// Verificar URL del sitio
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (siteUrl) {
  if (siteUrl.startsWith('https://')) {
    console.log('✅ NEXT_PUBLIC_SITE_URL usa HTTPS (correcto para producción)');
  } else if (siteUrl.startsWith('http://localhost')) {
    console.log('✅ NEXT_PUBLIC_SITE_URL usa localhost (correcto para desarrollo)');
  } else {
    console.log('⚠️  NEXT_PUBLIC_SITE_URL no usa HTTPS ni localhost');
  }
} else {
  console.log('❌ NEXT_PUBLIC_SITE_URL no configurada - esto causará problemas de redirección');
}

// Verificar configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL parece ser una URL válida de Supabase');
  } else {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL no parece ser una URL de Supabase');
  }
}

// Resumen
console.log('\n📊 Resumen:');
if (hasErrors) {
  console.log('❌ Se encontraron errores en la configuración');
  console.log('\n💡 Solución:');
  console.log('1. Crear archivo .env.local con las variables requeridas');
  console.log('2. Para producción, configurar NEXT_PUBLIC_SITE_URL=https://zaga.com.ar');
  console.log('3. Verificar configuración en Supabase Dashboard > Authentication > URL Configuration');
  process.exit(1);
} else {
  console.log('✅ Configuración correcta');
  console.log('\n💡 Para producción, asegúrate de que:');
  console.log('- NEXT_PUBLIC_SITE_URL=https://zaga.com.ar');
  console.log('- Las URLs de redirección en Supabase estén configuradas correctamente');
}
