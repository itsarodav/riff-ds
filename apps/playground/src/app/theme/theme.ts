import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

/** Misma clave que el script de index.html que aplica el tema antes de arrancar Angular. */
const STORAGE_KEY = 'pg-theme';

function readStoredMode(): ThemeMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

/**
 * Tema del playground. Los colores salen de los tokens --pg-color-* (light.json /
 * dark.json); aquí solo se decide qué modo aplicar:
 * - system: sin data-theme en <html>, manda prefers-color-scheme.
 * - light / dark: data-theme en <html>, se guarda en localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly media = matchMedia('(prefers-color-scheme: dark)');
  private readonly systemDark = signal(this.media.matches);

  readonly mode = signal<ThemeMode>(readStoredMode());
  readonly resolved = computed<ResolvedTheme>(() => {
    const mode = this.mode();
    return mode === 'system' ? (this.systemDark() ? 'dark' : 'light') : mode;
  });

  constructor() {
    this.media.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      const mode = this.mode();
      if (mode === 'system') this.root.removeAttribute('data-theme');
      else this.root.setAttribute('data-theme', mode);

      try {
        if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // Sin almacenamiento (modo privado, etc.): el tema funciona igual, solo no se recuerda.
      }
    });
  }
}
