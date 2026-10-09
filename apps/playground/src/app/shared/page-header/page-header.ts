import { Component, input } from '@angular/core';

@Component({
  selector: 'pg-page-header',
  template: `
    <h1 class="title">{{ title() }}</h1>
    @if (description()) {
      <p class="description">{{ description() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--riff-space-3);
      max-width: var(--pg-size-reading-max);
      margin-bottom: var(--riff-space-12);
    }

    .title {
      font-size: var(--riff-font-size-xl);
      font-weight: var(--riff-font-weight-bold);
      line-height: var(--riff-line-height-tight);
      letter-spacing: -0.02em;

      @media (min-width: 48rem) {
        font-size: var(--riff-font-size-2xl);
      }
    }

    .description {
      font-size: var(--riff-font-size-base);
      color: var(--pg-color-text-muted);

      @media (min-width: 48rem) {
        font-size: var(--riff-font-size-md);
        line-height: var(--riff-line-height-snug);
      }
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
