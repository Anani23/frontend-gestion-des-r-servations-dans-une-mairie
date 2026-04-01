import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRdvComponent } from './gestion-rdv.component';

describe('GestionRdvComponent', () => {
  let component: GestionRdvComponent;
  let fixture: ComponentFixture<GestionRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
