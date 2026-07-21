import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienMairieComponent } from './bien-mairie.component';

describe('BienMairieComponent', () => {
  let component: BienMairieComponent;
  let fixture: ComponentFixture<BienMairieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BienMairieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienMairieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
