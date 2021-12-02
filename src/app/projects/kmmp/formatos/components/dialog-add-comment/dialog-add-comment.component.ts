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
    return this.data.group.parametros.map((parametro: any, index: number) => {
      if (index === this.data.index) {
        return (parametro.observado = this.comment.value);
      }
    });
  }

  async submit() {
    await this.updateObservedParam();
    this.matDialog.close();
    /*this._editarFormatoService
      .createDato(this.data.group)
      .subscribe((resp) => this.matDialog.close());*/
  }
}
