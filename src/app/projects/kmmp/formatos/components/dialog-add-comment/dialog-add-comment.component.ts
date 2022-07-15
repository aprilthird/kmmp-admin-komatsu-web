import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Response } from "app/shared/models/general-model";
import { EditarFormatoService } from "../../editar-formato/editar-formato.service";

@Component({
  selector: "app-dialog-add-comment",
  templateUrl: "./dialog-add-comment.component.html",
  styleUrls: ["./dialog-add-comment.component.scss"],
})
export class DialogAddCommentComponent implements OnInit {
  comment = new FormControl(this.data?.comment, Validators.required);
  @Output() respCommetRequest: EventEmitter<Response> = new EventEmitter(null);
  loading: boolean;

  constructor(
    public matDialog: MatDialogRef<DialogAddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _editarFormatoService: EditarFormatoService
  ) {}

  ngOnInit(): void {}

  async updateObservedParam() {
    return this.data.data.secciones.map((section: any) => {
      if (section.id === Number(this.data.sectionId)) {
        return section.grupos.map((group: any, index: number) => {
          if (index === Number(this.data.groupIndex)) {
            return group.parametros.map((parametro: any, index: number) => {
              if (index === this.data.paramIndex) {
                parametro.comentarios = this.comment.value;
                parametro.observar = true;
                parametro.corregido = false;
              }
            });
          }
        });
      }
    });
  }

  async submit() {
    this.loading = true;
    await this.updateObservedParam();

    this._editarFormatoService.saveAssignation(this.data.data).subscribe(
      (resp) => {
        this.matDialog.close();
        this.loading = false;
        this.respCommetRequest.emit(resp);
      },
      (err) => {
        this.matDialog.close();
        this.loading = false;
        this.respCommetRequest.emit(err);
      }
    );
  }
}
