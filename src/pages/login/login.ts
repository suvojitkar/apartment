import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  displayName:any;
  email:any;
  familyName:any;
  userId:any;
  imageUrl:any;
  userReady: boolean = false;

  constructor(public navCtrl: NavController, public events: Events, public nativeStorage: NativeStorage, public navParams: NavParams,public loadingCtrl: LoadingController,private googlePlus: GooglePlus) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login_google(){
  	let env = this;
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      spinner: 'circles'
    });
    loading.present();

    //google login starts
    this.googlePlus.login({})
    .then(function (user) {
    	console.log(JSON.stringify(user));
        env.nativeStorage.setItem('user', {
          name: user.displayName,
          email: user.email,
          family: user.familyName,
          userid: user.userId,
          picture: user.imageUrl
        })
          .then(function(){     //stored in native storage
	          	console.log("Case-1"); 
	          	console.log(user.displayName+" "+user.email+" "+user.imageUrl+" "+user.familyName+" "+user.userId);
	            env.userReady = true;
	            env.events.publish('user:created',Date.now());
	            env.navCtrl.setRoot(HomePage, {}, {animate: true, animation:'transition',duration:300, direction: 'forward'});
	            setTimeout(() => {
	             	loading.dismiss();
	          }, 1000);
          }, function (error) {     //could not store in native storage
	          	console.log("Case-2");
	          	console.log(error);
	          	env.userReady = true;
	          	env.events.publish('user:created',Date.now());
	          	env.navCtrl.setRoot(HomePage, {}, {animate: true, animation:'transition',duration:300, direction: 'forward'});
	            loading.dismiss();
          })
      }, 
      function (error) {     //could not store in native storage due to other issue
      	console.log("Case-3");
      	console.log(error);
      	env.userReady = true;
      	env.events.publish('user:created',Date.now());
	    env.navCtrl.setRoot(HomePage, {}, {animate: true, animation:'transition',duration:300, direction: 'forward'});
      	loading.dismiss();
     });
  }

}
