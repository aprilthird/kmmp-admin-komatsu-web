import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EditarFormatoService } from "../../editar-formato/editar-formato.service";

@Component({
  selector: "app-dialog-add-comment",
  templateUrl: "./dialog-add-comment.component.html",
  styleUrls: ["./dialog-add-comment.component.scss"],
})
export class DialogAddCommentComponent implements OnInit {
  comment = new FormControl("", Validators.required);
  constructor(
    public matDialog: MatDialogRef<DialogAddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _editarFormatoService: EditarFormatoService
  ) {}

  ngOnInit(): void {}

  async updateObservedParam() {
    /*return this.data.group.parametros.map((parametro: any, index: number) => {
      if (index === this.data.index) {
        return (parametro.observado = this.comment.value);
      }
    });*/

    return this.data.data.secciones[0].grupos[
      this.data.groupIndex
    ].parametros.map((parametro: any, index: number) => {
      if (index === this.data.paramIndex) {
        parametro.comentarios = this.comment.value;
        parametro.observar = true;
      }
    });
  }

  async submit() {
    await this.updateObservedParam();
    console.log("data observada", this.data);
    this.matDialog.close();
    this._editarFormatoService
      .saveAssignation(this.data.data)
      .subscribe((resp) => this.matDialog.close());
  }
}
