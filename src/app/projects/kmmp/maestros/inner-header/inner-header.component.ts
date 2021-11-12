import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { BahiasService } from "../bahias/bahias.service";
import { ClaseActividadService } from "../clase-actividad/clase-actividad.service";
import { EquiposService } from "../equipos/equipos.service";
import { FlotasService } from "../flotas/flotas.service";
import { MaestrosService } from "../maestros.service";
import { ModelosService } from "../modelos/modelos.service";
import { TipoEquiposService } from "../tipo-equipos/tipo-equipos.service";

@Component({
  selector: "app-inner-header",
  templateUrl: "./inner-header.component.html",
  styleUrls: ["./inner-header.component.scss"],
})
export class InnerHeaderComponent implements OnInit {
  @Output() text: EventEmitter<string> = new EventEmitter(null);
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter(null);
  @Input() type: string;
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  selectedUser = null;

  constructor(
    private cliente: MaestrosService,
    private bahia: BahiasService,
    private equipo: EquiposService,
    private claseActividadService: ClaseActividadService,
    private flotasService: FlotasService,
    private modelosService: ModelosService,
    private tipoEquiposService: TipoEquiposService
  ) {}

  ngOnInit(): void {
    this.searchFilter();
  }
  filterByQuery(e): void {}

  searchFilter(): void {
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          console.log(query);
          console.log(this.type);
          //this.closeDetails();
          this.isLoading.emit(true);
          return this.setFilterData(this.type, query);
        }),
        map(() => {
          this.isLoading.emit(false);
        })
      )
      .subscribe();
  }

  setFilterData(param, query) {
    switch (param) {
      case "clientes":
        return this.cliente.getClients({ nombre: query });
      case "equipos":
        return this.equipo.getEquipos({ nombre: query });
      case "bahias":
        return this.bahia.getBahias({ nombre: query });

      case "tipos_equipos":
        return this.tipoEquiposService.getTipoEquipos({ nombre: query });
      case "modelos":
        return this.modelosService.getModelos({ nombre: query });
      case "flotas":
        return this.flotasService.getFlotas({ nombre: query });

      case "clase_actividades":
        return this.claseActividadService.getClaseActividad({ nombre: query });

      default:
        return [];
    }
  }
}
