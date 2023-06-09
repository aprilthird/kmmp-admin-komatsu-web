import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MsalBroadcastService } from "@azure/msal-angular";
import { EventMessage, InteractionStatus } from "@azure/msal-browser";
import { fuseAnimations } from "@fuse/animations";
import { FuseAlertType } from "@fuse/components/alert";
import { AuthService } from "app/core/auth/auth.service";
import { NavigationService } from "app/core/navigation/navigation.service";
import { HttpResponse } from "app/core/types/http.types";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { environment } from "environments/environment";
import { filter } from "rxjs/operators";

@Component({
  selector: "auth-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild("signInNgForm") signInNgForm: NgForm;
  environment = environment;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  signInForm: FormGroup;
  showAlert: boolean = false;
  loading: boolean;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _navigationService: NavigationService,
    private _MatDialog: MatDialog,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  // ngOnInit(): void {
  //   // Create the form
  //   this.signInForm = this._formBuilder.group({
  //     usr: ["", [Validators.required]],
  //     psw: ["", Validators.required],
  //   });
  // }

  // // -----------------------------------------------------------------------------------------------------
  // // @ Public methods
  // // -----------------------------------------------------------------------------------------------------

  // /**
  //  * Sign in
  //  */
  // signIn(): void {
  //   // Return if the form is invalid
  //   if (this.signInForm.invalid) {
  //     return;
  //   }

  //   // Disable the form
  //   this.signInForm.disable();

  //   // Hide the alert
  //   this.showAlert = false;

  //   // Sign in
  //   this._authService.signIn(this.signInForm.value).subscribe(
  //     () => {
  //       this._navigationService.get().subscribe((response: any) => {
  //         // Set the redirect url.
  //         // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
  //         // to the correct page after a successful sign in. This way, that url can be set via
  //         // routing file and we don't have to touch here.
  //         setTimeout(() => {
  //           const permissions = JSON.parse(localStorage.getItem("permissions"));
  //           const firstURL = Object.keys(permissions)[0];
  //           const redirectURL = firstURL || "/signed-in-redirect";
  //           // Navigate to the redirect url
  //           this._router.navigateByUrl(redirectURL);
  //         }, 100);
  //       });
  //     },
  //     (error: HttpErrorResponse) => {
  //       if (!error.error["error"]) {
  //         error.error["error"] =
  //           "Por favor, revisa tu conexión a internet y vuelve a intentarlo";
  //       }
  //       // Re-enable the form
  //       this.signInForm.enable();

  //       // Reset the form
  //       this.signInNgForm.resetForm();

  //       // Set the alert
  //       this.alert = {
  //         type: "error",
  //         message: error.error["error"],
  //       };

  //       // Show the alert
  //       this.showAlert = true;
  //     }
  //   );
  // }

  // forgotPassword(): void {
  //   this._MatDialog.open(UiDialogsComponent, {
  //     data: {
  //       title: "¿Olvidaste tu contraseña?",
  //       message:
  //         "Para recuperar tu contraseña, recuerda que siempre puedes hacerlo desde tu plataforma SAP",
  //     },
  //     width: "500px",
  //   });
  // }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === "msal:loginSuccess")
      )
      .subscribe((result: EventMessage) => {});

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        //this.setLoginDisplay();
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */

  async signIn() {
    await this.redirecting();
  }

  redirecting(): Promise<any> {
    return new Promise(() => {
      this.loading = false;
      const redirectURL = "/redirecting";
      setTimeout(() => {
        this._router.navigateByUrl(redirectURL);
      });
    });
  }
}
