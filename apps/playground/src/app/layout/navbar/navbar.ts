import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Logo } from '../../shared/logo/logo';
import { NAV_LINKS, REPO_URL } from '../../shared/site';

/**
 * Navbar de todo el sitio: portada y shell (encima del sidebar y el contenido).
 * El ancho del contenido lo marca quien lo usa con --navbar-max (por defecto,
 * todo el ancho). Lo que se proyecte va al final, a la derecha: en el shell,
 * el botón que abre el sidebar en pantallas pequeñas.
 */
@Component({
  selector: 'pg-navbar',
  imports: [RouterLink, RouterLinkActive, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly nav = NAV_LINKS;
  protected readonly repoUrl = REPO_URL;
}
