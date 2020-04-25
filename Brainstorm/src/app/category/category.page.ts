import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule, ActivatedRoute } from '@angular/router';

import { IonicModule, AlertController } from '@ionic/angular';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  title:any;
  catImg:any;
  
  tUID = 'Z7n0SrUyLeOMVJv6DkR15DY5NFu2';
  twUID = 'bWLbUB0zU0RSDzDJgew5fJX891q2';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private router:Router,
    private alertController:AlertController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.title = param.title;
        this.catImg = param.img;
      });
  }

  convTest(){
	  console.log('Test');
	  this.itemService.startConversation(this.tUID);
  }
}
