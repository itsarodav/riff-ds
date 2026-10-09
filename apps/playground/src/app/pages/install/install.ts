import { Component } from '@angular/core';

import { CodeBlock, CodeSnippet } from '../../shared/code-block/code-block';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'pg-install',
  imports: [PageHeader, CodeBlock],
  templateUrl: './install.html',
  styleUrl: './install.scss',
})
export class Install {
  protected readonly install: CodeSnippet[] = [
    { label: 'npm', code: 'npm install @riff-ds/tokens' },
    {
      label: 'SCSS',
      code: `// styles.scss
@use '@riff-ds/tokens' as riff;

// Emite todos los tokens como CSS custom properties (--riff-*)
:root {
  @include riff.primitives-css-vars;
}

// Y úsalos también como variables SCSS
.card {
  padding: riff.$riff-space-4;
  color: riff.$riff-sage-130;
}`,
    },
    {
      label: 'CSS',
      code: `/* Importa el CSS ya compilado (Next.js, React, cualquier proyecto) */
@import '@riff-ds/tokens/tokens.css';

.card {
  padding: var(--riff-space-4);
  color: var(--riff-sage-130);
}`,
    },
  ];
}
