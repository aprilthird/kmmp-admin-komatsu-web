import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FuseConfirmationService } from "@fuse/services/confirmation";

import { EditarFormatoService } from "../../../editar-formato/editar-formato.service";
import { SectionsComponent } from "../sections.component";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
})
export class GroupsComponent implements OnInit {
  @Input() groupData: any;
  isLoading: boolean;
  rowsOfGrid = [];
  edit: boolean;
  @ViewChild("nameInput") el: ElementRef;

  constructor(
    private _editFormat: EditarFormatoService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _groups: SectionsComponent
  ) {}

  ngOnInit(): void {}

  deleteGroup(): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: "Eliminar Grupo",
      message: "¿Estás seguro que deseas eliminar este Grupo?",
      icon: {
        name: "heroicons_outline:trash",
      },
      actions: {
        confirm: {
          label: "Sí, eliminar",
        },
        cancel: {
          label: "No",
        },
      },
      dismissible: true,
    });

    dialogRef.beforeClosed().subscribe((result) => {
      console.log(result);
      if (result === "confirmed") {
        this.isLoading = true;
        this._editFormat
          .createGrupo({
            ...this.groupData,
            activo: false,
          })
          .subscribe(() => {
            this._groups.loadGrupos();
          });
      }
    });
  }

  editGroup(): void {
    this.edit = true;
    setTimeout(() => {
      this.el.nativeElement.select();
    });
  }

  save(): void {
    this._editFormat
      .createGrupo({
        ...this.groupData,
        nombre: this.el.nativeElement.value,
      })
      .subscribe(() => {
        this.edit = false;
        this.groupData.nombre = this.el.nativeElement.value;
        this._groups.loadGrupos();
      });
  }
}
