import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router,Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private itemService: ItemService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // console.log('will enter');
    this.logout();
    this.router.navigate(['/login']);
  }
  
  async logout(){
    await firebase.auth().signOut();
    this.itemService.uid = '';
  }
}
