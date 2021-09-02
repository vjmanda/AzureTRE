import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DREApiCoreService } from './dre-api-core.service';
import { MockDREApiCoreService } from './dre-api-core-service.mock';
import { Workspace } from '../models/workspace';

describe('DREApiCoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      {
        provide: DREApiCoreService, useClass: MockDREApiCoreService
      }
    ]
  }));

  it('should be created', () => {
    const service: DREApiCoreService = TestBed.inject(DREApiCoreService);
    expect(service).toBeTruthy();
  });

  it('should return workspaces on calling getWorkspaces', () => {
    const service: DREApiCoreService = TestBed.inject(DREApiCoreService);

    let mockWorkspaces: Workspace[];
    let errorMessage: any;
    service.getWorkspaces().subscribe({
      next: workspaces => {
        mockWorkspaces = workspaces;
        expect(mockWorkspaces[0].displayName === 'p01').toBe(true);
        expect(mockWorkspaces[1].displayName === 'p02').toBe(true);
          },
      error: err => {
        errorMessage = err;
      }
    });
  });
});
