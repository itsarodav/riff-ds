import { Component, input } from '@angular/core';

export type CardArtKind = 'layers' | 'code' | 'timeline' | 'swatches' | 'modes' | 'soon';

/**
 * Ilustraciones de las cards de la portada, hechas con tokens y sin imágenes.
 * Van dentro de <pg-card> y usan sus --card-bg y --card-inner.
 */
@Component({
  selector: 'pg-card-art',
  templateUrl: './card-art.html',
  styleUrl: './card-art.scss',
})
export class CardArt {
  readonly kind = input.required<CardArtKind>();
}
