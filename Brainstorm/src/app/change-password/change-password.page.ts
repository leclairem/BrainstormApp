import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  updatePassword: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.updatePassword = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required)
    });
  }

  update(value){
    var self = this;
    if(value.password != value.confirmpassword)
    {
      self.presentAlert('Error','Passwords do not match');
      return;
    }
    else
    {
      var user = firebase.auth().currentUser;
      var self = this;
      user.updatePassword(value.confirmpassword).then(function() {
        self.router.navigate(['/user-settings']);
      }).catch(function(error) {
        self.presentAlert(error.code, error.message);
      });
    }
  }

  async presentAlert(header, message) {
    const alert =  await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
