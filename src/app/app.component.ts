import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';

import { NativeStorage } from '@ionic-native/native-storage';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user:any;
  userReady: boolean = false;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public nativeStorage: NativeStorage,private googlePlus: GooglePlus,public events: Events) {
    this.platform.ready().then(() => {
      let env=this;
      this.statusBar.styleDefault();
      

      this.nativeStorage.getItem('user')
        .then( function (user) {
        console.log(JSON.stringify(user));
            env.user = user;
            env.userReady = true;
            env.nav.setRoot(HomePage, {}, {animate: true, animation:'transition',duration:300,direction: 'forward'});
            setTimeout(() => {
             env.splashScreen.hide();
          }, 1500);
        }, function (error) {
            env.nav.setRoot(LoginPage, {}, {animate: true, animation:'transition',duration:300,  direction: 'forward'});
            setTimeout(() => {
             env.splashScreen.hide();
          }, 1500);
        });

      events.subscribe('user:created',(time) => {
         this.nativeStorage.getItem('user')
          .then( function (user) {
              console.log("user logged in");
              console.log("user - "+JSON.stringify(user));
              env.user = user;
              env.userReady = true;
          }, function (error) {
             console.log(error);
          });
    });
      
      // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
  });

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout(){
    let env = this;
    this.nativeStorage.remove('user');
    env.nav.setRoot(LoginPage, {}, {animate: true, animation:'transition',duration:300,direction: 'forward'});
  }
}
