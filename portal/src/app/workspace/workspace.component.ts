import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Configuration } from 'src/app/models/configuration';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from '../models/workspaceService';
import { DREApiCoreService } from '../services/dre-api-core.service';
import { WorkspaceServiceCreateComponent } from '../workspaceServiceCreate/workspaceServiceCreate.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  public workspaceServices: Array<WorkspaceService>;
  private errorMessage: any;

  @Input() workspace: Workspace;

  public adminMode = false;

  public workspaceSelectVisible = false;

  constructor(

    private router: Router,
    private spinner: NgxSpinnerService,
    private dreApiCoreService: DREApiCoreService,
    private configuration: Configuration,
    public dialog: MatDialog,
  ) { }


  ngOnInit() {

    this.spinner.show();
    this.dreApiCoreService.getWorkspaceServices(this.workspace).subscribe({
      next: workspacesServices => {

        this.workspaceServices = workspacesServices;
        this.spinner.hide();
      },
      error: err => {
        this.errorMessage = err;
        this.spinner.hide();
      }
    });
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
