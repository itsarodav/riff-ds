import { Component, input, model } from '@angular/core';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

let nextId = 0;

/** Grupo de radios con aspecto de botones segmentados. */
@Component({
  selector: 'pg-segmented',
  template: `
    <fieldset class="segmented">
      <legend class="legend">{{ legend() }}</legend>
      @for (option of options(); track option.value) {
        <label class="option">
          <input
            type="radio"
            [name]="name"
            [value]="option.value"
            [checked]="value() === option.value"
            (change)="value.set(option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      }
    </fieldset>
  `,
  styles: `
    :host {
      display: block;
    }

    .segmented {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .legend {
      grid-column: 1 / -1;
      margin-bottom: var(--riff-space-1);
      padding: 0;
      font-size: var(--riff-font-size-xs);
      font-weight: var(--riff-font-weight-semibold);
      color: var(--pg-color-text-muted);
    }

    .option {
      grid-row: 2;
      position: relative;
      cursor: pointer;

      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      span {
        display: block;
        padding: calc(var(--riff-spacing-unit) * 1.5) var(--riff-space-3);
        border: 1px solid var(--pg-color-border);
        background: var(--pg-color-surface);
        font-size: var(--riff-font-size-sm);
        font-weight: var(--riff-font-weight-medium);
      }

      &:hover span {
        background: var(--pg-color-surface-hover);
      }

      &:first-of-type span {
        border-radius: var(--pg-radius-sm) 0 0 var(--pg-radius-sm);
      }

      &:last-of-type span {
        border-radius: 0 var(--pg-radius-sm) var(--pg-radius-sm) 0;
      }

      & + .option span {
        border-left: 0;
      }

      input:checked + span {
        background: var(--pg-color-accent);
        border-color: var(--pg-color-accent);
        color: var(--pg-color-on-accent);
      }

      input:focus-visible + span {
        outline: 2px solid var(--pg-color-focus);
        outline-offset: 2px;
      }
    }
  `,
})
export class Segmented<T extends string> {
  readonly legend = input.required<string>();
  readonly options = input.required<SegmentedOption<T>[]>();
  readonly value = model.required<T>();

  protected readonly name = `pg-segmented-${nextId++}`;
}
