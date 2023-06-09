import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UploadFileComponent } from "./ui/upload-file/upload-file.component";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TextFilterPipe } from "./pipes/text-filter.pipe";
import { ExportExcelService } from "./utils/export-excel.ts.service";
import { InnerHeaderComponent } from "./ui/inner-header/inner-header.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { GroupPositionPipe } from "./pipes/group-position.pipe";
import { UiDialogsComponent } from "./ui/ui-dialogs/ui-dialogs.component";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UploadFileComponent,
    TextFilterPipe,
    GroupPositionPipe,
    InnerHeaderComponent,
  ],
  declarations: [
    UploadFileComponent,
    TextFilterPipe,
    InnerHeaderComponent,
    GroupPositionPipe,
    UiDialogsComponent,
  ],
  providers: [ExportExcelService],
})
export class SharedModule {}
