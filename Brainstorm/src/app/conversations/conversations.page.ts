import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router,Routes, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {

	handle;
	conversations = [];

  constructor(
	private route: ActivatedRoute,
	public router: Router,
    public itemService: ItemService,
    ) { 
		//console.log(this.itemService.currentUser.handle);
		this.handle = this.itemService.currentUser.handle;
	}

  ngOnInit() {
	  this.handle = this.itemService.currentUser.handle;
	  console.log(this.handle);
	  this.conversations = this.itemService.currentUser.conversations;
  }

}
