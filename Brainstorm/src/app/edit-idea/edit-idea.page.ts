import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-idea',
  templateUrl: './edit-idea.page.html',
  styleUrls: ['./edit-idea.page.scss'],
})
export class EditIdeaPage implements OnInit {

  thread:any;
  editForm: FormGroup;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.thread = param;
      });
      this.editForm = this.formBuilder.group({
        description: new FormControl(this.thread.description, Validators.required)
      })
  }

  saveChanges(value){
    var self = this;
    var db = firebase.firestore();
    db.collection('ideas').doc(self.thread.docID).update({
      'description': value.description
    });
  }
}
