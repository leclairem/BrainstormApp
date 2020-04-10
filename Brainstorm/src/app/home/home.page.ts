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
export class HomePage implements OnInit {

  categories = [{'title':'Engineering','img':'/assets/engineering.jpg'},
                {'title':'Technology','img':'/assets/technology.jpg'},
                {'title':'Educational','img':'/assets/teaching.jpg'},
                {'title':'Movie','img':'/assets/entertainment.jpg'},
                {'title':'Song','img':'/assets/music.jpg'},
                {'title':'Book','img':'/assets/books.jpg'},
                {'title':'Comic','img':'/assets/comics.jpg'},
                {'title':'Video Game','img':'/assets/videogames.jpg'}];
  threads=[];

  constructor(
      public router: Router,
      private itemService: ItemService
  ) {
    this.threads.push(new thread('Cool Idea',233,'Darth Vader','Be careful not to choke on your aspirations.'));
    this.threads.push(new thread('Not so cool idea', 3, 'Grand Moff Tarkin','Lets build a battlestation the size of a small moon with a major design flaw'));
    this.threads.push(new thread('Billion Dollar Idea', 18492, 'Darth Sidious','Lets tear down the republic and build a grand empire'));
    this.threads.push(new thread('Crawl under a rock and hide from this idea',1,'Lando Calrissian','I\'m goint to betray an old friend and stab him in the back'));
  }

  ngOnInit(){
    console.log(this.itemService.uid)
  }

  goToThread(thread){
  	console.log(thread);
  	this.router.navigate(["/thread", thread]);
  }

  goToCategory(object){
    this.router.navigate(['/category',object]);
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