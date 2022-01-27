import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DispositivosService } from "../dispositivos.service";

@Component({
  selector: "app-dialog-edit-device",
  templateUrl: "./dialog-edit-device.component.html",
  styleUrls: ["./dialog-edit-device.component.scss"],
})
export class DialogEditDeviceComponent implements OnInit {
  nombre: FormControl = new FormControl(this.data?.nombre);
  isLoading: boolean;

  constructor(
    public matdialigRef: MatDialogRef<DialogEditDeviceComponent>,
    private dispositivosService: DispositivosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  editDevice(): void {
    this.isLoading = true;
    this.dispositivosService
      .postDispositivo({
        ...this.data,
        nombre: this.nombre.value,
        idDispositivo: this.data.id,
      })
      .subscribe(
        () => {
          this.isLoading = false;
          this.matdialigRef.close();
        },
        (err) => {
          this.isLoading = false;
          this.matdialigRef.close();
        }
      );
  }
}
