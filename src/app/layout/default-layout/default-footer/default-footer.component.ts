import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-footer',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './default-footer.component.html',
  styleUrl: './default-footer.component.scss'
})
export class DefaultFooterComponent {}