import { TestBed } from '@angular/core/testing';

import { OreService } from './ore.service';

describe('OreService', () => {
  let service: OreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
