import { TestBed } from '@angular/core/testing';

import { CsrfTokenService } from './csrf-token-service.service';

describe('CsrfTokenServiceService', () => {
  let service: CsrfTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrfTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
