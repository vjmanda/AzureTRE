import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Configuration } from 'src/app/models/configuration';
import { Workspace } from 'src/app/models/workspace';
import { DREApiCoreService } from '../services/dre-api-core.service';
import { WorkspaceCreateComponent } from '../workspaceCreate/workspaceCreate.component';
import { WorkspaceDeleteComponent } from '../workspaceDelete/workspaceDelete.component';

@Component({
  selector: 'app-workspace-select',
  templateUrl: './workspaceSelect.component.html',
  styleUrls: ['./workspaceSelect.component.css']
})
export class WorkspaceSelectComponent implements OnInit {

  public workspaces: Array<Workspace>;
  private errorMessage: any;

  @Input() workspaceSelect: any;

  @Output() workspaceSelected = new EventEmitter<Workspace>()

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private dreApiCoreService: DREApiCoreService,
    private configuration: Configuration,
    public dialog: MatDialog,

    private httpClient: HttpClient
  ) { }

  ngOnInit() {

    this.spinner.show();
    this.dreApiCoreService.getWorkspaces().subscribe({
      next: workspaces => {

        this.workspaces = workspaces;
        this.spinner.hide();
      },
      error: err => {
        this.errorMessage = err;
        this.spinner.hide();
      }
    });
  }


  selectWorkspace(workspace: Workspace) {
    if (workspace.deployment.status != 'failed') {
      this.workspaceSelected.emit(workspace);
    }

  }

  openCreateWorkspaceDialog() {
    const dialogRef = this.dialog.open(WorkspaceCreateComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDeleteWorkspaceDialog(workspaceName) {
    const dialogRef = this.dialog.open(WorkspaceDeleteComponent, {
      data: {
        workspaceName
      },
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
