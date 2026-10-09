import { DOCUMENT, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Footer } from './layout/footer/footer';
import { Sidebar } from './layout/sidebar/sidebar';
import { Logo } from './shared/logo/logo';

@Component({
  selector: 'pg-root',
  imports: [RouterOutlet, Sidebar, Footer, Logo],
  template: `
    <a class="skip-link" href="#main">Saltar al contenido</a>

    @if (isCover()) {
      <!-- La portada trae su propia cabecera y su <main>. -->
      <router-outlet />
    } @else {
      <header class="topbar">
        <button
          type="button"
          class="topbar__menu"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="pg-sidebar"
          (click)="menuOpen.set(!menuOpen())"
        >
          <span class="pg-sr-only">{{ menuOpen() ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            @if (menuOpen()) {
              <path d="M6 6l12 12M18 6L6 18" />
            } @else {
              <path d="M4 7h16M4 12h16M4 17h16" />
            }
          </svg>
        </button>
        <span class="topbar__brand">
          <pg-logo class="topbar__logo" />
        </span>
      </header>

      <div class="layout">
        <pg-sidebar id="pg-sidebar" class="layout__sidebar" [class.is-open]="menuOpen()" />
        @if (menuOpen()) {
          <div class="layout__scrim" (click)="menuOpen.set(false)"></div>
        }
        <div class="layout__main">
          <main id="main" class="layout__content" tabindex="-1">
            <div class="layout__inner">
              <router-outlet />
            </div>
          </main>
          <!-- El tema ya se elige en el sidebar. -->
          <pg-footer [themeSwitch]="false" />
        </div>
      </div>
    }
  `,
  styleUrl: './app.scss',
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
})
export class App {
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  /** La portada ('/') va a pantalla completa, sin sidebar ni barra superior. */
  // Valor inicial desde la URL para no pintar el shell un instante antes de la portada.
  protected readonly isCover = signal(inject(DOCUMENT).location.pathname === '/');

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.menuOpen.set(false);
        this.isCover.set(this.router.url.split(/[?#]/)[0] === '/');
      });
  }
}
