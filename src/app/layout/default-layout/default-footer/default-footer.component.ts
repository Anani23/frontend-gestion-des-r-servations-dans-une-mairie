import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './default-footer.component.html',
  styleUrl: './default-footer.component.scss'
})
export class DefaultFooterComponent {}