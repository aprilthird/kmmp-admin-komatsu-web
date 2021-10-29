import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-filter-dialog",
  templateUrl: "./filter-dialog.component.html",
  styleUrls: ["./filter-dialog.component.scss"],
})
export class FilterDialogComponent implements OnInit {
  filters = Filters;

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<FilterDialogComponent>
  ) {
    this.form = this.fb.group({
      modelo: new FormControl(""),
      equipo: new FormControl(""),
      actividad: new FormControl(""),
      tipo_solicitud: new FormControl(""),
      estados: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  applyFilters(): void {
    this.matdialigRef.close();
  }

  wipeFilters(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key).setValue("");
    });
  }
}

const Filters = {
  modelo: [
    {
      id: "1",
      name: "FG66",
    },
    {
      id: "2",
      name: "8uhuj",
    },
  ],
  equipo: [
    {
      id: "1",
      name: "Sierra",
    },
    {
      id: "2",
      name: "Bujias",
    },
  ],
  actividad: [
    {
      id: "1",
      name: "Reparacion",
    },
    {
      id: "2",
      name: "Cambio de bujías",
    },
  ],
  tipo_solicitud: [
    {
      id: "1",
      name: "Consignación",
    },
    {
      id: "2",
      name: "Préstamo de taller",
    },
  ],
  estados: [
    {
      id: "1",
      name: "Nuevo",
    },
    {
      id: "2",
      name: "Usado",
    },
  ],
};
