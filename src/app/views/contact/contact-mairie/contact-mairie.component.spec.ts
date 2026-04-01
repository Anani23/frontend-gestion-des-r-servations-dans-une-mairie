import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMairieComponent } from './contact-mairie.component';

describe('ContactMairieComponent', () => {
  let component: ContactMairieComponent;
  let fixture: ComponentFixture<ContactMairieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMairieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactMairieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
