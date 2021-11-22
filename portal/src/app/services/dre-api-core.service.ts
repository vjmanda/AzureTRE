import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Configuration } from '../models/configuration';
import { ResourceCreateResponse } from '../models/resourceCreateResponse';
import { Template } from '../models/template';
import { UserResource } from '../models/userResource';
import { UserResourceCreateRequest } from '../models/userResourceCreateRequest';
import { Workspace } from '../models/workspace';
import { WorkspaceCreateRequest } from '../models/workspaceCreateRequest';
import { WorkspaceDeleteRequestResponse } from '../models/workspaceDeleteResponse';
import { WorkspaceService } from '../models/workspaceService';
import { WorkspaceServiceCreateRequest } from '../models/workspaceServiceCreateRequest';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class DREApiCoreService {

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

  getWorkspaces(): Observable<Workspace[]> {
    console.log("getWorkspaces");
    const reqUri = `${this.configuration.api_uri}/workspaces`;
    console.log(reqUri);
    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getWorkspaces: ' + JSON.stringify(data));
          return data["workspaces"]
        }),
        catchError(this.handleError)
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

  getWorkspaceTemplates(): Observable<Template[]> {
    const reqUri = `${this.configuration.api_uri}/workspace-templates`;

    return this.http.get(reqUri)
      .pipe(
        map(data => {
          console.log('getWorkspaceTemplates Response: ' + JSON.stringify(data));
          return data["templates"]
        }),
        catchError(this.handleError)
      );
  }

  getWorkspaceTemplate(templateName: string): Observable<Template> {
    const reqUri = `${this.configuration.api_uri}/workspace-templates/${templateName}`;
    console.log("URI: " + reqUri);
    return this.http.get<Template>(reqUri)
      .pipe(
        tap(data => {
          console.log('getWorkspaceTemplate Response: ' + JSON.stringify(data));
        })
      );
  }

  deleteWorkspace(workspaceName: string): Observable<WorkspaceDeleteRequestResponse> {
    const uri = `${this.configuration.api_uri}/workspaces/${workspaceName}`;
    return this.http.delete(uri)
      .pipe(
        catchError(this.handleError),
        map(_ => {
          const resp = new WorkspaceDeleteRequestResponse();
          resp.succeeded = true;
          resp.message = 'Workspace is being deleted.';
          return resp;
        })
      );
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
