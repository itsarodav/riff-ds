import { Component, computed, input, signal } from '@angular/core';

import { copyToClipboard } from '../clipboard';

export interface CodeSnippet {
  /** Texto de la pestaña: 'Angular', 'React', 'SCSS', 'npm'… */
  label: string;
  code: string;
}

/**
 * Bloque de código con pestañas y botón de copiar.
 * Pensado para mostrar la misma cosa en varios formatos (Angular / React / SCSS / CSS).
 */
@Component({
  selector: 'pg-code-block',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  readonly snippets = input.required<CodeSnippet[]>();
  /** Etiqueta accesible del grupo de pestañas. */
  readonly label = input('Código');

  private static nextId = 0;
  protected readonly id = `pg-code-${CodeBlock.nextId++}`;

  protected readonly selected = signal(0);
  protected readonly current = computed(() => this.snippets()[this.selected()] ?? this.snippets()[0]);
  protected readonly copied = signal(false);
  private resetTimer?: ReturnType<typeof setTimeout>;

  protected select(index: number): void {
    this.selected.set(index);
    this.copied.set(false);
  }

  /** Flechas izquierda/derecha entre pestañas (patrón WAI-ARIA tabs). */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const count = this.snippets().length;
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + count) % count;
    this.select(next);
    document.getElementById(`${this.id}-tab-${next}`)?.focus();
  }

  protected async copy(): Promise<void> {
    if (!(await copyToClipboard(this.current().code))) return;
    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), 2000);
  }
}
