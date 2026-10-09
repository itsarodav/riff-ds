import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import colors from '@riff-ds/tokens/colors.json';

import { copyToClipboard } from '../../../shared/clipboard';
import { CodeBlock, CodeSnippet } from '../../../shared/code-block/code-block';
import { contrastRatio, wcagLevel } from '../../../shared/contrast';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Segmented, SegmentedOption } from '../../../shared/segmented/segmented';
import { ResolvedTheme, ThemeService } from '../../../theme/theme';

type CopyFormat = 'css' | 'scss' | 'hex';

const sage = colors.families.find((f) => f.name === 'sage')!.steps;
const sageStep = (step: number) => sage.find((s) => s.step === step)!.hex;

/**
 * Fondo de la vista previa en cada tema. Coincide con --pg-color-bg de
 * light.json / dark.json; aquí hace falta el hex para calcular el contraste.
 */
const PREVIEW_BG: Record<ResolvedTheme, { token: string; hex: string }> = {
  light: { token: 'sage-10', hex: sageStep(10) },
  dark: { token: 'sage-160', hex: sageStep(160) },
};

@Component({
  selector: 'pg-color-page',
  imports: [PageHeader, CodeBlock, Segmented],
  templateUrl: './color.html',
  styleUrl: './color.scss',
})
export class ColorPage {
  private readonly theme = inject(ThemeService);

  protected readonly backgroundOptions: SegmentedOption<ResolvedTheme>[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];
  protected readonly formatOptions: SegmentedOption<CopyFormat>[] = [
    { value: 'css', label: 'CSS var' },
    { value: 'scss', label: 'SCSS' },
    { value: 'hex', label: 'HEX' },
  ];

  /** Tema de la vista previa: sigue al del playground hasta que se cambia a mano. */
  protected readonly background = linkedSignal(() => this.theme.resolved());
  protected readonly format = signal<CopyFormat>('css');
  protected readonly lastCopied = signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;

  protected readonly bg = computed(() => PREVIEW_BG[this.background()]);

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

  protected readonly usage: CodeSnippet[] = [
    { label: 'CSS', code: `.button {\n  background: var(--riff-blue-100);\n  color: var(--riff-sage-10);\n}` },
    {
      label: 'SCSS',
      code: `@use '@riff-ds/tokens' as riff;\n\n.button {\n  background: riff.$riff-blue-100;\n  color: riff.$riff-sage-10;\n}`,
    },
    {
      label: 'DTCG',
      code: `// packages/tokens/tokens/primitives/color.json\n"blue": {\n  "$type": "color",\n  "100": {\n    "$value": { "colorSpace": "srgb", "components": [0.1765, 0.4078, 0.7098], "hex": "#2D68B5" }\n  }\n}`,
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
