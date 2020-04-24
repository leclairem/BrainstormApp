import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.page.html',
  styleUrls: ['./update-info.page.scss'],
})
export class UpdateInfoPage implements OnInit {

  updateInfo: FormGroup;
  firstName:any;
  lastName:any;
  handle:any

  constructor(
    private router: Router,
    public itemService: ItemService,
    public formBuilder: FormBuilder,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.updateInfo = this.formBuilder.group({
      firstName: new FormControl(this.firstName, Validators.required),
      lastName: new FormControl(this.lastName, Validators.required),
      handle: new FormControl(this.handle, Validators.required)
    });
  }

  ionViewWillEnter(){
    console.log('will enter update info');
    this.firstName = this.itemService.currentUser.firstName;
    this.lastName = this.itemService.currentUser.lastName;
    this.handle = this.itemService.currentUser.handle;
    console.log(this.firstName+" "+this.lastName);
  }

  async update(value) {
    var user = firebase.auth().currentUser;
    var self = this;
    await firebase.firestore().collection('users').doc(this.itemService.currentUser.docID).update({
      "firstName": value.firstName,
      "lastName": value.lastName,
      "handle": value.handle
    }).then(async function () {
      console.log('User updated successfully');
      await self.itemService.getUserData();
      self.router.navigate(['/user-settings']);
    })
    .catch(function (error) {
      self.presentAlert(error.errorCode, error.errorMessage);
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
