import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MaestrosService } from "../../maestros/maestros.service";
import { CrearUsuarioService } from "./crear-usuario.service";

interface Perfil {
  id: string;
  nombre: string;
  activo: boolean;
  visible: boolean;
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map((control) => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => (next ? prev + next : prev), 0);

    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}

@Component({
  selector: "app-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.scss"],
})
export class CrearUsuarioComponent implements OnInit {
  isEdit: boolean = false;
  loading$: Observable<boolean>;
  alert: any;
  clients = [];

  perfiles: Perfil[] = [];
  form: FormGroup = this.fb.group({
    //usr: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9s]+")]],
    usr: ["", Validators.required],
    psw: [
      /*
      "",
      [
        Validators.required,
        Validators.pattern(/(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,20}/),
      ],*/
    ],
    nombres: ["", Validators.required],
    apellidos: ["", Validators.required],
    correo: ["", [Validators.required, Validators.email]],
    roles: [], // Roles será la lista general de roles
    idsCliente: new FormControl(),
    plataformas: new FormArray(
      [new FormControl(false), new FormControl(false)],
      minSelectedCheckboxes(1)
    ),
    usuarioRoles: new FormArray([], minSelectedCheckboxes(1)), // los roles seleccionado en la web
  });

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  submitted: boolean;
  id: any;
  test: any[] = [];
  assignClients: any[] = [];

  get rolesFormArray() {
    return this.form.controls.usuarioRoles as FormArray;
  }

  get plataformaFormArray() {
    return this.form.controls.plataformas as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private crearUsuarioService: CrearUsuarioService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _maestrosService: MaestrosService
  ) {
    this.init();
  }

