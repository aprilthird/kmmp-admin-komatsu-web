import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DocumentosService } from "../documentos.service";

@Component({
  selector: "app-dialog-add-documentos",
  templateUrl: "./dialog-add-documentos.component.html",
  styleUrls: ["./dialog-add-documentos.component.scss"],
})
export class DialogAddDocumentosComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";
  isEdit: boolean;
  documentId: number;
  initData: any;
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddDocumentosComponent>,
    private documentService: DocumentosService
  ) {
    if (this.data) {
      this.isEdit = true;
      this.initData = this.data;
      this.documentId = this.data.id;
    }

    this.form = this.fb.group({
      nombre: new FormControl(this.initData?.nombre, [Validators.required]),
      cliente: new FormControl(this.initData?.cliente),
      modelo: new FormControl(this.initData?.modelo, Validators.required),
      actividad: new FormControl(this.initData?.actividad, Validators.required),
      tipo_mantenimiento: new FormControl(
        this.initData?.tipoMantenimiento,
        Validators.required
      ),
      documento: new FormControl(this.initData?.documento, Validators.required),
      estado: new FormControl(this.initData?.nestado === "Activo" ? 1 : 0),
      //HARDCODED
      idCliente: new FormControl(2),
      mime: new FormControl("documento"),
      ruta: new FormControl("/admin/maestros/agregar_documentos"),
      entidad: new FormControl(0),
      documentosList: new FormControl([]),
      idModelo: new FormControl(2),
      idActividad: new FormControl(2),
      idTipoMantenimiento: new FormControl(2),
    });
  }

  ngOnInit(): void {}

  submit(isEdit): void {
    this.isLoading = true;

    if (isEdit) {
      this.form.addControl("id", new FormControl(this.documentId));
    }

    this.documentService.postDocumento(this.form.value).subscribe((resp) => {
      setTimeout(() => {
        this.isLoading = false;
        this.matdialigRef.close();
      }, 1000);
    });
  }

  check(event): void {
    setTimeout(() => {
      this.form.controls["estado"].setValue(event.checked ? 1 : 0);
    }, 200);
  }
}
