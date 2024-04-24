import { TestBed } from '@angular/core/testing';

import { GlobalService } from './global.service';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });
});
