import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export function nameValidator(name: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != name) {
      let validationErrors: string[] = [];
      validationErrors.push("Doesn't match");
      return validationErrors;
    }
    return null;
  };
}
