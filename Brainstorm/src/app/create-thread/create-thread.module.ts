import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateThreadPageRoutingModule } from './create-thread-routing.module';

import { CreateThreadPage } from './create-thread.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateThreadPageRoutingModule
  ],
  declarations: [CreateThreadPage]
})
export class CreateThreadPageModule {}
