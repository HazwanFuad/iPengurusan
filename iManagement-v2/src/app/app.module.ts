import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    CustomFormsModule,
    ],
  providers: [
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    LocalNotifications,
    StatusBar,
    SplashScreen,
    NativeStorage,
    SQLite,
    InAppBrowser,
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
