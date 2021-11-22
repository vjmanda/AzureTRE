import { Injectable, Input, OnInit, SimpleChanges } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { createAjv } from '@jsonforms/core';
import { ErrorObject } from 'ajv';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DREApiCoreService } from 'src/app/services/dre-api-core.service';
import { Template } from '../models/template';

@Injectable()
export abstract class ResourceCreateComponent implements OnInit {

  renderers = [
    ...angularMaterialRenderers
  ];
  submitted = false;
  templateSelected = false;
  error = false;
  ajv = createAjv({
    schemaId: 'auto',
    allErrors: true,
    jsonPointers: true,
    errorDataPath: 'property',
    useDefaults: true
  });

  // uischema = JSON.stringify({
  //   "type": "VerticalLayout",
  //   "elements": [
  //     {
  //       "type": "Control",
  //       "scope": "#/properties/vm_size"
  //     }
  //   ]
  // });

  schema: Observable<Template>;

  resourceType: String;
  template: Template;
  templateButtonEnabled = false;
  createButtonEnabled = false;

  @Input() data: any;

  formData: object;

  constructor(public spinner: NgxSpinnerService //, public dreApi: DREApiCoreService
  ) { };

  ngOnInit() {
  }

  jsonFormsDataChanges(changes: SimpleChanges): void {
    this.formData = changes;
    if (!this.error) this.createButtonEnabled = true;
  }

  jsonFormsError(errors: ErrorObject[]): void {
    if (errors.length > 0) {
      this.error = true;
      this.createButtonEnabled = false;
    } else {
      this.error = false;
    }
  }

  // templateOptionChanged(event) {
  //   console.log(event);
  //   this.Template = event.value;
  //   if (event.value !== 'Select template') {
  //     this.templateButtonEnabled = true;
  //   } else {
  //     this.templateButtonEnabled = false;
  //   }
  // }
}
