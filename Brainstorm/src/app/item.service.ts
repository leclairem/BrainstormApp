import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import *  as firebase from 'firebase';
//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  currentUser: any;
  token: any;
  handle: any;
  db = firebase.firestore();
  uid: any;
  userDocID: any;

  private itemSubject = new Subject<any>();

  publishData(data:any){
    this.itemSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.itemSubject;
  }

  constructor() { }

  async generateThread(value, uploadPath){
    var self = this;
    var db = firebase.firestore();
    var uploadedImgs = [];
    if(uploadPath != '')
      uploadedImgs.push(uploadPath);
    await db.collection('ideas').add({
      "title": value.title,
      "description": value.description,
      "category": value.category,
      "uid": self.currentUser.uid,
      "date": Date.now(),
      "imgs": [value.img],
      "owner": self.currentUser.handle,
      "replies": [],
      "likedBy": [],
      "uploadedImgs": uploadedImgs,
      "likes": 0.0,
      "dislikes": 0.0
    }).then(function(docref) {
      db.collection("ideas").doc(docref.id).update({
        docID: docref.id
      });
    });
  }

  loadCategory(category): Array<any>{
    var ideas = [];
    var db = firebase.firestore();
    db.collection('ideas').where('category','==',category).get().then(snapshot => {
      snapshot.forEach(doc => {
        var idea = doc.data();
        ideas.push({title:idea.title,description:idea.description,
          uid:idea.uid,date:idea.date,imgs:idea.imgs,docID:idea.docID,thumb:idea.imgs[0],
          owner:idea.owner,replies:idea.replies,likes:idea.likes,dislikes:idea.dislikes});
      });
    });
    return ideas;
  }

  getUserData(){
    var self = this;
    var db = firebase.firestore().collection('users');
    db.where('uid','==',`${self.uid}`).get().then(snapshot => {
      snapshot.forEach(doc => {
        self.currentUser = doc.data();
      });
    });
  }

  async deleteIdea(value){
    var self = this;
    var imgRef;
    var uploadedImgs = [];
    var replies = [];
    var db = firebase.firestore().collection('ideas');
    await db.doc(value.docID).get().then(doc => {
      uploadedImgs = doc.data().uploadedImgs;
      replies = doc.data().replies;
    })
    await db.doc(value.docID).delete();
    for(let i=0;i<uploadedImgs.length;i++)
    {
      imgRef = await firebase.storage().ref().child(uploadedImgs[i]);
      await imgRef.delete().then(function(){
        console.log('img deleted from storage');
      }).catch(function(error){
        console.log('error deleting img from storage');
      });
    }
    for(let i=0;i<replies.length;i++)
    {
      await firebase.firestore().collection('replies').doc(replies[i]).delete();
    }
  }
  
  async startConversation(otherUID:any){
	  var name1 = this.currentUser.handle;
	  var name2 = '';
	  var docID;
	  var id = otherUID + this.currentUser.uid;
	  var db = firebase.firestore();
	  /* var exist = false;
	  
	  db.collection('message').where('id','==',`${id}`).get().then(snapshot => {
      snapshot.forEach(doc => {
		  exist = true;
		  console.log(exist);
      });
    });
	db.collection('messages').where('id','==',`${this.currentUser.uid + otherUID}`).get().then(snapshot => {
      snapshot.forEach(doc => {
		  exist = true;
		  console.log(exist);
      });
    }); */
  //console.log(exist);
  var check = await this.checkConv(otherUID);
	if(!check){
		  db.collection('messages').add({
				id: id
		  });
		  db.collection('messages').where('id','==',`${id}`).get().then(snapshot => {
		  snapshot.forEach(doc => {
			  docID = doc.id;
			});
		  });
		  console.log("After first attemp");
		  var conversations = [];
		   if(this.currentUser.hasOwnProperty('conversations')){
				conversations = this.currentUser.conversations;
      }
      var i=-1;
      console.log(docID);
      for(var c=0;c<this.currentUser.conversations.length;c++){
        //console.log(this.currentUser.conversations[c]);
        if(this.currentUser.conversations[c].docID === docID){
          i = c;
          //console.log(c);
          //console.log(i);
          break;
        }
      }
		  //var conversations = this.currentUser.conversations; 
      //conversations.push({'docID':docID, 'name1':name1, 'name2':name2});
      if(i == -1){
        var self = this;
        //db = firebase.firestore().collection('users');
        db.collection('users').where('uid','==',`${otherUID}`).get().then(snapshot => {
          snapshot.forEach(doc => {
          var temp = doc.data();
          name2 = temp.handle;
          var tempConv = [];
          if(temp.hasOwnProperty('conversations')){
            tempConv = temp.conversations;
          }
          tempConv.push({'docID':docID, 'name1':name1, 'name2':name2});
          //console.log(tempConv);
          db.collection('users').doc(doc.id).update({'conversations':tempConv}); 
          });
        });
        //console.log("Between");
        db.collection('users').where('uid','==',`${self.uid}`).get().then(snapshot => {
          snapshot.forEach(doc => {
          //console.log(doc.id);
          //var docID = doc.id;
          conversations.push({'docID':docID, 'name1':name1, 'name2':name2});
          //console.log(conversations);
          db.collection('users').doc(doc.id).update({'conversations':conversations}); 
          });
        });
      }
	  } 
  }

  deleteConv(name1, name2, docID){
     var i=-1;
     console.log(docID);
    for(var c=0;c<this.currentUser.conversations.length;c++){
      console.log(this.currentUser.conversations[c]);
      if(this.currentUser.conversations[c].docID === docID){
        i = c;
        console.log(c);
        console.log(i);
        break;
      }
    }
	  //const index = this.currentUser.conversations.indexOf({name1, name2, docID}, 0);
    var self = this;
    console.log(i);
    if (i > -1) {
		   this.currentUser.conversations.splice(i, 1);
			var db = firebase.firestore();
				db.collection('users').where('uid','==',`${self.uid}`).get().then(snapshot => {
				snapshot.forEach(doc => {
				db.collection('users').doc(doc.id).update({'conversations':this.currentUser.conversations}); 
				});
      });
      this.Update();
		}
  }

  async Update(){
    await this.getUserData();
  }
  
  checkConv(otherUID){
	  var id = otherUID + this.currentUser.uid;
	  var oid = this.currentUser.uid + otherUID;
	  var db = firebase.firestore();
	  db.collection('message').where('id','==',`${id}`).get().then(snapshot => {
      snapshot.forEach(doc => {
		  console.log(true);
		  return true;
      });
    });
	db.collection('messages').where('id','==',`${this.currentUser.uid + otherUID}`).get().then(snapshot => {
      snapshot.forEach(doc => {
		  console.log(true);
		  return true;
      });
    });
	console.log(false);
	return false;
  }
}
