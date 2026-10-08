import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'pg-root',
  imports: [RouterOutlet, Sidebar],
  template: `
    <a class="skip-link" href="#main">Saltar al contenido</a>

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
      <span class="topbar__brand">riff-ds</span>
    </header>

    <div class="layout">
      <pg-sidebar id="pg-sidebar" class="layout__sidebar" [class.is-open]="menuOpen()" />
      @if (menuOpen()) {
        <div class="layout__scrim" (click)="menuOpen.set(false)"></div>
      }
      <main id="main" class="layout__content" tabindex="-1">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.scss',
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
})
export class App {
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }
}
