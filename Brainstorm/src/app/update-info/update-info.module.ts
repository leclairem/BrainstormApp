import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateInfoPageRoutingModule } from './update-info-routing.module';

import { UpdateInfoPage } from './update-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UpdateInfoPageRoutingModule
  ],
  declarations: [UpdateInfoPage]
})
export class UpdateInfoPageModule {}
