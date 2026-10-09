import { Component, booleanAttribute, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Logo } from '../../shared/logo/logo';
import { Segmented, SegmentedOption } from '../../shared/segmented/segmented';
import { AUTHOR_URL, NAV_LINKS, REPO_URL } from '../../shared/site';
import { ThemeMode, ThemeService } from '../../theme/theme';

/**
 * Footer de todo el sitio, en dos bloques: el principal (logo, enlaces y tema)
 * y la firma. Quien lo usa marca el ancho del contenido (sin padding) con --footer-max.
 * En el shell el selector de tema ya está en el sidebar: ahí se oculta con
 * [themeSwitch]="false".
 */
@Component({
  selector: 'pg-footer',
  imports: [RouterLink, Logo, Segmented],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly theme = inject(ThemeService);

  readonly themeSwitch = input(true, { transform: booleanAttribute });

  protected readonly nav = NAV_LINKS;
  protected readonly repoUrl = REPO_URL;
  protected readonly authorUrl = AUTHOR_URL;

  protected readonly themeOptions: SegmentedOption<ThemeMode>[] = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];
}
