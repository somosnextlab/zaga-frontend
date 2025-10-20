/**
 * Utilidad para prevenir errores de autofill del navegador
 * Soluciona el error: "Failed to execute 'insertBefore' on 'Node'"
 */

let observer: MutationObserver | null = null;
let isInitialized = false;

/**
 * Limpia overlays de autofill problemáticos (versión más específica)
 */
const cleanupAutofillOverlays = (): void => {
  try {
    // Solo limpiar overlays específicos que causan problemas
    const selectors = [
      '[data-autofill-overlay]',
      '[data-bootstrap-autofill]',
      '.bootstrap-autofill-overlay',
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        try {
          if (element instanceof HTMLElement) {
            const computedStyle = window.getComputedStyle(element);
            // Solo remover elementos que son claramente overlays problemáticos
            if (
              computedStyle.position === 'absolute' &&
              (computedStyle.zIndex === '9999' ||
                computedStyle.zIndex === '999999') &&
              element.getAttribute('data-autofill-overlay')
            ) {
              element.remove();
            }
          }
        } catch {
          // Silenciar errores de elementos que ya no existen
        }
      });
    });
  } catch {
    // Silenciar errores generales
  }
};

/**
 * Configura el MutationObserver para detectar y limpiar overlays automáticamente
 */
const setupAutofillObserver = (): void => {
  if (observer) return;

  observer = new MutationObserver(mutations => {
    let shouldCleanup = false;

    mutations.forEach(mutation => {
      // Detectar si se agregaron elementos que podrían ser overlays de autofill
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            const isAutofillOverlay =
              node.hasAttribute('data-autofill-overlay') ||
              node.classList.contains('bootstrap-autofill-overlay') ||
              (node.style.position === 'absolute' &&
                (node.style.zIndex === '9999' ||
                  node.style.zIndex === '999999'));

            if (isAutofillOverlay) {
              shouldCleanup = true;
            }
          }
        });
      }
    });

    if (shouldCleanup) {
      // Usar requestAnimationFrame para evitar conflictos con React
      requestAnimationFrame(() => {
        cleanupAutofillOverlays();
      });
    }
  });

  // Observar cambios en el body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
};

/**
 * Aplica atributos anti-autofill a un input (versión equilibrada)
 * @param input - El elemento input a configurar
 * @param allowAutofill - Si true, permite autofill del navegador pero previene overlays problemáticos
 */
export const applyAutofillFix = (
  input: HTMLInputElement,
  allowAutofill: boolean = true
): void => {
  if (allowAutofill) {
    // Versión equilibrada: permite autofill básico pero previene overlays problemáticos
    const attributes = {
      'data-lpignore': 'true', // LastPass
      'data-1p-ignore': 'true', // 1Password
      'data-bwignore': 'true', // Bitwarden
    };

    Object.entries(attributes).forEach(([key, value]) => {
      input.setAttribute(key, value);
    });

    // Solo prevenir overlays problemáticos, no el autofill básico
    input.addEventListener(
      'animationstart',
      e => {
        if (e.animationName === 'autofill' && e.target instanceof HTMLElement) {
          // Solo prevenir si es un overlay, no el input en sí
          if (e.target.hasAttribute('data-autofill-overlay')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      },
      { capture: true }
    );
  } else {
    // Versión estricta: bloquea completamente el autofill
    const attributes = {
      'data-lpignore': 'true',
      'data-form-type': 'other',
      autocomplete: input.type === 'password' ? 'new-password' : 'off',
      'data-1p-ignore': 'true',
      'data-bwignore': 'true',
    };

    Object.entries(attributes).forEach(([key, value]) => {
      input.setAttribute(key, value);
    });

    // Prevenir todos los eventos de autofill
    input.addEventListener(
      'animationstart',
      e => {
        if (e.animationName === 'autofill') {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      { capture: true }
    );
  }
};

/**
 * Inicializa la solución de autofill
 */
export const initializeAutofillFix = (): void => {
  if (isInitialized) return;

  // Limpiar inmediatamente
  cleanupAutofillOverlays();

  // Configurar observer
  setupAutofillObserver();

  // Limpiar periódicamente como respaldo
  const interval = setInterval(cleanupAutofillOverlays, 2000);

  // Limpiar al salir de la página
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    clearInterval(interval);
    isInitialized = false;
  };

  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('unload', cleanup);

  isInitialized = true;
};

/**
 * Limpia la solución de autofill
 */
export const cleanupAutofillFix = (): void => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  isInitialized = false;
};
