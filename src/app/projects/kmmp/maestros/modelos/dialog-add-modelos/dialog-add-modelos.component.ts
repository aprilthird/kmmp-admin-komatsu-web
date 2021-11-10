import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ModelosService } from "../modelos.service";

@Component({
  selector: "app-dialog-add-modelos",
  templateUrl: "./dialog-add-modelos.component.html",
  styleUrls: ["./dialog-add-modelos.component.scss"],
})
export class DialogAddModelosComponent implements OnInit {
  form: FormGroup;
  matErrorMsg = "Dato obligatorio";

  constructor(
    private modeloService: ModelosService,
    private fb: FormBuilder,
    public matdialigRef: MatDialogRef<DialogAddModelosComponent>
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", Validators.required),
      estado: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.modeloService.postModelo(this.form.value).subscribe((resp) => {
      console.log(resp);
    });
  }
}
