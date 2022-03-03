import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { InteractionStatus } from "@azure/msal-browser";
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
    private _router: Router
  ) {}

  logOut() {
    this.authService.logout();
  }

  async logIn() {
    const isIE =
      window.navigator.userAgent.indexOf("MSIE ") > -1 ||
      window.navigator.userAgent.indexOf("Trident/") > -1;

    if (!isIE) {
      await this.redirecting()
        .then(async (res: any) => {
          await this._authService
            .signIn({ usr: "solera", psw: "1234" })
            //.signInAD(res.account.username)
            .toPromise()
            .then(() => this._navigationService.get().toPromise());
        })
        .catch((err) => {
          if (err === "User is already logged in.") {
            setTimeout(() => {
              this._router.navigate(["admin"]);
            }, 250);
          } else {
            this._router.navigate(["sign-in"]);
          }
        });

      this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None
          )
        )
        .subscribe((resp) => {
          console.log(resp);
          this._router.navigate(["admin"]);
          //this.authService.loginPopup();
        });
    } else {
      this.authService.loginPopup;
    }
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
