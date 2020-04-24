import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service'
import { Router } from '@angular/router';

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
  ) { }

  async ionViewWillEnter(){
    this.email = this.itemService.currentUser.email;
    this.firstName = this.itemService.currentUser.firstName;
    this.lastName = this.itemService.currentUser.lastName;
    this.handle = this.itemService.currentUser.handle;
  }
  ionViewDidEnter(){
    this.email = this.itemService.currentUser.email;
    this.firstName = this.itemService.currentUser.firstName;
    this.lastName = this.itemService.currentUser.lastName;
    this.handle = this.itemService.currentUser.handle;
  }

  ngOnInit() {
  }

  goToUpdateEmail(){

  }

  goToChangePassword(){

  }

  goToUpdateInfo(){
    this.router.navigate(['/update-info']);
  }
}
