import { TestBed } from '@angular/core/testing';

import { CategorieBienService } from './categorie-bien.service';

describe('CategorieBienService', () => {
  let service: CategorieBienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieBienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
