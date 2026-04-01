import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDossiersComponent } from './liste-dossiers.component';

describe('ListeDossiersComponent', () => {
  let component: ListeDossiersComponent;
  let fixture: ComponentFixture<ListeDossiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeDossiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
