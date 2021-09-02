import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { MockDREApiCoreService } from 'src/app/services/dre-api-core-service.mock';
import { DREApiCoreService } from '../services/dre-api-core.service';
import { resourceCreateComponent } from './resourceCreate.component';


describe('resourceCreateComponent', () => {
  let component: resourceCreateComponent;
  let fixture: ComponentFixture<resourceCreateComponent>;
  let componentDreService: DREApiCoreService;
  const validEmail = 'me@myaddress.com';

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('DREApiCoreService', ['createWorkspace']);

    TestBed.configureTestingModule({
      imports: [NgxSpinnerModule, FormsModule, ReactiveFormsModule,
        RouterTestingModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [resourceCreateComponent],
      providers: [
        { provide: DREApiCoreService, useClass: MockDREApiCoreService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(resourceCreateComponent);
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

    expect(component.name.valid).toBeFalsy();
    let errors = component.name.errors || {};
    expect('required' in errors && errors.required).toBeTruthy();

    expect(component.addressSpace.valid).toBeFalsy();
    errors = component.addressSpace.errors || {};
    expect('required' in errors && errors.required).toBeTruthy();

    expect(component.administratorEmail.valid).toBeFalsy();
    errors = component.administratorEmail.errors || {};
    expect('required' in errors && errors.required).toBeTruthy();
  });

  // it('should correctly determine workspace name errors', () => {
  //   invalidWorkspaceNames.forEach(workspaceName => {
  //     component.name.setValue(workspaceName);
  //
  //     expect(component.workspaceForm.valid).toBeFalsy();
  //     expect(component.name.valid).toBeFalsy();
  //     const errors = component.name.errors || {};
  //     expect('pattern' in errors && errors.pattern).toBeTruthy();
  //   });
  // });

  // it('should allow valid workspace names', () => {
  //   validWorkspaceNames.forEach(workspaceName => {
  //     component.name.setValue(workspaceName);
  //
  //     expect(component.name.valid).toBeTruthy();
  //     const errors = component.name.errors || {};
  //     expect('pattern' in errors || errors.pattern).toBeFalsy();
  //   });
  // });

  // it('should correctly determine workspace address space errors', () => {
  //   invalidaddressSpaces.forEach(addressSpace => {
  //     component.addressSpace.setValue(addressSpace);
  //
  //     expect(component.workspaceForm.valid).toBeFalsy();
  //     expect(component.addressSpace.valid).toBeFalsy();
  //     const errors = component.addressSpace.errors || {};
  //     expect('pattern' in errors && errors.pattern).toBeTruthy();
  //   });
  // });

  // it('should allow valid workspace address spaces', () => {
  //   component.addressSpace.setValue(validaddressSpace);
  //
  //   expect(component.addressSpace.valid).toBeTruthy();
  //   const errors = component.addressSpace.errors || {};
  //   expect('pattern' in errors || errors.pattern).toBeFalsy();
  // });

  // it('should correctly determine workspace administrator email errors', () => {
  //   component.administratorEmail.setValue(invalidEmail);

  //   expect(component.workspaceForm.valid).toBeFalsy();
  //   expect(component.administratorEmail.valid).toBeFalsy();
  //   const errors = component.administratorEmail.errors || {};
  //   expect('pattern' in errors && errors.pattern).toBeTruthy();
  // });

  // it('should allow valid workspace administrator email', () => {
  //   component.administratorEmail.setValue(validEmail);

  //   expect(component.administratorEmail.valid).toBeTruthy();
  //   const errors = component.administratorEmail.errors || {};
  //   expect('pattern' in errors || errors.pattern).toBeFalsy();
  // });

  // it('should have valid form with correct values', () => {
  //   component.name.setValue(va[0]);
  //   component.addressSpace.setValue('10.0.0.1/16');
  //   component.administratorEmail.setValue(validEmail);

  //   expect(component.workspaceForm.valid).toBeTruthy();
  // });

  it('should show submitted on valid creation', () => {
    component.name.setValue('My Workspace');
    component.addressSpace.setValue('10.0.0.1/16');
    component.administratorEmail.setValue(validEmail);

    component.createWorkspace();

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
    spyOn(componentDreService, 'createWorkspace').and.returnValue(of({
      succeeded: false,
      message: '(mock) Error in Workspace creation.'
    }));

    component.createWorkspace();

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
    spyOn(componentDreService, 'createWorkspace').and.returnValue(
      throwError({ status: 500 })
    );

    component.createWorkspace();

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
