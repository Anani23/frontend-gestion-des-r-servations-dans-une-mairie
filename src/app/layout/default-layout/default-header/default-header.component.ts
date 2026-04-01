import { Component, OnInit } from '@angular/core';
import {
  ContainerComponent,
  HeaderBrandComponent,
  HeaderComponent
} from '@coreui/angular';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [HeaderComponent, ContainerComponent, HeaderBrandComponent],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss'
})
export class DefaultHeaderComponent implements OnInit {

  userName: string = '';
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.role = this.authService.getRole();
  }

}