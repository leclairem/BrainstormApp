import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule, ActivatedRoute } from '@angular/router';

import { IonicModule, AlertController } from '@ionic/angular';
import { ItemService } from '../item.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.page.html',
  styleUrls: ['./thread.page.scss'],
})
export class ThreadPage implements OnInit {
  replyForm:FormGroup;
  replyList = [];
  replies = [];
  imgs = [];
  likes:number;
  dislikes:number;
  thread:any;
  threadDescription: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private router:Router,
    private alertController:AlertController
  ) { 
   
  }

  async ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.thread = param;
      });
    this.threadDescription = this.thread.description;
    this.likes=this.thread.likes;
    this.dislikes=this.thread.dislikes;
    this.replyForm = this.formBuilder.group({
      body: new FormControl('', Validators.required)
    });
    var db = firebase.firestore().collection('ideas');
    await db.doc(this.thread.docID).get().then(doc => {
      this.replyList = doc.data().replies;
      this.imgs = doc.data().imgs;
    })
    this.getReplies();
  }

  getReplies(){
    var self = this;
    var db = firebase.firestore().collection('replies');
    self.replies = [];
    for(let i = 0;i<this.replyList.length;i++)
    {
      db.doc(self.replyList[i]).get().then(doc => {
        var reply = doc.data();
        self.replies.push({body:reply.body,owner:reply.owner,docID:reply.docID, uid:reply.uid})
      });
    }
  }

  async postReply(value){
    var self = this;
    var db = firebase.firestore();
    await db.collection('replies').add({
      "body": value.body,
      "uid": self.itemService.currentUser.uid,
      "owner": self.itemService.currentUser.handle,
    }).then(function(docref) {
      db.collection('replies').doc(docref.id).update({
        "docID": docref.id
      });
      self.replyList.push(docref.id);
      console.log('post replies'+docref.id);
      console.log(self.replyList);
    });
    console.log(self.thread.docID);
    await db.collection('ideas').doc(self.thread.docID).update({
      "replies": self.replyList
    })
    self.getReplies();
  }

  like(){
    var self = this;
    var db = firebase.firestore().collection('ideas');
    if(self.thread.uid == self.itemService.currentUser.uid)
    return;
    else
    {
      var newVal = Number(self.likes) + Number(1);
      db.doc(self.thread.docID).update({
        likes: newVal
      }).then(function() {
        self.likes = Number(newVal);
      })
    }
  }

  dislike(){
    var self = this;
    var db = firebase.firestore().collection('ideas');
    if(self.thread.uid == self.itemService.currentUser.uid)
      return;
    else
    {
      var newVal = Number(self.dislikes) + Number(1);
      db.doc(self.thread.docID).update({
        dislikes: newVal
      }).then(function() {
        self.dislikes = Number(newVal);
      })
    }
  }

  isOwner(): boolean {
    if(this.itemService.currentUser.uid == this.thread.uid)
      return true;
    else
      return false;
  }
  
  doRefresh(event){
    var self = this;
    var db = firebase.firestore();
    db.collection('ideas').doc(self.thread.docID).get().then(doc => {
      self.threadDescription = doc.data().description;
    });
    event.target.complete();
  }

  editIdea(){
    var self = this;
    self.router.navigate(['/edit-idea',self.thread]);
  }
  message(person){
	  var otherUID = person.uid;
	  if(otherUID != this.itemService.currentUser.uid){
		var mes = this.itemService.startConversation(otherUID);
	  }
	this.router.navigate(['conversations']);
  }
}
