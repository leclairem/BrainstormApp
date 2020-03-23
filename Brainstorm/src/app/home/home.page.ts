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
    this.threads.push(new thread('Cool Idea',233,'Darth Vader','Be careful not to choke on your aspirations.'));
    this.threads.push(new thread('Not so cool idea', 3, 'Grand Moff Tarkin','Lets build a battlestation the size of a small moon with a major design flaw'));
    this.threads.push(new thread('Billion Dollar Idea', 18492, 'Darth Sidious','Lets tear down the republic and build a grand empire'));
    this.threads.push(new thread('Crawl under a rock and hide from this idea',1,'Lando Calrissian','I\'m goint to betray an old friend and stab him in the back'));
  }

  goToThread(thread){
  	console.log(thread);
  	this.router.navigate(["/thread", thread]);
  }

}

class thread {
  title:any;
  views:any;
  owner:any;
  body:any;

  constructor(t:string, v:number, o:string, b:string){
    this.title = t;
    this.views = v;
    this.owner = o;
    this.body = b;
  }
};