import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router,Routes, RouterModule, ActivatedRoute } from '@angular/router';
import *  as firebase from 'firebase';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
	conv:any = null;
	nickname = 'Test';
	other = 'Filler';
	message;
	docID = '';//'5O9sX4zsJk4fY8hzNR3X';
	chats = [];
	
  constructor(
	private route: ActivatedRoute,
	public router: Router,
    public itemService: ItemService,
    ) { 
		
		this.message = '';
		this.nickname = this.itemService.currentUser.handle;		
	}

  ngOnInit() {
	  this.route.params.subscribe(
      param => {
        this.conv = this.route.snapshot.params;
		docID:this.conv.docID;
		name1:this.conv.name1;
		name2:this.conv.name2;
      }
    )
	console.log(this.conv);
	if(this.conv.name1 != this.nickname){
		this.other = this.conv.name1;
		console.log("name1");
		console.log(this.conv.name1);
	} else {
		this.other = this.conv.name2;
		console.log("name2");
		console.log(this.conv.name2);
	}
	this.docID = this.conv.docID;
	console.log(this.docID);
	this.getMessages();
  }
  
  getMessages(){
	  firebase.database().ref('messages/'+this.docID+'/chats').on('value', resp => {
		  this.chats = [];
		  this.chats = snapshotToArray(resp);
		});
  }
  
  sendMessage() {
    let newData = firebase.database().ref('messages/'+this.docID+'/chats').push();
    newData.set({
		nickname:this.nickname,
      message:this.message,
      sendDate:Date()
    });
	this.message = "";
  }

	deleteConversation(){
		console.log("Conversation deleted");
		this.itemService.deleteConv(this.conv.name1,this.conv.name2,this.docID);
		this.nickname = "system";
		this.message = "Other user has left.";
		this.sendMessage();
		this.router.navigate(['/conversations']);
	}
}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};



/* <div class="chat-status" text-center >
        <span class="chat-date">{{chat.sendDate | date:'short'}}</span>
        <span class="chat-content-center">{{chat.message}}</span>
      </div> */