  init(): void {
    this.loading$ = this.crearUsuarioService.loading$.pipe(
      takeUntil(this._unsubscribeAll)
    );

    this.crearUsuarioService.perfiles$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((perfiles) => {
        this.perfiles = perfiles;
        this.perfiles.forEach(() =>
          this.rolesFormArray.push(new FormControl(false))
        );
      });

    if (this.activatedRoute.snapshot.params.id) {
      this.id = Number(this.activatedRoute.snapshot.params.id);
      this.isEdit = true;
      this.crearUsuarioService
        .getUsuario(this.activatedRoute.snapshot.params.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response: any) => {
          const {
            id,
            usr,
            nombres,
            apellidos,
            correo,
            usuarioRoles,
            web,
            movil,
            usuarioCliente,
          } = response.body;

          this.updateIds(usuarioCliente);

          this.form.setValue({
            usr,
            nombres,
            apellidos,
            correo,
            psw: "",
            roles: usuarioRoles,
            usuarioRoles: this.generateRoles(usuarioRoles),
            plataformas: [web, movil],
            idsCliente: [],
          });
          this.form.controls.idsCliente.patchValue([
            ...usuarioCliente.map((usrClient) => {
              if (usrClient.id > 0 && usrClient.activo)
                return usrClient.idCliente;
            }),
          ]);
          this.form.addControl(
            "id",
            new FormControl(this.activatedRoute.snapshot.params.id)
          );
        });
    } else {
      this.getClients();
    }
  }

  ngOnInit(): void {
    this.usrField();
  }

  autoCheckUsr(): void {
    this.crearUsuarioService
      .getClintInfo(this.form.controls.usr.value)
      .subscribe((usrData: any) => {
        if (usrData) {
          this.form.controls.nombres.setValue(usrData.givenName);
          this.form.controls.apellidos.setValue(usrData.surname);
          this.form.controls.correo.setValue(usrData.mail);
        } else {
          this.form.controls.nombres.setValue("");
          this.form.controls.apellidos.setValue("");
          this.form.controls.correo.setValue("");
        }
      });
  }

  getClients(): void {
    this._maestrosService
      .getClients({ pageSize: 200, page: 0 })
      .subscribe((clients) => {
        this.clients = clients.body.data;
        this.clients.map((x) => {
          x.idCliente = x.id;
          x.id = 0;
        });
      });
  }

  setSelectionChange(e: MatSelectChange): void {
    this.clients.map((x) => {
      if (e.value.includes(x.idCliente)) {
        x.activo = true;
        return x;
      } else {
        x.activo = false;
        return x;
      }
    });

    const payload = this.clients.filter(
      (x) => x.id !== 0 || (x.id === 0 && x.activo)
    );
    if (this.isEdit) {
      this.crearUsuarioService.bindClientToUser(payload).subscribe((resp) => {
        this.updateIds(resp.body);
      });
    } else {
      this.assignClients = payload;
    }
  }

  updateIds(data): void {
    this.clients = [];
    data.forEach((client) => {
      this.clients.push({
        idCliente: client.idCliente,
        idUsuario: Number(this.id),
        activo: client.activo,
        id: client.id,
        nombre: client.nombre,
      });
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.crearUsuarioService.loading = false;
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  usrField(): void {
    if (!this.isEdit) {
      this.form.controls["usr"].enable();
    } else {
      this.form.controls["usr"].disable();
    }
  }

  generateRoles(roles) {
    const response = Array(this.perfiles.length).fill(false);
    roles.forEach((rol) => {
      const findIndex = this.perfiles.findIndex(
        (perfil) => rol.idRol === perfil.id
      );
      response[findIndex] = rol.activo;
    });

    return response;
  }

  onSubmit() {
    this.form.controls["usr"].enable();
    if (this.form.valid) {
      const { psw, ...body }: any = { ...this.form.value };
      const { plataformas } = body;
      const requestRoles = [];

      body.usuarioRoles.forEach((isCheck, i) => {
        if (this.isEdit || (!this.isEdit && isCheck)) {
          const newRol = {
            idRol: this.perfiles[i].id,
            activo: isCheck,
            idUsuario: this.isEdit
              ? Number(this.activatedRoute.snapshot.params.id)
              : 0,
          };

          const findRol = body.roles
            ? body.roles.find((role) => role.idRol === this.perfiles[i].id)
            : -1;

          if (typeof findRol !== "undefined") {
            newRol["id"] = findRol.id;
            requestRoles.push(newRol);
          } else if (isCheck) {
            // Si es un rol nuevo asociado al usuario debe estar seleccionado
            newRol["id"] = 0;
            requestRoles.push(newRol);
          }
        }
      });

      body.usuarioRoles = requestRoles;
      this.crearUsuarioService
        .saveUsuario({
          ...body,
          web: plataformas[0],
          movil: plataformas[1],
          //idsCliente: this.clients,
          psw: this.isEdit ? "0000" : psw, // Se envia 0000 por defecto pero esto no actualiza la contraseña
        })
        .subscribe((response) => {
          if (!this.isEdit) {
            this.assignClients.map((x) => (x.idUsuario = response.body.id));
            if (this.assignClients.length > 0) {
              this.crearUsuarioService
                .bindClientToUser(this.assignClients)
                .subscribe((resp) => {
                  this.updateIds(resp.body);
                  this.submitted = true;
                  this.messageRedirect(response);
                });
            } else {
              this.submitted = true;
              this.messageRedirect(response);
            }
          } else {
            this.submitted = true;
            this.messageRedirect(response);
          }
        });
    }
  }

  getErrorMessage(input: string) {
    const control = this.form.get(input);

    if (control.hasError("pattern")) {
      if (input === "psw") {
        if (!this.isEdit) {
          return "Al menos 6 caracteres alfanuméricos, mayúscula y minúscula";
        }
      } else if (input === "usr") {
        return "Campo solo alfanumérico y sin espacios";
      }
    }

    if (control.hasError("required")) {
      return "Campo requerido";
    }

    return control.hasError("email") ? "Formato de correo incorrecto" : "";
  }

  private messageRedirect(response): void {
    this.alert = {
      type: response.success ? "success" : "error",
      message: response.success
        ? `Se ha ${this.isEdit ? "editado" : "creado"} correctamente el usuario`
        : response.message,
    };

    setTimeout(() => {
      if (response.message !== "El usuario ya existe") {
        this.alert = null;
        this._router.navigateByUrl("/admin/ajustes/usuarios");
      }
    }, 2500);
  }

  byClient(e): void {}
}
