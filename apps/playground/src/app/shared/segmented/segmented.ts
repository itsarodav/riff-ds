import { Component, booleanAttribute, input, model } from '@angular/core';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

let nextId = 0;

/**
 * Grupo de radios con aspecto de control segmentado neutro (estilo tabs de
 * shadcn): carril de fondo y la opción elegida elevada sobre él.
 * Con `legendHidden` la leyenda solo la oyen los lectores de pantalla (útil
 * para alinear el control con otros elementos de una fila).
 */
@Component({
  selector: 'pg-segmented',
  template: `
    <fieldset class="segmented">
      <legend class="legend" [class.pg-sr-only]="legendHidden()">{{ legend() }}</legend>
      <div class="track">
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
      </div>
    </fieldset>
  `,
  styles: `
    :host {
      display: block;
    }

    .segmented {
      margin: 0;
      padding: 0;
      border: 0;
    }

    .legend {
      margin-bottom: var(--riff-space-1);
      padding: 0;
      font-size: var(--riff-font-size-xs);
      font-weight: var(--riff-font-weight-semibold);
      color: var(--pg-color-text-muted);
    }

    .track {
      display: inline-grid;
      grid-auto-flow: column;
      gap: 2px;
      padding: 3px;
      border-radius: var(--pg-radius-sm);
      background: var(--pg-color-segmented-track);
    }

    .option {
      position: relative;
      cursor: pointer;

      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      span {
        display: block;
        padding: var(--riff-space-1) var(--riff-space-3);
        border-radius: calc(var(--pg-radius-sm) - 2px);
        font-size: var(--riff-font-size-sm);
        font-weight: var(--riff-font-weight-medium);
        color: var(--pg-color-text-muted);
        transition:
          background-color 150ms,
          color 150ms,
          box-shadow 150ms;
      }

      &:hover span {
        color: var(--pg-color-text);
      }

      input:checked + span {
        background: var(--pg-color-segmented-thumb);
        color: var(--pg-color-text);
        box-shadow:
          0 1px 2px rgb(0 0 0 / 0.08),
          0 1px 1px rgb(0 0 0 / 0.04);
      }

      input:focus-visible + span {
        outline: 2px solid var(--pg-color-focus);
        outline-offset: 1px;
      }
    }
  `,
})
export class Segmented<T extends string> {
  readonly legend = input.required<string>();
  readonly legendHidden = input(false, { transform: booleanAttribute });
  readonly options = input.required<SegmentedOption<T>[]>();
  readonly value = model.required<T>();

  protected readonly name = `pg-segmented-${nextId++}`;
}
