import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  userEmail = 'revan@empire.com';
  firstName = 'Darth';
  lastName = 'Revan';
  handle = 'greyArea';
  constructor() { }

  ngOnInit() {
  }

  goToUpdateEmail(){

  }

  goToChangePassword(){

  }

  goToUpdateInfo(){

  }
}
