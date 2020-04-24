import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import *  as firebase from 'firebase';
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

  getUserData(value){
    var self = this;
    var db = firebase.firestore().collection('users');
    db.where('uid','==',`${self.uid}`).get().then(snapshot => {
      snapshot.forEach(doc => {
        self.currentUser = doc.data();
      });
    });
  }
}
