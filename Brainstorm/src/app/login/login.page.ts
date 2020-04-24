import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase';
import { IonicModule, AlertController } from '@ionic/angular';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login_user: FormGroup;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.login_user = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  async login(value){
    var self = this;
    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .then((user) => {
      self.itemService.uid = firebase.auth().currentUser.uid;
      self.itemService.getUserData(user);
      // self.itemService.events.publish('user:loggedIN',Date.now());
      console.log('user logged in as '+self.itemService.uid);
      self.router.navigate(['/home']);
    }).catch(function(error) {
      console.log(error.code+' '+error.message);
      self.presentAlert(error.code,error.message);
      // if(error.code == 'auth/wrong-password')
      //   self.presentAlert('Login failed', 'The password is invalid or the user does not have a password.  If you have used goole signin, sign in using google.')
    });
  }

  async presentAlert(header, errorMessage) {
    const alert = await this.alertController.create({
      header: header,
      message: errorMessage,
      buttons: ['OK']

    });
    await alert.present();
  }

  register(){
    this.router.navigate(["/register"]);
  }

}
