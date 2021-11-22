import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkspaceCreateRequest } from 'src/app/models/workspaceCreateRequest';
import { Template } from '../models/template';
import { ResourceCreateComponent } from '../resourceCreate/resourceCreate.component';
import { DREApiCoreService } from '../services/dre-api-core.service';


@Component({
    selector: 'app-workspace-create',
    templateUrl: '../resourceCreate/resourceCreate.component.html',
    styleUrls: ['../resourceCreate/resourceCreate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkspaceCreateComponent extends ResourceCreateComponent {


    schema: Observable<Template>;
    resourceType = "Workspace";
    templates$: Observable<Template[]> = this.dreApi.getWorkspaceTemplates()
        .pipe(map(templates => templates));

    constructor(public spinner: NgxSpinnerService, public dreApi: DREApiCoreService) {
        super(spinner);
    }


    selectTemplate(template: Template) {
        this.template = template;
        console.log('Template selected' + this.template);
        this.schema = this.dreApi.getWorkspaceTemplate(template.name);
        console.log("Schema:" + JSON.stringify(this.schema));
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
        const req: WorkspaceCreateRequest = {
            templateName: this.template.name,
            properties: this.formData
        };
        console.log(this.formData);

        this.dreApi.createWorkspace(req).subscribe(
            (result) => {
                if (result.succeeded) {
                    console.log(`createWorkspace result: ${result.succeeded}`);
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
