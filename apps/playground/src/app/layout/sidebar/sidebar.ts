import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PAGES, SECTIONS } from '../../pages';

@Component({
  selector: 'pg-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly sections = SECTIONS.map((section) => ({
    ...section,
    pages: PAGES.filter((page) => page.section === section.id),
  }));
}
