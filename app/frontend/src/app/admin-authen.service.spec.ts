import { TestBed, inject } from '@angular/core/testing';

import { AdminAuthenService } from './admin-authen.service';

describe('AdminAuthenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthenService]
    });
  });

  it('should be created', inject([AdminAuthenService], (service: AdminAuthenService) => {
    expect(service).toBeTruthy();
  }));
});
