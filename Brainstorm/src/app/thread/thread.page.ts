import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule, ActivatedRoute } from '@angular/router';

import { IonicModule, AlertController } from '@ionic/angular';
import { ItemService } from '../item.service';
import * as firebase from'firebase';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.page.html',
  styleUrls: ['./thread.page.scss'],
})
export class ThreadPage implements OnInit {

  //delete these arrays
  // replies = [
  //   'This is my reply',
  //   'This is my helpful feedback',
  //   'This is my criticism',
  //   'This is my less than helpful feedback'
  // ];
  // repliers = [
  //   'Helpful Hank',
  //   'Knowledgable Karen',
  //   'Critic Cathy',
  //   'Trolling Tom'
  // ];
  replies = [];

  thread:any;
  title:any;
  views:any;
  owner:any;
  body:any;
  db = firebase.firestore();

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private router:Router,
    private alertController:AlertController
  ) { 
    this.replies.push({'reply':'This is my reply','replier':'Helpful Hank'});
    this.replies.push({'reply':'This is my helpful feedback','replier':'Knowledgable Karen'});
    this.replies.push({'reply':'This is my criticism','replier':'Critic Cathy'});
    this.replies.push({'reply':'This is my less than helpful feedback','replier':'Trolling Tom'});
  }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.thread = param;
        this.title = param.title;
        this.views = this.views;
        this.owner = param.owner;
        this.body = param.body;
      });
  }

}
