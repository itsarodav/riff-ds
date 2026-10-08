import { Component, computed, signal } from '@angular/core';
import colors from '@riff-ds/tokens/colors.json';

import { copyToClipboard } from '../../../shared/clipboard';
import { CodeBlock, CodeSnippet } from '../../../shared/code-block/code-block';
import { contrastRatio, wcagLevel } from '../../../shared/contrast';
import { PageHeader } from '../../../shared/page-header/page-header';

type Background = 'light' | 'dark';
type CopyFormat = 'css' | 'scss' | 'hex';

const sage = colors.families.find((f) => f.name === 'sage')!.steps;

/** Fondos de referencia para medir contraste: los extremos de la rampa sage. */
const BACKGROUNDS: Record<Background, { label: string; token: string; hex: string }> = {
  light: { label: 'Claro', token: 'sage-10', hex: sage[0].hex },
  dark: { label: 'Oscuro', token: 'sage-160', hex: sage[sage.length - 1].hex },
};

const FORMATS: Record<CopyFormat, string> = {
  css: 'CSS var',
  scss: 'SCSS',
  hex: 'HEX',
};

@Component({
  selector: 'pg-color-page',
  imports: [PageHeader, CodeBlock],
  templateUrl: './color.html',
  styleUrl: './color.scss',
})
export class ColorPage {
  protected readonly backgrounds = Object.entries(BACKGROUNDS) as [Background, (typeof BACKGROUNDS)[Background]][];
  protected readonly formats = Object.entries(FORMATS) as [CopyFormat, string][];

  protected readonly background = signal<Background>('light');
  protected readonly format = signal<CopyFormat>('css');
  protected readonly lastCopied = signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;

  protected readonly bg = computed(() => BACKGROUNDS[this.background()]);

  protected readonly families = computed(() => {
    const bgHex = this.bg().hex;
    return colors.families.map((family) => ({
      name: family.name,
      anchors: family.steps.filter((s) => s.anchor),
      steps: family.steps.map((s) => {
        const ratio = contrastRatio(s.hex, bgHex);
        return {
          ...s,
          token: `${family.name}-${s.step}`,
          ratio: ratio.toFixed(2),
          level: wcagLevel(ratio),
          // Color del marcador ● para que se vea sobre el propio chip.
          darkChip: contrastRatio(s.hex, '#FFFFFF') >= 3,
        };
      }),
    }));
  });

  protected readonly extras = colors.extras;

  protected readonly usage: CodeSnippet[] = [
    { label: 'CSS', code: `.button {\n  background: var(--riff-blue-100);\n  color: var(--riff-sage-10);\n}` },
    {
      label: 'SCSS',
      code: `@use '@riff-ds/tokens' as riff;\n\n.button {\n  background: riff.$riff-blue-100;\n  color: riff.$riff-sage-10;\n}`,
    },
  ];

  protected tokenText(token: string, hex: string): string {
    switch (this.format()) {
      case 'css':
        return `var(--riff-${token})`;
      case 'scss':
        return `$riff-${token}`;
      case 'hex':
        return hex;
    }
  }

  protected async copy(token: string, hex: string): Promise<void> {
    const text = this.tokenText(token, hex);
    if (!(await copyToClipboard(text))) return;
    this.lastCopied.set(text);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.lastCopied.set(''), 2000);
  }
}
