import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

var firebaseConfig = {
  apiKey: "AIzaSyCwvLy9CUlqy20Fpvz6eXTiA-Ovko6dzeE",
  authDomain: "brainstorm-546.firebaseapp.com",
  databaseURL: "https://brainstorm-546.firebaseio.com",
  projectId: "brainstorm-546",
  storageBucket: "brainstorm-546.appspot.com",
  messagingSenderId: "526678353309",
  appId: "1:526678353309:web:211ec83e3c3d6348b3fb74",
  measurementId: "G-K78Y3BFLG1"
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'My Ideas',
      url: '/my-ideas',
      icon: 'list'
    },
    {
      title: 'User Settings',
      url: '/user-settings',
      icon: 'cog'
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'log-out',
    }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      firebase.initializeApp(firebaseConfig);
    });
  }
}
