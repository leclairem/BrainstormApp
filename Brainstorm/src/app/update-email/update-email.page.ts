import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.page.html',
  styleUrls: ['./update-email.page.scss'],
})
export class UpdateEmailPage implements OnInit {
  
  updateEmail: FormGroup;
  email:any;

  constructor(
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.email = this.itemService.currentUser.email;
    this.updateEmail = this.formBuilder.group({
      email: new FormControl(this.email, Validators.required)
    });
  }

  async updateAccount(value){
    var self = this;
    var docID = this.itemService.currentUser.docID;
    var user = firebase.auth().currentUser;
    var db = firebase.firestore().collection('users');
    await user.updateEmail(value.email).then(async function() {
      db.doc(docID).update({
        "email": value.email
      }).then(function() {
        console.log("user doc updated");
      }).catch(function (error) {
        self.presentAlert(error.code, error.message);
      });
      await self.itemService.getUserData();
      self.router.navigate(['/user-settings']);
    }).catch(function(error) {
      self.presentAlert(error.code, error.message);
    });
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
