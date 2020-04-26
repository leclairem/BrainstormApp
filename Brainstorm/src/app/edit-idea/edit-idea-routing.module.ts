import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditIdeaPage } from './edit-idea.page';

const routes: Routes = [
  {
    path: '',
    component: EditIdeaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditIdeaPageRoutingModule {}
