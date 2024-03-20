import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulairePage } from './formulaire.page';

const routes: Routes = [
  {
    path: '',
    component: FormulairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulairePageRoutingModule {}
