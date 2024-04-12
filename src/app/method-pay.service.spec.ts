import { TestBed } from '@angular/core/testing';

import { MethodPayService } from './method-pay.service';

describe('MethodPayService', () => {
  let service: MethodPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MethodPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
