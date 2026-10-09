import { Component } from '@angular/core';
import semantic from '@riff-ds/tokens/semantic.json';

import { CodeBlock, CodeSnippet } from '../../../shared/code-block/code-block';
import { PageHeader } from '../../../shared/page-header/page-header';

/** Grupos de feedback: comparten la misma estructura de tokens. */
const FEEDBACK = ['info', 'positive', 'negative', 'warning', 'notice', 'discovery'];

@Component({
  selector: 'pg-semantic-color-page',
  imports: [PageHeader, CodeBlock],
  templateUrl: './semantic-color.html',
  styleUrl: './semantic-color.scss',
})
export class SemanticColorPage {
  protected readonly groups = semantic.groups;
  protected readonly modes = semantic.modes;
  protected readonly feedback = FEEDBACK;

  protected readonly usage: CodeSnippet[] = [
    {
      label: 'CSS',
      code: `/* Importa una vez: @riff-ds/tokens/tokens.css + @riff-ds/tokens/semantic.css */\n.toast--info {\n  background: var(--riff-color-info-background);\n  border: 1px solid var(--riff-color-border-default);\n  color: var(--riff-color-info-content);\n}`,
    },
    {
      label: 'Tema',
      code: `<!-- Sin atributo: sigue a prefers-color-scheme -->\n<html data-theme="dark">\n\n<!-- También funciona en un fragmento -->\n<section data-theme="light">…</section>`,
    },
    {
      label: 'DTCG',
      code: `// packages/tokens/tokens/semantic/light.json  (dark.json: mismas claves)\n"color": {\n  "$type": "color",\n  "info": {\n    "background": { "$value": "{blue.20}", "$description": "Fondo suave de info…" }\n  }\n}`,
    },
  ];

  protected cssVar(group: string, token: string): string {
    return `var(--riff-color-${group}-${token})`;
  }
}
