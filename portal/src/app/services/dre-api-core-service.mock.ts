import { Observable, of } from 'rxjs';
import { IDREApiCoreService } from '../interfaces/dre-api-core.interface';
import { resourceCreateRequest } from '../models/resourceCreateRequest';
import { resourceCreateRequestResponse } from '../models/resourceCreateResponse';
import { Workspace } from '../models/workspace';
import { WorkspaceDeleteRequestResponse } from '../models/workspaceDeleteResponse';


export class MockDREApiCoreService implements IDREApiCoreService {
    deleteWorkspaceResponse: resourceCreateRequestResponse = {
        succeeded: true,
        message: '(mock) Workspace is being deleted.'
    };
    createWorkspaceResponse: resourceCreateRequestResponse = {
        succeeded: true,
        message: '(mock) Workspace is being created.'
    };

    deleteWorkspace(name: string): Observable<WorkspaceDeleteRequestResponse> {
        return of(this.deleteWorkspaceResponse);
    }

    createWorkspace(workspaceRequest: resourceCreateRequest): Observable<resourceCreateRequestResponse> {
        return of(this.createWorkspaceResponse);
    }

    getWorkspaces(): Observable<Workspace[]> {

        const p1: Workspace = {
            displayName: 'p01',
            description: 'blah',
            workspaceId: '12ab'
        };

        const p2: Workspace = {
            displayName: 'p02',
            description: 'blah',
            workspaceId: '34ab'
        };

        return of<Workspace[]>(
            [p1, p2]
        );
    }
}
