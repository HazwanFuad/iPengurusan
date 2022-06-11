import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class NativeStorageService {

  constructor(
    private nativeStorage: NativeStorage,
  ) { }

  async getToken(): Promise<any> {
    let token = '';
    await this.nativeStorage.getItem('access_token')
    .then(
      data => {
        token = data;
      },
      error => {
        console.error(error);
      }
    );
    return token;
}
}
