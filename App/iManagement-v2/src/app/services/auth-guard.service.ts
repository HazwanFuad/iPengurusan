import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private nativeStorage: NativeStorage,
    ) {}

  async isLoggedIn(): Promise<boolean> {
    let islogged = false;
    await this.nativeStorage.getItem('access_token')
    .then(
      data => {
        console.log(data);
        if (data !== undefined) {
          islogged =  true;
        } else {
          islogged =  false;
        }
      },
      error => {
        console.error(error);
        islogged =  false;
      }
    );
    return islogged;
}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const authInfo = {
      authenticated: this.isLoggedIn()
    };

    if (!authInfo.authenticated) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
