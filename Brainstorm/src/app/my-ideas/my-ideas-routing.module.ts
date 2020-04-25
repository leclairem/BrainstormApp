import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyIdeasPage } from './my-ideas.page';

const routes: Routes = [
  {
    path: '',
    component: MyIdeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyIdeasPageRoutingModule {}
