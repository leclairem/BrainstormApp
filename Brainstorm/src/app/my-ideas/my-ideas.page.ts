import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-my-ideas',
  templateUrl: './my-ideas.page.html',
  styleUrls: ['./my-ideas.page.scss'],
})
export class MyIdeasPage implements OnInit {

  myIdeas = [];

  constructor(
    private router: Router,
    private itemService: ItemService,
  ) { }

  ionViewWillEnter(){
    var self = this;
    var db = firebase.firestore();
    self.myIdeas = [];
    db.collection('ideas').where('uid','==',self.itemService.currentUser.uid).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var idea = doc.data();
        self.myIdeas.push({title:idea.title,description:idea.description,
          uid:idea.uid,imgs:idea.imgs,docID:idea.docID,thumb:idea.imgs[0],
          owner:idea.owner,replies:idea.replies,likes:idea.likes,dislikes:idea.dislikes});
      });
    });
  }

  ngOnInit() {
  }

  goToThread(object){
    this.router.navigate(['/thread',object]);
  }

  create(){
    this.router.navigate(['/create-thread']);
  }
}
