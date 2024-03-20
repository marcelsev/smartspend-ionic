import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationAppPage } from './information-app.page';

const routes: Routes = [
  {
    path: '',
    component: InformationAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationAppPageRoutingModule {}
