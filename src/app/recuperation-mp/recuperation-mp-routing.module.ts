import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperationMpPage } from './recuperation-mp.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperationMpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperationMpPageRoutingModule {}
