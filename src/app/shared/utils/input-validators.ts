import { InputValidators } from "../config/input-validator.config";

export function InputValidator(errors): string {
  if (errors?.email) {
    return InputValidators.errorOutput.EMAIL;
  } else if (
    errors?.pattern &&
    errors?.pattern?.requiredPattern === InputValidators.DNI_PATTERN
  ) {
    return InputValidators.errorOutput.DNI;
  } else if (
    errors?.minlength?.requiredLength ||
    errors?.maxlength?.requiredLength
  ) {
    if (this.fieldData.errors?.minlength) {
      return (
        InputValidators.errorOutput.MIN +
        errors?.minlength?.requiredLength +
        InputValidators.errorOutput.ALLOWED
      );
    } else if (this.fieldData.errors?.maxlength) {
      return (
        InputValidators.errorOutput.MAX +
        errors?.maxlength?.requiredLength +
        InputValidators.errorOutput.ALLOWED
      );
    }
  }
}
