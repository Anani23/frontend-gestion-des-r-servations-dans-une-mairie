import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienParCategorieComponent } from './bien-par-categorie.component';

describe('BienParCategorieComponent', () => {
  let component: BienParCategorieComponent;
  let fixture: ComponentFixture<BienParCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BienParCategorieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienParCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
