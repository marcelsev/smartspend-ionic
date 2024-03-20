import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationAppPageRoutingModule } from './information-app-routing.module';

import { InformationAppPage } from './information-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationAppPageRoutingModule
  ],
  declarations: [InformationAppPage]
})
export class InformationAppPageModule {}
