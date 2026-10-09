import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'pg-home',
  imports: [PageHeader, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
