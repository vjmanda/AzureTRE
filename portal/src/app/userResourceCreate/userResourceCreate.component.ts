import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import schemaAsset from '../../assets/test_schema.json';
import { Template } from '../models/template';
import { UserResourceCreateRequest } from '../models/userResourceCreateRequest';
import { WorkspaceService } from '../models/workspaceService';
import { resourceCreateComponent } from '../resourceCreate/resourceCreate.component';
import { DREApiCoreService } from '../services/dre-api-core.service';

@Component({
    selector: 'app-user-resource-create',
    templateUrl: '../resourceCreate/resourceCreate.component.html',
    styleUrls: ['../resourceCreate/resourceCreate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserResourceCreateComponent extends resourceCreateComponent {

    constructor(public dialogRef: MatDialogRef<UserResourceCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public currentWorkspaceService: WorkspaceService,
        public spinner: NgxSpinnerService, public dreApi: DREApiCoreService) {
        super(spinner, dreApi);
    }

    schema: Observable<Template>;


    templates$: Observable<Template[]> = this.dreApi.getUserResourceTemplates(this.currentWorkspaceService.templateName)
        .pipe(map(templates => templates));


    selectTemplate(template: Template) {
        this.template = template;
        console.log('Template selected' + this.template);
        // this.schema = this.dreApi.getUserResourceTemplate(this.currentWorkspaceService.templateName, template.name);
        let tmptemplate = new Template()
        tmptemplate.properties = schemaAsset.properties;
        this.schema = new Observable(observer => {
            observer.next(tmptemplate)
            observer.complete()
        })


        console.log("Schema:" + JSON.stringify(this.schema));
        this.templateSelected = true;
    }

    createResource() {
        this.spinner.show();

        if (this.formData == null) this.formData = {};

        this.ajv.validate(this.schema, this.formData);

        if (this.ajv.errors) {
            console.log(this.ajv.errors);
            this.spinner.hide();
            return;
        }

        this.submitted = true;
        const req: UserResourceCreateRequest = {
            templateName: this.template.name,
            properties: this.formData
        };
        console.log(this.formData);

        console.log(this.currentWorkspaceService);

        this.dreApi.createUserResource(this.currentWorkspaceService, req).subscribe(
            (result) => {
                if (result.succeeded) {
                    console.log(`creatUserResource result: ${result.succeeded}`);
                    console.log(`message returned is: ${result.message}`);
                } else {
                    console.log(`message returned is: ${result}`);
                    this.error = true;
                }

                this.spinner.hide();
            },
            (_) => {
                this.error = true;
                this.spinner.hide();
            }
        );
    }
}
