import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ContainerComponent,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarNavComponent
} from '@coreui/angular';

import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';

import { AuthService } from '../../services/auth.service';
import { adminNav, agentNav, citoyenNav, publicNav } from './nav';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ContainerComponent,
    SidebarComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    DefaultHeaderComponent,
    DefaultFooterComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  // ✅ On concatène tous les menus
  navItems: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.navItems = [...publicNav, ...citoyenNav, ...agentNav, ...adminNav];
  }
}