import { NgTemplateOutlet } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Card de navegación con tres niveles, como las de shadcn: página (canvas) →
 * card (surface) → contenedor de la ilustración (surface-sunken). Todo con
 * tokens semánticos del DS, así que claro y oscuro salen solos.
 *
 * - Con `href` es un enlace interno; sin él, un bloque estático.
 * - `soon` la marca como "próximamente": borde discontinuo y sin fondo.
 * - La ilustración se proyecta con el atributo `cardArt`. Puede usar
 *   --card-bg y --card-inner para fundirse con la card.
 *
 * <pg-card title="Color" description="…" href="/foundations/color">
 *   <pg-card-art cardArt kind="swatches" />
 * </pg-card>
 */
@Component({
  selector: 'pg-card',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly href = input<string | null>(null);
  readonly soon = input(false, { transform: booleanAttribute });
}
