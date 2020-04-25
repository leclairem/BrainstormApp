import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  email: '';
  firstName: '';
  lastName: '';
  handle: '';
  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ionViewWillEnter(){
    firebase.firestore().collection('users').doc(this.itemService.currentUser.docID)
    .get().then(doc => {
      this.email = doc.data().email;
      this.firstName = doc.data().firstName;
      this.lastName = doc.data().lastName;
      this.handle = doc.data().handle;
    });
  }

  ngOnInit() {
  }

  goToUpdateEmail(){
    this.router.navigate(['/update-email']);
  }

  goToChangePassword(){
    this.router.navigate(['/change-password']);
  }

  goToUpdateInfo(){
    this.router.navigate(['/update-info']);
  }
}
