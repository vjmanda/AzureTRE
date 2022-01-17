import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Template } from 'src/app/models/template';
import { UserResourceCreateRequest } from 'src/app/models/userResourceCreateRequest';
import { Workspace } from 'src/app/models/workspace';
import { WorkspaceService } from 'src/app/models/workspaceService';
import { ResourceCreateComponent } from 'src/app/resourceCreate/resourceCreate.component';
import { TREWorkspaceApiService } from '../services/old_tre-workspace-api.service';

@Component({
  selector: 'app-user-resource-create',
  templateUrl: '../../../resourceCreate/resourceCreate.component.html',
  styleUrls: ['../../../resourceCreate/resourceCreate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserResourceCreateComponent extends ResourceCreateComponent {


  schema: Observable<Template>;
  resourceType = "User Resource";
  templates$: Observable<Template[]> = this.treApi.getUserResourceTemplates(this.currentWorkspaceService.templateName)
    .pipe(map(templates => templates));

  constructor(public dialogRef: MatDialogRef<UserResourceCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public currentWorkspaceService: WorkspaceService,
    public treApi: TREWorkspaceApiService) {
      super();
    }


  ngOnInit(): void {
  }


  selectTemplate(template: Template) {
    this.template = template;
    console.log('Template selected' + this.template);
    this.schema = this.treApi.getUserResourceTemplate(this.currentWorkspaceService.templateName, template.name);
    this.templateSelected = true;

  }

  createResource() {
    if (this.formData == null) this.formData = {};

    this.ajv.validate(this.schema, this.formData);

    if (this.ajv.errors) {
      console.log(this.ajv.errors);
      return;
    }

    this.submitted = true;
    const req: UserResourceCreateRequest = {
      templateName: this.template.name,
      properties: this.formData
    };
    console.log(this.formData);

    console.log(this.currentWorkspaceService);

    this.treApi.createUserResource(this.currentWorkspaceService, req).subscribe(
      (result) => {
        if (result.succeeded) {
          console.log(`creatUserResource result: ${result.succeeded}`);
          console.log(`message returned is: ${result.message}`);
        } else {
          console.log(`message returned is: ${result}`);
          this.error = true;
        }


      },
      (_) => {
        this.error = true;

      }
    );
  }
}
