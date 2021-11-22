import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Workspace } from 'src/app/models/workspace';
import { UserResource } from '../../../../../src/app/models/userResource';
import { WorkspaceService } from '../../../../../src/app/models/workspaceService';
import { TREWorkspaceApiService } from '../services/tre-workspace-api.service';

import { UserResourceCreateComponent } from '../userResourceCreate/userResourceCreate.component';

@Component({
  selector: 'app-workspace-service',
  templateUrl: './workspaceService.component.html',
  styleUrls: ['./workspaceService.component.css']
})
export class WorkspaceServiceComponent implements OnInit {

  private errorMessage: any;
  @Input() workspaceService: WorkspaceService;
  @Input() adminMode: boolean;

  public userResources: Array<UserResource>;

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private dreApi: TREWorkspaceApiService,
  ) { }

  public hasUserResourceTemplates = false;


  ngOnInit() {
    this.dreApi.getUserResourceTemplates(this.workspaceService.templateName)
      .subscribe(templates => { if (templates.length > 0) this.hasUserResourceTemplates = true; });

    this.dreApi.getUserResources(this.workspaceService).subscribe({
      next: userResources => {
        console.log(userResources);
        this.userResources = userResources;
      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }

  openCreateUserResourceDialog() {
    const dialogRef = this.dialog.open(UserResourceCreateComponent, {
      width: '1000px',
      data: this.workspaceService
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }
}
