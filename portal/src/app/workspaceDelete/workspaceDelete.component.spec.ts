import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { MockDREApiCoreService } from 'src/app/services/dre-api-core-service.mock';
import { DREApiCoreService } from 'src/app/services/dre-api-core.service';
import { WorkspaceDeleteComponent } from './workspaceDelete.component';

describe('WorkspaceDeleteComponent', () => {
  const data = {
    workspaceName: 'Test-Workspace'
  };

  let component: WorkspaceDeleteComponent;
  let fixture: ComponentFixture<WorkspaceDeleteComponent>;
  let componentDreService: DREApiCoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceDeleteComponent ],
      imports: [ MatDialogModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule  ],
      providers: [ {
        provide: MAT_DIALOG_DATA,
        useValue: data
      }, {
        provide: DREApiCoreService,
        useClass: MockDREApiCoreService
      }, {
        provide: FormBuilder
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceDeleteComponent);
    component = fixture.componentInstance;
    componentDreService = fixture.debugElement.injector.get(DREApiCoreService);

    fixture.whenStable();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.workspaceForm.valid).toBeFalsy();
  });

  it('should correctly determine workspace name errors', () => {
    const control = component.workspaceForm.controls['workspaceNameControl'];
    control.setValue('%BAD PROJECT!%');
    expect(component.workspaceForm.valid).toBeFalsy();
    expect(control.valid).toBeFalsy();
  });

  it('should validate the workspace name correctly', () => {
    const control = component.workspaceForm.controls['workspaceNameControl'];
    control.setValue('Test-Workspace');
    expect(component.workspaceForm.valid).not.toBeFalsy();
  });

  it('should show submitted on valid deletion', () => {
    const control = component.workspaceForm.controls['workspaceNameControl'];
    control.setValue('Test-Workspace');

    component.deleteWorkspace();

    // Test js values
    expect(component.submitted).toBeTruthy();
    expect(component.error).toBeFalsy();

    // Test UI set correctly
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('#successAlert')).not.toBe(null);
    expect(el.querySelector('#errorAlert')).toBe(null);
    expect(el.querySelector('#cancelButton')).toBe(null);
    expect(el.querySelector('#submitButton')).toBe(null);
    expect(el.querySelector('#returnButton')).not.toBe(null);
  });

  it('should show error on service success = false', () => {
    spyOn(componentDreService, 'deleteWorkspace').and.returnValue(of({
      succeeded: false,
      message: '(mock) Error in Workspace deletion.'
    }));

    component.deleteWorkspace();

    // Test js values
    expect(component.submitted).toBeTruthy();
    expect(component.error).toBeTruthy();

    // Test UI set correctly
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('#successAlert')).toBe(null);
    expect(el.querySelector('#errorAlert')).not.toBe(null);
    expect(el.querySelector('#cancelButton')).toBe(null);
    expect(el.querySelector('#submitButton')).toBe(null);
    expect(el.querySelector('#returnButton')).not.toBe(null);
  });

  it('should show error on service HTTP error', () => {
    spyOn(componentDreService, 'deleteWorkspace').and.returnValue(
      throwError({status: 500})
    );

    component.deleteWorkspace();

    // Test js values
    expect(component.submitted).toBeTruthy();
    expect(component.error).toBeTruthy();

    // Test UI set correctly
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('#successAlert')).toBe(null);
    expect(el.querySelector('#errorAlert')).not.toBe(null);
    expect(el.querySelector('#cancelButton')).toBe(null);
    expect(el.querySelector('#submitButton')).toBe(null);
    expect(el.querySelector('#returnButton')).not.toBe(null);
  });
});
