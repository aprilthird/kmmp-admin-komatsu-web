import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { InteractionStatus } from "@azure/msal-browser";
import { UiDialogsComponent } from "app/shared/ui/ui-dialogs/ui-dialogs.component";
import { initPathToRedirect } from "app/shared/utils/initPath";
import { filter } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { NavigationService } from "../navigation/navigation.service";

@Injectable({
  providedIn: "root",
})
export class AzureAuthService {
  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private _authService: AuthService,
    private _navigationService: NavigationService,
    private _matDialog: MatDialog,
    private _router: Router
  ) {}

  logOut() {
    this.authService.logout();
  }

  async logIn() {
    const isIE =
      window.navigator.userAgent.indexOf("MSIE ") > -1 ||
      window.navigator.userAgent.indexOf("Trident/") > -1;

    //if (!isIE) {
    this.redirecting()
      .then(async (res: any) => {
        await this._authService
          //.signIn({ usr: "solera", psw: "1234" })
          .signInAD(res.account.username)
          .toPromise()
          .then(() =>
            this._navigationService
              .get()
              .toPromise()
              .then(() => this._router.navigateByUrl(initPathToRedirect()))
          )
          .catch(async () => {
            const dialog = this._matDialog.open(UiDialogsComponent, {
              width: "600px",
              data: {
                title: "Error",
                message: `Usuario ${res.account.username} no puede conectarse al sistema, al cerrar éste mensaje, favor cierre sesión de éste ususrio en la siguiente ventana de Windows y contacte al administrador del sistema`,
              },
            });
            await dialog
              .afterClosed()
              .toPromise()
              .then(() =>
                this.authService
                  .logout()
                  .toPromise()
                  .then(() => this._router.navigate(["sign-in"]))
              );
          });
      })
      .catch(async (err) => {
        if (err === "User is already logged in.") {
          this._router.navigateByUrl(initPathToRedirect());
        } else {
          this.authService.logout().toPromise();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe((resp) => {
        // Navigate to the redirect url
        this._router.navigateByUrl(initPathToRedirect());

        //this._router.navigate(["admin"]);
        //this._router.navigate(["admin"]);
        //this.authService.loginPopup();
      });
    // } else {
    //   this.authService.loginPopup;
    // }
  }

  private redirecting() {
    return new Promise<void>(async (res) => {
      const login = await this.loginPopUp();
      res(login);
    });
  }

  private loginPopUp() {
    return new Promise<any>((res) => {
      this.authService.loginPopup().subscribe(
        async (resp) => res(resp),
        (err) => {
          // sessionStorage.clear();
          // localStorage.clear();
          this._router.navigate(["sign-out"]);
        }
      );
    });
  }
}
