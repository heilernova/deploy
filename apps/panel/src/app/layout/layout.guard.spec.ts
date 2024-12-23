import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { layoutGuard } from './layout.guard';

describe('layoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => layoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
