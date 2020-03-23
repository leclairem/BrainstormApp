import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  threads=[];

  constructor(
      public router: Router
  ) {
    this.threads.push(new thread('Cool Idea',233,'Darth Vader'));
    this.threads.push(new thread('Not so cool idea', 3, 'Grand Moff Tarkin'));
    this.threads.push(new thread('Billion Dollar Idea', 18492, 'Darth Sidious'));
    this.threads.push(new thread('Crawl under a rock and hide from this idea',1,'Lando Calrissian'));
  }

}

class thread {
  title:any;
  views:any;
  owner:any;

  constructor(t:string, v:number, o:string){
    this.title = t;
    this.views = v;
    this.owner = o;
  }
};