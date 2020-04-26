import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditIdeaPageRoutingModule } from './edit-idea-routing.module';

import { EditIdeaPage } from './edit-idea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditIdeaPageRoutingModule
  ],
  declarations: [EditIdeaPage]
})
export class EditIdeaPageModule {}
