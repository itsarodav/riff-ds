import { Component, input } from '@angular/core';

@Component({
  selector: 'pg-page-header',
  template: `
    @if (eyebrow()) {
      <p class="eyebrow">{{ eyebrow() }}</p>
    }
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
      max-width: 48rem;
      margin-bottom: var(--riff-space-12);
    }

    .eyebrow {
      font-size: var(--riff-font-size-sm);
      font-weight: var(--riff-font-weight-semibold);
      color: var(--pg-color-accent);
    }

    .title {
      font-size: var(--riff-font-size-2xl);
      font-weight: var(--riff-font-weight-bold);
      line-height: var(--riff-line-height-tight);
      letter-spacing: -0.02em;

      @media (min-width: 48rem) {
        font-size: var(--riff-font-size-3xl);
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
  readonly eyebrow = input<string>();
  readonly description = input<string>();
}
