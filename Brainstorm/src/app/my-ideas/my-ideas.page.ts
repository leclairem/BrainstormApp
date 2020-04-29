import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../item.service';
import * as firebase from 'firebase';
import { LoadingController, IonRefresher } from '@ionic/angular';

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
    public loadingController: LoadingController,
    private route: ActivatedRoute
  ) { }

  async ionViewWillEnter(){
    var self = this;
    var db = firebase.firestore();
    self.myIdeas = [];
    await db.collection('ideas').where('uid','==',self.itemService.currentUser.uid).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var idea = doc.data();
        self.myIdeas.push({title:idea.title,description:idea.description,
          uid:idea.uid,date:idea.date,imgs:idea.imgs,docID:idea.docID,thumb:idea.imgs[0],
          owner:idea.owner,replies:idea.replies,likes:idea.likes,dislikes:idea.dislikes});
      });
    });
    // this.presentLoading();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        if(param.delete == 1)
          this.ionViewWillEnter();
      });
  }

  async doRefresh(event){
    var self = this;
    var db = firebase.firestore();
    await self.ionViewWillEnter();
    event.target.complete();
  }

  goToThread(object){
    this.router.navigate(['/thread',object]);
  }

  create(){
    this.router.navigate(['/create-thread']);
  }
}
