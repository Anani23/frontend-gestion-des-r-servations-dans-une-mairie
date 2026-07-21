import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaireComponent } from './maire.component';

describe('MaireComponent', () => {
  let component: MaireComponent;
  let fixture: ComponentFixture<MaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
