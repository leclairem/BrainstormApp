import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { ItemService } from '../item.service';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPassword: FormGroup;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.resetPassword = this.formBuilder.group({
      email: new FormControl('', Validators.required)
    });
  }

    forgotPassword(value){
      var self = this;
      firebase.auth().sendPasswordResetEmail(value.email).then(function() {
        self.presentAlert('Reset Link Sent', 'An email with a link to reset your password has been sent to the provided email.')
        self.router.navigate(['/login']);
      }).catch(function(error) {
        self.presentAlert(error.code, error.message);
      })
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
