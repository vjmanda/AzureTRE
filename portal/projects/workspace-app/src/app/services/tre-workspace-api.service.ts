import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Configuration } from 'src/app/models/configuration';
import { ResourceCreateResponse } from 'src/app/models/resourceCreateResponse';
import { Template } from 'src/app/models/template';
import { UserResource } from 'src/app/models/userResource';
import { UserResourceCreateRequest } from 'src/app/models/userResourceCreateRequest';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceCreateRequest } from 'src/app/models/workspaceCreateRequest';
import { WorkspaceDeleteRequestResponse } from 'src/app/models/workspaceDeleteResponse';
import { WorkspaceService } from 'src/app/models/workspaceService';
import { WorkspaceServiceCreateRequest } from 'src/app/models/workspaceServiceCreateRequest';
import { UUID } from 'angular2-uuid';

@Injectable()
export class TREWorkspaceApiService {

  constructor(private http: HttpClient, private configuration: Configuration) { }

  createWorkspace(resourceCreateRequest: WorkspaceCreateRequest): Observable<ResourceCreateResponse> {
    const uri = `${this.configuration.api_uri}/workspaces`;
    console.log(resourceCreateRequest);
    return this.http.post(uri, resourceCreateRequest)
      .pipe(
        catchError(this.handleError),
        map(_ => {
          const resp = new ResourceCreateResponse();
          resp.succeeded = true;
          resp.message = 'Workspace is being created.';
          return resp;
        })
      );
  }

  getWorkspace(workspace_id: UUID): Observable<Workspace> {
    const reqUri = `${this.configuration.api_uri}/workspaces/${workspace_id}`;

    return this.http.get<Workspace>(reqUri)
      .pipe(
        tap(data => {
          console.log('getWorkspace Response: ' + JSON.stringify(data));
        }));
  }



  // WORKSPACE SERVICES

  getWorkspaceServiceTemplate(templateName: string): Observable<Template> {
    const reqUri = `${this.configuration.api_uri}/workspace-service-templates/${templateName}`;
    console.log("URI: " + reqUri);
    return this.http.get<Template>(reqUri)
      .pipe(
        tap(data => {
          console.log('getWorkspaceServiceTemplate Response: ' + JSON.stringify(data));
        })
      );
  }

  getWorkspaceServiceTemplates(): Observable<Template[]> {
    const reqUri = `${this.configuration.api_uri}/workspace-service-templates`;

    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getWorkspaceServiceTemplates Response: ' + JSON.stringify(data));
          return data["templates"]
        }),
        catchError(this.handleError)
      );
  }

  createWorkspaceService(workspace: Workspace, workspaceServiceCreateRequest: WorkspaceServiceCreateRequest): Observable<ResourceCreateResponse> {
    const uri = `${this.configuration.api_uri}/workspaces/${workspace.id}/workspace-services`;
    console.log(uri);
    return this.http.post(uri, workspaceServiceCreateRequest)
      .pipe(
        catchError(this.handleError),
        map(_ => {
          const resp = new ResourceCreateResponse();
          resp.succeeded = true;
          resp.message = 'Workspace Service is being created.';
          return resp;
        })
      );
  }

  getWorkspaceServices(workspace: Workspace): Observable<WorkspaceService[]> {
    const reqUri = `${this.configuration.api_uri}/workspaces/${workspace.id}/workspace-services`;

    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getWorkspaceServices: ' + JSON.stringify(data));
          return data["workspaceServices"]
        }),
        catchError(this.handleError)
      );
  }

  // USER RESOURCE
  getUserResourceTemplate(workspaceServiceTemplateName: string, templateName: string): Observable<Template> {
    const reqUri = `${this.configuration.api_uri}/workspace-service-templates/${workspaceServiceTemplateName}/user-resource-templates/${templateName}`;
    console.log("URI: " + reqUri);
    return this.http.get<Template>(reqUri)
      .pipe(
        tap(data => {
          console.log('getUserResourceTemplate Response: ' + JSON.stringify(data));
        })
      );
  }

  getUserResourceTemplates(workspaceServiceTemplateName: string): Observable<Template[]> {
    const reqUri = `${this.configuration.api_uri}/workspace-service-templates/${workspaceServiceTemplateName}/user-resource-templates`;

    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getUserResourceTemplates Response: ' + JSON.stringify(data));
          return data["templates"]
        }),
        catchError(this.handleError)
      );
  }

  createUserResource(workspaceService: WorkspaceService, userResourceCreateRequest: UserResourceCreateRequest): Observable<ResourceCreateResponse> {
    const uri = `${this.configuration.api_uri}/workspaces/${workspaceService.workspaceId}/workspace-services/${workspaceService.id}/user-resources`;
    console.log(uri);
    return this.http.post(uri, userResourceCreateRequest)
      .pipe(
        catchError(this.handleError),
        map(_ => {
          const resp = new ResourceCreateResponse();
          resp.succeeded = true;
          resp.message = 'User Resource is being created.';
          return resp;
        })
      );
  }

  getUserResources(workspaceService: WorkspaceService): Observable<UserResource[]> {
    const reqUri = `${this.configuration.api_uri}/workspaces/${workspaceService.workspaceId}/workspace-services/${workspaceService.id}/user-resources`;

    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getUserResources: ' + JSON.stringify(data));
          return data["userResources"]
        }),
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    return throwError(error);
  }

}
