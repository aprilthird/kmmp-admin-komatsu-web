import { FormGroup } from "@angular/forms";

export function getValues(form: FormGroup): string {
  let stringValue: string = "";
  Object.keys(form.controls).forEach((key: string, index: number) => {
    if (index > 0) {
      stringValue = stringValue + ("," + form.get(key).value);
    } else {
      stringValue = stringValue + form.get(key).value;
    }
  });
  return stringValue;
}

export function setEquiposData(form: FormGroup, currentEquipo: any): void {
  form.controls["modelo"].setValue(currentEquipo.modelo);
  form.controls["flota"].setValue(currentEquipo.flota);
  form.controls["tipo_equipo"].setValue(currentEquipo.tipoEquipo);
  form.controls["idModelo"].setValue(currentEquipo.idModelo);
  form.controls["idFlota"].setValue(currentEquipo.idFlota);
  form.controls["idTipoEquipo"].setValue(currentEquipo.idTipoEquipo);
  form.controls["modelo"].disable();
  form.controls["flota"].disable();
  form.controls["tipo_equipo"].disable();
}
