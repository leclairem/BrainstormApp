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
  likedBy=[];
  likes:number;
  dislikes:number;
  thread:any;
  threadDescription: any;
  likable = true;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private router:Router,
    private alertController:AlertController
  ) { 
   
  }

  async ngOnInit() {
    var self = this;
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
      self.replyList = doc.data().replies;
      self.imgs = doc.data().imgs;
      self.likedBy = doc.data().likedBy;
    })
    this.getReplies();
    console.log('likable '+this.likable);
    await this.canLike();
    console.log('likable '+this.likable);
  }

  getReplies(){
    var self = this;
    var db = firebase.firestore().collection('replies');
    self.replies = [];
    for(let i = 0;i<this.replyList.length;i++)
    {
      db.doc(self.replyList[i]).get().then(doc => {
        var reply = doc.data();
        self.replies.push({body:reply.body,owner:reply.owner,docID:reply.docID, uid:reply.uid, date:reply.date})
      });
    }
  }

  async postReply(value){
    var self = this;
    var db = firebase.firestore();
    var date = Date.now();
    await db.collection('replies').add({
      "body": value.body,
      "uid": self.itemService.currentUser.uid,
      "owner": self.itemService.currentUser.handle,
      "date": date
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
    self.replyForm.reset();
  }

  async like(){
    var self = this;
    var db = firebase.firestore().collection('ideas');
    if(self.thread.uid == self.itemService.currentUser.uid)
      return;
    else if(!self.isLikable())
      return;
    else
    {
      var newVal = 0;
      await db.doc(self.thread.docID).get().then(doc => {
        self.likedBy = doc.data().likedBy;
        self.likedBy.push(self.itemService.currentUser.uid);
        newVal = Number(doc.data().likes) + Number(1);
      })
      await db.doc(self.thread.docID).update({
        'likes': newVal,
        'likedBy': self.likedBy
      }).then(function() {
        self.likable = false;
        self.likes = Number(newVal);
      })
    }
  }

  async dislike(){
    var self = this;
    var db = firebase.firestore().collection('ideas');
    if(self.thread.uid == self.itemService.currentUser.uid)
      return;
    else
    {
      // var newVal = Number(self.dislikes) + Number(1);
      var newVal = 0;
      await db.doc(self.thread.docID).get().then(doc => {
        self.likedBy = doc.data().likedBy;
        self.likedBy.push(self.itemService.currentUser.uid);
        newVal = Number(doc.data().dislikes) + Number(1);
      })
      await db.doc(self.thread.docID).update({
        'dislikes': newVal,
        'likedBy': self.likedBy
      }).then(function() {
        self.likable = false;
        self.dislikes = Number(newVal);
      })
    }
  }

  async canLike(){
    var self = this;
    var db = firebase.firestore().collection('ideas');
    if(self.thread.uid == self.itemService.currentUser.uid)
    {
      self.likable = false;
    }
    else if (self.containsOnLoad())
    {
      self.likable = false;
    }
    else
    {
      await db.doc(self.thread.docID).get().then(doc => {
        self.likedBy = doc.data().likedBy
      });
      for(let i=0;i<self.likedBy.length;i++)
      {
        if(self.likedBy[i] == self.itemService.currentUser.uid)
        {
          self.likable = false;
        }
      }
    }
  }

  isLikable():Boolean{
    return this.likable;
  }

  containsOnLoad():Boolean{
    var self = this;
    for(let i=0;i<self.likedBy.length;i++)
    {
      if(self.likedBy[i] == self.itemService.currentUser.uid)
      {
        console.log(self.likedBy[i]);
        console.log(self.itemService.currentUser.uid);
        return true;
      }
    }
    return false;
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
