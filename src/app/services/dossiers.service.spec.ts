import { TestBed } from '@angular/core/testing';

import { DossiersService } from './dossiers.service';

describe('DossiersService', () => {
  let service: DossiersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossiersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
