import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/models/configuration';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from '../../../models/workspaceService';
import { TREWorkspaceApiService } from '../services/tre-workspace-api.service';
import { WorkspaceServiceCreateComponent } from '../workspaceServiceCreate/workspaceServiceCreate.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  public workspaceServices: Array<WorkspaceService>;
  private errorMessage: any;
  public workspace: Workspace;
  private workspace_id: string;

  public adminMode = false;
  public workspaceSelectVisible = false;

  constructor(

    private route: ActivatedRoute,

    private dreApiCoreService: TREWorkspaceApiService,
    private configuration: Configuration,
    public dialog: MatDialog,
  ) {
    this.workspace_id = this.route.snapshot.params.workspace_id;
  }


  ngOnInit() {
    console.log('workspace.component.ts: ngOnInit ' + this.workspace_id);


    this.dreApiCoreService.getWorkspace(this.workspace_id).subscribe({
      next: workspace => {
        this.workspace = workspace['workspace'];
        console.log(this.workspace);
        this.dreApiCoreService.getWorkspaceServices(this.workspace).subscribe({
          next: workspaceServices => {

            console.log(this.workspace);
            this.workspaceServices = workspaceServices;
          },
          error: err => {
            this.errorMessage = err;
          }
        });
      },
      error: err => {
        this.errorMessage = err;
      }
    }
    );
  }

  openCreateWorkspaceServiceDialog() {
    const dialogRef = this.dialog.open(WorkspaceServiceCreateComponent, {
      width: '1000px',
      data: this.workspace
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
