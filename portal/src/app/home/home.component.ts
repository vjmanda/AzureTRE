import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Configuration } from 'src/app/models/configuration';
import { Workspace } from 'src/app/models/workspace';
import { DREApiCoreService } from '../services/dre-api-core.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public workspaces: Array<Workspace>;
  private errorMessage: any;
  public currentWorkspace: Workspace;

  constructor(
    private router: Router,
    private dreApiCoreService: DREApiCoreService,
    private configuration: Configuration,
    public dialog: MatDialog,

    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    console.log('HomeComponent.ngOnInit');

    console.log("here");
    this.dreApiCoreService.getWorkspaces().subscribe({
      next: workspaces => {
        console.log('workspaces', workspaces);
        this.workspaces = workspaces;

      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }

  showSelectWorkspace() {
    this.currentWorkspace = null;
  }

  onWorkspaceSelected(workspace: Workspace) {
    this.router.navigateByUrl('/workspaces/' + workspace.id + '/')
  }
}
