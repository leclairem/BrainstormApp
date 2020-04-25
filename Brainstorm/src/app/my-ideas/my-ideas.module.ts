import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyIdeasPageRoutingModule } from './my-ideas-routing.module';

import { MyIdeasPage } from './my-ideas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyIdeasPageRoutingModule
  ],
  declarations: [MyIdeasPage]
})
export class MyIdeasPageModule {}
