import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormatosRoutingModule } from "./formatos-routing.module";
import { ListadoComponent } from "./listado/listado.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { EditarFormatoComponent } from "./editar-formato/editar-formato.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSortModule } from "@angular/material/sort";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { FuseNavigationModule } from "@fuse/components/navigation";
import { GruposComponent } from "./editar-formato/grupos/grupos.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatDialogModule } from "@angular/material/dialog";
import { DialogAddFormatoComponent } from "./components/dialog-add-formato/dialog-add-formato.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SharedModule } from "app/shared/shared.module";
import { DialogAddSeccionComponent } from "./components/dialog-add-seccion/dialog-add-seccion.component";
import { DialogAddGrupoComponent } from "./components/dialog-add-grupo/dialog-add-grupo.component";
import { DialogAddDatoComponent } from "./components/dialog-add-dato/dialog-add-dato.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { AsignarFormatoComponent } from "./asignar-formato/asignar-formato.component";
import { FuseConfirmationModule } from "@fuse/services/confirmation";
import { DialogAddAsignarComponent } from "./components/dialog-add-asignar/dialog-add-asignar.component";
import { FuseAlertModule } from "@fuse/components/alert";
import { DialogPrevisualizarComponent } from "./components/dialog-previsualizar/dialog-previsualizar.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { AsignacionesComponent } from "./asignaciones/asignaciones.component";
import { MatChipsModule } from "@angular/material/chips";
import { AperturaAsignacionComponent } from "./asignaciones/apertura-asignacion/apertura-asignacion.component";
import { ValidationFormatosComponent } from "./validation-formatos/validation-formatos.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DialogValidateFormatComponent } from "./components/dialog-validate-format/dialog-validate-format.component";
import { DialogAddCommentComponent } from "./components/dialog-add-comment/dialog-add-comment.component";
import { MatMenuModule } from "@angular/material/menu";
import { DynamicFormatComponent } from "./dynamic-format/dynamic-format.component";
import { SectionsComponent } from "./dynamic-format/sections/sections.component";
import { GroupsComponent } from "./dynamic-format/sections/groups/groups.component";
import { FieldsComponent } from "./dynamic-format/sections/groups/fields/fields.component";
import { VerticalGroupComponent } from "./dynamic-format/sections/groups/vertical-group/vertical-group.component";
import { HorizontalGroupComponent } from "./dynamic-format/sections/groups/horizontal-group/horizontal-group.component";
import { OtherValidatorComponent } from "./dynamic-format/dialog-components/other-validator/other-validator.component";
import { ChipsSelectionComponent } from "./dynamic-format/dialog-components/chips-selection/chips-selection.component";
import { UploadImageComponent } from "./dynamic-format/dialog-components/upload-image/upload-image.component";
import { LabelEditableComponent } from "./dynamic-format/sections/groups/fields/label-editable/label-editable.component";

//DATETIME
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";

@NgModule({
  declarations: [
    ListadoComponent,
    EditarFormatoComponent,
    GruposComponent,
    DialogAddFormatoComponent,
    DialogAddSeccionComponent,
    DialogAddGrupoComponent,
    DialogAddDatoComponent,
    AsignarFormatoComponent,
    DialogAddAsignarComponent,
    DialogPrevisualizarComponent,
    AsignacionesComponent,
    AperturaAsignacionComponent,
    ValidationFormatosComponent,
    DialogValidateFormatComponent,
    DialogAddCommentComponent,
    DynamicFormatComponent,
    SectionsComponent,
    GroupsComponent,
    FieldsComponent,
    VerticalGroupComponent,
    HorizontalGroupComponent,
    OtherValidatorComponent,
    ChipsSelectionComponent,
    UploadImageComponent,
    LabelEditableComponent,
  ],
  imports: [
    CommonModule,
    FormatosRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSortModule,
    MatSidenavModule,
    MatDividerModule,
    MatExpansionModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FuseNavigationModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FuseConfirmationModule,
    FuseAlertModule,
    MatDatepickerModule,
    MatChipsModule,
    MatCheckboxModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatMenuModule,
    SharedModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class FormatosModule {}
