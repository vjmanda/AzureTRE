import { TestBed } from '@angular/core/testing';

import { TreGuard } from './tre.guard';

describe('TreGuard', () => {
  let guard: TreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
