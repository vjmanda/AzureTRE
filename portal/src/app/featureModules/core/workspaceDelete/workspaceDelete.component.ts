import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { TREApiService } from 'src/app/services/tre-api.service';
import { nameValidator } from './nameValidator';

@Component({
  templateUrl: './workspaceDelete.component.html',
  styleUrls: ['./workspaceDelete.component.css'],
})
export class WorkspaceDeleteComponent implements OnInit {
  public workspaceName: string;
  workspaceForm: FormGroup;

  submitted = false;
  error = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    public formBuilder: FormBuilder,
    private dreApi: TREApiService
  ) {}

  public get form() {
    return this.workspaceForm.controls;
  }

  @ViewChild('name') nameField: ElementRef;

  ngOnInit() {
    this.workspaceName = this.data.workspaceName;
    this.workspaceForm = this.formBuilder.group({
      workspaceNameControl: new FormControl('', [
        nameValidator(this.workspaceName),
      ]),
    });
  }

  deleteWorkspace() {

    this.submitted = true;

    if (this.workspaceForm.invalid) {
      this.error = true;

      return;
    }
    this.dreApi.deleteWorkspace(this.workspaceName).subscribe(
      result => {
      if (result.succeeded) {
        console.log(`Deleteworkspace result: ${result.succeeded}`);
        console.log(`message returned is: ${result.message}`);
      } else {
        this.error = true;
      }


    },
    _ => {
      this.error = true;

    }
    );
  }
}

