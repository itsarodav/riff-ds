import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PAGES, SECTIONS } from '../../pages';
import { Segmented, SegmentedOption } from '../../shared/segmented/segmented';
import { ThemeMode, ThemeService } from '../../theme/theme';

@Component({
  selector: 'pg-sidebar',
  imports: [RouterLink, RouterLinkActive, Segmented],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly theme = inject(ThemeService);

  protected readonly sections = SECTIONS.map((section) => ({
    ...section,
    pages: PAGES.filter((page) => page.section === section.id),
  }));

  protected readonly themeOptions: SegmentedOption<ThemeMode>[] = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];
}
