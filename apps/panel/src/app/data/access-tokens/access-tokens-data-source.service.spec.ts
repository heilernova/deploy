import { TestBed } from '@angular/core/testing';

import { AccessTokensDataSourceService } from './access-tokens-data-source.service';

describe('AccessTokensDataSourceService', () => {
  let service: AccessTokensDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessTokensDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
