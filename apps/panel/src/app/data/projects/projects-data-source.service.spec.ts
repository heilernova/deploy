import { TestBed } from '@angular/core/testing';

import { ProjectsDataSourceService } from './projects-data-source.service';

describe('ProjectsDataSourceService', () => {
  let service: ProjectsDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
