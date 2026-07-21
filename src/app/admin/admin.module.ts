import { CommonModule } from '@angular/common'; // nécessaire pour *ngIf et *ngFor
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // nécessaire pour [(ngModel)]

import { CreateServiceComponent } from './create-service/create-service.component';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
    ServicesComponent,
    CreateServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ServicesComponent,
    CreateServiceComponent
  ]
})
export class AdminModule { }