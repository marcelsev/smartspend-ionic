import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperationMpPageRoutingModule } from './recuperation-mp-routing.module';

import { RecuperationMpPage } from './recuperation-mp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperationMpPageRoutingModule
  ],
  declarations: [RecuperationMpPage]
})
export class RecuperationMpPageModule {}
