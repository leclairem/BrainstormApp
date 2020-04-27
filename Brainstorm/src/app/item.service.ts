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

  generateThread(value){
    var self = this;
    var db = firebase.firestore();
    db.collection('ideas').add({
      title: value.title,
      description: value.description,
      category: value.category,
      uid: self.currentUser.uid,
      imgs: [value.img],
      owner: self.currentUser.handle,
      replies: [],
      likes: 0.0,
      dislikes: 0.0
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
          uid:idea.uid,imgs:idea.imgs,docID:idea.docID,thumb:idea.imgs[0],
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
  
  startConversation(otherUID:any){
	  var name1 = this.currentUser.handle;
	  var name2 = 'Testing';
	  //const docID = this.db.createId();
	  var conversations = this.currentUser.conversations; 
	  //conversations.push({'docID':docID, 'name1':name1, 'name2':name2});
	  var self = this;
	  var db = firebase.firestore().collection('users');
    db.where('uid','==',`${self.uid}`).get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id);
		var docID = doc.id;
		conversations.push({'docID':doc.id, 'name1':name1, 'name2':name2});
		db.doc(docID).update({'conversations':conversations}); 
		//console.log(doc.data());
      });
    });
  
	  
	  /* var db = firebase.firestore().collection('users');
		//console.log(db.where('uid','==',`${self.uid}`));
		db.where("uid", "==",'${self.uid}')
		  .get()
		  .then(function(querySnapshot) {
			  querySnapshot.forEach(function(doc) {
				  console.log(doc.id, " => ", doc.data());
				  // Build doc ref from doc.id
				  //db.collection("users").doc(doc.id).update({foo: "bar"}); 
			  });
		 }) */
		//console.log(tdocID);
	//  db.where('uid','==',`${otherUID}`).update( 'conversations':conversations.push(
		//				{'docID':docID, 'name1':name1, 'name2':name2}) )
  }
}
