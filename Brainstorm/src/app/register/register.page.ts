import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public itemService: ItemService,
    public alertController: AlertController
  ) { 

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      handle: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required) 
    });
  }

  register(value){
    var self = this;
    var email = value.email;
    var password = value.password;
    if(value.password != value.confirmPassword)
    {
      self.presentAlert('Error','Passwords do not match');
      return;
    }
    else
    {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      self.presentAlert(errorCode, errorMessage);
      }).then(function(result){
        var user = firebase.auth().currentUser;
        self.itemService.token = user;
        self.itemService.uid = user.uid;
        console.log("adding user to db");
        var db = firebase.firestore();
          db.collection("users").add({
            firstName: value.fname,
            lastName: value.lname,
            handle: value.handle,
            email: value.email,
            uid: user.uid
          })
          .then(async function(docRef) {
            console.log("Doc written with Id: ", docRef.id);
            await db.collection("users").doc(docRef.id).update({
              "docID": docRef.id
            });
            self.itemService.getUserData();
            self.router.navigate(["/home"]);
          })
          .catch(function(error) {
            console.error("error adding doc: ", error);
          })
        });
    }
  }
    async presentAlert(header, message) {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
}
